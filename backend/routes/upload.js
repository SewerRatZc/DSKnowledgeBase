const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

// 配置 `multer` 存储路径
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../data'));  // 上传到 `data/` 目录
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);  // 避免文件重名
    }
});

// 只允许上传 PDF
const fileFilter = (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
        return cb(new Error('只允许上传 PDF 文件'), false);
    }
    cb(null, true);
};

// 设定 `multer` 配置
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/', upload.single('file'), (req, res) => {
    console.log("📂 收到上传请求，req.file:", req.file);
    console.log("📂 请求 Headers:", req.headers);
    console.log("📂 请求 Body:", req.body);

    if (!req.file) {
        return res.status(400).json({ error: "请上传 PDF 文件" });
    }

    res.json({ message: "文件上传成功", path: `/data/${req.file.filename}` });
});

module.exports = router;
