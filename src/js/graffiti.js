/**
 * Sasha Khan — Graffiti Section Controller
 * Scroll-driven video playback
 */

class GraffitiController {
  constructor() {
    this.section = document.querySelector('.graffiti-divider');
    this.video = document.querySelector('.graffiti-divider__video');

    this.isReady = false;
    this.videoDuration = 0;

    if (this.section && this.video) {
      this.init();
    }
  }

  init() {
    // Wait for video metadata to load
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

    // Setup scroll handler
    this.setupScrollHandler();
  }

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

  updateVideoPosition() {
    if (!this.isReady || this.videoDuration === 0) return;

    const sectionRect = this.section.getBoundingClientRect();
    const sectionTop = sectionRect.top;
    const sectionHeight = this.section.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Calculate progress based on when section enters and exits viewport
    // Progress goes from 0 (section just entering bottom) to 1 (section just leaving top)
    const startPoint = viewportHeight; // Section top at bottom of viewport
    const endPoint = -sectionHeight; // Section bottom at top of viewport
    const totalDistance = startPoint - endPoint;

    let progress = (startPoint - sectionTop) / totalDistance;
    progress = Math.max(0, Math.min(1, progress));

    // Map progress to video time
    const targetTime = progress * this.videoDuration;

    // Set video currentTime
    if (Math.abs(this.video.currentTime - targetTime) > 0.01) {
      this.video.currentTime = targetTime;
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new GraffitiController();
});
