const OPENAI_API_KEY = 'YOUR_API_KEY'; // API 키는 환경 변수나 설정 파일에서 관리하는 것이 좋습니다
const CACHE_DURATION = 3600000; // 1시간 캐시 유지

// 데이터 캐시 객체
const dataCache = {
  trends: {},
  news: {},
  swot: {}
};

// OpenAI API를 통해 분석 데이터 가져오기
async function fetchOpenAIAnalysis(industry, type) {
  let prompt = '';
  
  switch(type) {
    case 'trends':
      prompt = `${industry} 산업의 최근 주요 시장 트렌드 5가지를 JSON 형식으로 제공해주세요. 각 트렌드는 title과 description을 포함해야 합니다. 응답은 다음 형식이어야 합니다: {"trends": [{"title": "트렌드 제목", "description": "트렌드 설명"}]}`;
      break;
    case 'news':
      prompt = `${industry} 산업의 최근 주요 뉴스 5개를 JSON 형식으로 제공해주세요. 각 뉴스는 title, date, source, content를 포함해야 합니다. 응답은 다음 형식이어야 합니다: {"news": [{"title": "뉴스 제목", "date": "2024-XX-XX", "source": "출처", "content": "내용"}]}`;
      break;
    case 'swot':
      prompt = `${industry} 산업에 대한 SWOT 분석을 JSON 형식으로 제공해주세요. 각 카테고리(strengths, weaknesses, opportunities, threats)는 최소 3개의 항목을 포함해야 합니다. 응답은 다음 형식이어야 합니다: {"swot": {"strengths": ["강점1", "강점2", "강점3"], "weaknesses": ["약점1", "약점2", "약점3"], "opportunities": ["기회1", "기회2", "기회3"], "threats": ["위협1", "위협2", "위협3"]}}`;
      break;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API 호출 실패');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI API 오류:', error);
    throw error;
  }
}

// 캐시된 데이터 가져오기
function getCachedData(industry, type) {
  const cache = dataCache[type][industry];
  if (cache && (Date.now() - cache.timestamp) < CACHE_DURATION) {
    return cache.data;
  }
  return null;
}

// 데이터 캐시에 저장
function setCachedData(industry, type, data) {
  dataCache[type][industry] = {
    data: data,
    timestamp: Date.now()
  };
}

// 분석 데이터 가져오기 (캐시 확인 후 필요시 API 호출)
async function getAnalysisData(industry, type) {
  const cachedData = getCachedData(industry, type);
  if (cachedData) {
    return cachedData;
  }

  try {
    const data = await fetchOpenAIAnalysis(industry, type);
    setCachedData(industry, type, data);
    return data;
  } catch (error) {
    console.error('데이터 가져오기 실패:', error);
    throw error;
  }
}

// 외부에서 사용할 함수들 export
export {
  getAnalysisData
}; 