const ANALYTICS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxefwMEvZjBII-xUU8_7ZjuANtr7D-S82JnWUb67osvMUnbypM7KBu2M9wiDs---LylLw/exec';
const ANALYTICS_USE_GAS = true;

const stores = [
  {
    name: "원신흥점",
    lat: 36.3342,
    lng: 127.3406,
    address: "대전 유성구 원신흥동",
    points: ["강점 Point 1", "강점 Point 2", "강점 Point 3"],
    phone: "010-0000-0001",
    mapUrl: "https://map.naver.com/"
  },
  {
    name: "용문점",
    lat: 36.3387,
    lng: 127.3938,
    address: "대전 서구 용문동",
    points: ["강점 Point 1", "강점 Point 2", "강점 Point 3"],
    phone: "010-0000-0002",
    mapUrl: "https://map.naver.com/"
  },
  {
    name: "용운점",
    lat: 36.3213,
    lng: 127.4589,
    address: "대전 동구 용운동",
    points: ["강점 Point 1", "강점 Point 2", "강점 Point 3"],
    phone: "010-0000-0003",
    mapUrl: "https://map.naver.com/"
  },
  {
    name: "아산권곡점",
    lat: 36.7775,
    lng: 127.0189,
    address: "충남 아산시 권곡동",
    points: ["강점 Point 1", "강점 Point 2", "강점 Point 3"],
    phone: "010-0000-0004",
    mapUrl: "https://map.naver.com/"
  },
  {
    name: "아산세교점",
    lat: 36.7838,
    lng: 127.0004,
    address: "충남 아산시 세교리 인근",
    points: ["강점 Point 1", "강점 Point 2", "강점 Point 3"],
    phone: "010-0000-0005",
    mapUrl: "https://map.naver.com/"
  },
  {
    name: "천안신불당점",
    lat: 36.8086,
    lng: 127.1082,
    address: "충남 천안시 서북구 불당동",
    points: ["강점 Point 1", "강점 Point 2", "강점 Point 3"],
    phone: "010-0000-0006",
    mapUrl: "https://map.naver.com/"
  },
  {
    name: "홍성서우점",
    lat: 36.6014,
    lng: 126.6641,
    address: "충남 홍성군 홍성읍",
    points: ["강점 Point 1", "강점 Point 2", "강점 Point 3"],
    phone: "010-0000-0007",
    mapUrl: "https://map.naver.com/"
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

const todayViewsEl = document.getElementById('todayViews');
const totalViewsEl = document.getElementById('totalViews');

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

function updateViewCounters() {
  if (!todayViewsEl || !totalViewsEl) return;

  const bucket = getAnalyticsBucket();
  const todayKey = getTodayKey();
  const sessionKey = `t1mobile_viewed_${todayKey}`;

  if (!sessionStorage.getItem(sessionKey)) {
    bucket.totalViews += 1;
    bucket.dailyViews[todayKey] = (bucket.dailyViews[todayKey] || 0) + 1;
    saveAnalyticsBucket(bucket);
    sessionStorage.setItem(sessionKey, '1');
    sendAnalytics('page_view', {
      today: todayKey,
      referrer: document.referrer || 'direct'
    });
  }

  const latest = getAnalyticsBucket();
  todayViewsEl.textContent = latest.dailyViews[todayKey] || 0;
  totalViewsEl.textContent = latest.totalViews || 0;
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

function sendAnalytics(eventName, payload = {}) {
  if (!ANALYTICS_ENDPOINT) return;

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

  fetch(ANALYTICS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
    mode: ANALYTICS_USE_GAS ? 'no-cors' : 'cors'
  }).catch(() => {});
}

function renderStores(list) {
  if (!storeGrid) return;

  storeGrid.innerHTML = list.map((store, idx) => {
    const distanceHtml = store.distanceText
      ? `<span class="chip">현재 위치 기준 ${store.distanceText}</span>`
      : `<span class="chip">직영 매장</span>`;

    return `
      <article class="store-card" data-store-index="${idx}">
        <div class="store-card__top">
          <div>
            <h3>${store.name}</h3>
            <div class="store-card__sub">${store.address}</div>
          </div>
          ${distanceHtml}
        </div>

        <div class="store-points">
          ${store.points.map(point => `<div class="store-point">${point}</div>`).join('')}
        </div>

        <div class="store-actions">
          <a class="btn btn--primary btn--small" href="tel:${store.phone}">상담 연결</a>
          <a class="btn btn--ghost btn--small" href="${store.mapUrl}" target="_blank" rel="noopener">지도 보기</a>
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
        `${nearest.address} · 현재 위치 기준 ${nearest.distanceText}. 아래 매장 카드에서 바로 상담 연결 또는 지도 보기를 이용해보세요.`
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

document.addEventListener('click', (e) => {
  const target = e.target.closest('a, button');
  if (!target) return;

  if (target.matches('a[href^="tel:"]')) {
    trackCTA('call_click', { target: target.getAttribute('href') });
  }

  if (target.textContent && target.textContent.includes('지도 보기')) {
    trackCTA('map_click');
  }

  if (target.textContent && target.textContent.includes('브랜드 스토리')) {
    trackCTA('story_click');
  }
});

if (closeFloatingBoxBtn) {
  closeFloatingBoxBtn.addEventListener('click', hideFloatingBox);
}

trackSource();
updateViewCounters();
resetDefaultStores();
