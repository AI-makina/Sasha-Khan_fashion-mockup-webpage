/**
 * Sasha Khan — Cities Section Controller
 * Scroll-triggered card animations with rotating city names
 */

class CitiesController {
  constructor() {
    this.section = document.querySelector('.cities');
    this.cards = document.querySelectorAll('.cities__card');
    this.letters = document.querySelectorAll('.cities__card-letter');

    // City words to rotate through
    this.words = ['PARIS', 'MILAN', 'NYORK'];
    this.currentWordIndex = 0;

    // Animation state
    this.isInView = false;
    this.hasAnimatedIn = false;
    this.animationLoop = null;
    this.letterTimeouts = [];

    // Timing configuration (in milliseconds)
    this.config = {
      letterFadeDelay: 200,      // Delay between each letter appearing
      letterDisplayTime: 300,    // How long each letter takes to fade in
      wordDisplayTime: 1500,     // How long the full word stays visible
      wordFadeOutTime: 500,      // Time for word to fade out
      pauseBetweenWords: 300     // Pause before next word starts
    };

    if (this.section && this.cards.length > 0) {
      this.init();
    }
  }

  /**
   * Initialize the controller
   */
  init() {
    this.setupIntersectionObserver();
  }

  /**
   * Setup Intersection Observer for viewport detection
   */
  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3 // Trigger when 30% of section is visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.onEnterViewport();
        } else {
          this.onLeaveViewport();
        }
      });
    }, options);

    this.observer.observe(this.section);
  }

  /**
   * Called when section enters viewport
   */
  onEnterViewport() {
    if (this.isInView) return;

    this.isInView = true;
    this.hasAnimatedIn = false;

    // Start the sweep-in animation
    this.animateCardsIn();
  }

  /**
   * Called when section leaves viewport
   */
  onLeaveViewport() {
    if (!this.isInView) return;

    this.isInView = false;

    // Stop all animations
    this.stopAnimations();

    // Reset everything for next time
    this.resetState();
  }

  /**
   * Animate cards sweeping in from right to left
   */
  animateCardsIn() {
    // Add visible class to each card (CSS handles staggered delays)
    this.cards.forEach(card => {
      card.classList.add('is-visible');
    });

    // Wait for cards to settle, then start word animation
    const totalSweepTime = 400 + (this.cards.length * 100); // Base + stagger
    setTimeout(() => {
      if (this.isInView) {
        this.hasAnimatedIn = true;
        this.startWordRotation();
      }
    }, totalSweepTime);
  }

  /**
   * Start the word rotation loop
   */
  startWordRotation() {
    this.currentWordIndex = 0;
    this.showCurrentWord();
  }

  /**
   * Display the current word letter by letter
   */
  showCurrentWord() {
    if (!this.isInView) return;

    const word = this.words[this.currentWordIndex];
    const letters = word.split('');

    // Clear any existing letters
    this.clearLetters();

    // Show each letter with staggered delay
    letters.forEach((letter, index) => {
      const timeout = setTimeout(() => {
        if (!this.isInView) return;

        const letterEl = this.letters[index];
        if (letterEl) {
          letterEl.textContent = letter;
          letterEl.classList.add('is-visible');
        }
      }, index * this.config.letterFadeDelay);

      this.letterTimeouts.push(timeout);
    });

    // After word is fully displayed, wait, then fade out and show next
    const totalLetterTime = letters.length * this.config.letterFadeDelay + this.config.letterDisplayTime;
    const wordTimeout = setTimeout(() => {
      if (!this.isInView) return;
      this.fadeOutWord();
    }, totalLetterTime + this.config.wordDisplayTime);

    this.letterTimeouts.push(wordTimeout);
  }

  /**
   * Fade out current word
   */
  fadeOutWord() {
    if (!this.isInView) return;

    // Hide all letters
    this.letters.forEach(letter => {
      letter.classList.remove('is-visible');
    });

    // After fade out, show next word
    const nextWordTimeout = setTimeout(() => {
      if (!this.isInView) return;

      // Move to next word (loop back to start)
      this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
      this.showCurrentWord();
    }, this.config.wordFadeOutTime + this.config.pauseBetweenWords);

    this.letterTimeouts.push(nextWordTimeout);
  }

  /**
   * Clear all letter content and visibility
   */
  clearLetters() {
    this.letters.forEach(letter => {
      letter.classList.remove('is-visible');
      letter.textContent = '';
    });
  }

  /**
   * Stop all running animations
   */
  stopAnimations() {
    // Clear all timeouts
    this.letterTimeouts.forEach(timeout => clearTimeout(timeout));
    this.letterTimeouts = [];

    // Cancel animation loop if exists
    if (this.animationLoop) {
      cancelAnimationFrame(this.animationLoop);
      this.animationLoop = null;
    }
  }

  /**
   * Reset state for when section re-enters viewport
   */
  resetState() {
    // Remove visible class from cards
    this.cards.forEach(card => {
      card.classList.remove('is-visible');
    });

    // Clear letters
    this.clearLetters();

    // Reset indices
    this.currentWordIndex = 0;
    this.hasAnimatedIn = false;
  }

  /**
   * Cleanup - call when destroying controller
   */
  destroy() {
    this.stopAnimations();
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  new CitiesController();
});
