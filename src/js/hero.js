/**
 * Sasha Khan — Hero Section Controller
 * Interactive video hover behavior for diagonal triangle layout
 */

class HeroVideoController {
  constructor() {
    this.videoSections = document.querySelectorAll('.hero-triangle--video');
    this.allSections = document.querySelectorAll('.hero-triangle');
    this.logo = document.querySelector('.hero-logo');
    this.isTouch = this.detectTouchDevice();

    this.init();
  }

  /**
   * Detect if device supports touch
   */
  detectTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  /**
   * Initialize event listeners
   */
  init() {
    // Map link areas to their corresponding triangles
    this.linkMapping = {
      'hero-links__area--top': '.hero-triangle--top',
      'hero-links__area--left': '.hero-triangle--left',
      'hero-links__area--right': '.hero-triangle--right'
    };

    // Set up video sections
    this.videoSections.forEach(section => {
      const video = section.querySelector('video');

      if (!video) return;

      // Ensure video is paused and ready
      video.pause();
      video.currentTime = 0;

      // Set up seamless looping
      this.setupSeamlessLoop(video);
    });

    // Set up hover behavior on the link overlay areas
    const linkAreas = document.querySelectorAll('.hero-links__area');

    linkAreas.forEach(linkArea => {
      // Find corresponding triangle
      const triangleClass = Object.entries(this.linkMapping)
        .find(([linkClass]) => linkArea.classList.contains(linkClass))?.[1];

      if (!triangleClass) return;

      const section = document.querySelector(triangleClass);
      const video = section?.querySelector('video');

      if (!section || !video) return;

      // Always add hover behavior (works on desktop and hybrid devices)
      linkArea.addEventListener('mouseenter', () => this.onHover(section, video));
      linkArea.addEventListener('mouseleave', () => this.onLeave(section, video));
    });

    // Set up hover behavior for bottom triangle (Collections - no video, just dimming)
    const bottomTriangle = document.querySelector('.hero-triangle--bottom');
    if (bottomTriangle) {
      bottomTriangle.addEventListener('mouseenter', () => this.onHoverStatic(bottomTriangle));
      bottomTriangle.addEventListener('mouseleave', () => this.onLeaveStatic(bottomTriangle));
    }

    // Setup title parallax effect
    this.setupTitleParallax();

    // Handle keyboard accessibility
    this.setupKeyboardNavigation();

    // Handle reduced motion preference
    this.handleReducedMotion();
  }

  /**
   * Setup video - H.265 handles seamless looping natively
   */
  setupSeamlessLoop(video) {
    // H.265 with native loop attribute handles this seamlessly
    // Just ensure preload is set
    video.preload = 'auto';
  }

  /**
   * Handle hover on desktop - play video and dim others
   */
  onHover(activeSection, video) {
    // Play the hovered video (continues from current position)
    video.play().catch(err => {
      // Handle autoplay restrictions gracefully
      console.log('Video autoplay prevented:', err);
    });

    // Dim all OTHER sections (including logo area effect)
    this.allSections.forEach(section => {
      if (section !== activeSection) {
        section.classList.add('is-dimmed');
      }
    });

    // Mark active section
    activeSection.classList.add('is-active');

    // Subtle logo dim effect
    if (this.logo) {
      this.logo.classList.add('is-dimmed');
    }
  }

  /**
   * Handle mouse leave - pause video at current position
   */
  onLeave(activeSection, video) {
    // Pause video at current frame (does NOT reset)
    video.pause();

    // Remove dimming from all sections
    this.allSections.forEach(section => {
      section.classList.remove('is-dimmed');
    });

    // Remove active state
    activeSection.classList.remove('is-active');

    // Remove logo dim
    if (this.logo) {
      this.logo.classList.remove('is-dimmed');
    }
  }

  /**
   * Handle hover on static section (no video) - just dim others
   */
  onHoverStatic(activeSection) {
    // Dim all OTHER sections
    this.allSections.forEach(section => {
      if (section !== activeSection) {
        section.classList.add('is-dimmed');
      }
    });

    // Mark active section
    activeSection.classList.add('is-active');

    // Subtle logo dim effect
    if (this.logo) {
      this.logo.classList.add('is-dimmed');
    }
  }

  /**
   * Handle mouse leave on static section - remove dimming
   */
  onLeaveStatic(activeSection) {
    // Remove dimming from all sections
    this.allSections.forEach(section => {
      section.classList.remove('is-dimmed');
    });

    // Remove active state
    activeSection.classList.remove('is-active');

    // Remove logo dim
    if (this.logo) {
      this.logo.classList.remove('is-dimmed');
    }
  }

  /**
   * Setup parallax effect on triangle titles
   */
  setupTitleParallax() {
    const parallaxIntensity = 0.03; // Subtle movement

    // Map for link areas to triangles
    const linkToTriangle = {
      'hero-links__area--top': '.hero-triangle--top',
      'hero-links__area--left': '.hero-triangle--left',
      'hero-links__area--right': '.hero-triangle--right'
    };

    // Setup parallax for link areas (Freedom, Elite, Glamour)
    const linkAreas = document.querySelectorAll('.hero-links__area');
    linkAreas.forEach(linkArea => {
      const triangleClass = Object.entries(linkToTriangle)
        .find(([linkClass]) => linkArea.classList.contains(linkClass))?.[1];

      if (!triangleClass) return;

      const triangle = document.querySelector(triangleClass);
      const title = triangle?.querySelector('.hero-triangle__title');

      if (!title) return;

      linkArea.addEventListener('mousemove', (e) => {
        const rect = linkArea.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * parallaxIntensity;
        const deltaY = (e.clientY - centerY) * parallaxIntensity;

        requestAnimationFrame(() => {
          title.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
      });

      linkArea.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
          title.style.transform = 'translate(0, 0)';
        });
      });
    });

    // Setup parallax for bottom triangle (Collections)
    const bottomTriangle = document.querySelector('.hero-triangle--bottom');
    const bottomTitle = bottomTriangle?.querySelector('.hero-triangle__title');

    if (bottomTriangle && bottomTitle) {
      bottomTriangle.addEventListener('mousemove', (e) => {
        const rect = bottomTriangle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * parallaxIntensity;
        const deltaY = (e.clientY - centerY) * parallaxIntensity;

        requestAnimationFrame(() => {
          bottomTitle.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
      });

      bottomTriangle.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
          bottomTitle.style.transform = 'translate(0, 0)';
        });
      });
    }
  }

  /**
   * Setup keyboard navigation for accessibility
   */
  setupKeyboardNavigation() {
    this.videoSections.forEach((section, index) => {
      const video = section.querySelector('video');

      // Make sections focusable
      section.setAttribute('tabindex', '0');
      section.setAttribute('role', 'button');
      section.setAttribute('aria-label', `Play video ${index + 1}`);

      section.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();

          if (video.paused) {
            this.onHover(section, video);
          } else {
            this.onLeave(section, video);
          }
        }
      });

      section.addEventListener('focus', () => {
        if (video) {
          this.onHover(section, video);
        }
      });

      section.addEventListener('blur', () => {
        if (video) {
          this.onLeave(section, video);
        }
      });
    });
  }

  /**
   * Handle prefers-reduced-motion
   */
  handleReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleMotionPreference = (e) => {
      if (e.matches) {
        // Reduced motion - pause all videos
        this.videoSections.forEach(section => {
          const video = section.querySelector('video');
          if (video) {
            video.pause();
            video.currentTime = 0;
          }
        });
      }
    };

    mediaQuery.addEventListener('change', handleMotionPreference);
    handleMotionPreference(mediaQuery);
  }
}

/**
 * Logo Parallax Effect (subtle)
 */
class LogoParallax {
  constructor() {
    this.logo = document.querySelector('.hero-logo__image');
    this.intensity = 0.02; // Subtle movement

    if (this.logo && !this.prefersReducedMotion()) {
      this.init();
    }
  }

  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  init() {
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  onMouseMove(e) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const deltaX = (e.clientX - centerX) * this.intensity;
    const deltaY = (e.clientY - centerY) * this.intensity;

    requestAnimationFrame(() => {
      this.logo.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });
  }
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize video controller
  new HeroVideoController();

  // Initialize logo parallax
  new LogoParallax();

  // Add loaded class for animations
  document.body.classList.add('is-loaded');
});

/**
 * Handle page visibility - pause videos when tab is hidden
 */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.querySelectorAll('.hero-triangle--video video').forEach(video => {
      video.pause();
    });
  }
});
