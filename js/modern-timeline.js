/**
 * Modern Timeline Component
 * Uses Intersection Observer API for scroll animations
 * Implements smooth progress tracking
 * Follows ES6+ module pattern
 */

class TimelineComponent {
  constructor() {
    // DOM Elements
    this.timeline = document.querySelector('.timeline');
    this.progressBar = document.querySelector('.timeline__progress-bar');
    this.timelineSteps = document.querySelectorAll('.timeline__step');
    this.timelineProgress = document.querySelector('.timeline__line-progress');
    this.rightPanel = document.querySelector('.timeline__panel--right');
    
    // State
    this.currentStep = 0;
    this.totalSteps = this.timelineSteps.length;
    this.observers = [];
    
    // Initialize
    this.init();
  }
  
  init() {
    // Set up intersection observers for each step
    this.setupIntersectionObservers();
    
    // Set up scroll event for progress bar
    this.setupScrollProgress();
    
    // Initial check for visible elements (in case some are already in view)
    this.checkInitialVisibility();
    
    // Add event listeners
    this.addEventListeners();
  }
  
  setupIntersectionObservers() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5 // Only activate when 50% visible
    };

    this.timelineSteps.forEach((step, index) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const boundingRect = entry.boundingClientRect;
          const isCentered = 
            boundingRect.top <= window.innerHeight/2 &&
            boundingRect.bottom >= window.innerHeight/2;

          if (isCentered && entry.intersectionRatio >= 0.5) {
            this.activateStep(step, index);
          } else {
            this.deactivateStep(step);
          }
        });
      }, options);
      
      // Start observing the step
      observer.observe(step);
      
      // Store the observer for cleanup
      this.observers.push(observer);
    });
  }
  
  setupScrollProgress() {
    // Add left panel scroll handler
    const leftPanel = document.querySelector('.timeline__panel--left');
    
    // Synchronize panel scrolling
    // Added scroll sync logic
    const syncScroll = (source, target) => {
      const scrollRatio = source.scrollTop / (source.scrollHeight - source.clientHeight);
      target.scrollTop = scrollRatio * (target.scrollHeight - target.clientHeight);
    };
    
    // Modified scrollToStep for completion enforcement
    if (index === this.totalSteps - 1) {
      this.rightPanel.style.overscrollBehavior = 'auto';
    } else {
      this.rightPanel.style.overscrollBehavior = 'contain';
    }

    // Handle right panel scroll
    this.rightPanel.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        this.updateProgress();
        syncScroll(this.rightPanel, leftPanel);
      });
    }, { passive: true });

    // Handle left panel scroll
    leftPanel.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        syncScroll(leftPanel, this.rightPanel);
        this.updateProgress();
      });
    }, { passive: true });
  }
  
  updateProgress() {
    // Calculate scroll progress
    const scrollTop = this.rightPanel.scrollTop;
    const scrollHeight = this.rightPanel.scrollHeight - this.rightPanel.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    
    // Update progress bar width
    this.progressBar.style.width = `${scrollPercentage}%`;
    
    // Update timeline line progress
    if (this.timelineProgress) {
      this.timelineProgress.style.height = `${scrollPercentage}%`;
    }
  }
  
  activateStep(step, index) {
    // First deactivate all steps
    this.timelineSteps.forEach(s => s.classList.remove('active'));
    
    // Add active class to the current step
    step.classList.add('active');
    
    // Update current step
    this.currentStep = index;
    
    // Apply animation to the marker
    const marker = step.querySelector('.timeline__marker');
    if (marker) {
      marker.classList.add('pulse-animation');
      setTimeout(() => {
        marker.classList.remove('pulse-animation');
      }, 1500);
    }
    
    // Ensure step is scrolled into view
    this.scrollToStep(index);
  }
  
  deactivateStep(step) {
    // Remove active class from the step
    step.classList.remove('active');
  }
  
  checkInitialVisibility() {
    // Trigger initial check for elements already in viewport
    setTimeout(() => {
      this.updateProgress();
      
      // Activate the first step by default if at top of page
      if (this.rightPanel.scrollTop === 0 && this.timelineSteps.length > 0) {
        this.activateStep(this.timelineSteps[0], 0);
      }
    }, 100);
  }
  
  addEventListeners() {
    // Add click event to markers for navigation
    this.timelineSteps.forEach((step, index) => {
      const marker = step.querySelector('.timeline__marker');
      if (marker) {
        marker.addEventListener('click', (e) => {
          e.preventDefault();
          this.scrollToStep(index);
        });
      }
    });
    
    // Handle resize events with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.updateProgress();
      }, 250);
    }, { passive: true });
  }
  
  scrollToStep(index) {
    if (index >= 0 && index < this.totalSteps) {
      const targetStep = this.timelineSteps[index];
      
      targetStep.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  }
  
  // Clean up method to remove observers when needed
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Initialize the timeline when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const timeline = new TimelineComponent();
  
  // Make timeline accessible globally for debugging if needed
  window.timelineComponent = timeline;
});

// Export the class for potential reuse
export default TimelineComponent;