/**
 * Sasha Khan — Glasses Section Controller
 * Scroll-driven video playback
 * Scroll down = play forward, Scroll up = play backward
 */

class GlassesController {
  constructor() {
    this.section = document.querySelector('.glasses');
    this.video = document.querySelector('.glasses__video');
    this.overlayLink = document.querySelector('.glasses__overlay-link');

    this.isReady = false;
    this.videoDuration = 0;

    if (this.section && this.video) {
      this.init();
    }
  }

  /**
   * Initialize the controller
   */
  init() {
    // Wait for video metadata to load
    this.video.addEventListener('loadedmetadata', () => {
      this.videoDuration = this.video.duration;
      this.isReady = true;

      // Set initial position
      this.updateVideoPosition();
    });

    // Fallback if metadata already loaded
    if (this.video.readyState >= 1) {
      this.videoDuration = this.video.duration;
      this.isReady = true;
      this.updateVideoPosition();
    }

    // Setup scroll handler
    this.setupScrollHandler();
  }

  /**
   * Setup scroll handler for video scrubbing
   */
  setupScrollHandler() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateVideoPosition();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Update video position based on scroll
   */
  updateVideoPosition() {
    if (!this.isReady || this.videoDuration === 0) return;

    const sectionRect = this.section.getBoundingClientRect();
    const sectionTop = sectionRect.top;
    const sectionHeight = this.section.offsetHeight;
    const viewportHeight = window.innerHeight;

    // The scroll range for video playback (section height minus one viewport)
    const scrollRange = sectionHeight - viewportHeight;

    // Calculate progress (0 to 1) based on scroll position
    let progress = 0;

    if (sectionTop <= 0 && sectionTop > -scrollRange) {
      // Section is in the scroll zone
      progress = Math.abs(sectionTop) / scrollRange;
    } else if (sectionTop > 0) {
      // Before the section - video at start
      progress = 0;
    } else if (sectionTop <= -scrollRange) {
      // After the section - video at end
      progress = 1;
    }

    // Clamp progress between 0 and 1
    progress = Math.max(0, Math.min(1, progress));

    // Map progress to video time
    const targetTime = progress * this.videoDuration;

    // Set video currentTime (this scrubs the video)
    if (Math.abs(this.video.currentTime - targetTime) > 0.01) {
      this.video.currentTime = targetTime;
    }

    // Show/hide overlay link when text appears (1.8 seconds before video ends)
    if (this.overlayLink && this.videoDuration > 0) {
      const showAtTime = this.videoDuration - 1.8; // 1.8 seconds before end
      const showAtProgress = showAtTime / this.videoDuration;

      if (progress >= showAtProgress) {
        this.overlayLink.classList.add('is-visible');
      } else {
        this.overlayLink.classList.remove('is-visible');
      }
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    // Remove event listeners if needed
  }
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  new GlassesController();
});
