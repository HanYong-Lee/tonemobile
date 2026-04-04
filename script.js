const ANALYTICS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyw67q3vYDGzze1viH5YtoMHrP6f3r3lw4a9eoy1ku4XB7EHPDzXO1PdLKE4Nugso4y/exec';
const ANALYTICS_USE_GAS = true;

const stores = [
  {
    name: "원신흥점",
    lat: 36.3342,
    lng: 127.3406,
    image: "assets/wonshinheung.jpg",
    address: "대전 유성구 원신흥동 491-1(봉명로 27-3)",
    points: ["지하주차장 이용가능(출입구 공간 협소)"],
    phone: "0507-1355-2017",
    mapUrl: "https://naver.me/5pEzM5AE",
    review: "아이 첫 휴대폰이라 걱정 많았는데 쉽게 설명해주셔서 바로 결정했어요 👍",
    meta: "40대 / 자녀폰 상담"
  },
  {
    name: "용문점",
    lat: 36.3387,
    lng: 127.3938,
    image: "assets/yongmoon.jpg",
    image: "assets/yongwoon.jpg",
    address: "대전 서구 용문동 244-15(계룡로 661-1)",
    points: ["건너편 우체국 주차 가능"],
    phone: "0507-1477-2076",
    mapUrl: "https://naver.me/FytQtAEK",
    review: "아이 첫 휴대폰이라 걱정 많았는데 쉽게 설명해주셔서 바로 결정했어요 👍",
    meta: "40대 / 자녀폰 상담"
  },
  {
    name: "용운점",
    lat: 36.3213,
    lng: 127.4589,
    image: "assets/yongwoon.jpg",
    address: "대전 동구 용운동 783(용운로 203)",
    points: ["유료주차장 이용 가능(2시간 지원)"],
    phone: "0507-1319-5033",
    mapUrl: "https://naver.me/5ZjdrJ3Q",
    review: "아이 첫 휴대폰이라 걱정 많았는데 쉽게 설명해주셔서 바로 결정했어요 👍",
    meta: "40대 / 자녀폰 상담"
  },
  {
    name: "청주지웰시티점",
    lat: 36.6369,
    lng: 127.4266,
    address: "충북 청주시 흥덕구 복대동 288-15(대농로 47)",
    points: ["주차는 어떻게 해요?"],
    phone: "010-0000-0000",
    mapUrl: "https://naver.me/xUwgrDjt",
    review: "아이 첫 휴대폰이라 걱정 많았는데 쉽게 설명해주셔서 바로 결정했어요 👍",
    meta: "40대 / 자녀폰 상담"
  },
  {
    name: "아산권곡점",
    lat: 36.7775,
    lng: 127.0189,
    image: "assets/kwongok.jpg",
    address: "충남 아산시 권곡동 219-21(문화로 271-6 106호)",
    points: ["아산마트 주차장 무료이용 가능"],
    phone: "0507-7867-2010",
    mapUrl: "https://naver.me/GplJeXqn",
    review: "아이 첫 휴대폰이라 걱정 많았는데 쉽게 설명해주셔서 바로 결정했어요 👍",
    meta: "40대 / 자녀폰 상담"
  },
  {
    name: "아산세교점",
    lat: 36.7838,
    lng: 127.0004,
    image: "assets/segyo.jpg",
    address: "충남 아산시 배방읍 세교리 1585(동방로 180-3)",
    points: ["강점 Point 1"],
    phone: "0507-1338-8200",
    mapUrl: "https://naver.me/FG3plz6q",
    review: "아이 첫 휴대폰이라 걱정 많았는데 쉽게 설명해주셔서 바로 결정했어요 👍",
    meta: "40대 / 자녀폰 상담"
  },
  {
    name: "천안신불당점",
    lat: 36.8086,
    lng: 127.1082,
    image: "assets/shinbuldang.jpg",
    address: "충남 천안시 서북구 불당동 1617(불당33길 26)",
    points: ["강점 Point 3"],
    phone: "0507-1417-0338",
    mapUrl: "https://naver.me/FBaVF2Gg",
    review: "아이 첫 휴대폰이라 걱정 많았는데 쉽게 설명해주셔서 바로 결정했어요 👍",
    meta: "40대 / 자녀폰 상담"
  },
  {
    name: "홍성서우점",
    lat: 36.6014,
    lng: 126.6641,
    image: "assets/seowoo.jpg",
    address: "충남 홍성군 홍성읍 월산리 896-5(법원로 7)",
    points: ["강점 Point 1"],
    phone: "0507-1425-3009",
    mapUrl: "https://naver.me/x58PthN3",
    review: "아이 첫 휴대폰이라 걱정 많았는데 쉽게 설명해주셔서 바로 결정했어요 👍",
    meta: "40대 / 자녀폰 상담"
  }
];

const storeGrid = document.getElementById('storeGrid');
const floatingStoreBox = document.getElementById('floatingStoreBox');
const floatingStoreTitle = document.getElementById('floatingStoreTitle');
const floatingStoreDesc = document.getElementById('floatingStoreDesc');

const findNearbyBtn = document.getElementById('findNearbyBtn');
const findNearbyBtnSecondary = document.getElementById('findNearbyBtnSecondary');
const retryLocationBtn = document.getElementById('retryLocationBtn');
const closeFloatingBoxBtn = document.getElementById('closeFloatingBoxBtn');

const mobileNavToggle = document.getElementById('mobileNavToggle');
const siteNav = document.getElementById('siteNav');

const totalViewsEl = document.getElementById('totalViews');

/* ===== 오늘의 특가 팝업 / 왼쪽 하단 퀵버튼 ===== */
const promoPopup = document.getElementById('promoPopup');
const promoPopupClose = document.getElementById('promoPopupClose');
const promoPopupBackdrop = document.getElementById('promoPopupBackdrop');
const promoPopupPoster = document.getElementById('promoPopupPoster');
const floatingSpecialBtn = document.getElementById('floatingSpecialBtn');
const floatingNearbyBtn = document.getElementById('floatingNearbyBtn');

function getSessionId() {
  const key = 't1mobile_session_id';
  let sessionId = localStorage.getItem(key);
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, sessionId);
  }
  return sessionId;
}

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getAnalyticsBucket() {
  const raw = localStorage.getItem('t1mobileAnalytics');
  const fallback = {
    totalViews: 0,
    dailyViews: {},
    ctaClicks: {},
    nearbyClicks: [],
    sources: {}
  };

  try {
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveAnalyticsBucket(bucket) {
  localStorage.setItem('t1mobileAnalytics', JSON.stringify(bucket));
}

function getApproxGeo(lat, lng) {
  const roundedLat = Number((Math.round(lat * 2000) / 2000).toFixed(4));
  const roundedLng = Number((Math.round(lng * 2000) / 2000).toFixed(4));
  return { lat: roundedLat, lng: roundedLng };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendAnalytics(eventName, payload = {}) {
  if (!ANALYTICS_ENDPOINT) return null;

  const body = {
    event: eventName,
    page: location.pathname,
    ts: new Date().toISOString(),
    payload: {
      ...payload,
      userAgent: navigator.userAgent || '',
      sessionId: getSessionId()
    }
  };

  try {
    return await fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      mode: ANALYTICS_USE_GAS ? 'no-cors' : 'cors'
    });
  } catch (error) {
    console.warn('sendAnalytics failed:', error);
    return null;
  }
}

async function updateViewCounters() {
  if (!totalViewsEl) return;

  const bucket = getAnalyticsBucket();
  const todayKey = getTodayKey();
  const sessionKey = `t1mobile_viewed_${todayKey}`;

  if (!sessionStorage.getItem(sessionKey)) {
    bucket.totalViews += 1;
    bucket.dailyViews[todayKey] = (bucket.dailyViews[todayKey] || 0) + 1;
    saveAnalyticsBucket(bucket);
    sessionStorage.setItem(sessionKey, '1');

    await sendAnalytics('page_view', {
      today: todayKey,
      referrer: document.referrer || 'direct'
    });

    await sleep(700);
  }

  const localLatest = getAnalyticsBucket();
  totalViewsEl.textContent = localLatest.totalViews || 0;

  if (!ANALYTICS_ENDPOINT) return;

  try {
    const response = await fetch(ANALYTICS_ENDPOINT, { method: 'GET' });
    const data = await response.json();

    if (data && data.ok) {
      totalViewsEl.textContent = data.totalViews ?? totalViewsEl.textContent;
    }
  } catch (error) {
    console.warn('Live counter fetch failed:', error);
  }
}

function trackCTA(name, extra = {}) {
  const bucket = getAnalyticsBucket();
  bucket.ctaClicks[name] = (bucket.ctaClicks[name] || 0) + 1;
  saveAnalyticsBucket(bucket);
  sendAnalytics('cta_click', { name, ...extra });
}

function extractSource() {
  const params = new URLSearchParams(location.search);

  if (params.get('utm_source')) return params.get('utm_source');
  if (params.get('src')) return params.get('src');

  if (document.referrer) {
    try {
      return new URL(document.referrer).hostname;
    } catch (error) {
      return 'referrer';
    }
  }

  return 'direct';
}

function trackSource() {
  const source = extractSource();
  const bucket = getAnalyticsBucket();
  bucket.sources[source] = (bucket.sources[source] || 0) + 1;
  saveAnalyticsBucket(bucket);
  sendAnalytics('source_visit', { source });
}

/* ===== 오늘의 특가 팝업 ===== */
function shouldOpenPromoToday() {
  const key = 't1mobile_promo_seen_date';
  const today = getTodayKey();
  return localStorage.getItem(key) !== today;
}

function markPromoSeenToday() {
  const key = 't1mobile_promo_seen_date';
  localStorage.setItem(key, getTodayKey());
}

function openPromoPopup() {
  if (!promoPopup) return;
  promoPopup.classList.add('is-open');
  promoPopup.setAttribute('aria-hidden', 'false');
}

function closePromoPopup() {
  if (!promoPopup) return;
  promoPopup.classList.remove('is-open');
  promoPopup.setAttribute('aria-hidden', 'true');
  markPromoSeenToday();
}

function renderStores(list) {
  if (!storeGrid) return;

  storeGrid.innerHTML = list.map((store, idx) => {
    const distanceHtml = store.distanceText
      ? `<span class="chip">현재 위치 기준 ${store.distanceText}</span>`
      : `<span class="chip">직영 매장</span>`;

    const isFeatured = idx === 0;
    const featuredClass = isFeatured ? ' store-card--featured store-card--review' : ' store-card--review';
    const featuredBadge = isFeatured
      ? `<span class="store-featured-badge">가장 가까운 추천 매장</span>`
      : '';

    return `
      <article class="store-card${featuredClass}" data-store-index="${idx}">
        ${featuredBadge}

        <div class="store-top">
          <h3>${store.name}</h3>
          ${distanceHtml}
        </div>

        ${store.review ? `
          <p class="store-review">
            "${store.review}"
          </p>
        ` : ""}

        ${store.meta ? `
          <div class="store-meta">${store.meta}</div>
        ` : ""}

        <div class="store-card__sub">${store.address}</div>

        <div class="store-point">
          ${store.points.map(point => `✔ ${point}`).join('<br>')}
        </div>

        <div class="store-actions">
          <a class="btn btn--ghost btn--small" href="${store.mapUrl}" target="_blank" rel="noopener">위치 확인</a>
          <a class="btn btn--primary btn--small" href="tel:${store.phone}">전화 상담</a>
        </div>
      </article>
    `;
  }).join('');
}

function toRad(value) {
  return value * Math.PI / 180;
}

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function showFloatingBox(title, desc) {
  if (!floatingStoreBox || !floatingStoreTitle || !floatingStoreDesc) return;

  floatingStoreTitle.textContent = title;
  floatingStoreDesc.textContent = desc;
  floatingStoreBox.classList.add('is-visible');
}

function hideFloatingBox() {
  if (!floatingStoreBox) return;
  floatingStoreBox.classList.remove('is-visible');
}

function findNearbyStore() {
  if (!navigator.geolocation) {
    showFloatingBox(
      '위치 기능을 사용할 수 없습니다',
      '브라우저에서 위치 서비스를 지원하지 않아 기본 매장 목록을 보여드립니다.'
    );
    return;
  }

  showFloatingBox(
    '가까운 매장을 찾는 중입니다',
    '현재 위치 권한을 허용하면 가까운 순으로 매장을 다시 정렬합니다.'
  );

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      const sorted = stores
        .map(store => {
          const distance = getDistanceKm(latitude, longitude, store.lat, store.lng);
          return {
            ...store,
            distance,
            distanceText: distance < 1
              ? `${Math.round(distance * 1000)}m`
              : `${distance.toFixed(1)}km`
          };
        })
        .sort((a, b) => a.distance - b.distance);

      renderStores(sorted);

      const nearest = sorted[0];
      const approxGeo = getApproxGeo(latitude, longitude);
      const bucket = getAnalyticsBucket();

      bucket.nearbyClicks.push({
        ts: new Date().toISOString(),
        approx: approxGeo,
        nearestStore: nearest.name
      });

      saveAnalyticsBucket(bucket);
      sendAnalytics('nearby_store_search', {
        approxGeo,
        nearestStore: nearest.name
      });

      showFloatingBox(
        `가장 가까운 매장: ${nearest.name}`,
        `${nearest.address}`,
        `· 현재 위치 기준 ${nearest.distanceText}`
      );

      const storesSection = document.getElementById('stores');
      if (storesSection) {
        storesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    (error) => {
      let message = '위치 권한이 거부되었거나 현재 위치를 확인할 수 없어 기본 매장 목록을 보여드립니다.';

      if (error.code === 2) {
        message = '현재 위치 정보를 불러올 수 없어 기본 매장 목록을 보여드립니다.';
      } else if (error.code === 3) {
        message = '위치 확인 시간이 초과되어 기본 매장 목록을 보여드립니다.';
      }

      showFloatingBox('가까운 매장을 찾지 못했습니다', message);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

function resetDefaultStores() {
  renderStores(stores);
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    if (siteNav) siteNav.classList.remove('is-open');
  });
});

if (mobileNavToggle) {
  mobileNavToggle.addEventListener('click', () => {
    if (siteNav) siteNav.classList.toggle('is-open');
  });
}

if (findNearbyBtn) {
  findNearbyBtn.addEventListener('click', () => {
    trackCTA('hero_find_nearby');
    findNearbyStore();
  });
}

if (findNearbyBtnSecondary) {
  findNearbyBtnSecondary.addEventListener('click', () => {
    trackCTA('stores_find_nearby');
    findNearbyStore();
  });
}

if (retryLocationBtn) {
  retryLocationBtn.addEventListener('click', () => {
    trackCTA('retry_location');
    findNearbyStore();
  });
}

if (promoPopupClose) {
  promoPopupClose.addEventListener('click', () => {
    trackCTA('promo_popup_close');
    closePromoPopup();
  });
}

if (promoPopupBackdrop) {
  promoPopupBackdrop.addEventListener('click', () => {
    trackCTA('promo_popup_backdrop_close');
    closePromoPopup();
  });
}

if (promoPopupPoster) {
  promoPopupPoster.addEventListener('click', () => {
    trackCTA('promo_popup_poster_click');
  });
}

if (floatingSpecialBtn) {
  floatingSpecialBtn.addEventListener('click', () => {
    trackCTA('floating_special_open');
    openPromoPopup();
  });
}

if (floatingNearbyBtn) {
  floatingNearbyBtn.addEventListener('click', () => {
    trackCTA('floating_nearby_click');
    findNearbyStore();
  });
}

document.addEventListener('click', (e) => {
  const target = e.target.closest('a, button');
  if (!target) return;

  if (target.matches('a[href^="tel:"]')) {
    trackCTA('call_click', { target: target.getAttribute('href') });
  }

  if (target.textContent && (target.textContent.includes('지도 보기') || target.textContent.includes('위치 확인'))) {
    trackCTA('map_click');
  }

  if (target.textContent && target.textContent.includes('브랜드 스토리')) {
    trackCTA('story_click');
  }
});

if (closeFloatingBoxBtn) {
  closeFloatingBoxBtn.addEventListener('click', hideFloatingBox);
}

const heroSlides = [
  { name: "원신흥점", image: "assets/wonshinheung.jpg" },
  { name: "용문점", image: "assets/yongmoon.jpg" },
  { name: "용운점", image: "assets/yongwoon.jpg" },
  { name: "아산권곡점", image: "assets/kwongok.jpg" },
  { name: "아산세교점", image: "assets/segyo.jpg" },
  { name: "천안신불당점", image: "assets/shinbuldang.jpg" },
  { name: "홍성서우점", image: "assets/seowoo.jpg" }
];

const heroSliderTrack = document.getElementById('heroSliderTrack');
const heroSliderDots = document.getElementById('heroSliderDots');
const heroSliderCaption = document.getElementById('heroSliderCaption');
const heroSliderViewport = document.getElementById('heroSliderViewport');
const heroSliderToggle = document.getElementById('heroSliderToggle');

let heroCurrentIndex = 1;
let heroIsAnimating = false;
let heroAutoPlay = null;
let heroStartX = 0;
let heroCurrentX = 0;
let heroIsDragging = false;
let heroIsPaused = false;

function buildHeroSlider() {
  if (!heroSliderTrack || !heroSlides.length) return;

  const slidesForLoop = [
    heroSlides[heroSlides.length - 1],
    ...heroSlides,
    heroSlides[0]
  ];

  heroSliderTrack.innerHTML = slidesForLoop.map((slide) => `
    <div class="hero-slide">
      <img src="${slide.image}" alt="${slide.name}" class="hero-slide__img" />
    </div>
  `).join('');

  heroSliderDots.innerHTML = heroSlides.map((_, idx) => `
    <button
      type="button"
      class="hero-slider__dot"
      data-dot-index="${idx}"
      aria-label="${idx + 1}번째 이미지 보기"
    ></button>
  `).join('');

  updateHeroSliderUI(false);
  bindHeroSliderDots();
  bindHeroSliderTouch();
  bindHeroSliderToggle();
  startHeroSliderAutoPlay();
}

function updateHeroSliderUI(animate = true) {
  if (!heroSliderTrack) return;

  heroSliderTrack.style.transition = animate
    ? 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)'
    : 'none';

  heroSliderTrack.style.transform = `translateX(-${heroCurrentIndex * 100}%)`;

  const realIndex = getHeroRealIndex();
  const currentSlide = heroSlides[realIndex];

  if (heroSliderCaption && currentSlide) {
    heroSliderCaption.textContent = currentSlide.name;
  }

  if (heroSliderDots) {
    [...heroSliderDots.children].forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === realIndex);
    });
  }

  if (heroSliderToggle) {
    heroSliderToggle.textContent = heroIsPaused ? 'Play' : 'Pause';
    heroSliderToggle.setAttribute('aria-label', heroIsPaused ? '자동재생 시작' : '자동재생 일시정지');
  }
}

function getHeroRealIndex() {
  if (heroCurrentIndex === 0) return heroSlides.length - 1;
  if (heroCurrentIndex === heroSlides.length + 1) return 0;
  return heroCurrentIndex - 1;
}

function goToHeroSlide(nextIndex) {
  if (heroIsAnimating) return;
  heroIsAnimating = true;
  heroCurrentIndex = nextIndex;
  updateHeroSliderUI(true);
}

function nextHeroSlide() {
  goToHeroSlide(heroCurrentIndex + 1);
}

function prevHeroSlide() {
  goToHeroSlide(heroCurrentIndex - 1);
}

function bindHeroSliderDots() {
  if (!heroSliderDots) return;

  heroSliderDots.addEventListener('click', (e) => {
    const btn = e.target.closest('.hero-slider__dot');
    if (!btn) return;

    const dotIndex = Number(btn.dataset.dotIndex);
    heroCurrentIndex = dotIndex + 1;
    updateHeroSliderUI(true);
    restartHeroSliderAutoPlay();
  });
}


function startHeroSliderAutoPlay() {
  if (heroIsPaused) return;
  stopHeroSliderAutoPlay();

  heroAutoPlay = setInterval(() => {
    nextHeroSlide();
  }, 3500);
}

function stopHeroSliderAutoPlay() {
  if (heroAutoPlay) {
    clearInterval(heroAutoPlay);
    heroAutoPlay = null;
  }
}

function restartHeroSliderAutoPlay() {
  if (heroIsPaused) return;
  stopHeroSliderAutoPlay();
  startHeroSliderAutoPlay();
}

function bindHeroSliderTouch() {
  if (!heroSliderViewport) return;

  heroSliderViewport.addEventListener('touchstart', (e) => {
    if (!e.touches.length) return;
    heroIsDragging = true;
    heroStartX = e.touches[0].clientX;
    heroCurrentX = heroStartX;
    stopHeroSliderAutoPlay();
  }, { passive: true });

  heroSliderViewport.addEventListener('touchmove', (e) => {
    if (!heroIsDragging || !e.touches.length) return;
    heroCurrentX = e.touches[0].clientX;
  }, { passive: true });

  heroSliderViewport.addEventListener('touchend', () => {
    if (!heroIsDragging) return;

    const diffX = heroCurrentX - heroStartX;
    heroIsDragging = false;

    if (Math.abs(diffX) > 40) {
      if (diffX < 0) {
        nextHeroSlide();
      } else {
        prevHeroSlide();
      }
    }
    restartHeroSliderAutoPlay();
  });
  heroSliderViewport.addEventListener('mouseenter', () => {
    stopHeroSliderAutoPlay();
  });
  heroSliderViewport.addEventListener('mouseleave', () => {
    if (!heroIsPaused) startHeroSliderAutoPlay();
  });
}
if (heroSliderTrack) {
  heroSliderTrack.addEventListener('transitionend', () => {
    if (heroCurrentIndex === 0) {
      heroCurrentIndex = heroSlides.length;
      updateHeroSliderUI(false);
    }
    if (heroCurrentIndex === heroSlides.length + 1) {
      heroCurrentIndex = 1;
      updateHeroSliderUI(false);
    }
    heroIsAnimating = false;
  });
}

trackSource();
updateViewCounters();
resetDefaultStores();
buildHeroSlider();

function bindHeroSliderToggle() {
  if (!heroSliderToggle) return;

  heroSliderToggle.addEventListener('click', () => {
    heroIsPaused = !heroIsPaused;

    if (heroIsPaused) {
      stopHeroSliderAutoPlay();
    } else {
      startHeroSliderAutoPlay();
    }

    updateHeroSliderUI(false);
  });
}
if (shouldOpenPromoToday()) {
  openPromoPopup();
}

/* =========================
   HERO 캐러셀
========================= */

const heroTrack = document.getElementById('heroTrack');

if (heroTrack) {
  const slides = heroTrack.children;
  let index = 0;
  function nextSlide() {
    index++;
    if (index >= slides.length) {
      index = 0;
    }
    heroTrack.style.transform = `translateX(-${index * 100}%)`;
  }
  setInterval(nextSlide, 3000);
}
