/**
 * Sasha Khan — Glasses Section Controller
 * Scroll-driven video playback
 * Scroll down = play forward, Scroll up = play backward
 */

class GlassesController {
  constructor() {
    this.section = document.querySelector('.glasses');
    this.desktopVideo = document.querySelector('.glasses__video--desktop');
    this.tabletPortraitVideo = document.querySelector('.glasses__video--tablet-portrait');
    this.video = null; // Will be set based on viewport
    this.overlayLink = document.querySelector('.glasses__overlay-link');

    this.isReady = false;
    this.videoDuration = 0;

    // Video paths
    this.desktopVideoSrc = 'assets/videos/glasses/glasses.mp4';
    this.tabletVideoSrc = 'assets/videos/glasses/glasses-tablet.mp4';

    if (this.section && (this.desktopVideo || this.tabletPortraitVideo)) {
      this.init();
    }
  }

  /**
   * Check if viewport is tablet landscape (991px - 1200px)
   */
  isTabletLandscape() {
    return window.innerWidth >= 991 && window.innerWidth <= 1200;
  }

  /**
   * Check if viewport is tablet portrait (768px - 990px width, height > 500px)
   * Height check prevents overlap with mobile landscape
   */
  isTabletPortrait() {
    return window.innerWidth >= 768 && window.innerWidth <= 990 && window.innerHeight > 500;
  }

  /**
   * Select the correct video element based on viewport
   */
  selectVideo() {
    const wasVideo = this.video;

    if (this.isTabletPortrait() && this.tabletPortraitVideo) {
      this.video = this.tabletPortraitVideo;
    } else if (this.desktopVideo) {
      this.video = this.desktopVideo;
    }

    // If video changed, reinitialize
    if (wasVideo !== this.video && this.video) {
      this.isReady = false;
      this.setupVideoListeners();
    }
  }

  /**
   * Setup video event listeners
   */
  setupVideoListeners() {
    if (!this.video) return;

    this.video.addEventListener('loadedmetadata', () => {
      this.videoDuration = this.video.duration;
      this.isReady = true;
      this.updateVideoPosition();
    });

    // Fallback if metadata already loaded
    if (this.video.readyState >= 1) {
      this.videoDuration = this.video.duration;
      this.isReady = true;
      this.updateVideoPosition();
    }

    // Force video to load on mobile (browsers may not preload)
    this.video.load();
  }

  /**
   * Swap video source based on viewport (for desktop/tablet landscape)
   */
  swapVideoSource() {
    if (!this.video || this.isTabletPortrait()) return;

    const source = this.video.querySelector('source');
    if (!source) return;

    const targetSrc = this.isTabletLandscape() ? this.tabletVideoSrc : this.desktopVideoSrc;
    const currentSrc = source.getAttribute('src');

    // Only swap if different
    if (currentSrc !== targetSrc) {
      this.isReady = false;
      source.setAttribute('src', targetSrc);
      this.video.load();
    }
  }

  /**
   * Initialize the controller
   */
  init() {
    // Select correct video based on viewport
    this.selectVideo();

    // Swap video source for tablet landscape (if not tablet portrait)
    this.swapVideoSource();

    // Setup video listeners
    this.setupVideoListeners();

    // Setup scroll handler
    this.setupScrollHandler();

    // Handle viewport resize
    window.addEventListener('resize', () => {
      this.selectVideo();
      this.swapVideoSource();
    });
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
    // For tablet landscape/portrait, stop slightly before the end to prevent blank last frame
    const maxTime = (this.isTabletLandscape() || this.isTabletPortrait()) ? this.videoDuration - 0.1 : this.videoDuration;
    const targetTime = progress * maxTime;

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
