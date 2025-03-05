const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');  // 如果处理 PDF 文件

// 配置 `multer` 存储路径
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../data');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);  // 避免文件重名
    }
});

// 只允许上传 PDF 文件
const fileFilter = (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
        return cb(new Error('只允许上传 PDF 文件'), false);
    }
    cb(null, true);
};

// 使用 multer 配置
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/', upload.single('file'), async (req, res) => {
    console.log("📂 收到上传请求，req.file:", req.file);
    console.log("📂 请求 Headers:", req.headers);
    console.log("📂 请求 Body:", req.body);

    // 校验是否有上传文件
    if (!req.file) {
        return res.status(400).json({ error: "请上传 PDF 文件" });
    }

    // 获取用户问题
    const { question } = req.body;
    if (!question) {
        return res.status(400).json({ error: "请提供问题" });
    }

    try {
        // 读取上传的 PDF 文件
        const pdfBuffer = fs.readFileSync(req.file.path);

        // 使用 pdf-parse 解析 PDF 文件内容
        const pdfData = await pdf(pdfBuffer);
        const fileContent = pdfData.text;  // 提取文本内容

        // 将文件内容和用户问题一起作为 prompt 发送给 AI 模型
        const prompt = `文件内容:\n${fileContent}\n\n用户问题:\n${question}`;

        // 调用 DeepSeek AI 模型进行解析
        const response = await fetch('http://localhost:5173/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "deepseek-r1:7b",
                prompt: prompt,
                max_tokens: 512,
            }),
        });

        const data = await response.json();
        res.json({ message: "文件上传成功", path: `/data/${req.file.filename}`, pdfText: data.response });

    } catch (error) {
        console.error("解析失败:", error);
        res.status(500).json({ error: "AI 服务器请求失败", details: error.message });
    }
});

module.exports = router;
