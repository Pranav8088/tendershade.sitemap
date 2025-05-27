// Performance optimized components
(function() {
    'use strict';

    // Component loader with caching
    const componentLoader = {
        init() {
            this.loadAllComponents();
        },
        cache: new Map(),
        
        async loadComponent(name) {
            if (this.cache.has(name)) {
                return this.cache.get(name);
            }
            
            try {
                const response = await fetch(`components/${name}.html`);
                if (!response.ok) throw new Error(`Failed to load component: ${name}`);
                
                const html = await response.text();
                this.cache.set(name, html);
                return html;
            } catch (error) {
                console.error(`Error loading component ${name}:`, error);
                return '';
            }
        },
        
        async loadAllComponents() {
            const elements = document.querySelectorAll('[data-include]');
            elements.forEach(async (element) => {
                const path = element.getAttribute('data-include');
                if (!path) return;
                
                try {
                    const response = await fetch(path);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const content = await response.text();
                    element.innerHTML = content;
                    
                    // Initialize navigation if this is a header
                    if (path.includes('header.html')) {
                        headerComponent.initializeNavigation(element);
                    }
                } catch (error) {
                    console.error('Error loading component:', error);
                }
            });
        }
    };

    // Header component
    const headerComponent = {
        async init() {
            const html = await componentLoader.loadComponent('header');
            if (!html) return;
            
            const headerPlaceholders = document.querySelectorAll('div[data-include="components/header.html"]');
            headerPlaceholders.forEach(placeholder => {
                placeholder.innerHTML = html;
                this.initializeNavigation(placeholder);
            });
        },
        
        initializeNavigation(container) {
            const nav = container.querySelector('nav');
            const menuToggle = container.querySelector('.mobile-toggle');
            if (!nav || !menuToggle) return;

            // Mobile menu toggle logic
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                nav.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        }
    };

    // Footer component
    const footerComponent = {
        async init() {
            const html = await componentLoader.loadComponent('footer');
            if (!html) return;
            
            const footerPlaceholders = document.querySelectorAll('div[data-include="components/footer.html"]');
            footerPlaceholders.forEach(placeholder => {
                placeholder.innerHTML = html;
                this.initializeSocialLinks(placeholder);
            });
        },
        
        initializeSocialLinks(container) {
            const socialLinks = container.querySelectorAll('.social-links a');
            socialLinks.forEach(link => {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            });
        }
    };

    // Initialize components when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        componentLoader.init();
        performance.mark('componentsStart');
        
        try {
            Promise.all([
                headerComponent.init(),
                footerComponent.init()
            ]).then(() => {
                performance.mark('componentsEnd');
                performance.measure('componentsLoad', 'componentsStart', 'componentsEnd');
                
                console.log('Components loaded in:', 
                    performance.getEntriesByName('componentsLoad')[0].duration, 'ms');
            }).catch(error => {
                console.error('Error initializing components:', error);
            });
        } catch (error) {
            console.error('Error initializing components:', error);
        }
    });

    // Export components for potential reuse
    window.components = {
        header: headerComponent,
        footer: footerComponent,
        loader: componentLoader
    };
})();

// Component Loader
document.addEventListener('DOMContentLoaded', function() {
    // Load components with data-include attribute
    const includes = document.querySelectorAll('[data-include]');
    
    // Track loaded components
    let loadedComponents = 0;
    const totalComponents = includes.length;

    includes.forEach(function(element) {
        const file = element.getAttribute('data-include');
        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok for ${file}`);
                }
                return response.text();
            })
            .then(html => {
                element.innerHTML = html;
                loadedComponents++;
                
                // Check if all components are loaded
                if (loadedComponents === totalComponents) {
                    // Trigger components loaded event
                    document.dispatchEvent(new Event('componentsLoaded'));
                    
                    // Fix menu items text wrapping
                    fixMenuItemWrapping();
                }
            })
            .catch(error => {
                console.error('Error loading component:', error);
                element.innerHTML = `<div class="error-message">Error loading component: ${file}</div>`;
                loadedComponents++;
                
                // Even in case of error, we need to check if all components attempted loading
                if (loadedComponents === totalComponents) {
                    document.dispatchEvent(new Event('componentsLoaded'));
                }
            });
    });
});

// Fix menu items text wrapping by replacing spaces with non-breaking spaces
function fixMenuItemWrapping() {
    // Wait for the header to be available in the DOM
    setTimeout(() => {
        const navLinks = document.querySelectorAll('.nav-list > li > a');
        
        navLinks.forEach(link => {
            // Replace spaces with non-breaking spaces to prevent text wrapping within menu items
            if (link.innerText.includes(' ')) {
                const originalText = link.innerText;
                const nonBreakingText = originalText.replace(/ /g, '\u00A0');
                link.innerText = nonBreakingText;
            }
            
            // Add data attribute to store original width for debugging
            link.setAttribute('data-original-width', link.offsetWidth + 'px');
        });
        
        // Log completion for debugging
        console.log("Menu text wrapping fixed");
    }, 100);
} 