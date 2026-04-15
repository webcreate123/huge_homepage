function headerSet() {
	const stickyHeaderTop = 100;
	window.addEventListener("scroll", function () {
		const header = document.querySelector(".header");
		if (window.scrollY > stickyHeaderTop) {
			if (header && !header.classList.contains("pst_blackheader")) {
				header.classList.add("pst_blackheader");
			}
		} else {
			header?.classList.remove("pst_blackheader");
		}
	});

	document.querySelector(".js_hamburger")?.addEventListener("click", function () {
		document.querySelector(".header__hamburger-btn")?.classList.toggle("header__hamburger-btn--open");
		document.querySelector(".header__menu")?.classList.toggle("header__menu--open");

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
	// Banner Gallery
	const bannerGalleryEl = document.querySelector(".banner__gallery");
	if (bannerGalleryEl && typeof Swiper !== 'undefined') {
		const bannerGallery = new Swiper(".banner__gallery", {
			loop: true,
			speed: 1000,
			autoplay: {
				delay: 3000,
			},
			pagination: {
				el: ".swiper-pagination",
			},
		});
	}

	// News Gallery
	const newsGalleryEl = document.querySelector(".news__content");
	if (newsGalleryEl && typeof Swiper !== 'undefined') {
		const newsGallery = new Swiper(".news__content", {
			loop: !1,
			speed: 500,
			slidesPerView: 1,
			spaceBetween: 20,
			navigation: {
				nextEl: ".news__content .swiper-button-next",
				prevEl: ".news__content .swiper-button-prev",
			},
			breakpoints: {
				450: {
					slidesPerView: 1,
					spaceBetween: 20,
				},
				576: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				768: {
					slidesPerView: 3,
					spaceBetween: 25,
				},
				991: {
					slidesPerView: 3.6,
					spaceBetween: 30,
				},
			},
		});
	}

	// Member Gallery
	const memberGalleryEl = document.querySelector(".member__content");
	if (memberGalleryEl && typeof Swiper !== 'undefined') {
		const memberGallery = new Swiper(".member__content", {
			loop: !1,
			speed: 500,
			slidesPerView: 1.7,
			spaceBetween: 20,
			navigation: {
				nextEl: ".member__content .swiper-button-next",
				prevEl: ".member__content .swiper-button-prev",
			},
			breakpoints: {
				450: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				768: {
					slidesPerView: 4,
					spaceBetween: 25,
				},
				991: {
					slidesPerView: 5,
					spaceBetween: 30,
				},
			},
		});
	}

	// Goods Gallery
	const goodsGalleryEl = document.querySelector(".goods__content");
	if (goodsGalleryEl && typeof Swiper !== 'undefined') {
		const goodsGallery = new Swiper(".goods__content", {
			loop: !1,
			speed: 500,
			slidesPerView: 1.2,
			spaceBetween: 15,
			navigation: {
				nextEl: ".goods__content .swiper-button-next",
				prevEl: ".goods__content .swiper-button-prev",
			},
			breakpoints: {
				450: {
					slidesPerView: 2,
					spaceBetween: 15,
				},
				768: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				991: {
					slidesPerView: 4,
					spaceBetween: 25,
				},
			},
		});
	}
}

function init() {
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
