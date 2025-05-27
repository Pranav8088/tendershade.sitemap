(function() {
  
  'use strict';
  
  // define variables
  var items = document.querySelectorAll(".timeline li");
  
  // check if an element is in viewport
  // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom > 0 &&
      rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
      rect.right > 0
    );
  }
  
  function callbackFunc() {
    var foundFirst = false;
    for (var i = 0; i < items.length; i++) {
      if (!foundFirst && isElementInViewport(items[i])) {
        items[i].classList.add("in-view");
        foundFirst = true;
      } else {
        items[i].classList.remove("in-view");
      }
    }
  }
  
  // listen for events
  window.addEventListener("load", callbackFunc);
  window.addEventListener("resize", callbackFunc);
  window.addEventListener("scroll", callbackFunc);

  // Progress bar functionality
  var submissionProcessSection = document.querySelector('.submission-process');
  var progressBar = submissionProcessSection ? submissionProcessSection.querySelector('.progress-bar') : null;

  function updateProgressBar() {
    if (!submissionProcessSection || !progressBar) return;

    var sectionRect = submissionProcessSection.getBoundingClientRect();
    var windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // Calculate how much of the section is visible or has been scrolled past
    // Progress starts when the top of the section reaches the top of the viewport
    // Progress ends when the bottom of the section leaves the top of the viewport
    
    // Total scrollable height of the section within the viewport context
    // This is the height of the section itself, as we want the bar to fill as we scroll through it.
    var totalScrollableHeight = submissionProcessSection.offsetHeight - windowHeight;
    
    // Current scroll position relative to the start of the section scrolling
    // scrollTopOfTheSection is negative when section top is above viewport top, positive when below.
    // We want progress to start when section top hits viewport top (scrollTopOfTheSection = 0)
    // and end when section bottom hits viewport bottom.
    var scrollTopOfTheSection = sectionRect.top;
    
    var progress = 0;

    if (scrollTopOfTheSection < 0 && sectionRect.bottom > 0) { // Section is partially or fully in view from top
        // How far we've scrolled into the section (from its top)
        var scrolledDistance = -scrollTopOfTheSection;
        // Total height of the section that will be scrolled past
        var effectiveHeight = submissionProcessSection.offsetHeight;
        if (effectiveHeight > 0) {
            progress = (scrolledDistance / effectiveHeight) * 100;
        }
    } else if (sectionRect.bottom <= 0) { // Section has been scrolled completely past
        progress = 100;
    } else { // Section is not yet in view from top or fully below
        progress = 0;
    }

    progress = Math.min(Math.max(progress, 0), 100); // Clamp between 0 and 100
    progressBar.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateProgressBar);
  window.addEventListener('resize', updateProgressBar); // Recalculate on resize
  window.addEventListener('load', updateProgressBar); // Initial calculation
  
})();