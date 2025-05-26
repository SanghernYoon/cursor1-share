const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = 3000;
require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(express.json());

app.post('/api/openai', async (req, res) => {
  const { prompt, max_tokens = 600 } = req.body;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens
      })
    });
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'OpenAI API 호출 실패', detail: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`OpenAI 프록시 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
}); 