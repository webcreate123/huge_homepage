function headerSet() {
  const stickyHeaderTop = 100;
  const logoImg = document.querySelector(".header__logo img");
  const bannerSection = document.querySelector(".banner");
  const defaultLogoSrc = "img/header_logo.svg";
  const changedLogoSrc = "img/hd_change_logo.svg";
  const shouldApplyHeaderState = !document
    .querySelector(".header")
    ?.classList.contains("no-header-state-update");

  function updateHeaderState() {
    const header = document.querySelector(".header");
    let triggerPoint = stickyHeaderTop;

    if (bannerSection) {
      triggerPoint = bannerSection.offsetTop + bannerSection.offsetHeight;
    }

    if (window.scrollY > triggerPoint) {
      if (header && !header.classList.contains("pst_blackheader")) {
        header.classList.add("pst_blackheader");
      }
      if (
        logoImg &&
        !logoImg.getAttribute("src")?.includes("hd_change_logo.svg")
      ) {
        logoImg.setAttribute("src", changedLogoSrc);
      }
    } else {
      header?.classList.remove("pst_blackheader");
      if (
        logoImg &&
        !logoImg.getAttribute("src")?.includes("header_logo.svg")
      ) {
        logoImg.setAttribute("src", defaultLogoSrc);
      }
    }
  }

  if (shouldApplyHeaderState) {
    window.addEventListener("scroll", updateHeaderState);
    window.addEventListener("resize", updateHeaderState);
    updateHeaderState();
  }

  function closeHeaderSidebar() {
    document.body.classList.remove("is-header-sidebar-open");
    const btn = document.querySelector(".header__hamburger-btn");
    btn?.classList.remove("header__hamburger-btn--open");
    btn?.setAttribute("aria-expanded", "false");
    btn?.setAttribute("aria-label", "メニューを開く");
    document
      .querySelector(".header__sidebar")
      ?.setAttribute("aria-hidden", "true");
    document
      .querySelector(".header__sidebar-overlay")
      ?.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("hide-scroll");
    document.body.classList.remove("hide-scroll");
  }

  document
    .querySelector(".js_hamburger")
    ?.addEventListener("click", function () {
      document.body.classList.toggle("is-header-sidebar-open");
      document
        .querySelector(".header__hamburger-btn")
        ?.classList.toggle("header__hamburger-btn--open");
      const isOpen = document.body.classList.contains("is-header-sidebar-open");
      const btn = document.querySelector(".header__hamburger-btn");
      btn?.setAttribute("aria-expanded", isOpen ? "true" : "false");
      btn?.setAttribute(
        "aria-label",
        isOpen ? "メニューを閉じる" : "メニューを開く",
      );
      document
        .querySelector(".header__sidebar")
        ?.setAttribute("aria-hidden", isOpen ? "false" : "true");
      document
        .querySelector(".header__sidebar-overlay")
        ?.setAttribute("aria-hidden", isOpen ? "false" : "true");

      const nav = document.querySelector(".navigation-main-hp");
      if (nav) {
        if (nav.style.display === "block") {
          nav.style.display = "none";
        } else {
          nav.style.display = "block";
        }
      }

      document.documentElement.classList.toggle("hide-scroll");
      document.body.classList.toggle("hide-scroll");
    });

  document
    .querySelector(".header__sidebar-overlay")
    ?.addEventListener("click", closeHeaderSidebar);

  document.querySelectorAll(".header__sidebar-link").forEach((link) => {
    link.addEventListener("click", function () {
      closeHeaderSidebar();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      document.body.classList.contains("is-header-sidebar-open")
    ) {
      closeHeaderSidebar();
    }
  });

  document.querySelectorAll(".header__menu-link").forEach((link) => {
    link.addEventListener("click", function () {
      const headerMenu = document.querySelector(".header__menu");
      if (headerMenu && headerMenu.classList.contains("pst_open")) {
        document
          .querySelector(".header__hamburger-btn")
          ?.classList.toggle("pst_open");
        headerMenu.classList.toggle("pst_open");

        if (document.documentElement.classList.contains("hide-scroll")) {
          document.documentElement.classList.remove("hide-scroll");
          document.body.classList.remove("hide-scroll");
        }
      }
    });
  });

  subpageHeaderWhiteBandAfterFv();
}

/** 下層（no-header-state-update）PC: ファーストビュー通過後にヘッダー高さ分の白帯 */
function subpageHeaderWhiteBandAfterFv() {
  const header = document.querySelector(".header.no-header-state-update");
  const fv = document.querySelector(".page__fv");
  if (!header || !fv) return;

  // about-huge-3min.html（.page__about）では白帯を付けない
  if (fv.closest(".page__about")) return;

  const pcMq = window.matchMedia("(min-width: 992px)");

  function update() {
    if (!pcMq.matches) {
      header.classList.remove("pst_after-fv");
      return;
    }
    const pastFv = fv.getBoundingClientRect().bottom <= 0;
    header.classList.toggle("pst_after-fv", pastFv);
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  pcMq.addEventListener("change", update);
  update();
}

function lenisSetting() {
  const isMobile = window.matchMedia("(pointer: coarse)").matches;

  // 👉 スマホは完全にLenis無効
  if (isMobile) return;

  const lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

function setupMobileBottomNav() {
  const bottomNav = document.querySelector(".js-sp-bottom-nav");
  const heroSection = document.querySelector(".banner");
  const footer = document.querySelector(".footer");
  const mobileMedia = window.matchMedia("(max-width: 991px)");
  if (!bottomNav || !heroSection || !footer) return;
  document.body.classList.add("has-sp-bottom-nav");

  let heroBottom = 0;

  function updateHeroBottom() {
    const rect = heroSection.getBoundingClientRect();
    heroBottom = rect.top + window.scrollY + rect.height;
  }

  function updateBottomNavState() {
    if (!mobileMedia.matches) {
      bottomNav.classList.remove("is-visible");
      return;
    }

    const passedFirstView =
      window.scrollY > heroBottom - window.innerHeight * 0.5;
    const footerTop = footer.getBoundingClientRect().top;
    const navOffset = bottomNav.offsetHeight + 24;
    const isNearFooter = footerTop <= window.innerHeight - navOffset;
    const isSidebarOpen = document.body.classList.contains(
      "is-header-sidebar-open",
    );
    const shouldShow = passedFirstView && !isNearFooter && !isSidebarOpen;

    bottomNav.classList.toggle("is-visible", shouldShow);
  }

  updateHeroBottom();
  updateBottomNavState();

  window.addEventListener("scroll", updateBottomNavState, { passive: true });
  window.addEventListener("resize", () => {
    updateHeroBottom();
    updateBottomNavState();
  });

  document.addEventListener("click", (event) => {
    if (
      event.target.closest(".js_hamburger") ||
      event.target.closest(".header__sidebar-overlay") ||
      event.target.closest(".header__sidebar-link")
    ) {
      setTimeout(updateBottomNavState, 0);
    }
  });
}

/**
 * iOS Safari 等: アドレスバー／下部ツールバー表示で fixed の下辺がズレるのを visualViewport で補正
 */
function syncSpEntryBarToVisualViewport(entryBar, mobileMedia) {
  if (!window.visualViewport) return;

  const vv = window.visualViewport;
  let rafId = 0;

  const updateVisualBottom = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      if (!mobileMedia.matches) {
        entryBar.style.removeProperty("--sp-entry-visual-bottom");
        return;
      }
      const gap = Math.max(
        0,
        Math.round(window.innerHeight - vv.height - vv.offsetTop),
      );
      entryBar.style.setProperty("--sp-entry-visual-bottom", `${gap}px`);
    });
  };

  vv.addEventListener("resize", updateVisualBottom, { passive: true });
  vv.addEventListener("scroll", updateVisualBottom, { passive: true });
  window.addEventListener("resize", updateVisualBottom, { passive: true });
  window.addEventListener("scroll", updateVisualBottom, { passive: true });
  window.addEventListener("orientationchange", updateVisualBottom, {
    passive: true,
  });
  mobileMedia.addEventListener("change", updateVisualBottom);

  updateVisualBottom();
}

/** 新卒ページ: モバイルで ENTRY を画面下に固定（トップの sp-bottom-nav と同様の表示タイミング） */
function setupMobileEntryBar() {
  const entryBar = document.querySelector(".js-sp-entry-bar");
  const heroSection = document.querySelector(".page__newgrad .page__fv");
  const footer = document.querySelector(".footer");
  const mobileMedia = window.matchMedia("(max-width: 991px)");
  if (!entryBar || !heroSection || !footer) return;
  document.body.classList.add("has-sp-entry-bar");

  syncSpEntryBarToVisualViewport(entryBar, mobileMedia);

  let heroBottom = 0;

  function updateHeroBottom() {
    const rect = heroSection.getBoundingClientRect();
    heroBottom = rect.top + window.scrollY + rect.height;
  }

  function updateEntryBarState() {
    if (!mobileMedia.matches) {
      entryBar.classList.remove("is-visible");
      return;
    }

    const passedFirstView =
      window.scrollY > heroBottom - window.innerHeight * 0.5;
    const footerTop = footer.getBoundingClientRect().top;
    const navOffset = entryBar.offsetHeight + 24;
    const isNearFooter = footerTop <= window.innerHeight - navOffset;
    const isSidebarOpen = document.body.classList.contains(
      "is-header-sidebar-open",
    );
    const shouldShow = passedFirstView && !isNearFooter && !isSidebarOpen;

    entryBar.classList.toggle("is-visible", shouldShow);
  }

  updateHeroBottom();
  updateEntryBarState();

  window.addEventListener("scroll", updateEntryBarState, { passive: true });
  window.addEventListener("resize", () => {
    updateHeroBottom();
    updateEntryBarState();
  });

  document.addEventListener("click", (event) => {
    if (
      event.target.closest(".js_hamburger") ||
      event.target.closest(".header__sidebar-overlay") ||
      event.target.closest(".header__sidebar-link")
    ) {
      setTimeout(updateEntryBarState, 0);
    }
  });
}

function setupInviewAnimations() {
  const items = document.querySelectorAll("[data-inview]");
  items.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 70%",
      end: "bottom+=10% top",
      markers: false,
      onEnter: () => {
        el.classList.add("inview");
      },
    });
  });
}

function scrollAnimFunc() {
  const winHeight = window.innerHeight;
  const scrollTop = window.scrollY;

  document
    .querySelectorAll(
      ".anim, .fade_y, .svg_anim, .scaleDown, .scaleUp, .brush, .scr_cvr_y, .scr_cvr, .clip_path",
    )
    .forEach((el) => {
      const elTop = el.getBoundingClientRect().top + scrollTop; // FIXED
      if (scrollTop > elTop - winHeight * 0.75) {
        el.classList.add("on");
      }
    });
}

function brandImageAnimation() {
  const selector = ".brandImage";
  const initialScale = 1.1;
  const scaleValue = 1;
  const translateYValue = 0;
  const startPosition = "top 80%";
  const endPosition = "bottom top";
  const ease = "sine.out";
  const markers = false;
  const scrub = 2;

  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  elements.forEach((element) => {
    gsap.set(element, { overflow: "hidden" });

    const img = element.querySelector("img");
    if (!img) return;

    gsap.set(element, { clipPath: "inset(0% 0% 0% 100%)" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: startPosition,
        end: endPosition,
        scrub: scrub,
        markers: markers,
      },
    });

    tl.to(img, {
      scale: scaleValue,
      y: translateYValue,
      ease: ease,
    });

    ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(element, {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "power4.inOut",
          duration: 1.2,
        });
      },
    });
  });
}

function homeMessageHeadingReveal() {
  const heading = document.querySelector(".home__message .section__heading");
  if (!heading || typeof gsap === "undefined") return;

  const titleTxt = heading.querySelector(".section__title-txt");
  const paint = heading.querySelector(".section__title-paint");
  if (!titleTxt) return;

  gsap.set(titleTxt, { yPercent: 108 });
  if (paint) {
    gsap.set(paint, { autoAlpha: 0, y: 28 });
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heading,
      start: "top 82%",
      toggleActions: "play none none none",
    },
  });

  tl.to(titleTxt, {
    yPercent: 0,
    duration: 1.05,
    ease: "power3.out",
  });

  if (paint) {
    tl.to(
      paint,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
      },
      "-=0.72",
    );
  }
}

function textAnimation() {
  var txt = document.querySelectorAll(".animation_txt");
  txt.forEach((el) => {
    var target = el.querySelectorAll(":scope > p");
    gsap.set(target, { filter: "blur(10px)", opacity: 0, x: -10, y: -15 });
    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 70%",
          end: function () {
            return window.innerWidth >= 1600 ? "top 90%" : "40% 40%";
          },
          scrub: 4,
        },
      })
      .to(target, {
        opacity: 1,
        filter: "blur(0px)",
        x: 0,
        y: 0,
        stagger: 0.08,
        ease: "power1.out",
      });
  });
}

function bannerIntroAnimation() {
  const bannerBg = document.querySelector(".banner__bg");
  const bannerBottom = document.querySelector(".banner__bottom");
  const bannerTitle = document.querySelector(".banner__title");
  const bannerVideo = document.querySelector(".banner__video");
  const header = document.querySelector(".header");

  if (
    !bannerBg ||
    !bannerBottom ||
    !bannerTitle ||
    !bannerVideo ||
    !header ||
    typeof gsap === "undefined"
  ) {
    // Fallback: avoid keeping header hidden when GSAP can't run.
    if (header) {
      header.style.opacity = "1";
      header.style.visibility = "visible";
      header.style.transform = "none";
    }
    return;
  }

  const timeline = gsap.timeline();

  gsap.set(bannerBg, { autoAlpha: 0 });
  gsap.set(bannerBottom, { autoAlpha: 0, y: 40 });
  gsap.set(header, { autoAlpha: 1, y: "-100vh" });
  gsap.set(bannerTitle, { autoAlpha: 0, y: 0 });
  gsap.set(bannerVideo, { autoAlpha: 0, y: 0 });

  timeline
    .to(bannerBg, {
      autoAlpha: 1,
      duration: 0.55,
      ease: "power2.out",
    })
    .to(
      bannerBottom,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
      },
      "+=0.05",
    )
    .to(
      [bannerTitle, bannerVideo],
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.06,
      },
      "+=0.68",
    )
    .to(
      bannerBottom,
      {
        autoAlpha: 0,
        y: 24,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(bannerBottom, { display: "none" });
        },
      },
      "<",
    )
    .to(
      header,
      {
        y: 0,
        duration: 0.7,
        ease: "none",
      },
      "+=0.06",
    );
}

function accordionSetting() {
  const patientsItems = document.querySelectorAll(".patients__faq-item");

  patientsItems.forEach(function (item) {
    item.addEventListener("click", function () {
      this.classList.toggle("is__open");

      const panel = this.querySelector(".patients__faq-answer");

      if (panel.style.maxHeight && panel.style.maxHeight !== "0px") {
        panel.style.maxHeight = "0px";
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  const faqItems = document.querySelectorAll(".single__faq-item");

  faqItems.forEach(function (item) {
    item.addEventListener("click", function () {
      this.classList.toggle("is__open");

      const panel = this.querySelector(".single__faq-a");

      if (panel.style.maxHeight && panel.style.maxHeight !== "0px") {
        panel.style.maxHeight = "0px";
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
}

function tocSetting() {
  const links = document.querySelectorAll(".sinlge__toc-link");

  if (!links.length) return;

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Handles full URL or just #id
      const hash = this.hash;
      if (!hash) return;

      const target = document.querySelector(hash);
      if (!target) return;

      const header = document.querySelector(".header"); // change if needed
      const offset = header ? header.offsetHeight : 0;

      const position =
        target.getBoundingClientRect().top + window.pageYOffset - offset - 10;

      window.scrollTo({
        top: position,
        behavior: "smooth",
      });
    });
  });
}

function parttimeQuickLinkScroll() {
  const quickLinks = document.querySelectorAll(
    ".header__quick-link[href^='#']",
  );
  if (!quickLinks.length) return;

  const header = document.querySelector(".header");

  quickLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const hash = this.hash;
      if (!hash) return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      const offset = header ? header.offsetHeight : 0;
      const targetTop =
        target.getBoundingClientRect().top + window.pageYOffset - offset - 12;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    });
  });
}

/** about-huge-3min.html: ページ内ナビ（#data / #place / #business） */
function aboutNavSmoothScroll() {
  const links = document.querySelectorAll('.about__nav-link[href^="#"]');
  if (!links.length) return;

  const header = document.querySelector(".header");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const hash = link.hash;
      if (!hash) return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      const offset = header ? header.offsetHeight : 0;
      const targetTop =
        target.getBoundingClientRect().top + window.pageYOffset - offset - 12;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    });
  });
}

function faqNavScrollSpy() {
  const faqSections = document.querySelectorAll(".newgrad__faq .faq__inner");
  if (!faqSections.length) return;

  faqSections.forEach((section, sectionIndex) => {
    const navLinks = Array.from(
      section.querySelectorAll(".faq__side-nav .faq__nav-item"),
    );
    const dropdownRoot = section.querySelector(".faq__side-dropdown");
    const dropdownBtn = dropdownRoot?.querySelector(".faq__side-dropdown-btn");
    const dropdownBtnTxt = dropdownRoot?.querySelector(
      ".faq__side-dropdown-btn-txt",
    );
    const dropdownItems = dropdownRoot
      ? Array.from(dropdownRoot.querySelectorAll(".faq__side-dropdown-item"))
      : [];
    const faqItems = Array.from(
      section.querySelectorAll(".faq__main .faq__item"),
    );
    if (!navLinks.length || !faqItems.length) return;

    const pairCount = Math.min(navLinks.length, faqItems.length);
    const header = document.querySelector(".header");
    const dropdownCount = dropdownItems.length
      ? Math.min(dropdownItems.length, pairCount)
      : 0;

    const closeDropdown = () => {
      dropdownRoot?.classList.remove("-open");
    };

    const scrollToItem = (item) => {
      const offset = header ? header.offsetHeight : 0;
      const targetTop =
        item.getBoundingClientRect().top + window.pageYOffset - offset - 16;
      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    };

    const setActive = (activeIdx) => {
      navLinks.forEach((link, idx) => {
        link.classList.toggle("-active", idx === activeIdx);
      });

      if (dropdownCount) {
        dropdownItems.slice(0, dropdownCount).forEach((item, idx) => {
          item.classList.toggle("-active", idx === activeIdx);
        });
        if (dropdownBtnTxt && activeIdx >= 0 && activeIdx < dropdownCount) {
          dropdownBtnTxt.textContent =
            dropdownItems[activeIdx].textContent?.trim() || "";
        }
      }
    };

    for (let i = 0; i < pairCount; i += 1) {
      const item = faqItems[i];
      const link = navLinks[i];

      // Auto-wire nav links to FAQ blocks even if HTML href/id is missing.
      const fallbackId = `newgrad-faq-${sectionIndex + 1}-${i + 1}`;
      const itemId = item.id || fallbackId;
      item.id = itemId;
      link.setAttribute("href", `#${itemId}`);

      link.addEventListener("click", function (e) {
        e.preventDefault();
        scrollToItem(item);
      });
    }

    if (dropdownCount) {
      dropdownItems.slice(0, dropdownCount).forEach((dropdownItem, i) => {
        dropdownItem.addEventListener("click", function () {
          if (dropdownBtnTxt) {
            dropdownBtnTxt.textContent = dropdownItem.textContent?.trim() || "";
          }
          scrollToItem(faqItems[i]);
          closeDropdown();
        });
      });

      dropdownBtn?.addEventListener("click", function () {
        dropdownRoot.classList.toggle("-open");
      });

      document.addEventListener("click", function (e) {
        if (!dropdownRoot?.contains(e.target)) {
          closeDropdown();
        }
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
          closeDropdown();
        }
      });
    }

    const getActiveIndexByScroll = () => {
      const headerOffset = header ? header.offsetHeight : 0;
      const probeY = window.scrollY + headerOffset + 48;
      let activeIdx = 0;

      for (let i = 0; i < pairCount; i += 1) {
        const itemTop =
          faqItems[i].getBoundingClientRect().top + window.scrollY;
        if (itemTop <= probeY) {
          activeIdx = i;
        } else {
          break;
        }
      }

      return activeIdx;
    };

    const updateActiveByScroll = () => {
      setActive(getActiveIndexByScroll());
    };

    let ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          updateActiveByScroll();
          ticking = false;
        });
      },
      { passive: true },
    );

    window.addEventListener("resize", updateActiveByScroll);
    updateActiveByScroll();
  });
}

/** モバイル: .area__inner 内 sticky の .area__side 高さ。デスクトップ: 固定ヘッダー。 */
function getAreaStickyBandHeightForSection(sectionEl) {
  const header = document.querySelector(".header");
  if (!sectionEl) {
    return header ? header.offsetHeight : 0;
  }
  if (window.matchMedia("(max-width: 768px)").matches) {
    const side = sectionEl.querySelector(".area__side");
    if (side) {
      const h = side.getBoundingClientRect().height;
      if (h > 0) return Math.ceil(h);
    }
  }
  return header ? header.offsetHeight : 0;
}

/** career: エリアブロックの「募集要項へ」— sticky 帯を考慮して #recruit へスクロール */
function careerAreaRecruitScroll() {
  const btn = document.querySelector(".js-career-area-to-recruit");
  const target = document.querySelector("#recruit");
  if (!btn || !target) return;

  const section = btn.closest(".area__inner");
  if (!section) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const band = getAreaStickyBandHeightForSection(section);
    const y =
      target.getBoundingClientRect().top + window.pageYOffset - band - 10;
    window.scrollTo({ top: y, behavior: "smooth" });
  });
}

function areaNavScrollSpy() {
  const areaSections = document.querySelectorAll(".area__inner");
  if (!areaSections.length) return;

  areaSections.forEach((section, sectionIndex) => {
    const navLinks = Array.from(
      section.querySelectorAll(".area__side-content .area__side-item"),
    );
    const areaGroups = Array.from(
      section.querySelectorAll(".area__content .area__group"),
    );
    if (!navLinks.length || !areaGroups.length) return;

    const dropdownRoot = section.querySelector(".area__side-dropdown");
    const dropdownBtn = dropdownRoot?.querySelector(".area__side-dropdown-btn");
    const dropdownBtnTxt = dropdownRoot?.querySelector(
      ".area__side-dropdown-btn-txt",
    );
    const dropdownItems = dropdownRoot
      ? Array.from(dropdownRoot.querySelectorAll(".area__side-dropdown-item"))
      : [];
    const pairCount = Math.min(navLinks.length, areaGroups.length);
    const dropdownCount = dropdownItems.length
      ? Math.min(dropdownItems.length, pairCount)
      : 0;

    const getStickyBandHeight = () =>
      getAreaStickyBandHeightForSection(section);

    const closeDropdown = () => {
      dropdownRoot?.classList.remove("-open");
    };

    const scrollToGroup = (group) => {
      const band = getStickyBandHeight();
      const targetTop =
        group.getBoundingClientRect().top + window.pageYOffset - band - 16;
      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    };

    const setActive = (activeIdx) => {
      navLinks.forEach((link, idx) => {
        link.classList.toggle("-active", idx === activeIdx);
      });

      if (dropdownCount) {
        dropdownItems.slice(0, dropdownCount).forEach((item, idx) => {
          item.classList.toggle("-active", idx === activeIdx);
        });
      }
    };

    for (let i = 0; i < pairCount; i += 1) {
      const group = areaGroups[i];
      const link = navLinks[i];
      const fallbackId = `area-group-${sectionIndex + 1}-${i + 1}`;
      const groupId = group.id || fallbackId;
      group.id = groupId;
      link.setAttribute("href", `#${groupId}`);

      link.addEventListener("click", function (e) {
        e.preventDefault();
        scrollToGroup(group);
      });
    }

    if (dropdownCount) {
      dropdownItems.slice(0, dropdownCount).forEach((dropdownItem, i) => {
        dropdownItem.addEventListener("click", function () {
          if (dropdownBtnTxt) {
            dropdownBtnTxt.textContent = dropdownItem.textContent?.trim() || "";
          }
          scrollToGroup(areaGroups[i]);
          closeDropdown();
        });
      });

      dropdownBtn?.addEventListener("click", function () {
        dropdownRoot.classList.toggle("-open");
      });

      document.addEventListener("click", function (e) {
        if (!dropdownRoot?.contains(e.target)) {
          closeDropdown();
        }
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
          closeDropdown();
        }
      });
    }

    const getActiveIndexByScroll = () => {
      const band = getStickyBandHeight();
      const probeY = window.scrollY + band + 48;
      let activeIdx = 0;

      for (let i = 0; i < pairCount; i += 1) {
        const groupTop =
          areaGroups[i].getBoundingClientRect().top + window.scrollY;
        if (groupTop <= probeY) {
          activeIdx = i;
        } else {
          break;
        }
      }

      return activeIdx;
    };

    const updateActiveByScroll = () => {
      setActive(getActiveIndexByScroll());
    };

    let ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          updateActiveByScroll();
          ticking = false;
        });
      },
      { passive: true },
    );

    window.addEventListener("resize", updateActiveByScroll);
    updateActiveByScroll();
  });
}

function parttimeItemAccordion() {
  const items = document.querySelectorAll(".parttime__inner .parttime__item");
  if (!items.length) return;

  items.forEach((item) => {
    const tab = item.querySelector(".parttime__item-tab");
    const content = item.querySelector(".parttime__item-content");
    if (!tab || !content) return;

    tab.addEventListener("click", function (e) {
      e.preventDefault();

      // Prevent "jump" when switching accordions:
      // Keep the clicked tab's viewport position stable.
      const tabTopBefore = tab.getBoundingClientRect().top;
      const scrollYBefore = window.scrollY;
      item.classList.toggle("-open");

      requestAnimationFrame(() => {
        const tabTopAfter = tab.getBoundingClientRect().top;
        const delta = tabTopAfter - tabTopBefore;
        if (Math.abs(delta) > 0.5) {
          window.scrollTo({ top: scrollYBefore + delta, behavior: "auto" });
        }
      });
    });

    item
      .querySelectorAll(".area__close-btn, .area__scroll-btn")
      .forEach((btn) => {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          item.classList.remove("-open");

          // After closing, align viewport to the top of this accordion section.
          const header = document.querySelector(".header");
          const headerOffset = header ? header.offsetHeight : 0;

          requestAnimationFrame(() => {
            const targetTop =
              tab.getBoundingClientRect().top +
              window.pageYOffset -
              headerOffset -
              10;
            window.scrollTo({ top: targetTop, behavior: "auto" });
          });
        });
      });
  });
}

/**
 * AREA（モバイル）: sticky 中だけ `.area__side.-is-stuck` を付与し、CSS の ::before 白背景を効かせる。
 * career / part-time 共通。アルバイトの折りたたみ内は -open 時のみ監視。
 */
function parttimeAreaStickyBackdrop() {
  const mobileMq = window.matchMedia("(max-width: 768px)");
  const areaSides = document.querySelectorAll(".area__inner > .area__side");
  if (!areaSides.length || typeof IntersectionObserver === "undefined") return;

  const observers = new WeakMap();

  /** `.area__side { top: … }` の px（CSS とずれると -is-stuck / ::before が効かない） */
  const getStickyTopPx = (stickyEl) => {
    try {
      const top = getComputedStyle(stickyEl).top;
      if (top === "auto") return 0;
      const n = parseFloat(top);
      return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0;
    } catch {
      return 0;
    }
  };

  const ensureSentinel = (stickyEl) => {
    const prev = stickyEl.previousElementSibling;
    if (prev?.classList?.contains("js-area-side-sticky-sentinel")) {
      return prev;
    }

    const sentinel = document.createElement("span");
    sentinel.className =
      "js-area-side-sticky-sentinel area__side-sticky-sentinel";
    sentinel.setAttribute("aria-hidden", "true");
    stickyEl.parentElement?.insertBefore(sentinel, stickyEl);
    return sentinel;
  };

  const setStuck = (stickyEl, isStuck) => {
    stickyEl.classList.toggle("-is-stuck", isStuck);
  };

  const disconnectObserver = (stickyEl) => {
    const obs = observers.get(stickyEl);
    if (obs) {
      obs.disconnect();
      observers.delete(stickyEl);
    }
    setStuck(stickyEl, false);

    const prev = stickyEl.previousElementSibling;
    if (prev?.classList?.contains("js-area-side-sticky-sentinel")) {
      prev.remove();
    }
  };

  const connectObserver = (stickyEl) => {
    disconnectObserver(stickyEl);

    const sentinel = ensureSentinel(stickyEl);
    const topPx = getStickyTopPx(stickyEl);
    const rootMargin =
      topPx > 0 ? `-${topPx}px 0px 0px 0px` : "0px 0px 0px 0px";

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setStuck(stickyEl, !entry.isIntersecting);
      },
      {
        root: null,
        rootMargin,
        threshold: 0,
      },
    );

    obs.observe(sentinel);
    observers.set(stickyEl, obs);
  };

  const refreshAreaSide = (areaSide) => {
    const parttimeItem = areaSide.closest(".parttime__item");
    const needsOpen = !!parttimeItem;

    if (
      !mobileMq.matches ||
      (needsOpen && !parttimeItem.classList.contains("-open"))
    ) {
      disconnectObserver(areaSide);
      return;
    }

    connectObserver(areaSide);
  };

  areaSides.forEach((areaSide) => {
    refreshAreaSide(areaSide);

    const parttimeItem = areaSide.closest(".parttime__item");
    if (parttimeItem) {
      const mo = new MutationObserver(() => {
        refreshAreaSide(areaSide);
      });
      mo.observe(parttimeItem, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }
  });

  window.addEventListener(
    "resize",
    () => {
      areaSides.forEach((el) => refreshAreaSide(el));
    },
    { passive: true },
  );

  mobileMq.addEventListener("change", () => {
    areaSides.forEach((el) => refreshAreaSide(el));
  });
}

/**
 * 新卒 FAQ（モバイル）: `.area__side` と同様に sentinel + `-is-stuck` で帯の白背景を出す。
 */
function newgradFaqStickyBackdrop() {
  const mobileMq = window.matchMedia("(max-width: 768px)");
  const faqSides = document.querySelectorAll(
    ".newgrad__faq .faq__content > .faq__side",
  );
  if (!faqSides.length || typeof IntersectionObserver === "undefined") return;

  const observers = new WeakMap();

  const getStickyTopPx = (stickyEl) => {
    try {
      const top = getComputedStyle(stickyEl).top;
      if (top === "auto") return 0;
      const n = parseFloat(top);
      return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0;
    } catch {
      return 0;
    }
  };

  const ensureSentinel = (stickyEl) => {
    const prev = stickyEl.previousElementSibling;
    if (prev?.classList?.contains("js-faq-side-sticky-sentinel")) {
      return prev;
    }

    const sentinel = document.createElement("span");
    sentinel.className =
      "js-faq-side-sticky-sentinel faq__side-sticky-sentinel";
    sentinel.setAttribute("aria-hidden", "true");
    stickyEl.parentElement?.insertBefore(sentinel, stickyEl);
    return sentinel;
  };

  const setStuck = (stickyEl, isStuck) => {
    stickyEl.classList.toggle("-is-stuck", isStuck);
  };

  const disconnectObserver = (stickyEl) => {
    const obs = observers.get(stickyEl);
    if (obs) {
      obs.disconnect();
      observers.delete(stickyEl);
    }
    setStuck(stickyEl, false);

    const prev = stickyEl.previousElementSibling;
    if (prev?.classList?.contains("js-faq-side-sticky-sentinel")) {
      prev.remove();
    }
  };

  const connectObserver = (stickyEl) => {
    disconnectObserver(stickyEl);

    const sentinel = ensureSentinel(stickyEl);
    const topPx = getStickyTopPx(stickyEl);
    const rootMargin =
      topPx > 0 ? `-${topPx}px 0px 0px 0px` : "0px 0px 0px 0px";

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setStuck(stickyEl, !entry.isIntersecting);
      },
      {
        root: null,
        rootMargin,
        threshold: 0,
      },
    );

    obs.observe(sentinel);
    observers.set(stickyEl, obs);
  };

  const refreshFaqSide = (faqSide) => {
    if (!mobileMq.matches) {
      disconnectObserver(faqSide);
      return;
    }
    connectObserver(faqSide);
  };

  faqSides.forEach((el) => refreshFaqSide(el));

  window.addEventListener(
    "resize",
    () => {
      faqSides.forEach((el) => refreshFaqSide(el));
    },
    { passive: true },
  );

  mobileMq.addEventListener("change", () => {
    faqSides.forEach((el) => refreshFaqSide(el));
  });
}

function setupMessageVideoModal() {
  const modal = document.querySelector(".js-message-video-modal");
  const modalVideo = modal?.querySelector(".js-message-video-modal-video");
  const openBtn = document.querySelector(".js-message-video-modal-open");
  const sourceVideo = document.querySelector(
    ".home__message .message__video video",
  );
  if (!modal || !modalVideo || !openBtn || !sourceVideo) return;

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("hide-scroll");
    document.body.classList.remove("hide-scroll");
    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.load();
  }

  function openModal() {
    const src =
      sourceVideo.getAttribute("src") ||
      sourceVideo.currentSrc ||
      sourceVideo.querySelector("source")?.getAttribute("src");
    if (!src) return;

    modalVideo.setAttribute("src", src);
    modalVideo.muted = false;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("hide-scroll");
    document.body.classList.add("hide-scroll");

    modalVideo.currentTime = 0;
    const playPromise = modalVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }

  openBtn.addEventListener("click", (event) => {
    event.preventDefault();
    openModal();
  });

  modal.querySelectorAll(".js-message-video-modal-close").forEach((closeEl) => {
    closeEl.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

function sliderSetting() {
  function setupInterviewModal(interviewRoot) {
    const modalEl = document.querySelector(".js-interview-modal");
    const modalVideo = modalEl?.querySelector(".js-interview-modal-video");
    const modalEntry = modalEl?.querySelector(".js-interview-modal-entry");
    const entrySource = document.querySelector(".home__entry .entry__content");
    if (!modalEl || !modalVideo || !modalEntry || !interviewRoot) return;

    if (!modalEntry.children.length) {
      if (entrySource) {
        entrySource.querySelectorAll(".entry__item").forEach((entryItem) => {
          const clone = entryItem.cloneNode(true);
          clone.classList.add("interview-modal__entry-item");
          modalEntry.appendChild(clone);
        });
      } else {
        // Fallback: other pages don't have `.home__entry`. We still need
        // modal entry buttons to be visible.
        const fallbackItems = [
          {
            href: "new-graduates.html",
            img: "img/entry_img01.webp",
            titleEn: "NEW GRADUATES",
            titleJp: "新卒採用",
          },
          {
            href: "career.html",
            img: "img/entry_img02.webp",
            titleEn: "CAREER",
            titleJp: "中途採用",
          },
          {
            href: "part-time.html",
            img: "img/entry_img03.webp",
            titleEn: "PART-TIME",
            titleJp: "アルバイト採用",
          },
        ];

        fallbackItems.forEach((item) => {
          const a = document.createElement("a");
          a.href = item.href;
          a.className = "entry__item interview-modal__entry-item";

          a.innerHTML = `
            <div class="entry__img">
              <img src="${item.img}">
            </div>
            <div class="entry__blur">
              <img src="img/blur_bg.webp">
            </div>
            <h3 class="entry__title">
              <span class="entry__title-en">${item.titleEn}</span>
              <span class="entry__title-jp">${item.titleJp}</span>
            </h3>
            <div class="entry__arrow">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.17376 0.5L12.7071 0.5V9.03333M12.1738 1.03333L0.707092 12.5" stroke="white" stroke-linecap="square"/>
              </svg>
            </div>
          `;

          modalEntry.appendChild(a);
        });
      }
    }

    const lockScrollMq = window.matchMedia("(min-width: 992px)");
    const setPageScrollLock = (isLocked) => {
      // Mobile: avoid fixing body because some devices block
      // modal inner scrolling when body is fixed.
      if (!lockScrollMq.matches) {
        document.documentElement.classList.remove("hide-scroll");
        document.body.classList.remove("hide-scroll");
        document.body.classList.remove("modal-scroll-lock");
        document.body.style.removeProperty("--scroll-lock-top");
        return;
      }
      document.body.classList.remove("modal-scroll-lock");
      document.body.style.removeProperty("--scroll-lock-top");
      document.documentElement.classList.toggle("hide-scroll", isLocked);
      document.body.classList.toggle("hide-scroll", isLocked);
    };

    function closeModal() {
      modalEl.classList.remove("is-open");
      modalEl.setAttribute("aria-hidden", "true");
      setPageScrollLock(false);
      modalVideo.pause();
      modalVideo.removeAttribute("src");
      modalVideo.removeAttribute("poster");
      modalVideo.load();
    }

    function openModal(videoEl) {
      const source = videoEl.getAttribute("src");
      if (!source) return;

      modalVideo.setAttribute("src", source);
      const poster = videoEl.getAttribute("poster");
      if (poster) {
        modalVideo.setAttribute("poster", poster);
      }

      modalVideo.muted = false;
      modalVideo.defaultMuted = false;
      modalVideo.removeAttribute("muted");

      modalEl.classList.add("is-open");
      modalEl.setAttribute("aria-hidden", "false");
      setPageScrollLock(true);
      modalEl.scrollTop = 0;

      modalVideo.currentTime = 0;
      const playPromise = modalVideo.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    }

    interviewRoot
      .querySelectorAll(".js-interview-modal-trigger")
      .forEach((slideEl) => {
        const videoEl = slideEl.querySelector("video");
        if (!videoEl) return;

        slideEl.addEventListener("click", () => {
          openModal(videoEl);
        });
        slideEl.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openModal(videoEl);
          }
        });
      });

    modalEl
      .querySelectorAll(".js-interview-modal-close")
      .forEach((closeButton) => {
        closeButton.addEventListener("click", closeModal);
      });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modalEl.classList.contains("is-open")) {
        closeModal();
      }
    });
  }

  function resetInterviewVideoToPoster(videoEl) {
    videoEl.pause();
    videoEl.currentTime = 0;
    videoEl.load();
  }

  function ensureInterviewVideoPoster(videoEl) {
    const customPoster = videoEl.getAttribute("data-poster");
    if (customPoster) {
      videoEl.setAttribute("poster", customPoster);
    }
  }

  function syncInterviewSlideVideos(swiperInstance) {
    swiperInstance.slides.forEach((slide, slideIndex) => {
      const videoEl = slide.querySelector("video");
      if (!videoEl) return;
      ensureInterviewVideoPoster(videoEl);

      if (slideIndex === swiperInstance.activeIndex) {
        const playPromise = videoEl.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {});
        }
        return;
      }

      resetInterviewVideoToPoster(videoEl);
    });
  }

  // Gallery strips (home: .gallery__slider--ltr / --rtl; autoplay opposite directions)
  const galleryLtrEl = document.querySelector(".gallery__slider--ltr");
  const galleryRtlEl = document.querySelector(".gallery__slider--rtl");
  if (galleryLtrEl && galleryRtlEl && typeof Swiper !== "undefined") {
    const galleryBase = {
      loop: true,
      allowTouchMove: false,
      draggable: false,
      grabCursor: false,
      // Long duration + linear easing (CSS) = steady flow, no ease-in-out
      speed: 4000,
      slidesPerView: 1.5,
      spaceBetween: 0,
      autoplay: {
        delay: 1,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
        waitForTransition: true,
      },
      breakpoints: {
        450: {
          slidesPerView: 2,
          spaceBetween: 0,
        },
        768: {
          slidesPerView: 2.5,
          spaceBetween: 20,
        },
        991: {
          slidesPerView: 3.2,
          spaceBetween: 0,
        },
      },
    };
    new Swiper(galleryLtrEl, {
      ...galleryBase,
      autoplay: {
        ...galleryBase.autoplay,
        reverseDirection: true,
      },
    });
    new Swiper(galleryRtlEl, {
      ...galleryBase,
      autoplay: {
        ...galleryBase.autoplay,
        reverseDirection: false,
      },
    });
  }

  // Interview (home only — other pages reuse .interview__slider without Swiper markup)
  const interviewSliderEl = document.querySelector(".interview__slider");
  if (interviewSliderEl && typeof Swiper !== "undefined") {
    setupInterviewModal(interviewSliderEl);

    interviewSliderEl.querySelectorAll("video").forEach((videoEl) => {
      ensureInterviewVideoPoster(videoEl);
      videoEl.removeAttribute("autoplay");
      resetInterviewVideoToPoster(videoEl);
    });

    new Swiper(".interview__slider", {
      loop: !1,
      speed: 500,
      autoplay: {
        delay: 10000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
        waitForTransition: true,
      },
      slidesPerView: 1.5,
      centeredSlides: true,
      spaceBetween: 20,
      pagination: {
        el: ".interview__pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".interview__slider .swiper-button-next",
        prevEl: ".interview__slider .swiper-button-prev",
      },
      breakpoints: {
        576: {
          slidesPerView: 2.5,
          spaceBetween: 24,
        },
        768: {
          slidesPerView: 3.5,
          spaceBetween: 24,
        },
        991: {
          slidesPerView: 4.5,
          spaceBetween: 24,
        },
        1280: {
          slidesPerView: 4.5,
          spaceBetween: 48,
        },
      },
      on: {
        init(swiperInstance) {
          syncInterviewSlideVideos(swiperInstance);
        },
        slideChange(swiperInstance) {
          syncInterviewSlideVideos(swiperInstance);
        },
        resize(swiperInstance) {
          syncInterviewSlideVideos(swiperInstance);
        },
      },
    });
  }

  // Library cards slider (mobile only)
  const librarySliderEl = document.querySelector(
    ".home__library .library__mobile-slider",
  );
  if (librarySliderEl && typeof Swiper !== "undefined") {
    const libraryWrapper = librarySliderEl.querySelector(".swiper-wrapper");
    const desktopBottomItems = Array.from(
      document.querySelectorAll(
        ".home__library .library__bottom .library__list.-type--card .library__item",
      ),
    ).map((item) => item.outerHTML);
    const mobileAllItems = [
      ...Array.from(
        document.querySelectorAll(".home__library .libray__top .library__item"),
      ).map((item) => item.outerHTML),
      ...desktopBottomItems,
    ];

    let librarySwiper = null;
    const mobileMediaQuery = window.matchMedia("(max-width: 768px)");

    const toggleLibrarySlider = () => {
      if (!libraryWrapper) return;

      if (mobileMediaQuery.matches) {
        libraryWrapper.innerHTML = "";
        mobileAllItems.forEach((itemHtml) => {
          const tempWrapper = document.createElement("div");
          tempWrapper.innerHTML = itemHtml.trim();
          const itemEl = tempWrapper.firstElementChild;
          if (!itemEl) return;
          itemEl.classList.add("swiper-slide");
          libraryWrapper.appendChild(itemEl);
        });

        if (!librarySwiper) {
          librarySwiper = new Swiper(librarySliderEl, {
            loop: false,
            speed: 500,
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 0,
            centeredSlides: false,
            watchOverflow: true,
            resistanceRatio: 0,
            navigation: {
              nextEl: ".home__library .library__mobile-next",
              prevEl: ".home__library .library__mobile-prev",
            },
          });
        }
        return;
      }

      if (librarySwiper) {
        librarySwiper.destroy(true, true);
        librarySwiper = null;
      }

      libraryWrapper.innerHTML = desktopBottomItems.join("");
    };

    toggleLibrarySlider();
    mobileMediaQuery.addEventListener("change", toggleLibrarySlider);
  }

  // Career pickup slider
  const pickupSliderEl = document.querySelector(".pickup__content");
  if (pickupSliderEl && typeof Swiper !== "undefined") {
    new Swiper(".pickup__content", {
      loop: false,
      speed: 500,
      slidesPerView: 1.3,
      spaceBetween: 20,
      pagination: {
        el: ".pickup__pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".pickup__nav-btn--next",
        prevEl: ".pickup__nav-btn--prev",
      },
      breakpoints: {
        576: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2.5,
          spaceBetween: 24,
        },
        991: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  }

  // About — history timeline
  const historySliderEl = document.querySelector(".history__slider.swiper");
  if (historySliderEl && typeof Swiper !== "undefined") {
    const rootFontPx =
      parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const historyGapPx = Math.round(8 * rootFontPx);
    new Swiper(historySliderEl, {
      loop: false,
      speed: 500,
      slidesPerView: "auto",
      spaceBetween: historyGapPx,
      roundLengths: true,
      watchOverflow: true,
      navigation: {
        nextEl: ".data__history .history__next-btn",
        prevEl: ".data__history .history__prev-btn",
      },
    });
  }
}

// about-huge-3min.html
function valueModalInit() {
  const root = document.getElementById("value-modal");
  if (!root) return;

  const backdrop = root.querySelector(".value-modal__backdrop");
  const closeBtn = root.querySelector(".value-modal__close");
  const orderEl = root.querySelector(".value-modal__order");
  const iconEl = root.querySelector(".value-modal__icon");
  const titleEl = root.querySelector(".value-modal__title");
  const detailEl = root.querySelector(".value-modal__detail");

  function openFromItem(item) {
    const order = item.querySelector(".value__order");
    const icon = item.querySelector(".value__icon");
    const subtitle = item.querySelector(".value__subtitle");
    const detail = item.querySelector(".value__detail");

    if (orderEl) {
      orderEl.textContent = order ? order.textContent.trim() : "";
    }
    if (iconEl) {
      iconEl.replaceChildren();
      const svg = icon?.querySelector("svg");
      if (svg) {
        iconEl.appendChild(svg.cloneNode(true));
      }
    }
    titleEl.replaceChildren();
    if (subtitle) {
      subtitle.childNodes.forEach((node) => {
        titleEl.appendChild(node.cloneNode(true));
      });
    }
    detailEl.replaceChildren();
    if (detail) {
      detail.childNodes.forEach((node) => {
        detailEl.appendChild(node.cloneNode(true));
      });
    }

    root.classList.add("is-open");
    root.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("hide-scroll");
    document.body.classList.add("hide-scroll");
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
    closeBtn?.focus();
  }

  function closeModal() {
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("hide-scroll");
    document.body.classList.remove("hide-scroll");
    if (orderEl) orderEl.textContent = "";
    if (iconEl) iconEl.replaceChildren();
    titleEl.replaceChildren();
    detailEl.innerHTML = "";
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
  }

  document.querySelectorAll(".company__value .value__item").forEach((item) => {
    item.addEventListener("click", () => {
      openFromItem(item);
    });
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFromItem(item);
      }
    });
  });

  backdrop?.addEventListener("click", closeModal);
  closeBtn?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("is-open")) {
      closeModal();
    }
  });
}

function historyModalInit() {
  const root = document.getElementById("history-modal");
  if (!root) return;

  const backdrop = root.querySelector(".history-modal__backdrop");
  const closeBtn = root.querySelector(".history-modal__close");
  const imgEl = root.querySelector(".history-modal__img");
  const dateEl = root.querySelector(".history-modal__date");
  const titleEl = root.querySelector(".history-modal__title");
  const resultEl = root.querySelector(".history-modal__result");
  const detailEl = root.querySelector(".history-modal__detail");

  function openFromItem(item) {
    const thumb = item.querySelector(".history__img img");
    const titleSpan = item.querySelector(".history__label-txt");
    const summaryTitle = item.querySelector(".history__summary-title");
    const dateSrc = item.querySelector(".history__modal-date");
    const summaryTime = item.querySelector(".history__summary-time");
    const resultSrc = item.querySelector(".history__modal-result");
    const detailSrc = item.querySelector(".history__modal-detail");
    if (thumb) {
      imgEl.src = thumb.currentSrc || thumb.src;
      imgEl.alt = thumb.alt || "";
    }
    if (dateEl) {
      let dateText = "";
      if (dateSrc) {
        dateText = dateSrc.textContent.replace(/\s+/g, " ").trim();
      } else if (summaryTime) {
        dateText = summaryTime.textContent.replace(/\s+/g, " ").trim();
      }
      dateEl.textContent = dateText;
    }
    titleEl.textContent = "";
    if (titleSpan) {
      titleEl.textContent = titleSpan.textContent.replace(/\s+/g, " ").trim();
    } else if (summaryTitle) {
      titleEl.textContent = summaryTitle.textContent
        .replace(/\s+/g, " ")
        .trim();
    }
    if (resultEl) {
      resultEl.replaceChildren();
      if (resultSrc) {
        resultSrc.childNodes.forEach((node) => {
          resultEl.appendChild(node.cloneNode(true));
        });
      }
    }
    detailEl.replaceChildren();
    if (detailSrc) {
      detailSrc.childNodes.forEach((node) => {
        detailEl.appendChild(node.cloneNode(true));
      });
    }
    root.classList.add("is-open");
    root.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("hide-scroll");
    document.body.classList.add("hide-scroll");
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
    closeBtn?.focus();
  }

  function closeModal() {
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("hide-scroll");
    document.body.classList.remove("hide-scroll");
    imgEl.removeAttribute("src");
    imgEl.alt = "";
    if (dateEl) dateEl.textContent = "";
    titleEl.textContent = "";
    if (resultEl) resultEl.innerHTML = "";
    detailEl.innerHTML = "";
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
  }

  document
    .querySelectorAll(".history__item--important .history__btn")
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const item = e.currentTarget.closest(".history__item--important");
        if (item) openFromItem(item);
      });
    });

  backdrop?.addEventListener("click", closeModal);
  closeBtn?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("is-open")) {
      closeModal();
    }
  });
}

function sustainabilityModalInit() {
  const root = document.getElementById("sustainability-modal");
  if (!root) return;

  const backdrop = root.querySelector(".sustainability-modal__backdrop");
  const closeBtn = root.querySelector(".sustainability-modal__close");
  const imgEl = root.querySelector(".sustainability-modal__img");
  const titleEl = root.querySelector(".sustainability-modal__title");
  const detailEl = root.querySelector(".sustainability-modal__detail");
  const galleryEl = root.querySelector(".sustainability-modal__gallery");

  function setGalleryFromItem(item) {
    if (!galleryEl) return;
    galleryEl.replaceChildren();
    const source = item.querySelector(".sustainability__gallery");
    const imgs = source ? source.querySelectorAll("img") : [];
    if (!imgs.length) {
      galleryEl.setAttribute("hidden", "");
      return;
    }
    galleryEl.removeAttribute("hidden");
    imgs.forEach((img) => {
      const wrap = document.createElement("div");
      wrap.className = "sustainability-modal__gallery-item";
      wrap.appendChild(img.cloneNode(true));
      galleryEl.appendChild(wrap);
    });
  }

  function setClonedChildren(target, source) {
    if (!source) return;
    target.replaceChildren();
    source.childNodes.forEach((node) => {
      target.appendChild(node.cloneNode(true));
    });
  }

  function removeBrTags(container) {
    if (!container) return;
    container.querySelectorAll("br").forEach((br) => br.remove());
  }

  function openFromItem(item) {
    const thumb = item.querySelector(".sustainability__img img");
    const title = item.querySelector(".sustainability__title");
    const detail = item.querySelector(".sustainability__detail");
    if (thumb) {
      imgEl.src = thumb.currentSrc || thumb.src;
      imgEl.alt = thumb.alt || "";
    }
    setClonedChildren(titleEl, title);
    setClonedChildren(detailEl, detail);
    removeBrTags(titleEl);
    removeBrTags(detailEl);
    setGalleryFromItem(item);
    root.classList.add("is-open");
    root.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("hide-scroll");
    document.body.classList.add("hide-scroll");
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
    closeBtn?.focus();
  }

  function closeModal() {
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("hide-scroll");
    document.body.classList.remove("hide-scroll");
    imgEl.removeAttribute("src");
    imgEl.alt = "";
    titleEl.innerHTML = "";
    detailEl.innerHTML = "";
    if (galleryEl) {
      galleryEl.replaceChildren();
      galleryEl.setAttribute("hidden", "");
    }
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
  }

  document.querySelectorAll(".sustainability__item").forEach((item) => {
    item.addEventListener("click", () => {
      openFromItem(item);
    });
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFromItem(item);
      }
    });
  });

  backdrop?.addEventListener("click", closeModal);
  closeBtn?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("is-open")) {
      closeModal();
    }
  });
}




function setupHomeNewsFromMicroCms() {
  const newsList = document.querySelector(".home__news .news__list");
  if (!newsList) return;

  const SERVICE_DOMAIN = "0jd49onovl";
  const API_KEY = "P6rvpRFzdA80h8T8D0U1rGtlbfzgxLJoFOzx";
  const ENDPOINT = "blogs";
  const { createClient } = microcms;

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const toDateText = (item) => {
    const raw = item.date || item.publishedAt || item.createdAt;
    if (!raw) return "";
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return String(raw);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
  };

  const createNewsItemHtml = (item) => {
    const title = escapeHtml(item.title || item.name || "");
    const date = escapeHtml(toDateText(item));
    const href = item.url || item.link || "";
    const hasLink = !!href;

    if (!title) return "";

    if (!hasLink) {
      return `
        <li class="news__item news__item--nolink">
          <div class="news__link">
            <div class="news__main">
              <time class="news__date">${date}</time>
              <h3 class="news__article">${title}</h3>
            </div>
          </div>
        </li>
      `;
    }

    return `
      <li class="news__item">
        <a class="news__link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">
          <div class="news__main">
            <time class="news__date">${date}</time>
            <h3 class="news__article">${title}</h3>
          </div>
          <div class="news__arrow">
            <svg viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.4365 0.707163L17.4705 6.74114L11.4365 12.7751M16.7163 6.74114L0.499948 6.74114" stroke="white" stroke-linecap="square"/>
            </svg>
          </div>
        </a>
      </li>
    `;
  };

  const client = createClient({
    serviceDomain: SERVICE_DOMAIN,
    apiKey: API_KEY,
  });

  client
    .getList({
      endpoint: ENDPOINT,
      queries: {
        limit: 3,
        orders: "-publishedAt",
      },
    })
    .then((response) => {
      const items = Array.isArray(response?.contents) ? response.contents : [];
      const rendered = items.map((item) => createNewsItemHtml(item)).join("");
      if (!rendered) return;
      newsList.innerHTML = rendered;
    })
    .catch((error) => {
      console.error("microCMS NEWS fetch failed:", error);
    });
}

/* about-huge-3min.html */

function init() {
  bannerIntroAnimation();
  headerSet();
  setupMobileBottomNav();
  setupMobileEntryBar();
  lenisSetting();
  setupInviewAnimations();
  brandImageAnimation();
  homeMessageHeadingReveal();
  setupMessageVideoModal();
  textAnimation();
  accordionSetting();
  tocSetting();
  parttimeQuickLinkScroll();
  aboutNavSmoothScroll();
  faqNavScrollSpy();
  areaNavScrollSpy();
  careerAreaRecruitScroll();
  parttimeItemAccordion();
  parttimeAreaStickyBackdrop();
  newgradFaqStickyBackdrop();
  sliderSetting();
  setupHomeNewsFromMicroCms();
  // about-huge-3min.html（各関数内で #value-modal 等が無ければ no-op）
  valueModalInit();
  historyModalInit();
  sustainabilityModalInit();
}

document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const isMobile = window.matchMedia("(pointer: coarse)").matches;
  ScrollTrigger.defaults({
    toggleActions: "play",
    scroller: "html",
  });
  if (!isMobile) {
    ScrollTrigger.normalizeScroll(true);
  }
  setTimeout(() => ScrollTrigger.refresh(), 100);
  init();
});
window.addEventListener("scroll", function () {
  scrollAnimFunc();
});
