// Lazy Loading Utility
class LazyLoader {
    constructor(options = {}) {
        this.options = {
            rootMargin: '50px 0px',
            threshold: 0.1,
            ...options
        };
        
        this.observer = null;
        this.init();
    }

    init() {
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.options);
            this.observe();
        } else {
            this.loadAllImages(); // Fallback for older browsers
        }
    }

    handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }

    loadImage(imageElement) {
        const src = imageElement.dataset.src;
        const srcset = imageElement.dataset.srcset;

        if (src) {
            imageElement.src = src;
        }

        if (srcset) {
            imageElement.srcset = srcset;
        }

        imageElement.classList.add('loaded');
        
        // Remove placeholder once image is loaded
        imageElement.addEventListener('load', () => {
            const placeholder = imageElement.closest('.image-placeholder');
            if (placeholder) {
                placeholder.classList.remove('image-placeholder');
            }
        });
    }

    observe() {
        const images = document.querySelectorAll('img[data-src], img[data-srcset]');
        
        images.forEach(img => {
            // Add placeholder and lazy-image class
            if (!img.closest('.image-placeholder')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'image-placeholder';
                img.parentNode.insertBefore(wrapper, img);
                wrapper.appendChild(img);
            }
            
            img.classList.add('lazy-image');
            this.observer.observe(img);
        });
    }

    loadAllImages() {
        const images = document.querySelectorAll('img[data-src], img[data-srcset]');
        images.forEach(img => this.loadImage(img));
    }

    refresh() {
        this.observe();
    }
}

// Initialize lazy loading when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const lazyLoader = new LazyLoader();

    // Refresh lazy loading after dynamic content updates
    document.addEventListener('contentChanged', () => {
        lazyLoader.refresh();
    });
}); 