document.addEventListener('DOMContentLoaded', () => {
    const timeline = document.querySelector('.process-timeline');
    const steps = document.querySelectorAll('.process-step');
    const progressBar = document.querySelector('.progress-bar');
    const video = document.querySelector('.video-background video');
    const submissionProcess = document.querySelector('.submission-process');
    let isScrolling = false;
    
    if (!timeline || !steps.length) return;

    // Ensure video plays correctly
    if (video) {
        // Force video to play
        setTimeout(() => {
            video.play().catch(function(error) {
                console.log("Video play prevented: ", error);
                // Try again in case of autoplay restrictions
                document.addEventListener('click', function videoPlayOnClick() {
                    video.play();
                    document.removeEventListener('click', videoPlayOnClick);
                }, { once: true });
            });
        }, 1000);
        
        // Ensure video is sized correctly for section only
        function adjustVideoSize() {
            const sectionWidth = submissionProcess.offsetWidth;
            const sectionHeight = submissionProcess.offsetHeight;
            
            if (sectionWidth / sectionHeight > video.videoWidth / video.videoHeight) {
                video.style.width = sectionWidth + 'px';
                video.style.height = 'auto';
            } else {
                video.style.width = 'auto';
                video.style.height = sectionHeight + 'px';
            }
        }
        
        // Check if section is in viewport to play/pause video
        function checkSectionVisibility() {
            const rect = submissionProcess.getBoundingClientRect();
            const isVisible = (
                rect.top < window.innerHeight &&
                rect.bottom > 0
            );
            
            if (isVisible) {
                if (video.paused) {
                    video.play().catch(e => console.log("Couldn't play video: ", e));
                }
            } else {
                if (!video.paused) {
                    video.pause();
                }
            }
        }
        
        // Adjust video size when loaded and on resize
        video.addEventListener('loadedmetadata', adjustVideoSize);
        window.addEventListener('resize', adjustVideoSize);
        
        // Play video only when section is visible
        window.addEventListener('scroll', checkSectionVisibility);
        
        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                checkSectionVisibility();
            } else {
                video.pause();
            }
        });
        
        // Initial check
        checkSectionVisibility();
    }
    
    // Set initial heights
    function setStepHeights() {
        const viewportHeight = window.innerHeight;
        const padding = 80; // Account for padding
        const minHeight = viewportHeight - padding;
        
        steps.forEach((step, index) => {
            // First and last steps get extra padding to ensure they can be centered
            if (index === 0 || index === steps.length - 1) {
                step.style.minHeight = `${minHeight + padding}px`;
            } else {
                step.style.minHeight = `${minHeight}px`;
            }
        });
    }

    // Calculate which step is active based on scroll position
    function updateActiveStep() {
        const timelineRect = timeline.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const centerPoint = viewportHeight / 2;
        let activeStep = null;
        let closestDistance = Infinity;

        steps.forEach((step) => {
            const stepRect = step.getBoundingClientRect();
            const stepCenter = stepRect.top + (stepRect.height / 2);
            const distanceFromCenter = Math.abs(stepCenter - centerPoint);

            // Remove active class from all steps initially
            step.classList.remove('active');
            const stepNumber = step.querySelector('.step-number');
            if (stepNumber) {
                stepNumber.style.transform = 'scale(1)';
                stepNumber.style.opacity = '0.5';
            }

            // Find the step closest to center
            if (distanceFromCenter < closestDistance) {
                closestDistance = distanceFromCenter;
                activeStep = step;
            }
        });

        // Add active class to the closest step
        if (activeStep) {
            activeStep.classList.add('active');
            const activeStepNumber = activeStep.querySelector('.step-number');
            if (activeStepNumber) {
                activeStepNumber.style.transform = 'scale(1.2)';
                activeStepNumber.style.opacity = '1';
            }

            // Update progress bar
            const index = Array.from(steps).indexOf(activeStep);
            const progress = ((index + 1) / steps.length) * 100;
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        }
    }

    // Smooth scroll to step with improved positioning and easing
    function scrollToStep(step) {
        const stepRect = step.getBoundingClientRect();
        const timelineRect = timeline.getBoundingClientRect();
        
        // Calculate the target scroll position to center the step in the viewport
        // Add a small offset to improve visibility of the step content
        const targetScroll = timeline.scrollTop + stepRect.top - (window.innerHeight / 2) + (stepRect.height / 3);
        
        // Add a small delay to ensure DOM updates have completed
        setTimeout(() => {
            // Apply active class before scrolling for better visual feedback
            steps.forEach(s => {
                s.classList.remove('highlight-step');
                s.classList.remove('active');
            });
            step.classList.add('highlight-step');
            step.classList.add('active');
            
            // Perform the scroll with smooth behavior
            timeline.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
            
            // Remove highlight after animation completes
            setTimeout(() => {
                step.classList.remove('highlight-step');
                // Update active step after scrolling is complete
                updateActiveStep();
            }, 1000);
        }, 10);
    }

    // Add wheel event listener for smooth scrolling with improved sensitivity
    let scrollTimeout;
    let lastScrollTime = 0;
    const scrollCooldown = 600; // Increased cooldown for less sensitivity
    let wheelDeltaAccumulator = 0;
    const wheelThreshold = 50; // Higher threshold to prevent accidental scrolling

    timeline.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const now = Date.now();
        if (isScrolling) return;
        
        // Accumulate wheel delta to reduce sensitivity
        wheelDeltaAccumulator += Math.abs(e.deltaY);
        
        // Only proceed if we've accumulated enough scroll or enough time has passed
        if (wheelDeltaAccumulator < wheelThreshold && now - lastScrollTime < scrollCooldown) return;
        
        lastScrollTime = now;
        wheelDeltaAccumulator = 0; // Reset accumulator
        
        const activeStep = document.querySelector('.process-step.active');
        if (!activeStep) return;

        // Get scroll direction
        const direction = e.deltaY > 0 ? 1 : -1;
        const currentIndex = Array.from(steps).indexOf(activeStep);
        const targetIndex = currentIndex + direction;

        if (targetIndex >= 0 && targetIndex < steps.length) {
            isScrolling = true;
            scrollToStep(steps[targetIndex]);

            // Reset scrolling flag after animation
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 800); // Increased for smoother experience
        }
    }, { passive: false });

    // Add click handlers for step numbers
    steps.forEach((step) => {
        const stepNumber = step.querySelector('.step-number');
        if (stepNumber) {
            stepNumber.addEventListener('click', () => {
                scrollToStep(step);
            });
        }
    });

    // Initialize
    updateActiveStep();
    setStepHeights();
    
    // Track timeline completion status
    let timelineCompleted = false;
    
    // Function to check if user has viewed all steps
    function checkTimelineCompletion() {
        const lastStep = steps[steps.length - 1];
        const lastStepRect = lastStep.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Consider timeline completed if last step is fully visible
        if (lastStepRect.bottom <= viewportHeight) {
            timelineCompleted = true;
            document.body.classList.add('timeline-completed');
            
            // Allow scrolling past the section after a short delay
            setTimeout(() => {
                if (submissionProcess) {
                    submissionProcess.classList.add('scrollable');
                }
            }, 500);
        }
    }
    
    // Add scroll event listener with completion check
    timeline.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            updateActiveStep();
            checkTimelineCompletion();
        });
    });
    
    // Handle scroll events on the entire section
    if (submissionProcess) {
        submissionProcess.addEventListener('wheel', (e) => {
            if (!timelineCompleted && !submissionProcess.classList.contains('scrollable')) {
                e.preventDefault();
                
                // Direct scroll events to the timeline
                const activeStep = document.querySelector('.process-step.active');
                if (activeStep) {
                    const direction = e.deltaY > 0 ? 1 : -1;
                    const currentIndex = Array.from(steps).indexOf(activeStep);
                    const targetIndex = currentIndex + direction;
                    
                    if (targetIndex >= 0 && targetIndex < steps.length) {
                        scrollToStep(steps[targetIndex]);
                    }
                }
            }
        }, { passive: false });
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        setStepHeights();
        updateActiveStep();
    });

    // Add intersection observer for better performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const step = entry.target;
                const stepNumber = step.querySelector('.step-number');
                if (stepNumber) {
                    stepNumber.style.opacity = '1';
                }
            }
        });
    }, {
        root: timeline,
        threshold: 0.5
    });

    steps.forEach(step => observer.observe(step));

    // Prevent scrolling past the timeline until all steps are seen (for both left and right areas)
    function preventSectionScroll(e) {
        const atBottom = timeline.scrollTop + timeline.clientHeight >= timeline.scrollHeight - 2;
        const atTop = timeline.scrollTop <= 0;
        
        // Prevent scrolling down past the last step
        if (atBottom && e.deltaY > 0) {
            e.preventDefault();
            timeline.scrollTop = timeline.scrollHeight - timeline.clientHeight;
            
            // Visual indicator that user needs to view all steps
            const lastStep = steps[steps.length - 1];
            if (lastStep) {
                lastStep.classList.add('pulse-animation');
                setTimeout(() => {
                    lastStep.classList.remove('pulse-animation');
                }, 1000);
            }
        }
        
        // Prevent scrolling up past the first step
        if (atTop && e.deltaY < 0) {
            e.preventDefault();
            timeline.scrollTop = 0;
            
            // Visual indicator for first step
            const firstStep = steps[0];
            if (firstStep) {
                firstStep.classList.add('pulse-animation');
                setTimeout(() => {
                    firstStep.classList.remove('pulse-animation');
                }, 1000);
            }
        }
    }
    
    // Add touch event handling for mobile devices with improved sensitivity
    let touchStartY = 0;
    let touchEndY = 0;
    let lastTouchTime = 0;
    const touchCooldown = 800; // Longer cooldown for touch to prevent accidental swipes
    
    timeline.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    timeline.addEventListener('touchmove', (e) => {
        if (isScrolling) return;
        
        const now = Date.now();
        if (now - lastTouchTime < touchCooldown) return;
        
        touchEndY = e.touches[0].clientY;
        const touchDiff = touchStartY - touchEndY;
        
        // Increased threshold for more deliberate touch movements
        if (Math.abs(touchDiff) > 50) {
            lastTouchTime = now;
            
            const direction = touchDiff > 0 ? 1 : -1;
            const activeStep = document.querySelector('.process-step.active');
            if (!activeStep) return;
            
            const currentIndex = Array.from(steps).indexOf(activeStep);
            const targetIndex = currentIndex + direction;
            
            if (targetIndex >= 0 && targetIndex < steps.length) {
                isScrolling = true;
                scrollToStep(steps[targetIndex]);
                
                // Reset scrolling flag after animation with longer duration
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                }, 800);
                
                // Reset touch start position
                touchStartY = touchEndY;
            }
        }
    }, { passive: true }); // Changed to passive for better performance
    
    timeline.addEventListener('wheel', preventSectionScroll, { passive: false });
    const fixedContent = document.querySelector('.fixed-content');
    if (fixedContent) {
        fixedContent.addEventListener('wheel', preventSectionScroll, { passive: false });
    }
    if (submissionProcess) {
        submissionProcess.addEventListener('wheel', preventSectionScroll, { passive: false });
    }
});