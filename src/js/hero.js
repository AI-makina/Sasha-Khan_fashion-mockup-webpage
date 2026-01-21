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

    // Pause all videos and restore loop attribute for desktop
    this.pauseAllVideos();
    this.restoreVideoLoops();
  }

  /**
   * Restore loop attribute on all videos (for desktop mode)
   */
  restoreVideoLoops() {
    this.sequence.forEach(item => {
      if (item.type === 'video') {
        const triangle = document.querySelector(item.selector);
        const video = triangle?.querySelector('video');
        if (video) {
          video.setAttribute('loop', '');
        }
      }
    });
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
        // Remove loop attribute so video ends and triggers 'ended' event
        video.removeAttribute('loop');

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
 * Tablet Portrait Sequence Controller
 * Plays videos in alternating rows sequence for tablet portrait (768px - 990px)
 * Sequence: Row1:Freedom → Row3:Elite → Row1:Glamour → Row3:Freedom → Row1:Elite → Row3:Glamour → Repeat
 */
class TabletPortraitSequenceController {
  constructor() {
    this.isRunning = false;
    this.currentIndex = 0;

    // Video triangle selectors
    this.triangles = {
      freedom: document.querySelector('.hero-triangle--top'),
      elite: document.querySelector('.hero-triangle--left'),
      glamour: document.querySelector('.hero-triangle--right')
    };

    // Row overlay elements
    this.row1Overlay = document.querySelector('.tp-row1-overlay');
    this.row3Overlay = document.querySelector('.tp-row3-overlay');

    // Define the 6-step sequence (alternating rows)
    // playing: { row, video } - the video that plays
    // waiting: { row, video } - the video that's paused and dimmed, ready for next turn
    this.sequence = [
      { playing: { row: 1, video: 'freedom' }, waiting: { row: 3, video: 'elite' } },   // Step 1
      { playing: { row: 3, video: 'elite' }, waiting: { row: 1, video: 'glamour' } },   // Step 2
      { playing: { row: 1, video: 'glamour' }, waiting: { row: 3, video: 'freedom' } }, // Step 3
      { playing: { row: 3, video: 'freedom' }, waiting: { row: 1, video: 'elite' } },   // Step 4
      { playing: { row: 1, video: 'elite' }, waiting: { row: 3, video: 'glamour' } },   // Step 5
      { playing: { row: 3, video: 'glamour' }, waiting: { row: 1, video: 'freedom' } }  // Step 6
    ];

    this.boundAdvance = null;
    this.init();
  }

  /**
   * Check if viewport is tablet portrait (768px - 990px width, height > 500px)
   * Height check prevents overlap with mobile landscape
   */
  isTabletPortrait() {
    return window.innerWidth >= 768 && window.innerWidth <= 990 && window.innerHeight > 500;
  }

  /**
   * Initialize the controller
   */
  init() {
    // Start if in tablet portrait viewport
    if (this.isTabletPortrait()) {
      this.startSequence();
    }

    // Handle viewport resize
    window.addEventListener('resize', () => this.handleResize());

    // Handle page visibility
    document.addEventListener('visibilitychange', () => this.handleVisibility());

    // Setup menu dropdown interactions
    this.setupMenuDropdowns();
  }

  /**
   * Setup menu dropdown toggle behavior
   */
  setupMenuDropdowns() {
    const menuItems = document.querySelectorAll('.tablet-portrait-menu__item--has-submenu');

    menuItems.forEach(item => {
      const label = item.querySelector('.tablet-portrait-menu__label');

      if (label) {
        label.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          // Close other open menus
          menuItems.forEach(other => {
            if (other !== item) {
              other.classList.remove('is-open');
            }
          });

          // Toggle this menu
          item.classList.toggle('is-open');
        });
      }
    });

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.tablet-portrait-menu__item--has-submenu')) {
        menuItems.forEach(item => item.classList.remove('is-open'));
      }
    });

    // Handle scroll target links (LUX, ODE)
    const scrollLinks = document.querySelectorAll('.tablet-portrait-menu__link[data-scroll-target]');
    scrollLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-scroll-target');
        // Close menu
        document.querySelectorAll('.tablet-portrait-menu__item--has-submenu').forEach(item => {
          item.classList.remove('is-open');
        });
        // Scroll to bags section
        const bagsSection = document.getElementById('bags-intro-section');
        if (bagsSection) {
          bagsSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /**
   * Handle viewport resize
   */
  handleResize() {
    if (this.isTabletPortrait() && !this.isRunning) {
      this.startSequence();
    } else if (!this.isTabletPortrait() && this.isRunning) {
      this.stopSequence();
    }
  }

  /**
   * Handle page visibility changes
   */
  handleVisibility() {
    if (!this.isTabletPortrait()) return;

    if (document.hidden) {
      this.pauseCurrentVideo();
    } else if (this.isRunning) {
      this.resumeCurrentVideo();
    }
  }

  /**
   * Start the sequence
   */
  startSequence() {
    if (this.isRunning) return;

    this.isRunning = true;
    document.body.classList.add('tablet-portrait-active');

    // Reset all triangles
    this.resetAllTriangles();

    // Start with step 0
    this.currentIndex = 0;
    this.playCurrentStep();
  }

  /**
   * Stop the sequence
   */
  stopSequence() {
    this.isRunning = false;
    document.body.classList.remove('tablet-portrait-active');

    // Reset all triangles and overlays
    this.resetAllTriangles();

    // Pause all videos and restore loop attribute
    Object.values(this.triangles).forEach(triangle => {
      if (triangle) {
        const video = triangle.querySelector('video');
        if (video) {
          video.pause();
          video.setAttribute('loop', '');
        }
      }
    });
  }

  /**
   * Reset all triangles to hidden state
   */
  resetAllTriangles() {
    Object.values(this.triangles).forEach(triangle => {
      if (triangle) {
        triangle.classList.remove('tp-row1-active', 'tp-row3-active');
        const video = triangle.querySelector('video');
        if (video) {
          video.pause();
          video.currentTime = 0;
          video.removeEventListener('ended', this.boundAdvance);
        }
      }
    });

    // Reset overlays
    if (this.row1Overlay) this.row1Overlay.classList.remove('is-dimmed');
    if (this.row3Overlay) this.row3Overlay.classList.remove('is-dimmed');
  }

  /**
   * Play the current step in the sequence
   */
  playCurrentStep() {
    if (!this.isRunning) return;

    const step = this.sequence[this.currentIndex];
    const playingTriangle = this.triangles[step.playing.video];
    const waitingTriangle = this.triangles[step.waiting.video];

    if (!playingTriangle) return;

    // Reset all triangles first
    Object.values(this.triangles).forEach(t => {
      if (t) {
        t.classList.remove('tp-row1-active', 'tp-row3-active');
        const v = t.querySelector('video');
        if (v) {
          v.pause();
          v.removeEventListener('ended', this.boundAdvance);
        }
      }
    });

    // Position the PLAYING triangle in its row
    if (step.playing.row === 1) {
      playingTriangle.classList.add('tp-row1-active');
      if (this.row1Overlay) this.row1Overlay.classList.remove('is-dimmed');
    } else {
      playingTriangle.classList.add('tp-row3-active');
      if (this.row3Overlay) this.row3Overlay.classList.remove('is-dimmed');
    }

    // Position the WAITING triangle in its row (paused, with dimmed overlay)
    if (waitingTriangle) {
      if (step.waiting.row === 1) {
        waitingTriangle.classList.add('tp-row1-active');
        if (this.row1Overlay) this.row1Overlay.classList.add('is-dimmed');
      } else {
        waitingTriangle.classList.add('tp-row3-active');
        if (this.row3Overlay) this.row3Overlay.classList.add('is-dimmed');
      }

      // Make sure waiting video is paused at start
      const waitingVideo = waitingTriangle.querySelector('video');
      if (waitingVideo) {
        waitingVideo.pause();
        waitingVideo.currentTime = 0;
      }
    }

    // Play the active video
    const video = playingTriangle.querySelector('video');
    if (video) {
      // Remove loop so 'ended' event fires
      video.removeAttribute('loop');
      video.currentTime = 0;

      // Setup ended listener
      this.boundAdvance = () => this.advanceSequence();
      video.addEventListener('ended', this.boundAdvance, { once: true });

      // Play
      video.play().catch(err => console.log('Tablet portrait video play prevented:', err));
    }
  }

  /**
   * Advance to next step in sequence
   */
  advanceSequence() {
    if (!this.isRunning) return;

    // Move to next step (loop back to 0 after step 5)
    this.currentIndex = (this.currentIndex + 1) % this.sequence.length;

    // Play next step
    this.playCurrentStep();
  }

  /**
   * Pause the current video
   */
  pauseCurrentVideo() {
    const step = this.sequence[this.currentIndex];
    const triangle = this.triangles[step.playing.video];
    if (triangle) {
      const video = triangle.querySelector('video');
      if (video) video.pause();
    }
  }

  /**
   * Resume the current video
   */
  resumeCurrentVideo() {
    const step = this.sequence[this.currentIndex];
    const triangle = this.triangles[step.playing.video];
    if (triangle) {
      const video = triangle.querySelector('video');
      if (video) {
        video.play().catch(err => console.log('Video resume prevented:', err));
      }
    }
  }
}

/**
 * Mobile Landscape Sequence Controller
 * Plays videos in sequence: Freedom → Glamour → Elite → repeat
 * One video at a time, full viewport
 */
class MobileLandscapeSequenceController {
  constructor() {
    this.isRunning = false;
    this.currentIndex = 0;

    // Video triangles (same elements, different display)
    this.triangles = {
      freedom: document.querySelector('.hero-triangle--top'),
      glamour: document.querySelector('.hero-triangle--right'),
      elite: document.querySelector('.hero-triangle--left')
    };

    // Sequence order: Freedom → Glamour → Elite
    this.sequence = ['freedom', 'glamour', 'elite'];

    this.boundAdvance = null;
    this.init();
  }

  /**
   * Check if viewport is mobile landscape
   */
  isMobileLandscape() {
    return window.innerHeight <= 500 && window.innerWidth > window.innerHeight;
  }

  /**
   * Initialize the controller
   */
  init() {
    // Start if in mobile landscape viewport
    if (this.isMobileLandscape()) {
      this.startSequence();
    }

    // Handle viewport resize
    window.addEventListener('resize', () => this.handleResize());

    // Handle page visibility
    document.addEventListener('visibilitychange', () => this.handleVisibility());

    // Setup menu dropdown interactions
    this.setupMenuDropdowns();
  }

  /**
   * Setup menu dropdown toggle behavior
   */
  setupMenuDropdowns() {
    const menuItems = document.querySelectorAll('.mobile-landscape-menu__item--has-submenu');

    menuItems.forEach(item => {
      const label = item.querySelector('.mobile-landscape-menu__label');

      if (label) {
        label.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          // Close other open menus
          menuItems.forEach(other => {
            if (other !== item) {
              other.classList.remove('is-open');
            }
          });

          // Toggle this menu
          item.classList.toggle('is-open');
        });
      }
    });

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.mobile-landscape-menu__item--has-submenu')) {
        menuItems.forEach(item => item.classList.remove('is-open'));
      }
    });

    // Handle scroll target links (LUX, ODE)
    const scrollLinks = document.querySelectorAll('.mobile-landscape-menu__link[data-scroll-target]');
    scrollLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-scroll-target');
        // Close menu
        document.querySelectorAll('.mobile-landscape-menu__item--has-submenu').forEach(item => {
          item.classList.remove('is-open');
        });
        // Scroll to target section
        const targetSection = document.getElementById(`${target}-section`) ||
                              document.querySelector(`[data-collection="${target}"]`);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /**
   * Handle viewport resize
   */
  handleResize() {
    if (this.isMobileLandscape() && !this.isRunning) {
      this.startSequence();
    } else if (!this.isMobileLandscape() && this.isRunning) {
      this.stopSequence();
    }
  }

  /**
   * Handle page visibility changes
   */
  handleVisibility() {
    if (!this.isMobileLandscape()) return;

    if (document.hidden) {
      this.pauseCurrentVideo();
    } else if (this.isRunning) {
      this.resumeCurrentVideo();
    }
  }

  /**
   * Preload all videos for instant playback
   */
  preloadVideos() {
    const loadPromises = [];

    this.sequence.forEach(videoName => {
      const triangle = this.triangles[videoName];
      if (triangle) {
        const video = triangle.querySelector('video');
        if (video) {
          video.preload = 'auto';
          video.muted = true;
          // IMPORTANT: Remove loop attribute so 'ended' event fires
          video.loop = false;
          video.removeAttribute('loop');

          // Create promise that resolves when video can play through
          const loadPromise = new Promise(resolve => {
            if (video.readyState >= 4) {
              resolve();
            } else {
              video.addEventListener('canplaythrough', () => resolve(), { once: true });
              video.load();
            }
          });
          loadPromises.push(loadPromise);
        }
      }
    });

    return Promise.all(loadPromises);
  }

  /**
   * Prepare next video while current is playing - reset to start and pause
   */
  prepareNextVideo() {
    const nextIndex = (this.currentIndex + 1) % this.sequence.length;
    const nextVideoName = this.sequence[nextIndex];
    const nextTriangle = this.triangles[nextVideoName];

    if (nextTriangle) {
      const nextVideo = nextTriangle.querySelector('video');
      if (nextVideo) {
        // Reset to start and pause - keep it ready
        nextVideo.currentTime = 0;
        nextVideo.pause();
      }
    }
  }

  /**
   * Reset all videos to start for instant playback
   */
  resetAllVideos() {
    this.sequence.forEach(videoName => {
      const triangle = this.triangles[videoName];
      if (triangle) {
        const video = triangle.querySelector('video');
        if (video) {
          video.currentTime = 0;
          video.pause();
        }
      }
    });
  }

  /**
   * Start the video sequence
   */
  startSequence() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.currentIndex = 0;

    // Add class to body for styling
    document.body.classList.add('mobile-landscape-sequence-active');

    // Clear all active states first
    this.clearAllActive();

    // Preload and reset all videos to frame 0
    this.preloadVideos();
    this.resetAllVideos();

    // Start playing immediately
    this.playVideo(this.currentIndex);
  }

  /**
   * Stop the video sequence
   */
  stopSequence() {
    this.isRunning = false;

    // Remove body class
    document.body.classList.remove('mobile-landscape-sequence-active');

    // Stop all videos and clear classes
    Object.values(this.triangles).forEach(triangle => {
      if (triangle) {
        triangle.classList.remove('ml-active');
        const video = triangle.querySelector('video');
        if (video) {
          video.pause();
          video.removeEventListener('ended', this.boundAdvance);
        }
      }
    });
  }

  /**
   * Clear all active states
   */
  clearAllActive() {
    Object.values(this.triangles).forEach(triangle => {
      if (triangle) {
        triangle.classList.remove('ml-active');
      }
    });
  }

  /**
   * Play video at given index
   */
  playVideo(index) {
    const videoName = this.sequence[index];
    const triangle = this.triangles[videoName];

    if (!triangle) return;

    const video = triangle.querySelector('video');
    if (video) {
      // Remove old listener from all videos
      this.sequence.forEach(name => {
        const t = this.triangles[name];
        if (t) {
          const v = t.querySelector('video');
          if (v && this.boundAdvance) {
            v.removeEventListener('ended', this.boundAdvance);
          }
        }
      });

      // IMPORTANT: Ensure loop is disabled so 'ended' event fires
      video.loop = false;

      // Clear previous active and set new active instantly
      this.clearAllActive();
      triangle.classList.add('ml-active');

      // Reset video to start
      video.currentTime = 0;

      // Create bound advance function
      this.boundAdvance = () => this.advanceToNext();

      // Listen for video end
      video.addEventListener('ended', this.boundAdvance, { once: true });

      // Prepare next video in background while this one plays
      this.prepareNextVideo();

      // Play video immediately
      video.play().catch(err => console.log('Mobile landscape video play prevented:', err));
    }
  }

  /**
   * Advance to next video in sequence
   */
  advanceToNext() {
    if (!this.isRunning) return;

    // Move to next video (loop back to 0 after last)
    this.currentIndex = (this.currentIndex + 1) % this.sequence.length;

    // Play next video immediately - it should already be preloaded
    this.playVideo(this.currentIndex);
  }

  /**
   * Pause the current video
   */
  pauseCurrentVideo() {
    const videoName = this.sequence[this.currentIndex];
    const triangle = this.triangles[videoName];
    if (triangle) {
      const video = triangle.querySelector('video');
      if (video) video.pause();
    }
  }

  /**
   * Resume the current video
   */
  resumeCurrentVideo() {
    const videoName = this.sequence[this.currentIndex];
    const triangle = this.triangles[videoName];
    if (triangle) {
      const video = triangle.querySelector('video');
      if (video) {
        video.play().catch(err => console.log('Mobile landscape video resume prevented:', err));
      }
    }
  }
}

/**
 * Mobile Portrait Sequence Controller
 * Plays videos in sequence: Freedom → Glamour → Elite → Collections (5s) → repeat
 * 4 rows at 25vh each, 50% opacity overlay on inactive rows
 * Only active in mobile portrait viewport (width <= 767px AND height > 500px)
 */
class MobilePortraitSequenceController {
  constructor() {
    this.isRunning = false;
    this.currentIndex = 0;
    this.collectionsDisplayTime = 5000; // 5 seconds for Collections image
    this.sequenceTimer = null;

    // Video/Image triangles
    this.triangles = {
      freedom: document.querySelector('.hero-triangle--top'),
      glamour: document.querySelector('.hero-triangle--right'),
      elite: document.querySelector('.hero-triangle--left'),
      collections: document.querySelector('.hero-triangle--bottom')
    };

    // Sequence order: Freedom → Glamour → Elite → Collections
    this.sequence = [
      { name: 'freedom', type: 'video' },
      { name: 'glamour', type: 'video' },
      { name: 'elite', type: 'video' },
      { name: 'collections', type: 'image' }
    ];

    // Menu elements
    this.menuBtn = document.querySelector('.mobile-portrait-menu-btn');
    this.menu = document.querySelector('.mobile-portrait-menu');

    this.boundAdvance = null;
    this.init();
  }

  /**
   * Check if viewport is mobile portrait
   */
  isMobilePortrait() {
    return window.innerWidth <= 767 && window.innerHeight > 500;
  }

  /**
   * Initialize the controller
   */
  init() {
    // Preload all videos immediately if in mobile portrait
    if (this.isMobilePortrait()) {
      this.preloadAllVideos();
      this.startSequence();
    }

    // Handle viewport resize
    window.addEventListener('resize', () => this.handleResize());

    // Handle page visibility
    document.addEventListener('visibilitychange', () => this.handleVisibility());

    // Setup menu interactions
    this.setupMenu();

    // Setup tap navigation for hero triangles
    this.setupTapNavigation();
  }

  /**
   * Setup tap navigation for hero triangles
   * Videos link to their subpages, Collections opens the menu
   */
  setupTapNavigation() {
    // Map triangle names to their destination URLs
    const destinations = {
      freedom: 'freedom.html',
      glamour: 'glamour.html',
      elite: 'elite.html',
      collections: null // Opens menu instead
    };

    // Add click handlers to each triangle
    Object.keys(this.triangles).forEach(name => {
      const triangle = this.triangles[name];
      if (!triangle) return;

      // Make the triangle tappable
      triangle.style.cursor = 'pointer';

      triangle.addEventListener('click', (e) => {
        // Only handle in mobile portrait mode
        if (!this.isMobilePortrait()) return;

        e.preventDefault();
        e.stopPropagation();

        if (name === 'collections') {
          // Open the menu
          if (this.menu && this.menuBtn) {
            this.menu.classList.add('is-open');
            this.menuBtn.classList.add('is-active');
            this.menuBtn.setAttribute('aria-expanded', 'true');
            document.body.classList.add('mp-menu-open');
          }
        } else {
          // Navigate to the subpage
          const url = destinations[name];
          if (url) {
            window.location.href = url;
          }
        }
      });
    });
  }

  /**
   * Preload all videos - load and pause at first frame so they're visible
   */
  preloadAllVideos() {
    this.sequence.forEach(item => {
      if (item.type === 'video') {
        const triangle = this.triangles[item.name];
        if (triangle) {
          const video = triangle.querySelector('video');
          if (video) {
            // Set preload to auto
            video.preload = 'auto';
            video.muted = true;

            // Load the video
            video.load();

            // When metadata is loaded, seek to first frame
            video.addEventListener('loadedmetadata', () => {
              video.currentTime = 0.001; // Slight offset to force frame render
            }, { once: true });

            // If already loaded, set to first frame
            if (video.readyState >= 1) {
              video.currentTime = 0.001;
            }
          }
        }
      }
    });
  }

  /**
   * Setup menu toggle and dropdown interactions
   */
  setupMenu() {
    if (!this.menuBtn || !this.menu) return;

    // Toggle menu on button click
    this.menuBtn.addEventListener('click', () => {
      const isOpen = this.menu.classList.toggle('is-open');
      this.menuBtn.classList.toggle('is-active', isOpen);
      this.menuBtn.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('mp-menu-open', isOpen);
    });

    // Setup dropdown submenus
    const menuItems = document.querySelectorAll('.mobile-portrait-menu__item--has-submenu');
    menuItems.forEach(item => {
      const label = item.querySelector('.mobile-portrait-menu__label');
      if (label) {
        label.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          // Close other open menus
          menuItems.forEach(other => {
            if (other !== item) {
              other.classList.remove('is-open');
            }
          });

          // Toggle this menu
          item.classList.toggle('is-open');
        });
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.mobile-portrait-menu') &&
          !e.target.closest('.mobile-portrait-menu-btn')) {
        this.menu.classList.remove('is-open');
        this.menuBtn.classList.remove('is-active');
        this.menuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mp-menu-open');
      }
    });

    // Handle scroll target links (LUX, ODE)
    const scrollLinks = document.querySelectorAll('.mobile-portrait-menu__link[data-scroll-target]');
    scrollLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-scroll-target');

        // Close menu
        this.menu.classList.remove('is-open');
        this.menuBtn.classList.remove('is-active');
        this.menuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mp-menu-open');

        // Scroll to target section
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
            behavior: 'smooth'
          });
        }
      });
    });

    // Close menu on navigation link click
    const navLinks = document.querySelectorAll('.mobile-portrait-menu__label[href], .mobile-portrait-menu__link[href]:not([data-scroll-target])');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.menu.classList.remove('is-open');
        this.menuBtn.classList.remove('is-active');
        this.menuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mp-menu-open');
      });
    });
  }

  /**
   * Handle viewport resize
   */
  handleResize() {
    if (this.isMobilePortrait() && !this.isRunning) {
      this.preloadAllVideos();
      this.startSequence();
    } else if (!this.isMobilePortrait() && this.isRunning) {
      this.stopSequence();
    }
  }

  /**
   * Handle page visibility changes
   */
  handleVisibility() {
    if (!this.isMobilePortrait()) return;

    if (document.hidden) {
      this.pauseSequence();
    } else if (this.isRunning) {
      this.resumeSequence();
    }
  }

  /**
   * Start the video sequence
   */
  startSequence() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.currentIndex = 0;

    // Add class to body for styling
    document.body.classList.add('mobile-portrait-sequence-active');

    // Reset all videos and states
    this.resetAll();

    // Start playing first item
    this.playCurrentItem();
  }

  /**
   * Stop the sequence
   */
  stopSequence() {
    this.isRunning = false;

    // Clear any pending timers
    if (this.sequenceTimer) {
      clearTimeout(this.sequenceTimer);
      this.sequenceTimer = null;
    }

    // Remove body class
    document.body.classList.remove('mobile-portrait-sequence-active');

    // Reset all states
    this.resetAll();

    // Restore video loop attributes for other modes
    Object.values(this.triangles).forEach(triangle => {
      if (triangle) {
        const video = triangle.querySelector('video');
        if (video) {
          video.setAttribute('loop', '');
        }
      }
    });
  }

  /**
   * Pause the sequence
   */
  pauseSequence() {
    if (this.sequenceTimer) {
      clearTimeout(this.sequenceTimer);
      this.sequenceTimer = null;
    }

    const current = this.sequence[this.currentIndex];
    if (current.type === 'video') {
      const triangle = this.triangles[current.name];
      const video = triangle?.querySelector('video');
      if (video) video.pause();
    }
  }

  /**
   * Resume the sequence
   */
  resumeSequence() {
    if (!this.isRunning) return;

    const current = this.sequence[this.currentIndex];
    if (current.type === 'video') {
      const triangle = this.triangles[current.name];
      const video = triangle?.querySelector('video');
      if (video) {
        video.play().catch(err => console.log('Mobile portrait video resume prevented:', err));
      }
    } else {
      // For Collections image, restart the timer
      this.sequenceTimer = setTimeout(() => this.advanceSequence(), this.collectionsDisplayTime);
    }
  }

  /**
   * Reset all videos and states
   */
  resetAll() {
    Object.entries(this.triangles).forEach(([name, triangle]) => {
      if (triangle) {
        triangle.classList.remove('mp-active', 'mp-dimmed');
        const video = triangle.querySelector('video');
        if (video) {
          video.pause();
          video.currentTime = 0;
          if (this.boundAdvance) {
            video.removeEventListener('ended', this.boundAdvance);
          }
        }
      }
    });
  }

  /**
   * Play the current item in the sequence
   */
  playCurrentItem() {
    if (!this.isRunning) return;

    const current = this.sequence[this.currentIndex];
    const currentTriangle = this.triangles[current.name];

    if (!currentTriangle) return;

    // Update states: active for current, dimmed for others
    Object.entries(this.triangles).forEach(([name, triangle]) => {
      if (triangle) {
        if (name === current.name) {
          triangle.classList.add('mp-active');
          triangle.classList.remove('mp-dimmed');
        } else {
          // For Collections (image), don't dim others
          if (current.type === 'image') {
            triangle.classList.remove('mp-dimmed', 'mp-active');
          } else {
            triangle.classList.add('mp-dimmed');
            triangle.classList.remove('mp-active');
          }
        }
      }
    });

    if (current.type === 'video') {
      const video = currentTriangle.querySelector('video');
      if (video) {
        // Remove loop so 'ended' event fires
        video.removeAttribute('loop');
        video.currentTime = 0;

        // Remove old listener
        if (this.boundAdvance) {
          video.removeEventListener('ended', this.boundAdvance);
        }

        // Add ended listener
        this.boundAdvance = () => this.advanceSequence();
        video.addEventListener('ended', this.boundAdvance, { once: true });

        // Play video
        video.play().catch(err => console.log('Mobile portrait video play prevented:', err));
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

    // Reset current video if needed
    const current = this.sequence[this.currentIndex];
    if (current.type === 'video') {
      const triangle = this.triangles[current.name];
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
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize video controller (handles desktop hover behavior)
  new HeroVideoController();

  // Tablet landscape sequence controller - plays videos in sequence on tablet landscape
  new TabletSequenceController();

  // Tablet portrait sequence controller - plays videos in alternating rows on tablet portrait
  new TabletPortraitSequenceController();

  // Mobile landscape sequence controller - plays videos in sequence on mobile landscape
  new MobileLandscapeSequenceController();

  // Mobile portrait sequence controller - plays videos in sequence on mobile portrait
  new MobilePortraitSequenceController();

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
