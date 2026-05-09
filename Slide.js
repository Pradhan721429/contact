    (function() {
        function initAutoSlideshow() {
            const slidesContainer = document.getElementById('ascSlidesContainer');
            const dotsContainer = document.getElementById('ascDotsContainer');
            
            if (!slidesContainer || !dotsContainer) {
                setTimeout(initAutoSlideshow, 100);
                return;
            }

            // =============================================
            // 📷 ADD YOUR IMAGES HERE 📷
            // =============================================
            // Replace the paths below with your own image files
            // You can use:
            // - Relative paths: "images/photo1.jpg", "img/slide2.png"
            // - Absolute paths: "/assets/myimage.webp"
            // - Or keep online URLs
            
            const slidesData = [
                {
                    bgImage: 'E-mail (1)-1.png',  // 👈 CHANGE THIS to your image path
                    caption: "🏔️ Your Caption Here"
                },
                {
                    bgImage: "images/your-image-2.jpg",  // 👈 CHANGE THIS to your image path
                    caption: "🌊 Another Caption"
                },
                {
                    bgImage: "images/your-image-3.jpg",  // 👈 CHANGE THIS to your image path
                    caption: "🎨 Third Slide"
                },
                {
                    bgImage: "images/your-image-4.jpg",  // 👈 ADD MORE as needed
                    caption: "✨ Fourth Slide"
                },
                {
                    bgImage: "images/your-image-5.jpg",  // 👈 ADD MORE as needed
                    caption: "🌟 Fifth Slide"
                }
                // 👆 You can add more slides here (copy the format, don't forget commas)
            ];

            // =============================================
            // ⚙️ SETTINGS YOU CAN ADJUST ⚙️
            // =============================================
            const AUTO_DELAY_MS = 3200;  // Change this to control speed (3000 = 3 seconds)
            // =============================================

            let currentIndex = 0;
            let autoInterval = null;

            function buildSlides() {
                slidesContainer.innerHTML = '';
                dotsContainer.innerHTML = '';

                // Filter out any slides with empty or invalid image paths
                const validSlides = slidesData.filter(slide => slide.bgImage && slide.bgImage.trim() !== '');
                
                if (validSlides.length === 0) {
                    console.error('No valid images found! Please add image paths to slidesData');
                    return;
                }

                // Create slides
                validSlides.forEach((slide, idx) => {
                    const slideDiv = document.createElement('div');
                    slideDiv.className = 'asc-slide';
                    slideDiv.style.backgroundImage = `url('${slide.bgImage}')`;
                    slideDiv.style.backgroundSize = 'cover';
                    slideDiv.style.backgroundPosition = 'center';
                    
                    const captionElem = document.createElement('div');
                    captionElem.className = 'asc-slide-caption';
                    captionElem.innerText = slide.caption || `Slide ${idx + 1}`;
                    slideDiv.appendChild(captionElem);
                    slidesContainer.appendChild(slideDiv);
                });

                // Create dots
                validSlides.forEach((_, idx) => {
                    const dot = document.createElement('div');
                    dot.className = 'asc-dot';
                    if (idx === currentIndex) dot.classList.add('active');
                    
                    dot.addEventListener('click', (e) => {
                        e.stopPropagation();
                        goToSlide(idx);
                        if (autoInterval) {
                            clearInterval(autoInterval);
                            startAutoTimer();
                        }
                    });
                    dotsContainer.appendChild(dot);
                });
            }

            function updateSlidePosition() {
                const totalSlides = document.querySelectorAll('.asc-slide').length;
                if (totalSlides === 0) return;
                slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
                const allDots = document.querySelectorAll('.asc-dot');
                allDots.forEach((dot, idx) => {
                    if (idx === currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }

            function goToSlide(index) {
                const totalSlides = document.querySelectorAll('.asc-slide').length;
                if (totalSlides === 0) return;
                if (index < 0) index = totalSlides - 1;
                if (index >= totalSlides) index = 0;
                currentIndex = index;
                updateSlidePosition();
            }

            function nextSlide() {
                goToSlide(currentIndex + 1);
            }

            function startAutoTimer() {
                if (autoInterval) clearInterval(autoInterval);
                autoInterval = setInterval(() => {
                    nextSlide();
                }, AUTO_DELAY_MS);
            }

            // Preload images for smoother experience
            function preloadImages() {
                const validSlides = slidesData.filter(slide => slide.bgImage && slide.bgImage.trim() !== '');
                validSlides.forEach(slide => {
                    const img = new Image();
                    img.src = slide.bgImage;
                });
            }

            // Add floating badge
            const container = document.querySelector('.asc-slideshow-container');
            if (container && !container.querySelector('.asc-auto-badge')) {
                const badge = document.createElement('div');
                badge.className = 'asc-auto-badge';
                badge.innerHTML = '<span>⏵</span> AUTO • CYCLE';
                container.insertBefore(badge, container.firstChild);
            }

            // Initialize
            preloadImages();
            buildSlides();
            updateSlidePosition();
            startAutoTimer();

            // Handle visibility change
            function handleVisibilityChange() {
                if (document.hidden) {
                    if (autoInterval) {
                        clearInterval(autoInterval);
                        autoInterval = null;
                    }
                } else {
                    if (!autoInterval) {
                        startAutoTimer();
                    }
                }
            }
            document.addEventListener('visibilitychange', handleVisibilityChange);

            // Cleanup
            window.addEventListener('beforeunload', () => {
                if (autoInterval) clearInterval(autoInterval);
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAutoSlideshow);
        } else {
            initAutoSlideshow();
        }
    })();