/**
 * Sasha Khan — Main JavaScript
 * Global utilities and initialization
 */

/**
 * Debounce utility function
 */
function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle utility function
 */
function throttle(func, limit = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(element) {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

/**
 * Preload critical assets
 */
function preloadAssets() {
  // Preload logo
  const logo = new Image();
  logo.src = 'assets/logo/sasha-khan-logo.png';

  // Preload hero background image
  const heroImage = new Image();
  heroImage.src = 'assets/images/hero-section/lux-bag-1-hero-section.png';
}

/**
 * Handle viewport height for mobile browsers
 * Fixes the 100vh issue on mobile Safari
 */
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/**
 * Initialize global event listeners
 */
function initGlobalEvents() {
  // Handle viewport resize
  window.addEventListener('resize', debounce(setViewportHeight, 100));

  // Initial viewport height set
  setViewportHeight();

  // Handle orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(setViewportHeight, 100);
  });
}

/**
 * Performance monitoring (development only)
 */
function logPerformance() {
  if (process.env.NODE_ENV === 'development') {
    window.addEventListener('load', () => {
      const timing = performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      console.log(`Page load time: ${loadTime}ms`);
    });
  }
}

/**
 * Tablet Menu Controller
 * Handles menu button and tablet navigation for tablet viewports (991px - 1200px)
 */
class TabletMenuController {
  constructor() {
    this.menuButton = document.querySelector('.menu-button');
    this.tabletNav = document.querySelector('.tablet-nav');
    this.bottomTriangle = document.querySelector('.hero-triangle--bottom');
    this.submenuItems = document.querySelectorAll('.tablet-nav__item--has-submenu');

    if (this.menuButton && this.tabletNav) {
      this.init();
    }
  }

  isTabletViewport() {
    return window.innerWidth >= 991 && window.innerWidth <= 1200;
  }

  init() {
    // Menu button click
    this.menuButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMenu();
    });

    // Bottom triangle tap triggers menu (tablet landscape only)
    if (this.bottomTriangle) {
      this.bottomTriangle.addEventListener('click', (e) => {
        if (this.isTabletViewport()) {
          e.preventDefault();
          e.stopPropagation();
          this.toggleMenu();
        }
      });
    }

    // Submenu toggle
    this.submenuItems.forEach(item => {
      const label = item.querySelector('.tablet-nav__label');
      if (label) {
        label.addEventListener('click', (e) => {
          e.preventDefault();
          item.classList.toggle('is-expanded');
        });
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.tabletNav.classList.contains('is-open')) {
        if (!this.tabletNav.contains(e.target) &&
            !this.menuButton.contains(e.target) &&
            !this.bottomTriangle?.contains(e.target)) {
          this.closeMenu();
        }
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.tabletNav.classList.contains('is-open')) {
        this.closeMenu();
      }
    });

    // Handle LUX/ODE navigation links
    const scrollLinks = this.tabletNav.querySelectorAll('[data-scroll-target]');
    scrollLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-scroll-target');
        this.closeMenu();
        // Trigger the same navigation as the original collections menu
        if (window.setupLuxOdeNavigation) {
          const bagsSection = document.querySelector('.bags-intro');
          if (bagsSection) {
            const sectionTop = bagsSection.offsetTop;
            const sectionHeight = bagsSection.offsetHeight;
            const viewportHeight = window.innerHeight;
            const scrollRange = sectionHeight - viewportHeight;

            let targetProgress = target === 'lux' ? 0.25 : 0.80;
            const scrollPosition = sectionTop + (scrollRange * targetProgress);

            window.scrollTo({
              top: scrollPosition,
              behavior: 'instant'
            });
          }
        }
      });
    });
  }

  toggleMenu() {
    const isOpen = this.tabletNav.classList.contains('is-open');
    if (isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.tabletNav.classList.add('is-open');
    this.menuButton.classList.add('is-active');
    this.menuButton.setAttribute('aria-expanded', 'true');
  }

  closeMenu() {
    this.tabletNav.classList.remove('is-open');
    this.menuButton.classList.remove('is-active');
    this.menuButton.setAttribute('aria-expanded', 'false');
    // Collapse all submenus
    this.submenuItems.forEach(item => item.classList.remove('is-expanded'));
  }
}

/**
 * Main initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  // Preload critical assets
  preloadAssets();

  // Initialize global events
  initGlobalEvents();

  // Initialize tablet menu controller
  new TabletMenuController();

  // Add page loaded indicator
  window.addEventListener('load', () => {
    document.body.classList.add('page-loaded');
  });
});

// Export utilities for potential use in other modules
window.SashaKhanUtils = {
  debounce,
  throttle,
  isInViewport,
  smoothScrollTo,
};
