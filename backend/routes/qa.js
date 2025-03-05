const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const fetch = require('node-fetch');

// 接收请求，处理问题和文件路径
router.post('/', async (req, res) => {
    const { question, filePath } = req.body;  // 从请求中获取问题和文件路径

    if (!question || !filePath) {
        return res.status(400).json({ error: "请提供问题和文件路径" });
    }

    try {
        // 确保路径正确，使用绝对路径读取文件
        const fullPath = path.resolve(__dirname, filePath);
        if (!fs.existsSync(fullPath)) {
            return res.status(400).json({ error: "文件不存在" });
        }

        // 读取 PDF 文件为 Buffer（二进制）
        const pdfBuffer = fs.readFileSync(fullPath);

        // 使用 pdf-parse 解析 PDF 文件
        const pdfData = await pdf(pdfBuffer);
        const fileContent = pdfData.text;  // 提取文本内容

        // 组合文件内容和用户问题
        const prompt = `文件内容:\n${fileContent}\n\n用户问题:\n${question}`;

        // 调用本地 DeepSeek AI 模型进行解析
        const response = await fetch('http://localhost:5173/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "deepseek-r1:7b",  // 使用的模型
                prompt: prompt,  // 将合并后的 prompt 传递给模型
                max_tokens: 512,  // 限制返回的最大 token 数
            }),
        });

        const data = await response.json();
        // 返回模型的回答
        res.json({ answer: data.response });

    } catch (error) {
        console.error("解析或请求出错:", error);
        res.status(500).json({ error: "AI 服务器请求失败", details: error.message });
    }
});

module.exports = router;
