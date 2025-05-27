// Cookie Management Utility
const CookieManager = {
    // Set a cookie with optional expiry days and path
    set: function(name, value, days = 365, path = '/') {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=${path}`;
    },

    // Get a cookie value by name
    get: function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    // Delete a cookie
    delete: function(name, path = '/') {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=${path}`;
    },

    // Check if a cookie exists
    exists: function(name) {
        return this.get(name) !== null;
    },

    // Set cookie consent
    setConsent: function(accepted = true) {
        this.set('cookie_consent', accepted ? 'accepted' : 'declined');
        if (!accepted) {
            // Clear non-essential cookies if consent is declined
            const essentialCookies = ['cookie_consent'];
            const allCookies = document.cookie.split(';');
            
            allCookies.forEach(cookie => {
                const cookieName = cookie.split('=')[0].trim();
                if (!essentialCookies.includes(cookieName)) {
                    this.delete(cookieName);
                }
            });
        }
    },

    // Check if cookie consent is given
    hasConsent: function() {
        return this.get('cookie_consent') === 'accepted';
    }
};

// Cookie Consent Banner
function showCookieConsentBanner() {
    if (!CookieManager.exists('cookie_consent')) {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
                <div class="cookie-buttons">
                    <button class="btn btn-primary accept-cookies">Accept</button>
                    <button class="btn btn-secondary decline-cookies">Decline</button>
                    <a href="privacy.html" class="cookie-policy">Learn More</a>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Handle accept button click
        banner.querySelector('.accept-cookies').addEventListener('click', () => {
            CookieManager.setConsent(true);
            banner.remove();
        });

        // Handle decline button click
        banner.querySelector('.decline-cookies').addEventListener('click', () => {
            CookieManager.setConsent(false);
            banner.remove();
        });
    }
}

// Initialize cookie consent banner when DOM is loaded
document.addEventListener('DOMContentLoaded', showCookieConsentBanner); 