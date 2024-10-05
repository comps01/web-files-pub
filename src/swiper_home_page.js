(function () {
  let swipersInitialized = false;
  const swiperElements = document.querySelectorAll('.swiper');

  function initSwipers() {
    if (swipersInitialized) return;
    swipersInitialized = true;

    // Initialize Swiper for AI Features
    const aiFeaturesSwiper = new Swiper('.swiper.ai-features', {
      direction: 'horizontal',
      loop: false,
      slidesPerView: 1.3,
      spaceBetween: 20,
      pagination: {
        el: '.swiper-pagination.ai-features',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next.ai-features',
        prevEl: '.swiper-button-prev.ai-features',
      },
      breakpoints: {
        0: {
          slidesPerView: 1.2,
        },
        768: {
          spaceBetween: 20,
        },
        1500: {
          slidesPerView: 1.5,
        },
        1900: {
          slidesPerView: 2,
        },
      },
    });

    // Initialize Swiper for Testimonials
    const testimonialsSwiper = new Swiper('.swiper.testimonials', {
      direction: 'horizontal',
      loop: false,
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: {
        el: '.swiper-pagination.testimonials',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next.testimonials',
        prevEl: '.swiper-button-prev.testimonials',
      },
    });
  }

  // Use Intersection Observer to lazy-load Swipers
  const observer = new IntersectionObserver(function (
    entries,
    observerInstance
  ) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        initSwipers();
        observerInstance.disconnect();
      }
    });
  });

  swiperElements.forEach(function (swiper) {
    observer.observe(swiper);
  });
})();