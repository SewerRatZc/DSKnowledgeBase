const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: "请提供问题" });
    }

    try {
        // 调用 DeepSeek AI 模型
        const response = await fetch('http://localhost:5173/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "deepseek-r1:7b",
                prompt: question,
                max_tokens: 512,
            }),
        });

        const data = await response.json();
        res.json({ answer: data.response });

    } catch (error) {
        res.status(500).json({ error: "AI 服务器请求失败", details: error.message });
    }
});

module.exports = router;