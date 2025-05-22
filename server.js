const express = require('express');
const path = require('path');
const ngrok = require('ngrok');
const app = express();
const port = 3000;

// 정적 파일 제공을 위한 미들웨어 설정
app.use(express.static(path.join(__dirname, '../Downloads')));

// 서버 시작
app.listen(port, async () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
    
    try {
        // ngrok 터널 생성
        const url = await ngrok.connect(port);
        console.log(`임시 도메인: ${url}`);
    } catch (err) {
        console.error('ngrok 연결 중 오류 발생:', err);
    }
}); 