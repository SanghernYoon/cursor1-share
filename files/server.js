const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Cafe24_Customized_Proposal')));

const pool = mysql.createPool({
  host: 'auto-common-db-master-001.hanpda.com',
  user: 'hyjoo',
  password: 'Buai131411',
  database: 'c_mc_excooperation',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// API 키는 환경 변수나 별도의 설정 파일에서 관리해야 합니다
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'YOUR_API_KEY_HERE';

app.get('/', (req, res) => {
  res.send('API 서버 정상 동작 중');
});

app.get('/api/news', async (req, res) => {
  console.log('category:', req.query.category);
  const { category, limit = 3 } = req.query;
  if (!category) {
    return res.status(400).json({ error: 'category 파라미터가 필요합니다.' });
  }
  const keywords = category.split('/').map(k => k.trim()).filter(Boolean);
  const where = keywords.map(() => `keyword LIKE ?`).join(' OR ');
  const params = keywords.map(k => `%${k}%`);
  params.push(Number(limit));

  try {
    const [rows] = await pool.query(
      `SELECT title, content, date, channel, url
       FROM category_trends_news
       WHERE ${where}
       ORDER BY date DESC
       LIMIT ?`,
      params
    );

    const summarized = await Promise.all(rows.map(async (item) => {
      const prompt = `아래 뉴스 기사 내용을 2~3문장으로 한글로 요약해줘:\n\n${item.content}`;
      try {
        const response = await fetch('http://118.130.18.151:3001/api/openai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, max_tokens: 300 })
        });
        const data = await response.json();
        console.log('OpenAI 요약 응답:', data);
        if (!response.ok) {
          console.error('OpenAI 요약 에러:', data);
        }
        const summary = data.choices?.[0]?.message?.content?.trim() || '';
        return {
          ...item,
          summary
        };
      } catch (e) {
        return {
          ...item,
          summary: '[요약 실패]'
        };
      }
    }));

    res.json(summarized);
  } catch (err) {
    res.status(500).json({ error: 'DB error', details: err.message });
  }
});

app.post('/api/openai', async (req, res) => {
  const { prompt, max_tokens } = req.body;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: max_tokens || 300
      })
    });
    const data = await response.json();
    console.log('OpenAI 응답:', data);
    if (!response.ok) {
      console.error('OpenAI 요약 에러:', data);
    }
    const summary = data.choices?.[0]?.message?.content?.trim() || '';
    res.json(data);
  } catch (err) {
    console.error('OpenAI API 요청 실패:', err);
    res.status(500).json({ error: 'OpenAI API 요청 실패', details: err.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});