window.T1_CONFIG = {
  // Google Sheets를 '웹에 게시 → CSV'로 설정한 뒤 주소를 입력하세요.
  inventoryCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_MPdGxEXnPAIBt7QrG33FJYWsykUPjWTRUivNJ0_J3AGU3ul0l2RLG5lU2pJ_JepFUnCqplFwNQ0X/pub?gid=0&single=true&output=csv",
  storesCsvUrl: "",
  // CTA 기록용 Google Apps Script 웹 앱 주소를 입력하세요.
  analyticsEndpoint: "https://script.google.com/macros/s/AKfycbwjE9jsOeXtzjrK5nh0L7M91h6FdrylLCbmDAKE49JWgdqQlUcY6p1E_KIxGn_sBMC6Fg/exec",
  // 재고 시트의 매장 열 이름과 홈페이지 매장명을 연결합니다.
  inventoryStoreColumns: {
    "원신흥": "원신흥본점",
    "용운": "용운점",
    "용문": "용문점",
    "아산권곡": "아산권곡점",
    "지웰시티": "지웰시티점"
  },
  specialImages: [
    "images/today-special1.jpg",
    "images/today-special2.jpg",
    "images/today-special3.jpg"
  ]
};
