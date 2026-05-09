(function() {
        function initAutoSlideshow() {
            const slidesContainer = document.getElementById('ascSlidesContainer');
            const dotsContainer = document.getElementById('ascDotsContainer');
            const track = document.getElementById('ascSlideTrack');
            
            if (!slidesContainer || !dotsContainer) {
                setTimeout(initAutoSlideshow, 100);
                return;
            }

            // =============================================
            // 📷 ADD YOUR IMAGES HERE 📷
            // =============================================
            const slidesData = [
                {
                    bgImage: "SL1.JPEG",  
                },
                 {
                    bgImage: "SL2.JPEG",  
                },
                 {
                    bgImage: "SL3.JPEG",  
                },
                 {
                    bgImage: "SL4.JPEG",  
                },
                 {
                    bgImage: "SL5.JPEG",  
                },
                 {
                    bgImage: "SL6.JPEG",  
                },
                 {
                    bgImage: "SL7.JPEG",  
                },
                 {
                    bgImage: "SL8.JPEG",  
                },
                 {
                    bgImage: "SL9.JPEG",  
                },
                 {
                    bgImage: "SL10.JPEG",  
                }
            ];

            // =============================================
            // ⚙️ SETTINGS
            // =============================================
            const AUTO_DELAY_MS = 3200;  // Change speed (3000 = 3 seconds)
            const SWIPE_THRESHOLD = 50;   // Minimum swipe distance in pixels
            // =============================================

            let currentIndex = 0;
            let autoInterval = null;
            let touchStartX = 0;
            let touchEndX = 0;
            let isSwiping = false;

            function buildSlides() {
                slidesContainer.innerHTML = '';
                dotsContainer.innerHTML = '';

                const validSlides = slidesData.filter(slide => slide.bgImage && slide.bgImage.trim() !== '');
                
                if (validSlides.length === 0) {
                    console.error('No valid images found! Please add image paths to slidesData');
                    slidesContainer.innerHTML = '<div style="padding: 100px 20px; text-align: center; color: white;">No images found. Please add your images to slidesData.</div>';
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
                        resetAutoTimer();
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

            function prevSlide() {
                goToSlide(currentIndex - 1);
            }

            function startAutoTimer() {
                if (autoInterval) clearInterval(autoInterval);
                autoInterval = setInterval(() => {
                    nextSlide();
                }, AUTO_DELAY_MS);
            }

            function resetAutoTimer() {
                if (autoInterval) {
                    clearInterval(autoInterval);
                    startAutoTimer();
                }
            }

            // Touch/swipe handlers for mobile
            function handleTouchStart(e) {
                touchStartX = e.touches[0].clientX;
                isSwiping = true;
                // Pause auto timer temporarily during swipe for better UX
                if (autoInterval) {
                    clearInterval(autoInterval);
                }
            }

            function handleTouchMove(e) {
                if (!isSwiping) return;
                touchEndX = e.touches[0].clientX;
                const diff = touchEndX - touchStartX;
                // Optional: Add visual feedback during swipe (slightly drag)
                const totalSlides = document.querySelectorAll('.asc-slide').length;
                if (totalSlides > 0) {
                    const dragPercent = (diff / slidesContainer.offsetWidth) * 100;
                    // Uncomment for smooth drag effect (optional)
                    // slidesContainer.style.transform = `translateX(calc(-${currentIndex * 100}% + ${dragPercent}%))`;
                }
            }

            function handleTouchEnd(e) {
                if (!isSwiping) return;
                isSwiping = false;
                
                const diffX = touchEndX - touchStartX;
                
                if (Math.abs(diffX) > SWIPE_THRESHOLD) {
                    if (diffX > 0) {
                        // Swipe right - go to previous slide
                        prevSlide();
                    } else {
                        // Swipe left - go to next slide
                        nextSlide();
                    }
                }
                
                // Restart auto timer
                startAutoTimer();
                
                // Reset touch coordinates
                touchStartX = 0;
                touchEndX = 0;
            }

            // Add swipe hint for mobile users (optional)
            function addSwipeHint() {
                if (window.innerWidth < 768 && !document.querySelector('.swipe-hint')) {
                    const hint = document.createElement('div');
                    hint.className = 'swipe-hint';
                    hint.innerHTML = '👆 Swipe left/right to navigate';
                    document.querySelector('.asc-slideshow-container').appendChild(hint);
                    
                    // Remove hint after animation
                    setTimeout(() => {
                        if (hint && hint.remove) hint.remove();
                    }, 3000);
                }
            }

            // Preload images
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

            // Add touch event listeners
            if (track) {
                track.addEventListener('touchstart', handleTouchStart, { passive: false });
                track.addEventListener('touchmove', handleTouchMove, { passive: false });
                track.addEventListener('touchend', handleTouchEnd);
            }

            // Initialize
            preloadImages();
            buildSlides();
            updateSlidePosition();
            startAutoTimer();
            addSwipeHint();

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

            // Handle window resize (maintain responsive layout)
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    updateSlidePosition();
                    if (window.innerWidth < 768 && !document.querySelector('.swipe-hint')) {
                        addSwipeHint();
                    }
                }, 150);
            });

            // Cleanup
            window.addEventListener('beforeunload', () => {
                if (autoInterval) clearInterval(autoInterval);
                if (track) {
                    track.removeEventListener('touchstart', handleTouchStart);
                    track.removeEventListener('touchmove', handleTouchMove);
                    track.removeEventListener('touchend', handleTouchEnd);
                }
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAutoSlideshow);
        } else {
            initAutoSlideshow();
        }
    })();
