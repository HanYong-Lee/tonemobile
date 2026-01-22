/* KT Plaza - main script
   - Intro overlay
   - Tabs
   - Bullet accordion
   - YouTube Shorts inline player (ClipCard)
   - Lightweight analytics
*/
(() => {
  "use strict";

  // ---------------------------
  // Helpers
  // ---------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------------------------
  // 1) Intro (tap to skip)
  // ---------------------------
  const intro = $("#intro");
  const introVideo = $("#introVideo");
  const skipBtn = $("#skipBtn");

  const hideIntro = () => {
    if (!intro || intro.classList.contains("is-hidden")) return;
    intro.classList.add("is-hidden");
    try { introVideo?.pause(); } catch (_) {}
    document.body.style.overflow = "";
  };

  if (intro) {
    document.body.style.overflow = "hidden";
    intro.addEventListener("click", hideIntro);
  }
  if (skipBtn) {
    skipBtn.addEventListener("click", (e) => { e.stopPropagation(); hideIntro(); });
  }
  if (introVideo) {
    introVideo.addEventListener("ended", hideIntro);
    introVideo.addEventListener("error", hideIntro); // fail-safe
  }

  // ---------------------------
  // 2) Tabs
  // ---------------------------
  const tabButtons = $$(".tab");
  const panels = $$(".panel");

  const setActiveTab = (id) => {
    tabButtons.forEach((btn) => {
      const on = btn.dataset.tab === id;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", String(on));
    });
    panels.forEach((p) => p.classList.toggle("is-active", p.id === id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  tabButtons.forEach((btn) => btn.addEventListener("click", () => setActiveTab(btn.dataset.tab)));

  // Jump links inside cards (data-jump-tab)
  $$("[data-jump-tab]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const id = el.getAttribute("data-jump-tab");
      if (!id) return;
      e.preventDefault();
      setActiveTab(id);
    });
  });

  // (Optional) retrigger fade lines when returning to Tab1
  const reRunFadeLines = () => {
    const container = $("#t1 .fadeLines[data-fade-lines]");
    if (!container) return;
    $$("span", container).forEach((s) => {
      s.style.animation = "none";
      s.offsetHeight; // reflow
      s.style.animation = "";
    });
  };
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.tab === "t1") reRunFadeLines();
    });
  });

  // ---------------------------
  // 3) Core bullets accordion
  // ---------------------------
  const accordWrap = $("[data-bullet-accord]");
  if (accordWrap) {
    const items = $$(".bulletCard", accordWrap);

    // init aria
    items.forEach((li) => {
      const b = $(".bulletCard__btn", li);
      if (b) b.setAttribute("aria-expanded", String(li.classList.contains("is-open")));
    });

    accordWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".bulletCard__btn");
      if (!btn) return;

      const li = btn.closest(".bulletCard");
      if (!li) return;

      const willOpen = !li.classList.contains("is-open");

      // close all
      items.forEach((other) => {
        other.classList.remove("is-open");
        const b = $(".bulletCard__btn", other);
        if (b) b.setAttribute("aria-expanded", "false");
      });

      // open selected
      if (willOpen) {
        li.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        li.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
  }

  // ---------------------------
  // 4) YouTube Shorts (ClipCard)
  //    - IMPORTANT: iOS/Safari autoplay is usually blocked unless muted.
  //    - We set autoplay=1&mute=1&playsinline=1
  // ---------------------------
  const buildEmbedUrl = (videoId) => {
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      playsinline: "1",
      rel: "0",
      modestbranding: "1",
    });
    return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`;
  };

  const closeClipCard = (card) => {
    const player = $(".clipCard__player", card);
    const iframe = $(".clipCard__iframe", card);
    player?.classList.add("hidden");
    if (iframe) iframe.src = ""; // stop
    card.classList.remove("is-playing");
  };

  const openClipCard = (card) => {
    const videoId = card.dataset.videoId;
    const player = $(".clipCard__player", card);
    const iframe = $(".clipCard__iframe", card);
    if (!videoId || !player || !iframe) return;

    iframe.src = buildEmbedUrl(videoId);
    player.classList.remove("hidden");
    card.classList.add("is-playing");
  };

  // Single delegated handler (no duplicates)
  document.addEventListener("click", (e) => {
    const closeBtn = e.target.closest(".js-close-video");
    if (closeBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card = closeBtn.closest(".clipCard");
      if (card) closeClipCard(card);
      return;
    }

    const openEl = e.target.closest(".js-open-video");
    if (openEl) {
      e.preventDefault();
      const card = openEl.closest(".clipCard") || openEl;
      if (!card) return;
      // close other playing cards (optional)
      $$(".clipCard.is-playing").forEach((c) => { if (c !== card) closeClipCard(c); });
      openClipCard(card);
    }
  });

  // Keyboard open (Space/Enter) if clipCard is a div/role=button
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const el = document.activeElement;
    if (!(el instanceof HTMLElement)) return;
    if (!el.classList.contains("js-open-video")) return;
    e.preventDefault();
    $$(".clipCard.is-playing").forEach((c) => { if (c !== el) closeClipCard(c); });
    openClipCard(el);
  });

  // ---------------------------
  // 5) Analytics (simple)
  // ---------------------------
  const ANALYTICS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxTL6tU-PwMX5MOX0AHQGTaBbMfju_wz8GelbeWdfdhAivqzG8P8xGYErRIVPj76B1Sjg/exec";

  const getUaSummary = () => {
    const ua = (navigator.userAgent || "").toLowerCase();
    const plat = (navigator.platform || "").toLowerCase();

    const isMobile = /mobi|android|iphone|ipad|ipod|iemobile|windows phone/.test(ua);
    const deviceType = isMobile ? "mobile" : "desktop";

    let os = "other";
    if (/android/.test(ua)) os = "android";
    else if (/iphone|ipad|ipod/.test(ua)) os = "ios";
    else if (/windows/.test(ua) || /win/.test(plat)) os = "windows";
    else if (/mac os|macintosh/.test(ua) || /mac/.test(plat)) os = "mac";
    else if (/linux/.test(ua)) os = "linux";

    let browser = "other";
    if (/edg\//.test(ua)) browser = "edge";
    else if (/opr\//.test(ua) || /opera/.test(ua)) browser = "opera";
    else if (/samsungbrowser\//.test(ua)) browser = "samsung";
    else if (/chrome\//.test(ua) && !/chromium/.test(ua)) browser = "chrome";
    else if (/firefox\//.test(ua)) browser = "firefox";
    else if (/safari\//.test(ua) && !/chrome\//.test(ua) && !/crios\//.test(ua)) browser = "safari";

    return `${deviceType}|${os}|${browser}`;
  };

  const getSessionId = () => {
    const k = "ktplaza_sid";
    let sid = localStorage.getItem(k);
    if (!sid) {
      sid = "s_" + Math.random().toString(36).slice(2) + "_" + Date.now();
      localStorage.setItem(k, sid);
    }
    return sid;
  };

  const sid = getSessionId();
  const sessionStart = Date.now();
  let activeTab = "t1";
  let tabStart = Date.now();
  let didFlush = false;

  const sendEvent = (payload) => {
    const bodyObj = {
      ts: Date.now(),
      sessionId: sid,
      url: location.href,
      ua: getUaSummary(),
      ...payload,
    };

    const url = `${ANALYTICS_ENDPOINT}?path=collect`;
    const json = JSON.stringify(bodyObj);

    // sendBeacon first
    if (navigator.sendBeacon) {
      try {
        const blob = new Blob([json], { type: "text/plain;charset=UTF-8" });
        if (navigator.sendBeacon(url, blob)) return;
      } catch (_) {}
    }

    // fallback
    fetch(url, {
      method: "POST",
      body: json,
      keepalive: true,
      mode: "no-cors",
      cache: "no-store",
    }).catch(() => {});
  };

  sendEvent({ event: "page_view" });

  const recordTabDwell = (nextTab) => {
    const now = Date.now();
    const dur = now - tabStart;
    if (dur > 300) sendEvent({ event: "tab_dwell", tab: activeTab, durationMs: dur });
    activeTab = nextTab;
    tabStart = now;
  };

  $$(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab || "";
      if (target) recordTabDwell(target);
    });
  });

  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-consultant]");
    if (c) {
      sendEvent({ event: "consultant_click", targetType: "consultant", targetId: c.dataset.consultant || "unknown" });
    }

    const a = e.target.closest("[data-cta]");
    if (a) {
      sendEvent({ event: "cta_click", targetType: "cta", targetId: a.dataset.cta || "unknown", cardId: a.dataset.card || "default" });
    }
  });

  const flushOnExit = () => {
    if (didFlush) return;
    didFlush = true;

    const now = Date.now();

    const dur = now - tabStart;
    if (dur > 300) sendEvent({ event: "tab_dwell", tab: activeTab, durationMs: dur });

    const total = now - sessionStart;
    if (total > 300) sendEvent({ event: "session_end", durationMs: total });
  };

  window.addEventListener("pagehide", flushOnExit);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushOnExit();
  });
  window.addEventListener("beforeunload", flushOnExit);
})();
