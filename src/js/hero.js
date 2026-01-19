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
   * Check if viewport is in tablet range (991px - 1200px)
   */
  isTabletViewport() {
    return window.innerWidth >= 991 && window.innerWidth <= 1200;
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

      // Only add hover behavior on desktop (not touch AND not tablet viewport)
      const shouldAddHover = !this.isTouch && !this.isTabletViewport();
      if (shouldAddHover) {
        linkArea.addEventListener('mouseenter', () => this.onHover(section, video));
        linkArea.addEventListener('mouseleave', () => this.onLeave(section, video));
      }
    });

    // Set up hover behavior for bottom triangle (Collections - no video, just dimming)
    // Only on desktop (not touch AND not tablet viewport)
    const bottomTriangle = document.querySelector('.hero-triangle--bottom');
    const shouldAddBottomHover = !this.isTouch && !this.isTabletViewport();
    if (bottomTriangle && shouldAddBottomHover) {
      bottomTriangle.addEventListener('mouseenter', () => this.onHoverStatic(bottomTriangle));
      bottomTriangle.addEventListener('mouseleave', () => this.onLeaveStatic(bottomTriangle));
    }

    // Setup title parallax effect (desktop only)
    if (!this.isTouch && !this.isTabletViewport()) {
      this.setupTitleParallax();
    }

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
   * Setup keyboard navigation for accessibility (desktop only)
   */
  setupKeyboardNavigation() {
    // Skip keyboard navigation on tablet to prevent focus-triggered hover states
    if (this.isTouch || this.isTabletViewport()) {
      return;
    }

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
 * DISABLED on tablet to prevent layout issues
 */
class LogoParallax {
  constructor() {
    this.logo = document.querySelector('.hero-logo__image');
    this.intensity = 0.02; // Subtle movement

    // Skip on tablet viewport (991-1200px) - touch check removed to preserve desktop functionality
    if (this.logo && !this.prefersReducedMotion() && !this.isTabletViewport()) {
      this.init();
    }
  }

  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  isTabletViewport() {
    return window.innerWidth >= 991 && window.innerWidth <= 1200;
  }

  init() {
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  onMouseMove(e) {
    // Double-check we're not on tablet (in case of resize)
    if (this.isTabletViewport()) return;

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
 * Tablet Landscape Sequence Controller
 * Plays videos in sequence: Freedom → Elite → Glamour → Collections (5s) → Loop
 * Only active in tablet landscape viewport (991px - 1200px)
 */
class TabletSequenceController {
  constructor() {
    this.isRunning = false;
    this.currentIndex = 0;
    this.collectionsDisplayTime = 5000; // 5 seconds for Collections image
    this.sequenceTimer = null;

    // Define the sequence order
    this.sequence = [
      { selector: '.hero-triangle--top', type: 'video' },      // Freedom
      { selector: '.hero-triangle--left', type: 'video' },     // Elite
      { selector: '.hero-triangle--right', type: 'video' },    // Glamour
      { selector: '.hero-triangle--bottom', type: 'image' }    // Collections
    ];

    this.triangles = document.querySelectorAll('.hero-triangle');
    this.init();
  }

  /**
   * Check if viewport is in tablet landscape range (991px - 1200px)
   */
  isTabletViewport() {
    return window.innerWidth >= 991 && window.innerWidth <= 1200;
  }

  /**
   * Initialize the controller
   */
  init() {
    // Start sequence if in tablet viewport
    if (this.isTabletViewport()) {
      this.startSequence();
    }

    // Handle viewport resize
    window.addEventListener('resize', () => this.handleResize());

    // Handle page visibility
    document.addEventListener('visibilitychange', () => this.handleVisibility());
  }

  /**
   * Handle viewport resize
   */
  handleResize() {
    if (this.isTabletViewport() && !this.isRunning) {
      this.startSequence();
    } else if (!this.isTabletViewport() && this.isRunning) {
      this.stopSequence();
    }
  }

  /**
   * Handle page visibility changes
   */
  handleVisibility() {
    if (!this.isTabletViewport()) return;

    if (document.hidden) {
      this.pauseSequence();
    } else {
      this.resumeSequence();
    }
  }

  /**
   * Start the sequence
   */
  startSequence() {
    if (this.isRunning) return;

    this.isRunning = true;
    document.body.classList.add('tablet-sequence-active');

    // Reset all videos to first frame
    this.resetAllVideos();

    // Start with the first item (Freedom)
    this.currentIndex = 0;
    this.playCurrentItem();
  }

  /**
   * Stop the sequence
   */
  stopSequence() {
    this.isRunning = false;
    document.body.classList.remove('tablet-sequence-active');

    // Clear any pending timers
    if (this.sequenceTimer) {
      clearTimeout(this.sequenceTimer);
      this.sequenceTimer = null;
    }

    // Remove all states
    this.triangles.forEach(triangle => {
      triangle.classList.remove('is-active', 'is-dimmed');
    });

    // Pause all videos
    this.pauseAllVideos();
  }

  /**
   * Pause the sequence (when tab hidden)
   */
  pauseSequence() {
    if (this.sequenceTimer) {
      clearTimeout(this.sequenceTimer);
      this.sequenceTimer = null;
    }

    // Pause current video if playing
    const current = this.sequence[this.currentIndex];
    if (current.type === 'video') {
      const triangle = document.querySelector(current.selector);
      const video = triangle?.querySelector('video');
      if (video) video.pause();
    }
  }

  /**
   * Resume the sequence (when tab visible again)
   */
  resumeSequence() {
    if (!this.isRunning) return;

    const current = this.sequence[this.currentIndex];
    if (current.type === 'video') {
      const triangle = document.querySelector(current.selector);
      const video = triangle?.querySelector('video');
      if (video) {
        video.play().catch(err => console.log('Video play prevented:', err));
      }
    } else {
      // For Collections image, restart the timer
      this.sequenceTimer = setTimeout(() => this.advanceSequence(), this.collectionsDisplayTime);
    }
  }

  /**
   * Play the current item in the sequence
   */
  playCurrentItem() {
    if (!this.isRunning) return;

    const current = this.sequence[this.currentIndex];
    const currentTriangle = document.querySelector(current.selector);

    if (!currentTriangle) return;

    // Update states: active for current, dimmed for others
    this.triangles.forEach(triangle => {
      if (triangle === currentTriangle) {
        triangle.classList.add('is-active');
        triangle.classList.remove('is-dimmed');
      } else {
        triangle.classList.add('is-dimmed');
        triangle.classList.remove('is-active');
      }
    });

    if (current.type === 'video') {
      const video = currentTriangle.querySelector('video');
      if (video) {
        // Reset to beginning
        video.currentTime = 0;

        // Remove any existing ended listener
        video.removeEventListener('ended', this.boundAdvance);

        // Add ended listener
        this.boundAdvance = () => this.advanceSequence();
        video.addEventListener('ended', this.boundAdvance, { once: true });

        // Play the video
        video.play().catch(err => console.log('Video play prevented:', err));
      }
    } else {
      // For Collections image, display for 5 seconds then advance
      this.sequenceTimer = setTimeout(() => this.advanceSequence(), this.collectionsDisplayTime);
    }
  }

  /**
   * Advance to the next item in the sequence
   */
  advanceSequence() {
    if (!this.isRunning) return;

    // Reset current video to first frame if it's a video
    const current = this.sequence[this.currentIndex];
    if (current.type === 'video') {
      const triangle = document.querySelector(current.selector);
      const video = triangle?.querySelector('video');
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }

    // Move to next item (loop back to 0 after last)
    this.currentIndex = (this.currentIndex + 1) % this.sequence.length;

    // Play the next item
    this.playCurrentItem();
  }

  /**
   * Reset all videos to first frame
   */
  resetAllVideos() {
    this.sequence.forEach(item => {
      if (item.type === 'video') {
        const triangle = document.querySelector(item.selector);
        const video = triangle?.querySelector('video');
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }

  /**
   * Pause all videos
   */
  pauseAllVideos() {
    document.querySelectorAll('.hero-triangle--video video').forEach(video => {
      video.pause();
    });
  }
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize video controller (handles desktop hover behavior)
  new HeroVideoController();

  // DISABLED: Tablet sequence controller causes layout instability
  // TODO: Fix TabletSequenceController before re-enabling
  // new TabletSequenceController();

  // Initialize logo parallax
  new LogoParallax();

  // Add loaded class for animations
  document.body.classList.add('is-loaded');
});

/**
 * Handle page visibility - pause videos when tab is hidden (desktop fallback)
 */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Only pause if NOT in tablet sequence mode (tablet handles its own visibility)
    if (!document.body.classList.contains('tablet-sequence-active')) {
      document.querySelectorAll('.hero-triangle--video video').forEach(video => {
        video.pause();
      });
    }
  }
});
