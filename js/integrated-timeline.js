document.addEventListener('DOMContentLoaded', () => {
    // Variables for the video background and section
    const video = document.querySelector('.video-background video');
    const submissionProcess = document.querySelector('.submission-process');
    const progressBar = document.querySelector('.progress-bar');
    const timelineItems = document.querySelectorAll(".timeline ul li");
    
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
    
    // Progress bar update based on scroll
    function updateProgressBar() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const maxScroll = documentHeight - windowHeight;
        const scrollPercentage = (scrollPosition / maxScroll) * 100;
        
        if (progressBar) {
            progressBar.style.width = `${scrollPercentage}%`;
        }
    }
    
    // Check if an element is in viewport
    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Add in-view class to timeline items when they enter viewport
    function updateTimelineItems() {
        for (var i = 0; i < timelineItems.length; i++) {
            if (isElementInViewport(timelineItems[i])) {
                timelineItems[i].classList.add("in-view");
            }
        }
    }
    
    // Event listeners
    window.addEventListener("load", function() {
        updateProgressBar();
        updateTimelineItems();
    });
    
    window.addEventListener("resize", function() {
        updateTimelineItems();
    });
    
    window.addEventListener("scroll", function() {
        updateProgressBar();
        updateTimelineItems();
    });
});