

        (function () {
            const videoOverlay = document.getElementById('videoOverlay');
            const splitContent = document.getElementById('splitContent');
            const hero = document.getElementById('home');
            const splitContainer = document.querySelector('.split-container');
            const aboutImage = document.getElementById('aboutImage');
            const aboutContent = document.getElementById('aboutContent');
            const whyTitle = document.querySelector('#whyHeading');
            const featureCards = document.querySelectorAll('#featuresGrid .feature-card');
            const servicesTitle = document.getElementById('servicesHeading');
            const servicesIntro = document.querySelector('.services-intro');
            const serviceCards = document.querySelectorAll('#servicesGrid .service-card');
            const scrollTopBtn = document.getElementById('scrollTop');
            const navToggle = document.getElementById('navToggle');
            const primaryNav = document.getElementById('primaryNav');

            // Toggle mobile nav
            navToggle.addEventListener('click', () => {
                const expanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', String(!expanded));
                primaryNav.style.display = expanded ? '' : 'flex';
            });

            // Respect reduced motion
            const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReduce) {
                document.querySelectorAll('.split-content, .about-image, .about-content, .section-title, .feature-card, .service-card, .services-intro').forEach(el => {
                    el.classList.add('visible');
                    el.style.opacity = 1;
                    el.style.transform = 'none';
                });
                videoOverlay.style.display = 'none';
            } else {
                // Intersection Observer للأنميشن
                const revealObserver = new IntersectionObserver((entries) => {
                    entries.forEach((entry, index) => {
                        if (entry.isIntersecting) {
                            if (entry.target.classList.contains('feature-card') || 
                                entry.target.classList.contains('service-card')) {
                                setTimeout(() => {
                                    entry.target.classList.add('visible');
                                }, index * 100);
                            } else {
                                entry.target.classList.add('visible');
                            }
                        }
                    });
                }, {threshold: 0.2});

                // مراقبة العناصر
                if (splitContent) revealObserver.observe(splitContent);
                if (aboutImage) revealObserver.observe(aboutImage);
                if (aboutContent) revealObserver.observe(aboutContent);
                if (whyTitle) revealObserver.observe(whyTitle);
                featureCards.forEach(card => revealObserver.observe(card));
                if (servicesTitle) revealObserver.observe(servicesTitle);
                if (servicesIntro) revealObserver.observe(servicesIntro);
                serviceCards.forEach(card => revealObserver.observe(card));

                // مراقبة الـ Hero للـ split effect
                const heroObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.intersectionRatio < 0.7) {
                            videoOverlay.classList.add('split');
                            splitContent.classList.add('visible');
                        } else {
                            videoOverlay.classList.remove('split');
                        }
                    });
                }, {threshold: [0, 0.25, 0.5, 0.7, 0.9]});
                if (hero) heroObserver.observe(hero);

                // إخفاء/إظهار الـ overlay
                let lastScrollTop = 0;
                const splitObserver = new IntersectionObserver((entries) => {
                    entries.forEach(e => {
                        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        
                        if (e.boundingClientRect.top < window.innerHeight * 0.3) {
                            videoOverlay.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            videoOverlay.style.opacity = '0';
                            videoOverlay.style.transform = 'scale(0.95)';
                            videoOverlay.style.pointerEvents = 'none';
                            setTimeout(() => {
                                if (videoOverlay.style.opacity === '0') {
                                    videoOverlay.style.display = 'none';
                                }
                            }, 600);
                        } else if (e.isIntersecting) {
                            videoOverlay.style.display = 'block';
                            void videoOverlay.offsetWidth;
                            videoOverlay.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            videoOverlay.style.opacity = '1';
                            videoOverlay.style.transform = 'scale(1)';
                            videoOverlay.style.pointerEvents = 'none';
                        }
                        
                        lastScrollTop = currentScrollTop;
                    });
                }, {threshold: [0, 0.1, 0.3, 0.5]});
                if (splitContainer) splitObserver.observe(splitContainer);
            }

            // Scroll to top button
            let scrollTimeout;
            let lastShown = false;
            window.addEventListener('scroll', () => {
                if (scrollTimeout) clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const shouldShow = scrollTop > 300;
                    if (shouldShow !== lastShown) {
                        lastShown = shouldShow;
                        if (shouldShow) {
                            scrollTopBtn.classList.add('visible');
                        } else {
                            scrollTopBtn.classList.remove('visible');
                        }
                    }
                }, 80);
            }, {passive: true});

            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({top:0, behavior:'smooth'});
            });

            // Smooth anchor scrolling
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const target = document.querySelector(this.getAttribute('href'));
                    if (!target) return;
                    e.preventDefault();
                    target.scrollIntoView({behavior:'smooth', block:'start'});
                    if (navToggle.getAttribute('aria-expanded') === 'true') {
                        navToggle.click();
                    }
                });
            });

            // Footer year
            const yearSpan = document.getElementById('year');
            if (yearSpan) yearSpan.textContent = new Date().getFullYear();
        })();
