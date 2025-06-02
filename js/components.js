// Performance optimized components
(function() {
    'use strict';

    // Component loader with caching
    const componentLoader = {
        cache: new Map(),
        
        async loadComponent(path) {
            if (this.cache.has(path)) {
                return this.cache.get(path);
            }
            
            try {
                const response = await fetch(path);
                if (!response.ok) throw new Error(`Failed to load component: ${path}`);
                
                const html = await response.text();
                this.cache.set(path, html);
                return html;
            } catch (error) {
                console.error(`Error loading component ${path}:`, error);
                return '';
            }
        },
        
        async loadAllComponents() {
            const elements = document.querySelectorAll('[data-include]');
            const loadPromises = Array.from(elements).map(async (element) => {
                const path = element.getAttribute('data-include');
                if (!path) return;
                
                try {
                    const content = await this.loadComponent(path);
                    element.innerHTML = content;
                    
                    // Initialize navigation if this is a header
                    if (path.includes('header.html')) {
                        headerComponent.initializeNavigation(element);
                    }
                } catch (error) {
                    console.error('Error loading component:', error);
                    element.innerHTML = `<div class="error-message">Error loading component: ${path}</div>`;
                }
            });
            await Promise.all(loadPromises);
            document.dispatchEvent(new Event('componentsLoaded'));
        }
    };

    // Header component
    const headerComponent = {
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

    // Footer component (simplified as it doesn't have complex JS interaction)
    const footerComponent = {
        initializeSocialLinks(container) {
            const socialLinks = container.querySelectorAll('.social-links a');
            socialLinks.forEach(link => {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            });
        }
    };

    // Initialize components when DOM is ready
    document.addEventListener('DOMContentLoaded', async () => {
        performance.mark('componentsStart');
        
        try {
            await componentLoader.loadAllComponents();
            performance.mark('componentsEnd');
            performance.measure('componentsLoad', 'componentsStart', 'componentsEnd');
            
            console.log('Components loaded in:', 
                performance.getEntriesByName('componentsLoad')[0].duration, 'ms');
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
        });
        
        // Log completion for debugging
        console.log("Menu text wrapping fixed");
    }, 100);
}