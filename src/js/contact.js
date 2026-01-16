/**
 * Sasha Khan — Contact Section Controller
 * Animated video cards with viewport detection
 */

class ContactController {
  constructor() {
    this.section = document.querySelector('.contact');
    this.cardsContainer = document.querySelector('.contact__cards');
    this.centerCard = document.querySelector('.contact__card--center');
    this.leftCard = document.querySelector('.contact__card--left');
    this.rightCard = document.querySelector('.contact__card--right');

    this.centerVideo = this.centerCard?.querySelector('.contact__video');
    this.leftVideo = this.leftCard?.querySelector('.contact__video');
    this.rightVideo = this.rightCard?.querySelector('.contact__video');

    this.isAnimating = false;

    if (this.section && this.cardsContainer) {
      this.init();
    }
  }

  init() {
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isAnimating) {
          this.triggerAnimation();
        } else if (!entry.isIntersecting && this.isAnimating) {
          this.resetAnimation();
        }
      });
    }, options);

    observer.observe(this.cardsContainer);
  }

  triggerAnimation() {
    this.isAnimating = true;

    // Step 1: Play center card video immediately
    if (this.centerVideo) {
      this.centerVideo.currentTime = 0;
      this.centerVideo.play();
    }

    // Step 2: After a brief delay, animate side cards out
    setTimeout(() => {
      this.leftCard?.classList.add('is-animated');
      this.rightCard?.classList.add('is-animated');

      // Step 3: Once animation completes, play side videos
      setTimeout(() => {
        if (this.leftVideo) {
          this.leftVideo.currentTime = 0;
          this.leftVideo.play();
        }
        if (this.rightVideo) {
          this.rightVideo.currentTime = 0;
          this.rightVideo.play();
        }
      }, 800); // Wait for CSS transition to complete

    }, 500); // Initial delay before side cards animate
  }

  resetAnimation() {
    this.isAnimating = false;

    // Remove animation classes
    this.leftCard?.classList.remove('is-animated');
    this.rightCard?.classList.remove('is-animated');

    // Pause and reset all videos
    if (this.centerVideo) {
      this.centerVideo.pause();
      this.centerVideo.currentTime = 0;
    }
    if (this.leftVideo) {
      this.leftVideo.pause();
      this.leftVideo.currentTime = 0;
    }
    if (this.rightVideo) {
      this.rightVideo.pause();
      this.rightVideo.currentTime = 0;
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new ContactController();
});
