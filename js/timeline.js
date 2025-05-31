import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Configuration
const VIEWPORT_HEIGHT = window.innerHeight;
const CARD_COUNT = document.querySelectorAll('.timeline-card').length;
let currentIndex = 0;
let isAnimating = false;

// Set initial positions for cards
function setInitialCardPositions() {
  gsap.set(".timeline-card", {
    left: "50%",
    xPercent: -50,
    yPercent: -50,
    top: (i) => {
      if (i === 0) return "50%";
      return i < currentIndex ? "-50%" : "150%";
    },
    opacity: (i) => (i === 0 ? 1 : 0),
    scale: (i) => (i === 0 ? 1 : 0.85),
    filter: (i) => (i === 0 ? "none" : "blur(8px)"),
    zIndex: (i) => (i === 0 ? 10 : 5),
  });
}

// Activate timeline on 100% viewport entry
ScrollTrigger.create({
  trigger: "#timeline-module",
  start: "top bottom", // Changed from "top top" to "top bottom"
  end: "bottom top", // Changed from "bottom bottom" to "bottom top"
  onEnter: () => activateTimeline(),
  onLeaveBack: () => exitTimeline("top"),
  // markers: true // Remove in production
});

function activateTimeline() {
  document.getElementById("timeline-module").style.display = "block";
  document.body.style.overflow = "hidden";
  setInitialCardPositions();
  positionCards(currentIndex);
}

// Card positioning logic
function positionCards(activeIndex) {
  isAnimating = true;
  gsap.to(".timeline-card", {
    duration: 1.2,
    stagger: 0.1,
    css: {
      top: (i) => {
        if (i === activeIndex) return "50%";
        if (i === activeIndex - 1) return "20%";
        if (i === activeIndex + 1) return "80%";
        return i < activeIndex ? "-50%" : "150%";
      },
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      scale: (i) => {
        if (i === activeIndex) return 1;
        return 0.85;
      },
      opacity: (i) => {
        if (i === activeIndex) return 1;
        if (i === activeIndex - 1 || i === activeIndex + 1) return 0.4;
        return 0;
      },
      filter: (i) => {
        if (i === activeIndex) return "none";
        if (i === activeIndex - 1 || i === activeIndex + 1) return "blur(8px)";
        return "blur(8px)";
      },
      zIndex: (i) => {
        if (i === activeIndex) return 10;
        return 5;
      },
    },
    ease: "power3.out",
    onComplete: () => {
      isAnimating = false;
      // Add/remove classes for focus states
      document.querySelectorAll('.timeline-card').forEach((card, i) => {
        card.classList.remove('card-center', 'card-secondary', 'card-hidden');
        if (i === activeIndex) {
          card.classList.add('card-center');
        } else if (i === activeIndex - 1 || i === activeIndex + 1) {
          card.classList.add('card-secondary');
        } else {
          card.classList.add('card-hidden');
        }
      });
    },
  });
}

// Directional exit handlers
window.addEventListener("wheel", (e) => {
  if (isAnimating) return;

  if (e.deltaY > 0) {
    // Scrolling down
    if (currentIndex < CARD_COUNT - 1) {
      currentIndex++;
      positionCards(currentIndex);
    } else {
      exitTimeline("bottom");
    }
  } else {
    // Scrolling up
    if (currentIndex > 0) {
      currentIndex--;
      positionCards(currentIndex);
    } else {
      exitTimeline("top");
    }
  }
});

function exitTimeline(direction) {
  isAnimating = true;
  const timelineModule = document.getElementById("timeline-module");
  const exitOverlay = document.querySelector(`.exit-overlay.${direction}`);

  if (exitOverlay) {
    gsap.to(exitOverlay, { opacity: 1, duration: 0.3 });
  }

  gsap.to(timelineModule, {
    y: direction === "top" ? "-100vh" : "100vh",
    opacity: 0,
    duration: 0.8,
    ease: "power2.inOut",
    onComplete: () => {
      timelineModule.style.display = "none";
      timelineModule.style.transform = "translateY(0)";
      timelineModule.style.opacity = 1;
      document.body.style.overflow = "auto";
      if (exitOverlay) {
        gsap.to(exitOverlay, { opacity: 0, duration: 0.3 });
      }
      currentIndex = 0; // Reset for next activation
      isAnimating = false;
    },
  });
}

// Optional: Haptic Feedback (requires user gesture)
function triggerHapticFeedback() {
  if (navigator.vibrate) {
    navigator.vibrate(10); // Vibrate for 10ms
  }
}

// Example of how to integrate haptic feedback on card focus change
// This would typically be called within positionCards or a similar function
// triggerHapticFeedback();

// Initial setup to hide the timeline module
document.addEventListener('DOMContentLoaded', () => {
  const timelineModule = document.getElementById('timeline-module');
  if (timelineModule) {
    timelineModule.style.display = 'none';
  }
});