/**
 * Sasha Khan — Bags Section Controller
 * Scroll-triggered video playback with horizontal scroll effect
 */

class BagsController {
  constructor() {
    this.videoSection = document.querySelector('.bags-intro');
    this.videoContainer = document.querySelector('.bags-intro__video-container');
    this.video = document.querySelector('.bags-intro__video');
    this.bagShowcase = document.querySelector('.bag-showcase');

    this.isVideoPlaying = false;
    this.isInHorizontalScroll = false;

    if (this.videoSection && this.video) {
      this.init();
    }
  }

  /**
   * Initialize the controller
   */
  init() {
    this.setupVideoObserver();
    this.setupShowcaseObserver();
    this.setupScrollHandler();
  }

  /**
   * Setup Intersection Observer for video section
   * Plays video when 10% is visible
   */
  setupVideoObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // 10% visibility threshold
    };

    this.videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.playVideo();
        } else {
          this.pauseVideo();
        }
      });
    }, options);

    this.videoObserver.observe(this.videoSection);
  }

  /**
   * Setup scroll handler for horizontal scroll effect
   */
  setupScrollHandler() {
    window.addEventListener('scroll', () => {
      this.handleHorizontalScroll();
    }, { passive: true });
  }

  /**
   * Handle horizontal scroll effect
   * Translates vertical scroll into horizontal video movement
   */
  handleHorizontalScroll() {
    const sectionRect = this.videoSection.getBoundingClientRect();
    const sectionTop = sectionRect.top;
    const sectionHeight = this.videoSection.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Calculate how far we've scrolled into the section
    // The section is 200vh, so the "scroll range" for horizontal effect is 100vh
    const scrollStart = 0; // When video fills viewport (sectionTop = 0)
    const scrollRange = sectionHeight - viewportHeight; // 100vh of scroll

    // Only apply horizontal scroll when section top is at or above viewport top
    if (sectionTop <= 0 && sectionTop > -scrollRange) {
      // Calculate progress (0 to 1)
      const progress = Math.abs(sectionTop) / scrollRange;

      // Translate video horizontally (0% to -100%)
      const translateX = progress * -100;
      this.video.style.transform = `translateX(${translateX}%)`;

      this.isInHorizontalScroll = true;
    } else if (sectionTop > 0) {
      // Before horizontal scroll zone - reset position
      this.video.style.transform = 'translateX(0)';
      this.isInHorizontalScroll = false;
    } else if (sectionTop <= -scrollRange) {
      // After horizontal scroll zone - video fully exited
      this.video.style.transform = 'translateX(-100%)';
      this.isInHorizontalScroll = false;
    }
  }

  /**
   * Setup Intersection Observer for bag showcase
   */
  setupShowcaseObserver() {
    if (!this.bagShowcase) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    this.showcaseObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.showBagShowcase();
        }
      });
    }, options);

    this.showcaseObserver.observe(this.bagShowcase);
  }

  /**
   * Play the video
   */
  playVideo() {
    if (this.isVideoPlaying) return;

    this.video.play().then(() => {
      this.isVideoPlaying = true;
    }).catch(err => {
      console.log('Video autoplay prevented:', err);
    });
  }

  /**
   * Pause the video
   */
  pauseVideo() {
    if (!this.isVideoPlaying) return;

    this.video.pause();
    this.isVideoPlaying = false;
  }

  /**
   * Show the bag showcase section
   */
  showBagShowcase() {
    if (!this.bagShowcase) return;
    this.bagShowcase.classList.add('is-visible');
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.videoObserver) {
      this.videoObserver.disconnect();
    }
    if (this.showcaseObserver) {
      this.showcaseObserver.disconnect();
    }
  }
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  new BagsController();
});
