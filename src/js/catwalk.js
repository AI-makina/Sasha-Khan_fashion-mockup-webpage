/**
 * Sasha Khan — Catwalk Section Controller
 * Scroll-triggered video playback with horizontal scroll exit effect
 * Video exits to the left with fading opacity
 */

class CatwalkController {
  constructor() {
    this.section = document.querySelector('.catwalk');
    this.videoContainer = document.querySelector('.catwalk__video-container');
    this.video = document.querySelector('.catwalk__video');
    this.clothingContainer = document.querySelector('.clothing__container');

    this.isVideoPlaying = false;

    if (this.section && this.video) {
      this.init();
    }
  }

  /**
   * Initialize the controller
   */
  init() {
    this.setupVideoObserver();
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
      threshold: 0.1
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

    this.videoObserver.observe(this.section);
  }

  /**
   * Setup scroll handler for horizontal scroll effect
   */
  setupScrollHandler() {
    window.addEventListener('scroll', () => {
      this.handleHorizontalScroll();
    }, { passive: true });

    // Initial call to set correct positions
    this.handleHorizontalScroll();
  }

  /**
   * Handle horizontal scroll effect
   * Video exits left, clothing enters from right - like horizontal scroll
   */
  handleHorizontalScroll() {
    const sectionRect = this.section.getBoundingClientRect();
    const sectionTop = sectionRect.top;
    const sectionHeight = this.section.offsetHeight;
    const viewportHeight = window.innerHeight;

    // The section is 200vh, so the "scroll range" for horizontal effect is 100vh
    const scrollRange = sectionHeight - viewportHeight;

    // Only apply horizontal scroll when section top is at or above viewport top
    if (sectionTop <= 0 && sectionTop > -scrollRange) {
      // Calculate progress (0 to 1)
      const progress = Math.abs(sectionTop) / scrollRange;

      // Video: Translate horizontally (0% to -100%) and fade out
      const videoTranslateX = progress * -100;
      const videoOpacity = 1 - progress;
      this.video.style.transform = `translateX(${videoTranslateX}%)`;
      this.video.style.opacity = videoOpacity;

      // Clothing: Enter from right (100vw to 0) in sync with video
      if (this.clothingContainer) {
        const clothingTranslateX = (1 - progress) * 100;
        this.clothingContainer.style.transform = `translateX(${clothingTranslateX}vw)`;
      }

    } else if (sectionTop > 0) {
      // Before horizontal scroll zone - reset positions
      this.video.style.transform = 'translateX(0)';
      this.video.style.opacity = 1;
      if (this.clothingContainer) {
        this.clothingContainer.style.transform = 'translateX(100vw)';
      }
    } else if (sectionTop <= -scrollRange) {
      // After horizontal scroll zone - final positions
      this.video.style.transform = 'translateX(-100%)';
      this.video.style.opacity = 0;
      if (this.clothingContainer) {
        this.clothingContainer.style.transform = 'translateX(0)';
      }
    }
  }

  /**
   * Play the video
   */
  playVideo() {
    if (this.isVideoPlaying) return;

    this.video.play().then(() => {
      this.isVideoPlaying = true;
    }).catch(err => {
      console.log('Catwalk video autoplay prevented:', err);
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
   * Cleanup
   */
  destroy() {
    if (this.videoObserver) {
      this.videoObserver.disconnect();
    }
  }
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  new CatwalkController();
});
