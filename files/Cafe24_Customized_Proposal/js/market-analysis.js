import { getAnalysisData } from './openai-service.js';

// 시장 분석 데이터 생성
async function generateMarketData() {
    const industry = document.querySelector('#industry-type').textContent;
    showLoading();

    try {
        // 트렌드 데이터 가져오기
        const trends = await generateTrends(industry);
        displayTrends(trends);

        // 뉴스 데이터 가져오기
        const news = await generateNews(industry);
        displayNews(news);

        // SWOT 분석 데이터 가져오기
        const swotData = await generateSwotData(industry);
        displaySwot(swotData);
    } catch (error) {
        console.error('시장 분석 데이터 생성 중 오류 발생:', error);
        displayError();
    } finally {
        hideLoading();
    }
}

// 트렌드 데이터 생성
async function generateTrends(industry) {
    try {
        const response = await getAnalysisData(industry, 'trends');
        return response.trends;
    } catch (error) {
        console.error('트렌드 데이터 생성 중 오류:', error);
        return getFallbackTrends(industry);
    }
}

// 뉴스 데이터 생성
async function generateNews(industry) {
    try {
        const response = await getAnalysisData(industry, 'news');
        return response.news;
    } catch (error) {
        console.error('뉴스 데이터 생성 중 오류:', error);
        return getFallbackNews(industry);
    }
}

// SWOT 분석 데이터 생성
async function generateSwotData(industry) {
    try {
        const response = await getAnalysisData(industry, 'swot');
        return response.swot;
    } catch (error) {
        console.error('SWOT 분석 데이터 생성 중 오류:', error);
        return getFallbackSwot(industry);
    }
}

// 트렌드 표시
function displayTrends(trends) {
    const trendsContainer = document.querySelector('#trends-container');
    trendsContainer.innerHTML = trends.map(trend => `
        <div class="trend-card">
            <h4>${trend.title}</h4>
            <p>${trend.description}</p>
        </div>
    `).join('');
}

// 뉴스 표시
function displayNews(news) {
    const newsContainer = document.querySelector('#news-container');
    newsContainer.innerHTML = news.map(item => `
        <div class="news-card">
            <h4>${item.title}</h4>
            <div class="news-meta">
                <span class="date">${item.date}</span>
                <span class="source">${item.source}</span>
            </div>
            <p>${item.content}</p>
        </div>
    `).join('');
}

// SWOT 분석 표시
function displaySwot(swotData) {
    const swotContainer = document.querySelector('#swot-container');
    swotContainer.innerHTML = `
        <div class="swot-grid">
            <div class="swot-card strengths">
                <h4>강점 (Strengths)</h4>
                <ul>${swotData.strengths.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>
            <div class="swot-card weaknesses">
                <h4>약점 (Weaknesses)</h4>
                <ul>${swotData.weaknesses.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>
            <div class="swot-card opportunities">
                <h4>기회 (Opportunities)</h4>
                <ul>${swotData.opportunities.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>
            <div class="swot-card threats">
                <h4>위협 (Threats)</h4>
                <ul>${swotData.threats.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>
        </div>
    `;
}

// 로딩 표시
function showLoading() {
    const loadingSpinner = document.querySelector('#market-loading');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'flex';
    }
}

// 로딩 숨기기
function hideLoading() {
    const loadingSpinner = document.querySelector('#market-loading');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
}

// 에러 표시
function displayError() {
    const containers = ['#trends-container', '#news-container', '#swot-container'];
    containers.forEach(container => {
        const element = document.querySelector(container);
        if (element) {
            element.innerHTML = `
                <div class="error-message">
                    <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
                    <button onclick="initMarketAnalysis()">다시 시도</button>
                </div>
            `;
        }
    });
}

// 폴백 데이터 (API 호출 실패 시 사용)
function getFallbackTrends(industry) {
    return [
        {
            title: "디지털 전환 가속화",
            description: "코로나19 이후 디지털 전환이 가속화되며 온라인 쇼핑몰의 중요성이 더욱 부각되고 있습니다."
        },
        {
            title: "모바일 커머스 성장",
            description: "스마트폰을 통한 쇼핑이 증가하며 모바일 최적화된 쇼핑 경험이 필수가 되었습니다."
        },
        {
            title: "라이브 커머스 확대",
            description: "실시간 스트리밍을 통한 상품 판매가 새로운 판매 채널로 자리잡고 있습니다."
        },
        {
            title: "개인화 서비스 강화",
            description: "AI 기반 개인화 추천과 맞춤형 서비스가 고객 경험을 향상시키는 핵심 요소가 되고 있습니다."
        },
        {
            title: "지속가능한 커머스",
            description: "환경 친화적인 포장과 배송, 윤리적 소비에 대한 관심이 증가하고 있습니다."
        }
    ];
}

function getFallbackNews(industry) {
    return [
        {
            title: "이커머스 시장, 2024년 더욱 성장 전망",
            date: "2024-03-15",
            source: "디지털타임스",
            content: "온라인 쇼핑 시장이 지속적으로 성장하며, 특히 모바일 쇼핑이 전체 거래액의 70%를 차지할 것으로 예상됩니다."
        },
        {
            title: "AI 기술 도입으로 고객 경험 혁신",
            date: "2024-03-14",
            source: "테크뉴스",
            content: "이커머스 기업들이 AI 기술을 활용한 개인화 서비스를 확대하며 고객 만족도를 높이고 있습니다."
        },
        {
            title: "라이브 커머스, 새로운 판매 채널로 부상",
            date: "2024-03-13",
            source: "커머스투데이",
            content: "실시간 방송을 통한 상품 판매가 증가하며, 라이브 커머스 시장이 급성장하고 있습니다."
        },
        {
            title: "지속가능한 이커머스 트렌드 확산",
            date: "2024-03-12",
            source: "그린비즈",
            content: "친환경 포장재 사용과 탄소 배출 감소를 위한 노력이 이커머스 업계의 새로운 과제로 대두되고 있습니다."
        },
        {
            title: "옴니채널 전략 강화하는 기업들",
            date: "2024-03-11",
            source: "유통신문",
            content: "온오프라인을 연계한 옴니채널 전략이 고객 경험을 향상시키는 핵심 요소로 자리잡고 있습니다."
        }
    ];
}

function getFallbackSwot(industry) {
    return {
        strengths: [
            "안정적인 플랫폼 인프라 보유",
            "다양한 판매자와 상품 구성",
            "검증된 결제 시스템"
        ],
        weaknesses: [
            "플랫폼 간 차별화 부족",
            "높은 수수료 구조",
            "고객 서비스 대응 시간"
        ],
        opportunities: [
            "디지털 전환 가속화",
            "모바일 쇼핑 증가",
            "신기술 도입 기회"
        ],
        threats: [
            "시장 경쟁 심화",
            "소비 심리 위축",
            "보안 위협 증가"
        ]
    };
}

// 페이지 로드 시 시장 분석 초기화
window.initMarketAnalysis = generateMarketData; 