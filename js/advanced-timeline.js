document.addEventListener('DOMContentLoaded', () => {
    const timelineSection = document.querySelector('.advanced-timeline-section');
    const timelineItems = document.querySelectorAll('.advanced-timeline-section .timeline-item');
    const timelineContainer = document.querySelector('.advanced-timeline-section .timeline-container');
    let activeItemIndex = 0;
    let isScrolling = false;

    if (!timelineSection || timelineItems.length === 0 || !timelineContainer) {
        console.warn('Advanced Timeline elements not found. Skipping initialization.');
        return;
    }

    // Set initial active item
    function initializeTimeline() {
        timelineItems.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next');
            if (index === 0) {
                item.classList.add('active');
            } else if (index === 1) {
                item.classList.add('next');
            }
        });
        activeItemIndex = 0;
        updateTimelineItemStates();
    }

    function updateTimelineItemStates() {
        timelineItems.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next');
            if (index === activeItemIndex) {
                item.classList.add('active');
            } else if (index === activeItemIndex - 1) {
                item.classList.add('prev');
            } else if (index === activeItemIndex + 1) {
                item.classList.add('next');
            }
        });
    }

    // Intersection Observer for section entry/exit
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Entering timeline section');
                // Optionally lock scroll or adjust behavior when entering
            } else {
                console.log('Exiting timeline section');
                // Optionally unlock scroll or reset behavior when exiting
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the section is visible

    sectionObserver.observe(timelineSection);

    // Scroll handling for timeline items
    let scrollTimeout;
    window.addEventListener('wheel', (event) => {
        if (!timelineSection.getBoundingClientRect().inViewport()) return; // Only act if timeline is in viewport

        event.preventDefault(); // Prevent default scroll

        if (isScrolling) return;
        isScrolling = true;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 500); // Debounce scroll events

        if (event.deltaY > 0) {
            // Scroll down
            if (activeItemIndex < timelineItems.length - 1) {
                activeItemIndex++;
            }
        } else {
            // Scroll up
            if (activeItemIndex > 0) {
                activeItemIndex--;
            }
        }
        updateTimelineItemStates();
    }, { passive: false }); // Use passive: false to allow preventDefault

    // Helper to check if element is in viewport
    Element.prototype.inViewport = function() {
        const rect = this.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    initializeTimeline();
});