function headerSet() {
	const stickyHeaderTop = 100;
	const logoImg = document.querySelector(".header__logo img");
	const bannerSection = document.querySelector(".banner");
	const defaultLogoSrc = "img/header_logo.svg";
	const changedLogoSrc = "img/hd_change_logo.svg";

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
			if (logoImg && !logoImg.getAttribute("src")?.includes("hd_change_logo.svg")) {
				logoImg.setAttribute("src", changedLogoSrc);
			}
		} else {
			header?.classList.remove("pst_blackheader");
			if (logoImg && !logoImg.getAttribute("src")?.includes("header_logo.svg")) {
				logoImg.setAttribute("src", defaultLogoSrc);
			}
		}
	}

	window.addEventListener("scroll", updateHeaderState);
	window.addEventListener("resize", updateHeaderState);
	updateHeaderState();

	function closeHeaderSidebar() {
		document.body.classList.remove("is-header-sidebar-open");
		const btn = document.querySelector(".header__hamburger-btn");
		btn?.classList.remove("header__hamburger-btn--open");
		btn?.setAttribute("aria-expanded", "false");
		btn?.setAttribute("aria-label", "メニューを開く");
		document.querySelector(".header__sidebar")?.setAttribute("aria-hidden", "true");
		document.querySelector(".header__sidebar-overlay")?.setAttribute("aria-hidden", "true");
		document.documentElement.classList.remove("hide-scroll");
		document.body.classList.remove("hide-scroll");
	}

	document.querySelector(".js_hamburger")?.addEventListener("click", function () {
		document.body.classList.toggle("is-header-sidebar-open");
		document.querySelector(".header__hamburger-btn")?.classList.toggle("header__hamburger-btn--open");
		const isOpen = document.body.classList.contains("is-header-sidebar-open");
		const btn = document.querySelector(".header__hamburger-btn");
		btn?.setAttribute("aria-expanded", isOpen ? "true" : "false");
		btn?.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
		document.querySelector(".header__sidebar")?.setAttribute("aria-hidden", isOpen ? "false" : "true");
		document.querySelector(".header__sidebar-overlay")?.setAttribute("aria-hidden", isOpen ? "false" : "true");

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

	document.querySelector(".header__sidebar-overlay")?.addEventListener("click", closeHeaderSidebar);

	document.querySelectorAll(".header__sidebar-link").forEach(link => {
		link.addEventListener("click", function () {
			closeHeaderSidebar();
		});
	});

	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape" && document.body.classList.contains("is-header-sidebar-open")) {
			closeHeaderSidebar();
		}
	});

	document.querySelectorAll(".header__menu-link").forEach(link => {
		link.addEventListener("click", function () {
			const headerMenu = document.querySelector(".header__menu");
			if (headerMenu && headerMenu.classList.contains("pst_open")) {
				document.querySelector(".header__hamburger-btn")?.classList.toggle("pst_open");
				headerMenu.classList.toggle("pst_open");

				if (document.documentElement.classList.contains("hide-scroll")) {
					document.documentElement.classList.remove("hide-scroll");
					document.body.classList.remove("hide-scroll");
				}
			}
		});
	});
}

function lenisSetting() {
	const lenis = new Lenis();
	lenis.on('scroll', ScrollTrigger.update);
	function raf(time) {
		lenis.raf(time);
		requestAnimationFrame(raf);
	}
	requestAnimationFrame(raf);
}

function setupInviewAnimations() {
	const items = document.querySelectorAll('[data-inview]');
	items.forEach(el => {
		ScrollTrigger.create({
			trigger: el,
			start: 'top 70%',
			end: 'bottom+=10% top',
			markers: false,
			onEnter: () => {
				el.classList.add('inview');
			}
		});
	});
}

function scrollAnimFunc() {
	const winHeight = window.innerHeight;
	const scrollTop = window.scrollY;

	document.querySelectorAll(
		".anim, .fade_y, .svg_anim, .scaleDown, .scaleUp, .brush, .scr_cvr_y, .scr_cvr, .clip_path"
	).forEach(el => {
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

function textAnimation() {
	var txt = document.querySelectorAll(".animation_txt");
	txt.forEach(el => {
		var target = el.querySelectorAll(":scope > p");
		gsap.set(target, { filter: "blur(10px)", opacity: 0, x: -10, y: -15 });
		gsap.timeline({
			scrollTrigger: {
				trigger: el,
				start: "top 70%",
				end: function () {
					return window.innerWidth >= 1600 ? "top 90%" : "40% 40%";
				},
				scrub: 4,
			}
		}).to(target, {
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

	if (!bannerBg || !bannerBottom || !bannerTitle || !bannerVideo || !header || typeof gsap === "undefined") return;

	const timeline = gsap.timeline();

	gsap.set(bannerBg, { autoAlpha: 0 });
	gsap.set(bannerBottom, { autoAlpha: 0, y: 40 });
	gsap.set(header, { autoAlpha: 0 });
	gsap.set(bannerTitle, { autoAlpha: 0, y: 0 });
	gsap.set(bannerVideo, { autoAlpha: 0, y: 0 });

	timeline
		.to(bannerBg, {
			autoAlpha: 1,
			duration: 0.9,
			ease: "power2.out",
		})
		.to(
			[bannerBottom, header],
			{
				autoAlpha: 1,
				y: 0,
				duration: 0.75,
				ease: "power2.out",
				stagger: 0.08,
			},
			"+=0.1"
		)
		.to(
			bannerBottom,
			{
				autoAlpha: 0,
				y: 30,
				duration: 0.55,
				ease: "power2.in",
			},
			"+=0.35"
		)
		.to(
			[bannerTitle, bannerVideo],
			{
				autoAlpha: 1,
				y: 0,
				duration: 0.7,
				ease: "power2.out",
				stagger: 0.08,
				onComplete: () => {
					gsap.set(bannerBottom, { display: "none" });
				},
			},
			"<0.12"
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

			const position = target.getBoundingClientRect().top + window.pageYOffset - offset - 10;

			window.scrollTo({
				top: position,
				behavior: "smooth"
			});
		});
	});
}

function sliderSetting() {
	function setupInterviewModal(interviewRoot) {
		const modalEl = document.querySelector(".js-interview-modal");
		const modalVideo = modalEl?.querySelector(".js-interview-modal-video");
		const modalEntry = modalEl?.querySelector(".js-interview-modal-entry");
		const entrySource = document.querySelector(".home__entry .entry__content");
		if (!modalEl || !modalVideo || !modalEntry || !entrySource || !interviewRoot) return;

		if (!modalEntry.children.length) {
			entrySource.querySelectorAll(".entry__item").forEach((entryItem) => {
				const clone = entryItem.cloneNode(true);
				clone.classList.add("interview-modal__entry-item");
				modalEntry.appendChild(clone);
			});
		}

		function closeModal() {
			modalEl.classList.remove("is-open");
			modalEl.setAttribute("aria-hidden", "true");
			document.documentElement.classList.remove("hide-scroll");
			document.body.classList.remove("hide-scroll");
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

			modalEl.classList.add("is-open");
			modalEl.setAttribute("aria-hidden", "false");
			document.documentElement.classList.add("hide-scroll");
			document.body.classList.add("hide-scroll");

			modalVideo.currentTime = 0;
			const playPromise = modalVideo.play();
			if (playPromise && typeof playPromise.catch === "function") {
				playPromise.catch(() => {});
			}
		}

		interviewRoot.querySelectorAll(".js-interview-modal-trigger").forEach((slideEl) => {
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

		modalEl.querySelectorAll(".js-interview-modal-close").forEach((closeButton) => {
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

	function syncInterviewSlideVideos(swiperInstance) {
		swiperInstance.slides.forEach((slide, slideIndex) => {
			const videoEl = slide.querySelector("video");
			if (!videoEl) return;

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
	if (interviewSliderEl && typeof Swiper !== 'undefined') {
		setupInterviewModal(interviewSliderEl);

		interviewSliderEl.querySelectorAll("video").forEach(videoEl => {
			videoEl.removeAttribute("autoplay");
			resetInterviewVideoToPoster(videoEl);
		});

		new Swiper(".interview__slider", {
			loop: !1,
			speed: 500,
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
	const librarySliderEl = document.querySelector(".home__library .library__mobile-slider");
	if (librarySliderEl && typeof Swiper !== "undefined") {
		const libraryWrapper = librarySliderEl.querySelector(".swiper-wrapper");
		const desktopBottomItems = Array.from(
			document.querySelectorAll(".home__library .library__bottom .library__list.-type--card .library__item")
		).map((item) => item.outerHTML);
		const mobileAllItems = [
			...Array.from(document.querySelectorAll(".home__library .libray__top .library__item")).map((item) => item.outerHTML),
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
}


function init() {
	bannerIntroAnimation();
	headerSet();
	lenisSetting();
	setupInviewAnimations();
	brandImageAnimation();
	textAnimation();
	accordionSetting();
	tocSetting();
	sliderSetting();
}

document.addEventListener('DOMContentLoaded', function () {
	gsap.registerPlugin(ScrollTrigger, SplitText);
	ScrollTrigger.defaults({
		toggleActions: "play",
		scroller: "html",
	});
	ScrollTrigger.normalizeScroll(true);
	setTimeout(() => ScrollTrigger.refresh(), 100);
	init();
});
window.addEventListener('scroll', function () {
	scrollAnimFunc();
});
