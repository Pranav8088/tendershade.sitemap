// DOM Elements and State
const mobileToggle = document.querySelector('.mobile-toggle');
const mainNav = document.querySelector('.main-nav');
const dropdownLinks = document.querySelectorAll('.has-dropdown > a');
let isScrolled = false;

// Handle scroll for header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Mobile Menu Toggle
if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
    });
}

// Handle dropdown on mobile
dropdownLinks.forEach(link => {
    const parent = link.parentElement;
    
    // Mobile click
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
                e.preventDefault(); // Prevent link navigation on mobile to open dropdown
            // Close other open dropdowns
            dropdownLinks.forEach(otherLink => {
                const otherParent = otherLink.parentElement;
                if (otherParent !== parent && otherParent.classList.contains('active')) {
                    otherParent.classList.remove('active');
            }
        });
            // Toggle the clicked dropdown
            parent.classList.toggle('active');
            }
        });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 992 && mainNav && mainNav.classList.contains('active')) {
        // Check if the click is outside the nav and outside the toggle button
        if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        mainNav.classList.remove('active');
            mobileToggle.classList.remove('active');
            // Close any open mobile dropdowns as well
            dropdownLinks.forEach(link => {
                link.parentElement.classList.remove('active');
            });
        }
    }
});

// Handle window resize with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // If resizing to desktop view, close mobile menu and dropdowns
        if (window.innerWidth > 992) {
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
            if (mobileToggle && mobileToggle.classList.contains('active')) {
                 mobileToggle.classList.remove('active');
            }
            dropdownLinks.forEach(link => {
                link.parentElement.classList.remove('active'); // Ensure mobile active states are cleared
            });
        }
    }, 250);
});

// Banner Slider Functionality
function initBannerSlider() {
    // Hero Slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    const sliderDots = document.querySelectorAll('.slider-dot');
    let currentSlideIndex = 0;
    let slideInterval;

    // Set first slide as active initially
    if (heroSlides.length > 0) {
        heroSlides[0].classList.add('active');
    }
    
    function showSlide(index, lazyLoaderInstance) {
        // Remove active class from all slides
        heroSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        sliderDots.forEach(dot => {
            dot.classList.remove('active');
        });
    
        // Add active class to selected slide and dot
        heroSlides[index].classList.add('active');
        sliderDots[index].classList.add('active');

        // Manually trigger lazy loading for the active slide's image
        const activeImage = heroSlides[index].querySelector('.hero-image');
        if (activeImage && lazyLoaderInstance) {
            lazyLoaderInstance.loadImage(activeImage);
        }
    }
    
    // Initialize lazy loading when DOM is loaded
    const lazyLoader = new LazyLoader();

    // Refresh lazy loading after dynamic content updates
    document.addEventListener('contentChanged', () => {
        lazyLoader.refresh();
    });

    // Initial call to show the first slide with the lazyLoader instance
    if (heroSlides.length > 0) {
        showSlide(currentSlideIndex, lazyLoader);
    }

    function startSlideInterval() {
        // Clear any existing interval
        clearInterval(slideInterval);
        // Set 3 second interval for slide transition
        slideInterval = setInterval(nextSlide, 3000);
    }

    function nextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % heroSlides.length;
        showSlide(currentSlideIndex, lazyLoader);
    }

    // Initialize automatic slideshow if there are slides
    if (heroSlides.length > 0) {
        startSlideInterval();
        
        // Add click event to dots for manual navigation
        sliderDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlideIndex = index;
                showSlide(currentSlideIndex, lazyLoader);
                startSlideInterval(); // Reset interval after manual navigation
            });
        });
        
        // Pause slideshow when hovering over slider
        const heroSlider = document.querySelector('.hero-slider');
        if (heroSlider) {
            heroSlider.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
        
            // Resume slideshow when mouse leaves
            heroSlider.addEventListener('mouseleave', () => {
                startSlideInterval();
            });
        }
    }
}
        
// Animate on scroll
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkInView() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('fade-up');
            }
        });
        }
        
    // Initial check
    checkInView();
    
    // Check on scroll with throttle
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                checkInView();
                scrollTimeout = null;
            }, 100);
        }
    });

    // New Timeline Scroll Logic
    const timelineItems = document.querySelectorAll('.new-timeline-section .timeline-item');
    const timelineSection = document.querySelector('.new-timeline-section');
    let activeItemIndex = 0;

    function updateTimelineVisibility() {
        if (!timelineSection) return;

        const sectionRect = timelineSection.getBoundingClientRect();
        const sectionCenter = sectionRect.top + sectionRect.height / 2;

        // Determine which item is closest to the center of the section
        let closestItemIndex = -1;
        let minDistance = Infinity;

        timelineItems.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.top + itemRect.height / 2;
            const distance = Math.abs(sectionCenter - itemCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestItemIndex = index;
            }
        });

        if (closestItemIndex !== -1 && closestItemIndex !== activeItemIndex) {
            activeItemIndex = closestItemIndex;
            console.log('Active timeline item index:', activeItemIndex); // Debugging line
            timelineItems.forEach((item, index) => {
                item.classList.remove('active', 'prev', 'next');
                if (index === activeItemIndex) {
                    item.classList.add('active');
                } else if (index === activeItemIndex - 1) {
                    item.classList.add('prev');
                } else if (index === activeItemIndex + 1) {
                    item.classList.add('next');
                }
                // All other items will remain without active/prev/next classes,
                // making them hidden by the default .timeline-item styling.
            });
        }
    }

    // Attach to scroll and resize events
    window.addEventListener('scroll', updateTimelineVisibility);
    window.addEventListener('resize', updateTimelineVisibility);

    // Ensure the first item is active on load and set initial visibility for adjacent items
    if (timelineItems.length > 0) {
        // Initially set all items to their default (visible) state
        timelineItems.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next');
        });
        // Set the first item as active and its neighbors as prev/next if they exist
        timelineItems[0].classList.add('active');
        if (timelineItems.length > 1) {
            timelineItems[1].classList.add('next');
        }
        if (timelineItems.length > 0) {
            // If there's more than one item, the last item can be considered 'prev' to the first in a cyclical sense if desired, or just left as default.
            // For now, we'll just ensure the first is active and its immediate next is 'next'.
        }
    }
    // Call updateTimelineVisibility after initial setup to ensure correct state
    // This will re-evaluate based on scroll position, potentially overriding the initial setup if not at the top.
    updateTimelineVisibility();
    console.log('Initial timeline setup complete. Active item:', activeItemIndex); // Debugging line
});
        
// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (mainNav) {
                mainNav.classList.remove('active');
            }
            if (mobileToggle) {
                mobileToggle.classList.remove('active');
    }
        }
    });
});

// Form Validation with Performance Optimization
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Cache DOM elements and use event delegation
    const formGroups = contactForm.querySelectorAll('.form-group');
    const formStatus = contactForm.querySelector('.form-status');
    
    // Validate an individual input with debounced validation
    let debounceTimer;
    const validateInput = (input) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const parent = input.closest('.form-group');
            const feedback = parent.querySelector('.form-feedback');
        
            // Clear previous validation state
            parent.classList.remove('is-valid', 'is-invalid');
            feedback.textContent = '';
            
            if (input.validity.valid) {
                parent.classList.add('is-valid');
                return true;
            } else {
                parent.classList.add('is-invalid');
        
                // Custom error messages
                if (input.validity.valueMissing) {
                    feedback.textContent = 'This field is required';
                } else if (input.validity.typeMismatch && input.type === 'email') {
                    feedback.textContent = 'Please enter a valid email address';
                } else if (input.validity.patternMismatch && input.type === 'tel') {
                    feedback.textContent = 'Please enter a valid phone number';
                } else if (input.validity.tooShort) {
                    feedback.textContent = `Should be at least ${input.minLength} characters`;
            } else {
                    feedback.textContent = 'Invalid input';
            }
                return false;
            }
        }, 200); // 200ms debounce to avoid excessive repaints
    };
    
    // Add event listeners with event delegation
    contactForm.addEventListener('input', (e) => {
        const input = e.target;
        if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA' || input.tagName === 'SELECT') {
            validateInput(input);
        }
});

    // Handle form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const formData = new FormData();
        
        // Validate all inputs
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Skip non-required checkboxes that aren't checked
            if (input.type === 'checkbox' && !input.required && !input.checked) return;
            
            const isInputValid = input.checkValidity();
            const parent = input.closest('.form-group');
            const feedback = parent.querySelector('.form-feedback');
            
            parent.classList.remove('is-valid', 'is-invalid');
            if (isInputValid) {
                parent.classList.add('is-valid');
                formData.append(input.name, input.value);
            } else {
            isValid = false;
                parent.classList.add('is-invalid');
                if (input.validity.valueMissing) {
                    feedback.textContent = 'This field is required';
                } else if (input.validity.typeMismatch && input.type === 'email') {
                    feedback.textContent = 'Please enter a valid email address';
                } else if (input.validity.patternMismatch && input.type === 'tel') {
                    feedback.textContent = 'Please enter a valid phone number';
                } else if (input.validity.tooShort) {
                    feedback.textContent = `Should be at least ${input.minLength} characters`;
        }
            }
        });
        
        if (isValid) {
            // Simulate form submission - in a real app, you would send data to server
            formStatus.className = 'form-status';
            formStatus.textContent = 'Sending your message...';
            formStatus.style.display = 'block';
            
            // Simulate API call response
            setTimeout(() => {
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Message sent successfully! We will contact you soon.';
            contactForm.reset();
                formGroups.forEach(group => group.classList.remove('is-valid'));
            }, 1500);
        } else {
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Please correct the errors in the form';
            formStatus.style.display = 'block';
            
            // Scroll to first error with smooth behavior
            const firstError = contactForm.querySelector('.is-invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
});

// Home page contact form
const homeContactForm = document.getElementById('home-contact-form');
if (homeContactForm) {
    homeContactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const service = document.getElementById('service');
        const message = document.getElementById('message');
        
        let isValid = true;
        
        // Reset error states
        [name, email, phone, service, message].forEach(field => {
            if (field) {
                field.classList.remove('error');
            }
        });
        
        // Validate fields
        if (name && !name.value.trim()) {
            name.classList.add('error');
            isValid = false;
        }
        
        if (email && (!email.value.trim() || !isValidEmail(email.value))) {
            email.classList.add('error');
            isValid = false;
        }
        
        if (phone && !isValidPhone(phone.value)) {
            phone.classList.add('error');
            isValid = false;
        }
        
        if (service && !service.value) {
            service.classList.add('error');
            isValid = false;
        }
        
        if (message && !message.value.trim()) {
            message.classList.add('error');
            isValid = false;
        }
        
        if (isValid) {
            // Show success message and reset form
            alert('Thank you! Your message has been sent.');
            homeContactForm.reset();
        } else {
            alert('Please fill all required fields correctly.');
        }
    });
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function isValidPhone(phone) {
    const regex = /^[0-9+\-\s]{10,15}$/;
    return regex.test(phone);
}

function showSuccessMessage() {
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully. We'll get back to you soon.</p>
            </div>
        `;
    }
}

function showErrorMessage() {
    const errorMsg = document.querySelector('.error-message');
    if (!errorMsg) {
        const formContainer = document.querySelector('.form-container');
        if (formContainer) {
            const errorDiv = document.createElement('div');
            errorDiv.classList.add('error-message');
            errorDiv.innerHTML = 'Please fill all required fields correctly.';
            formContainer.prepend(errorDiv);
            
            // Remove after 3 seconds
            setTimeout(() => {
                errorDiv.remove();
            }, 3000);
        }
    }
}

// Initialize countdown timer for CTA
function initCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    // Set countdown to end of day tomorrow
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 0);
    
    function updateCountdown() {
        const currentTime = new Date();
        const difference = tomorrow - currentTime;
        
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        countdownElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
        
        if (difference > 0) {
            setTimeout(updateCountdown, 1000);
        } else {
            countdownElement.textContent = "Today! Act Fast!";
        }
    }
    
    updateCountdown();
}

// Call all initializations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Define initBannerSlider function
    function initBannerSlider() {
        // Your banner slider initialization code here
        // For example, if you have a specific slider library or custom code
        // that initializes a banner, it would go here.
        // If there's no banner slider, this function can remain empty or be removed.
        console.log('initBannerSlider called');
    }

    initBannerSlider();
    initCountdown();
    initFAQ();
    initResourceTabs();
    removePricingSections();
    initAnimateOnScroll();
    
    // Initialize testimonial slider if it exists
    if (document.querySelector('.testimonial-slider')) {
        // Ensure testimonial slider initialization is called correctly
        // The testimonial slider logic is already wrapped in a DOMContentLoaded listener,
        // so calling it directly here might be redundant or cause issues if not a function.
        // If it's a function, call it. Otherwise, ensure its existing DOMContentLoaded block is sufficient.
        // For now, assuming it's a function that needs to be called.
        // If the testimonial slider is already initialized by its own DOMContentLoaded listener,
        // this line might not be needed or might need adjustment.
        // For example, if the testimonial slider code is self-executing on DOMContentLoaded,
        // you don't need to call a function here.
        // Let's assume for now that the testimonial slider setup is self-contained
        // within its own DOMContentLoaded block and doesn't need an explicit call here.
        // If it was meant to be a callable function, it should be defined as such.
        // Based on the provided code, the testimonial slider is already initialized
        // within its own DOMContentLoaded listener, so no explicit call is needed here.
        // The previous error was likely due to initBannerSlider not being defined.
    }
});

// Animation on Scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('animate');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Testimonial Slider
document.addEventListener('DOMContentLoaded', function() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const sliderDotsContainer = document.querySelector('.slider-dots');
    let currentTestimonialIndex = 0;
    let testimonialInterval;

    if (!testimonialSlider || !sliderDotsContainer) {
        return; // Exit if elements not found
    }

    const testimonialSlides = testimonialSlider.querySelectorAll('.testimonial-slide');
    const testimonialDots = sliderDotsContainer.querySelectorAll('.dot');

    function showTestimonial(index) {
        testimonialSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
        testimonialDots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) {
                dot.classList.add('active');
            }
        });
    }

    function nextTestimonial() {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialSlides.length;
        showTestimonial(currentTestimonialIndex);
    }

    function startTestimonialInterval() {
        clearInterval(testimonialInterval);
        testimonialInterval = setInterval(nextTestimonial, 5000); // Change slide every 5 seconds
    }

    // Initial display
    if (testimonialSlides.length > 0) {
        showTestimonial(currentTestimonialIndex);
        startTestimonialInterval();
    }

    // Dot navigation
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTestimonialIndex = index;
            showTestimonial(currentTestimonialIndex);
            startTestimonialInterval(); // Reset interval on manual navigation
        });
    });

    // Pause on hover
    testimonialSlider.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
    testimonialSlider.addEventListener('mouseleave', () => startTestimonialInterval());
});

// New Timeline Animation
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the item is visible
    };

    const timelineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
});

// Universal include for header and footer
document.addEventListener('DOMContentLoaded', function() {
    const includes = document.querySelectorAll('[data-include]');
    includes.forEach(include => {
        const filePath = include.getAttribute('data-include');
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                include.innerHTML = data;
                // Re-run scripts after content is loaded, especially for header/footer
                if (filePath === 'components/header.html') {
                    // Re-initialize mobile menu and dropdowns for the new header content
                    const mobileToggle = document.querySelector('.mobile-toggle');
                    const mainNav = document.querySelector('.main-nav');
                    const dropdownLinks = document.querySelectorAll('.has-dropdown > a');

                    if (mobileToggle && mainNav) {
                        mobileToggle.addEventListener('click', () => {
                            mobileToggle.classList.toggle('active');
                            mainNav.classList.toggle('active');
                        });
                    }

                    dropdownLinks.forEach(link => {
                        const parent = link.parentElement;
                        link.addEventListener('click', (e) => {
                            if (window.innerWidth <= 992) {
                                e.preventDefault();
                                dropdownLinks.forEach(otherLink => {
                                    const otherParent = otherLink.parentElement;
                                    if (otherParent !== parent && otherParent.classList.contains('active')) {
                                        otherParent.classList.remove('active');
                                    }
                                });
                                parent.classList.toggle('active');
                            }
                        });
                    });

                    document.addEventListener('click', (e) => {
                        if (window.innerWidth <= 992 && mainNav && mainNav.classList.contains('active')) {
                            if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
                                mainNav.classList.remove('active');
                                mobileToggle.classList.remove('active');
                                dropdownLinks.forEach(link => {
                                    link.parentElement.classList.remove('active');
                                });
                            }
                        }
                    });

                    let resizeTimeout;
                    window.addEventListener('resize', () => {
                        clearTimeout(resizeTimeout);
                        resizeTimeout = setTimeout(() => {
                            if (window.innerWidth > 992) {
                                if (mainNav && mainNav.classList.contains('active')) {
                                    mainNav.classList.remove('active');
                                }
                                if (mobileToggle && mobileToggle.classList.contains('active')) {
                                    mobileToggle.classList.remove('active');
                                }
                                dropdownLinks.forEach(link => {
                                    link.parentElement.classList.remove('active');
                                });
                            }
                        }, 250);
                    });
                }
                // Dispatch a custom event to notify that content has changed
                document.dispatchEvent(new Event('contentChanged'));
            })
            .catch(error => console.error('Error loading include file:', filePath, error));
    });
});

// Cookie Consent
document.addEventListener('DOMContentLoaded', function() {
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptCookies = document.getElementById('accept-cookies');

    if (cookieConsent && acceptCookies) {
        // Check if cookie consent has been given
        if (!localStorage.getItem('cookieConsentGiven')) {
            cookieConsent.style.display = 'block';
        }

        acceptCookies.addEventListener('click', function() {
            localStorage.setItem('cookieConsentGiven', 'true');
            cookieConsent.style.display = 'none';
        });
    }
});

// Back to Top Button
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Contact Form Submission (if applicable)
// Assuming you have a contact form with id 'contact-form'
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission

        const formData = new FormData(contactForm);
        const formProps = Object.fromEntries(formData);

        // Example: Send data to a server using fetch API
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formProps),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Your message has been sent successfully!');
            contactForm.reset(); // Clear the form
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('There was an error sending your message. Please try again later.');
        });
    });
}

// Form Input Animation
document.querySelectorAll('.input-group input, .input-group textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// Header Scroll Effect
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    if (header) { // Ensure header exists before adding event listener
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                header.classList.remove('scroll-up');
                return;
            }
            
            if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
                // Scroll Down
                header.classList.remove('scroll-up');
                header.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
                // Scroll Up
                header.classList.remove('scroll-down');
                header.classList.add('scroll-up');
            }
            
            lastScroll = currentScroll;
        });
    }
});

// Initialize FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Initialize Resource Tabs
function initResourceTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.resources-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show related tab content
            const targetId = button.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // Activate first tab by default if it exists
    if (tabButtons.length > 0 && !document.querySelector('.tab-button.active')) {
        tabButtons[0].click();
    }
}

// Remove pricing sections from DOM
function removePricingSections() {
    // Target pricing sections directly
    const pricingSections = document.querySelectorAll('.pricing-section, .pricing');
    pricingSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Find any section that contains pricing cards
    document.querySelectorAll('section').forEach(section => {
        if (section.querySelector('.pricing-card, .price')) {
            section.style.display = 'none';
        }
    });
}

// Animate on scroll functionality
function initAnimateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Call all initializations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initBannerSlider();
    initCountdown();
    initFAQ();
    initResourceTabs();
    removePricingSections();
    initAnimateOnScroll();

    // Initialize testimonial slider if it exists
    // The testimonial slider logic is already wrapped in a DOMContentLoaded listener,
    // so no explicit call is needed here.
}); 

// Lazy Load Images for Performance
document.addEventListener('DOMContentLoaded', () => {
    // Check if IntersectionObserver is available in the browser
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '50px 0px' });
        
        // Target all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
});

// Performance Optimization: Throttle Scroll and Resize Events
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Your scroll handling code here
    const animateElements = document.querySelectorAll('.animate-on-scroll:not(.visible)');
    if (!animateElements.length) return;
    
    animateElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        if (rect.top <= windowHeight * 0.8) {
            element.classList.add('visible');
        }
    });
}, 100); // 100ms throttle

window.addEventListener('scroll', throttledScrollHandler);

// Apply throttling to resize events
const throttledResizeHandler = throttle(() => {
    // Your resize handling code here
}, 200); // 200ms throttle

window.addEventListener('resize', throttledResizeHandler);

// Active link highlighting
const currentLocation = location.pathname;
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    if (link.getAttribute('href') === currentLocation) {
        link.classList.add('active');
    }
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form validation
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        if (isValid) {
            // Here you would typically send the form data to your server
            console.log('Form submitted successfully');
            form.reset();
        }
    });
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');
    const dropdowns = document.querySelectorAll('.has-dropdown');
    
    // Toggle mobile menu
    mobileToggle?.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
    });

    // Handle dropdowns on mobile
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('active');
                    }
                });
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.has-dropdown') && !e.target.closest('.mobile-toggle')) {
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            if (window.innerWidth <= 992) {
                mobileToggle?.classList.remove('active');
                mainNav?.classList.remove('active');
            }
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 992) {
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
                mobileToggle?.classList.remove('active');
                mainNav?.classList.remove('active');
            }
        }, 250);
    });
});

// Performance optimized main script
(function() {
    "use strict";

    // Performance monitoring
    const performance = {
        startTime: Date.now(),
        metrics: {},
        
        start: function(label) {
            this.metrics[label] = { startTime: Date.now() };
        },
        
        end: function(label) {
            if (this.metrics[label]) {
                this.metrics[label].endTime = Date.now();
                this.metrics[label].duration = this.metrics[label].endTime - this.metrics[label].startTime;
                console.log(`${label}: ${this.metrics[label].duration}ms`);
            }
        },
        
        measure: function(label, callback) {
            this.start(label);
            callback();
            this.end(label);
        }
    };

    // Preloader functionality
    const preloader = {
        init: function() {
            // Create preloader if it doesn't exist
            if (!document.querySelector('.preloader')) {
                const preloaderElement = document.createElement('div');
                preloaderElement.className = 'preloader';
                preloaderElement.innerHTML = '<div class="preloader-spinner"></div>';
                document.body.appendChild(preloaderElement);
            }
            
            // Cache elements
            this.preloaderElement = document.querySelector('.preloader');
            
            // Hide preloader when page is loaded
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.hide();
                }, 500);
            });
        },
        
        hide: function() {
            this.preloaderElement.classList.add('hidden');
            setTimeout(() => {
                this.preloaderElement.style.display = 'none';
            }, 500);
        }
    };

    // Resource loader
    const resourceLoader = {
        loadedScripts: {},
        loadedStylesheets: {},
        
        loadScript: function(url, async = true, defer = false) {
            return new Promise((resolve, reject) => {
                if (this.loadedScripts[url]) {
                    resolve();
                    return;
                }
                
                const script = document.createElement('script');
                script.src = url;
                script.async = async;
                script.defer = defer;
                
                script.onload = () => {
                    this.loadedScripts[url] = true;
                    resolve();
                };
                
                script.onerror = () => {
                    reject(new Error(`Failed to load script: ${url}`));
                };
                
                document.head.appendChild(script);
            });
        },
        
        loadStylesheet: function(url) {
            return new Promise((resolve, reject) => {
                if (this.loadedStylesheets[url]) {
                    resolve();
                    return;
                }
                
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = url;
                
                link.onload = () => {
                    this.loadedStylesheets[url] = true;
                    resolve();
                };
                
                link.onerror = () => {
                    reject(new Error(`Failed to load stylesheet: ${url}`));
                };
                
                document.head.appendChild(link);
            });
        }
    };

    // Enhanced Image optimizer
    const imageOptimizer = {
        observer: null,
        observedImages: new Set(),
        
        init: function() {
            // Use Intersection Observer API for lazy loading
            this.observer = new IntersectionObserver(this.onIntersection.bind(this), {
                root: null,
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            this.setupImages();
            
            // Re-check for images on dynamic content changes
            const mutationObserver = new MutationObserver(this.setupImages.bind(this));
            mutationObserver.observe(document.body, { 
                childList: true, 
                subtree: true 
            });
        },
        
        setupImages: function() {
            // Find all images with data-src attribute that aren't already being observed
            const images = document.querySelectorAll('img[data-src]:not(.lazy-loaded)');
            
            images.forEach(img => {
                if (!this.observedImages.has(img)) {
                    // Create placeholder if it doesn't exist
                    if (!img.parentNode.classList.contains('image-placeholder')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'image-placeholder';
                        img.parentNode.insertBefore(placeholder, img);
                        placeholder.appendChild(img);
                    }
                    
                    // Add lazy-image class
                    img.classList.add('lazy-image');
                    
                    // Observe the image
                    this.observer.observe(img);
                    this.observedImages.add(img);
                }
            });
            
            // Set up videos as well
            this.setupVideos();
        },
        
        setupVideos: function() {
            // Find all videos with data-src attribute
            const videos = document.querySelectorAll('video[data-src]:not(.lazy-loaded)');
            
            videos.forEach(video => {
                if (!this.observedImages.has(video)) {
                    // Create placeholder if it doesn't exist
                    if (!video.parentNode.classList.contains('video-placeholder')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'video-placeholder';
                        video.parentNode.insertBefore(placeholder, video);
                        placeholder.appendChild(video);
                    }
                    
                    // Add lazy-video class
                    video.classList.add('lazy-video');
                    
                    // Observe the video
                    this.observer.observe(video);
                    this.observedImages.add(video);
                    
                    // Add play/pause optimization
                    this.optimizeVideoPlayback(video);
                }
            });
        },
        
        optimizeVideoPlayback: function(video) {
            // Pause video when not visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (video.paused && video.dataset.autoplay !== 'false') {
                            video.play().catch(e => console.log('Video play error:', e));
                        }
                    } else {
                        if (!video.paused) {
                            video.pause();
                        }
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(video);
        },
        
        onIntersection: function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadMedia(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        },
        
        loadMedia: function(element) {
            const src = element.getAttribute('data-src');
            const srcset = element.getAttribute('data-srcset');
            const sizes = element.getAttribute('data-sizes');
            
            if (element.tagName.toLowerCase() === 'img') {
                if (src) element.src = src;
                if (srcset) element.srcset = srcset;
                if (sizes) element.sizes = sizes;
                
                element.onload = () => {
                    element.classList.add('loaded');
                    element.classList.add('lazy-loaded');
                    
                    // Remove placeholder after image is loaded
                    setTimeout(() => {
                        if (element.parentNode && element.parentNode.classList.contains('image-placeholder')) {
                            const parent = element.parentNode.parentNode;
                            if (parent && element.parentNode) { // Add null check for element.parentNode
                                parent.appendChild(element);
                                element.parentNode.removeChild(element.parentNode);
                            }
                        }
                    }, 500);
                };
            } else if (element.tagName.toLowerCase() === 'video') {
                if (src) {
                    // Handle source elements within video
                    const sources = element.querySelectorAll('source');
                    if (sources.length) {
                        sources.forEach(source => {
                            source.src = source.getAttribute('data-src');
                        });
                    } else {
                        element.src = src;
                    }
                    
                    element.load();
                    element.classList.add('loaded');
                    element.classList.add('lazy-loaded');
                    
                    if (element.dataset.autoplay !== 'false' && element.getBoundingClientRect().top < window.innerHeight) {
                        element.play().catch(e => console.log('Video play error:', e));
                    }
                }
            }
        }
    };

    // Form handling
    const formHandler = {
        forms: null,
        
        init: function() {
            this.forms = document.querySelectorAll('form');
            
            this.forms.forEach(form => {
                form.addEventListener('submit', this.handleSubmit.bind(this));
            });
        },
        
        handleSubmit: function(e) {
            e.preventDefault();
            
            const form = e.target;
            const submitBtn = form.querySelector('[type="submit"]');
            
            // Prevent multiple submissions
            if (submitBtn.disabled) return;
            
            // Disable submit button and show loading state
            submitBtn.disabled = true;
            submitBtn.dataset.originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Submitting...';
            
            // Simulate form submission (replace with actual form submission logic)
            setTimeout(() => {
                this.showMessage(form, 'Form submitted successfully!', 'success');
                
                // Reset form
                form.reset();
                
                // Reset submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = submitBtn.dataset.originalText;
            }, 1000);
        },
        
        showMessage: function(form, message, type) {
            // Create message element if it doesn't exist
            let messageElement = form.querySelector('.form-message');
            
            if (!messageElement) {
                messageElement = document.createElement('div');
                messageElement.className = 'form-message';
                form.appendChild(messageElement);
            }
            
            // Set message content and style
            messageElement.textContent = message;
            messageElement.className = `form-message form-message-${type}`;
            
            // Automatically hide message after a few seconds
            setTimeout(() => {
                messageElement.style.opacity = '0';
                setTimeout(() => {
                    messageElement.remove();
                }, 300);
            }, 5000);
        }
    };

    // Navigation enhancement
    const navigation = {
        init: function() {
            this.setupMobileMenu();
            this.setupSmoothScroll();
            this.setupLinkPrefetching();
            this.setupDropdownAccessibility();
        },
        
        setupMobileMenu: function() {
            const mobileToggle = document.querySelector('.mobile-toggle');
            const mainNav = document.querySelector('.main-nav');
            
            if (mobileToggle && mainNav) {
                mobileToggle.addEventListener('click', function() {
                    mobileToggle.classList.toggle('active');
                    mainNav.classList.toggle('active');
                    document.body.classList.toggle('nav-open');
                });
                
                // Close menu when clicking outside
                document.addEventListener('click', function(e) {
                    if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target) && mainNav.classList.contains('active')) {
                        mobileToggle.classList.remove('active');
                        mainNav.classList.remove('active');
                        document.body.classList.remove('nav-open');
                    }
                });
            }
        },
        
        setupSmoothScroll: function() {
            // Smooth scroll for anchor links
            document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const target = document.querySelector(this.getAttribute('href'));
                    
                    if (target) {
                        e.preventDefault();
                        
                        window.scrollTo({
                            top: target.offsetTop - 80, // Account for fixed header
                            behavior: 'smooth'
                        });
                        
                        // Update URL without scrolling
                        history.pushState(null, null, this.getAttribute('href'));
                    }
                });
            });
        },
        
        setupLinkPrefetching: function() {
            // Prefetch pages on hover to improve perceived performance
            document.querySelectorAll('a:not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])').forEach(link => {
                let prefetched = false;
                
                link.addEventListener('mouseenter', function() {
                    if (!prefetched && this.href && this.href.startsWith(window.location.origin)) {
                        const prefetchLink = document.createElement('link');
                        prefetchLink.rel = 'prefetch';
                        prefetchLink.href = this.href;
                        document.head.appendChild(prefetchLink);
                        prefetched = true;
                    }
                });
            });
        },
        
        setupDropdownAccessibility: function() {
            const dropdowns = document.querySelectorAll('.has-dropdown');
            
            dropdowns.forEach(dropdown => {
                const link = dropdown.querySelector('a');
                const menu = dropdown.querySelector('.dropdown-menu');
                
                if (link && menu) {
                    // Make dropdown accessible via keyboard
                    link.addEventListener('keydown', function(e) {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            dropdown.classList.toggle('active');
                        }
                    });
                    
                    // Close dropdown when clicking outside
                    document.addEventListener('click', function(e) {
                        if (!dropdown.contains(e.target)) {
                            dropdown.classList.remove('active');
                        }
                    });
                }
            });
        }
    };

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        performance.start('init');
        
        // Initialize preloader
        preloader.init();
        
        // Initialize components
        imageOptimizer.init();
        formHandler.init();
        navigation.init();
        
        performance.end('init');
        
        // Log total page load time
        window.addEventListener('load', function() {
            const totalLoadTime = Date.now() - performance.startTime;
            console.log(`Total page load time: ${totalLoadTime}ms`);
        });
    });

    // Handle errors
    window.addEventListener('error', function(e) {
        console.error('Unhandled error:', e.error || e.message);
    });

    // Clean up before unloading page
    window.addEventListener('beforeunload', function() {
        // Any cleanup needed
    });
})();