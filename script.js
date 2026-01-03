(() => {
  // ---------- Intro: tap to skip ----------
  const intro = document.getElementById("intro");
  const introVideo = document.getElementById("introVideo");
  const skipBtn = document.getElementById("skipBtn");

  const hideIntro = () => {
    if (!intro || intro.classList.contains("is-hidden")) return;
    intro.classList.add("is-hidden");
    try { introVideo && introVideo.pause(); } catch (e) {}
    document.body.style.overflow = "";
  };

  // Lock scroll while intro is showing
  if (intro) document.body.style.overflow = "hidden";

  // If video ends, auto-hide
  if (introVideo) {
    introVideo.addEventListener("ended", hideIntro);
    introVideo.addEventListener("error", hideIntro); // fail-safe
  }

  // Tap anywhere to skip
  if (intro) intro.addEventListener("click", hideIntro);
  if (skipBtn) skipBtn.addEventListener("click", (e) => { e.stopPropagation(); hideIntro(); });

  // ---------- Tabs ----------
  const tabButtons = Array.from(document.querySelectorAll(".tab"));
  const panels = Array.from(document.querySelectorAll(".panel"));

  const setActiveTab = (id) => {
    tabButtons.forEach(btn => {
      const isOn = btn.dataset.tab === id;
      btn.classList.toggle("is-active", isOn);
      btn.setAttribute("aria-selected", String(isOn));
    });
    panels.forEach(p => p.classList.toggle("is-active", p.id === id));
    // light scroll to top of content area for mobile comfort
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
  });

  // Jump links inside cards (data-jump-tab)
  document.querySelectorAll("[data-jump-tab]").forEach(el => {
    el.addEventListener("click", (e) => {
      const id = el.getAttribute("data-jump-tab");
      if (!id) return;
      e.preventDefault();
      setActiveTab(id);
    });
  });

  // ---------- Fade lines: re-trigger when returning to Tab1 ----------
  // (기본 CSS 애니메이션이지만, 탭 이동 후 다시 들어올 때도 보여주고 싶으면 재실행)
  const reRunFadeLines = () => {
    const container = document.querySelector("#t1 .fadeLines[data-fade-lines]");
    if (!container) return;
    const spans = Array.from(container.querySelectorAll("span"));
    spans.forEach((s) => {
      s.style.animation = "none";
      s.offsetHeight; // reflow
      s.style.animation = "";
    });
  };

  // When Tab1 becomes active
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.tab === "t1") reRunFadeLines();
    });
  });
})();


(function () {
  const wrap = document.querySelector("[data-bullet-accord]");
  if (!wrap) return;

  const items = Array.from(wrap.querySelectorAll(".bulletCard"));

  // 접근성: 패널에 id 부여 + 버튼 aria-controls 연결
  items.forEach((li, idx) => {
    const btn = li.querySelector(".bulletCard__btn");
    const panel = li.querySelector(".bulletCard__panel");
    if (!btn || !panel) return;

    const panelId = `bulletCardPanel_${idx}`;
    panel.id = panelId;
    btn.setAttribute("aria-controls", panelId);

    // 초기 상태 동기화
    const isOpen = li.classList.contains("is-open");
    btn.setAttribute("aria-expanded", String(isOpen));
  });

  function closeAll(except) {
    items.forEach((li) => {
      if (li === except) return;
      li.classList.remove("is-open");
      const btn = li.querySelector(".bulletCard__btn");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  items.forEach((li) => {
    const btn = li.querySelector(".bulletCard__btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const willOpen = !li.classList.contains("is-open");

      closeAll(li);

      if (willOpen) {
        li.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");

        // 모바일에서 펼친 항목이 화면에 잘 보이도록 부드럽게 위치 보정(선택)
        li.scrollIntoView({ block: "nearest", behavior: "smooth" });
      } else {
        li.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  });
})();

// ---------- Bullet Accordion (smooth open/close) ----------
(() => {
  const accord = document.querySelector("[data-bullet-accord]");
  if (!accord) return;

  const items = Array.from(accord.querySelectorAll(".bulletCard"));

  // 열린 패널의 실제 높이를 max-height로 설정해 애니메이션 되게 함
  const setPanelHeight = (li, open) => {
    const panel = li.querySelector(".bulletCard__panel");
    const inner = li.querySelector(".bulletCard__panelInner");
    if (!panel || !inner) return;

    if (open) {
      // 먼저 max-height를 0에서 scrollHeight로
      panel.style.maxHeight = inner.scrollHeight + "px";
    } else {
      panel.style.maxHeight = "0px";
    }
  };

  // 초기 상태(처음 열려있는 항목이 있으면 높이 세팅)
  items.forEach(li => {
    const isOpen = li.classList.contains("is-open");
    const btn = li.querySelector(".bulletCard__btn");
    if (btn) btn.setAttribute("aria-expanded", String(isOpen));
    setPanelHeight(li, isOpen);
  });

  accord.addEventListener("click", (e) => {
    const btn = e.target.closest(".bulletCard__btn");
    if (!btn) return;

    const li = btn.closest(".bulletCard");
    if (!li) return;

    const isOpen = li.classList.contains("is-open");

    // 원하면 "하나만 열리게" 유지
    items.forEach(other => {
      if (other !== li) {
        other.classList.remove("is-open");
        const b = other.querySelector(".bulletCard__btn");
        if (b) b.setAttribute("aria-expanded", "false");
        setPanelHeight(other, false);
      }
    });

    // 토글
    li.classList.toggle("is-open", !isOpen);
    btn.setAttribute("aria-expanded", String(!isOpen));
    setPanelHeight(li, !isOpen);
  });

  // 화면 회전/리사이즈 시 열린 패널 높이 재계산
  window.addEventListener("resize", () => {
    items.forEach(li => {
      if (li.classList.contains("is-open")) setPanelHeight(li, true);
    });
  });
})();
