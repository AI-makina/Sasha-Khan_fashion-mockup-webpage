/**
 * Sasha Khan — LUXURY Cards & Product Cards Controller
 *
 * Phase 1: LUX cards chase the exiting video to the left (0-25% progress)
 * Phase 2: Cards flip from LUX to ODE one by one with overlap (25-75% progress)
 *          - Next card starts flipping when current card is 25% turned
 *          - LUX products exit, ODE products enter in sequence
 * Phase 3: Hold flipped state (75-100% progress)
 */

class LuxuryCardsController {
  constructor() {
    this.bagsSection = document.querySelector('.bags-intro');
    this.bagsVideo = document.querySelector('.bags-intro__video');
    this.luxuryCards = document.querySelectorAll('.luxury-card');

    // LUX and ODE product containers
    this.luxProductContainer = document.querySelector('.products-container--lux');
    this.odeProductContainer = document.querySelector('.products-container--ode');
    this.luxProductCards = document.querySelectorAll('.products-container--lux .product-card');
    this.odeProductCards = document.querySelectorAll('.products-container--ode .product-card');

    this.hasPlayed = false;

    // Tablet landscape detection (991px - 1200px)
    this.isTabletLandscape = () => window.innerWidth >= 991 && window.innerWidth <= 1200;

    // Animation phase thresholds
    this.sweepEndProgress = 0.25;     // Cards locked in place by 25%
    this.flipStartProgress = 0.30;    // Flip starts at 30%
    this.flipEndProgress = 0.75;      // Flip ends at 75%

    // Card flip overlap: next card starts when current is 25% done
    this.flipOverlap = 0.25;

    if (this.bagsSection && this.luxuryCards.length > 0) {
      this.init();
    }
  }

  /**
   * Initialize the controller
   */
  init() {
    this.setupScrollHandler();
    this.preloadVideos();
  }

  /**
   * Preload all videos for smooth playback
   * Forces Chrome to actually buffer video data
   */
  preloadVideos() {
    this.luxuryCards.forEach(card => {
      // Preload both LUX and ODE videos
      const videos = card.querySelectorAll('video');
      videos.forEach(video => {
        if (video) {
          // Force load
          video.load();

          // Once metadata is loaded, seek to force Chrome to buffer
          video.addEventListener('loadedmetadata', () => {
            // Seek to near start to force Chrome to buffer video data
            video.currentTime = 0.001;
          }, { once: true });
        }
      });
    });
  }

  /**
   * Setup scroll handler synced with bags-intro horizontal scroll
   */
  setupScrollHandler() {
    window.addEventListener('scroll', () => {
      this.handleScroll();
    }, { passive: true });
  }

  /**
   * Handle scroll - sync all cards with video exit progress
   */
  handleScroll() {
    if (!this.bagsSection) return;

    const sectionRect = this.bagsSection.getBoundingClientRect();
    const sectionTop = sectionRect.top;
    const sectionHeight = this.bagsSection.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Scroll range for the section
    const scrollRange = sectionHeight - viewportHeight;

    // Only animate when in scroll zone
    if (sectionTop <= 0 && sectionTop > -scrollRange) {
      // Calculate progress (0 to 1)
      const progress = Math.abs(sectionTop) / scrollRange;

      // Phase 1: Sweep in (0 to 25%)
      this.animateLuxuryCards(progress);
      this.animateLuxProductCards(progress);
      this.fadeVideo(progress);

      // Phase 2: Flip animation (25% to 75%)
      if (progress >= this.flipStartProgress) {
        this.animateFlip(progress);
        this.animateProductTransition(progress);
      }
    } else if (sectionTop > 0) {
      // Before scroll zone - reset all cards
      this.resetAllCards();
    } else if (sectionTop <= -scrollRange) {
      // After scroll zone - ensure cards are fully flipped
      this.setFullyFlipped();
    }
  }

  /**
   * Fade video as it exits - aggressive blend
   */
  fadeVideo(progress) {
    if (!this.bagsVideo) return;

    // Aggressive fade: start immediately, fully faded by 15%
    const fadeEnd = 0.15;

    if (progress >= fadeEnd) {
      this.bagsVideo.style.opacity = 0;
    } else {
      const fadeProgress = progress / fadeEnd;
      this.bagsVideo.style.opacity = 1 - fadeProgress;
    }
  }

  /**
   * Phase 1: Animate LUX cards - chase video exit, lock at left margin
   */
  animateLuxuryCards(progress) {
    this.luxuryCards.forEach((card, index) => {
      const luxVideo = card.querySelector('.luxury-card__video--lux');

      // Staggered chase: each card follows slightly behind
      const staggerDelay = 0.02;
      const cardStartProgress = index * staggerDelay;
      const cardDuration = this.sweepEndProgress - (2 * staggerDelay);
      const cardEndProgress = cardStartProgress + cardDuration;

      // Calculate this card's individual progress (0-1)
      let cardProgress = (progress - cardStartProgress) / (cardEndProgress - cardStartProgress);
      cardProgress = Math.max(0, Math.min(1, cardProgress));

      // Chase from right, lock at 0 (left margin)
      const translateX = (1 - cardProgress) * 100;
      card.style.transform = `translateX(${translateX}vw)`;

      // Tablet landscape only: fade in cards to hide bleeding into previous section
      if (this.isTabletLandscape()) {
        // Fade from 0 to 1 as cards enter viewport (first 50% of card progress)
        const opacityProgress = Math.min(1, cardProgress * 2);
        card.style.opacity = opacityProgress;
      } else {
        card.style.opacity = 1;
      }

      // Toggle active state
      if (cardProgress > 0 && cardProgress < 1) {
        card.classList.add('is-active');
        this.hasPlayed = true;
      } else {
        card.classList.remove('is-active');
      }

      // Sync LUX video playback to card progress (during sweep-in)
      if (luxVideo && luxVideo.duration && !isNaN(luxVideo.duration)) {
        const targetTime = cardProgress * luxVideo.duration;
        if (Math.abs(luxVideo.currentTime - targetTime) > 0.05) {
          luxVideo.currentTime = targetTime;
        }
      }
    });
  }

  /**
   * Phase 1: Animate LUX Product cards - sweep in from right
   */
  animateLuxProductCards(progress) {
    this.luxProductCards.forEach((card, index) => {
      // Product cards animate with similar timing to LUX cards
      const staggerDelay = 0.02;
      const cardStartProgress = index * staggerDelay;
      const cardDuration = this.sweepEndProgress - (2 * staggerDelay);
      const cardEndProgress = cardStartProgress + cardDuration;

      // Calculate this card's individual progress (0-1)
      let cardProgress = (progress - cardStartProgress) / (cardEndProgress - cardStartProgress);
      cardProgress = Math.max(0, Math.min(1, cardProgress));

      // Sweep from right (off-screen) to final position (0)
      const translateX = (1 - cardProgress) * 100;
      card.style.transform = `translateX(${translateX}%)`;

      // Fade in from 0% to 100% as it sweeps in
      card.style.opacity = cardProgress;

      // Enable pointer events when visible
      card.style.pointerEvents = cardProgress > 0.5 ? 'auto' : 'none';
    });
  }

  /**
   * Phase 2: Animate flip from LUX to ODE with overlap
   * Cards flip one by one, next starts when current is 25% turned
   */
  animateFlip(progress) {
    // Calculate flip progress within the flip range (25% to 75%)
    const flipRange = this.flipEndProgress - this.flipStartProgress;
    const flipProgress = (progress - this.flipStartProgress) / flipRange;
    const clampedFlipProgress = Math.max(0, Math.min(1, flipProgress));

    const cardCount = this.luxuryCards.length;

    // With 25% overlap, effective progress per card is reduced
    // Card 0: 0% - 40%, Card 1: 10% - 50%, Card 2: 20% - 60% (example with 3 cards)
    // Each card takes (1 / cardCount) * (1 + overlap) of the progress
    const effectiveCardDuration = 1 / (cardCount - (cardCount - 1) * (1 - this.flipOverlap));

    this.luxuryCards.forEach((card, index) => {
      const cardInner = card.querySelector('.luxury-card__inner');
      const luxVideo = card.querySelector('.luxury-card__video--lux');
      const odeVideo = card.querySelector('.luxury-card__video--ode');

      if (!cardInner) return;

      // Calculate this card's flip timing with overlap
      const cardFlipStart = index * effectiveCardDuration * this.flipOverlap;
      const cardFlipEnd = cardFlipStart + effectiveCardDuration;

      if (clampedFlipProgress >= cardFlipEnd) {
        // Fully flipped - show ODE side
        cardInner.style.transform = 'rotateY(180deg)';

        // ODE video at end
        if (odeVideo && odeVideo.duration && !isNaN(odeVideo.duration)) {
          odeVideo.currentTime = odeVideo.duration;
        }
        // LUX video at start (reversed)
        if (luxVideo) {
          luxVideo.currentTime = 0;
        }

      } else if (clampedFlipProgress >= cardFlipStart) {
        // Currently flipping
        const cardProgress = (clampedFlipProgress - cardFlipStart) / (cardFlipEnd - cardFlipStart);
        const rotation = cardProgress * 180;
        cardInner.style.transform = `rotateY(${rotation}deg)`;

        // LUX video plays backwards (first half of flip)
        if (cardProgress < 0.5 && luxVideo && luxVideo.duration && !isNaN(luxVideo.duration)) {
          // Reverse: from end (where it was) to start
          const luxProgress = 1 - (cardProgress / 0.5);
          luxVideo.currentTime = luxProgress * luxVideo.duration;
        } else if (luxVideo) {
          luxVideo.currentTime = 0;
        }

        // ODE video plays forward (second half of flip)
        if (cardProgress >= 0.5 && odeVideo && odeVideo.duration && !isNaN(odeVideo.duration)) {
          const odeProgress = (cardProgress - 0.5) / 0.5;
          odeVideo.currentTime = odeProgress * odeVideo.duration;
        } else if (odeVideo) {
          odeVideo.currentTime = 0;
        }

      } else {
        // Not yet flipping - show LUX side
        cardInner.style.transform = 'rotateY(0deg)';
      }
    });
  }

  /**
   * Phase 2: Animate product transition during flip
   * LUX products exit to right, ODE products enter from left
   */
  animateProductTransition(progress) {
    // Calculate flip progress within the flip range (25% to 75%)
    const flipRange = this.flipEndProgress - this.flipStartProgress;
    const flipProgress = (progress - this.flipStartProgress) / flipRange;
    const clampedFlipProgress = Math.max(0, Math.min(1, flipProgress));

    const cardCount = this.luxProductCards.length;
    const effectiveCardDuration = 1 / (cardCount - (cardCount - 1) * (1 - this.flipOverlap));

    // Animate LUX products exiting
    this.luxProductCards.forEach((card, index) => {
      const cardFlipStart = index * effectiveCardDuration * this.flipOverlap;
      const cardFlipEnd = cardFlipStart + effectiveCardDuration;

      if (clampedFlipProgress >= cardFlipEnd) {
        // Fully exited
        card.style.transform = 'translateX(100%)';
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
      } else if (clampedFlipProgress >= cardFlipStart) {
        // Currently exiting
        const cardProgress = (clampedFlipProgress - cardFlipStart) / (cardFlipEnd - cardFlipStart);

        // Exit to right with fade
        const translateX = cardProgress * 100;
        card.style.transform = `translateX(${translateX}%)`;
        card.style.opacity = `${1 - cardProgress}`;
        card.style.pointerEvents = cardProgress > 0.5 ? 'none' : 'auto';
      } else {
        // Not yet exiting - stay in place
        card.style.transform = 'translateX(0)';
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
      }
    });

    // Animate ODE products entering
    this.odeProductCards.forEach((card, index) => {
      const cardFlipStart = index * effectiveCardDuration * this.flipOverlap;
      const cardFlipEnd = cardFlipStart + effectiveCardDuration;

      if (clampedFlipProgress >= cardFlipEnd) {
        // Fully entered
        card.style.transform = 'translateX(0)';
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
      } else if (clampedFlipProgress >= cardFlipStart) {
        // Currently entering
        const cardProgress = (clampedFlipProgress - cardFlipStart) / (cardFlipEnd - cardFlipStart);

        // Enter from left with fade in
        const translateX = (1 - cardProgress) * -100;
        card.style.transform = `translateX(${translateX}%)`;
        card.style.opacity = `${cardProgress}`;
        card.style.pointerEvents = cardProgress > 0.5 ? 'auto' : 'none';
      } else {
        // Not yet entering - stay hidden
        card.style.transform = 'translateX(-100%)';
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
      }
    });
  }

  /**
   * Set cards to fully flipped state (for when past scroll range)
   */
  setFullyFlipped() {
    // Flip all LUX cards to ODE
    this.luxuryCards.forEach(card => {
      const cardInner = card.querySelector('.luxury-card__inner');
      const odeVideo = card.querySelector('.luxury-card__video--ode');

      // Ensure card is in final position and fully visible
      card.style.transform = 'translateX(0)';
      card.style.opacity = '1';

      if (cardInner) {
        cardInner.style.transform = 'rotateY(180deg)';
      }
      if (odeVideo && odeVideo.duration && !isNaN(odeVideo.duration)) {
        odeVideo.currentTime = odeVideo.duration;
      }
    });

    // Hide all LUX products
    this.luxProductCards.forEach(card => {
      card.style.transform = 'translateX(100%)';
      card.style.opacity = '0';
      card.style.pointerEvents = 'none';
    });

    // Show all ODE products
    this.odeProductCards.forEach(card => {
      card.style.transform = 'translateX(0)';
      card.style.opacity = '1';
      card.style.pointerEvents = 'auto';
    });
  }

  /**
   * Reset all cards to initial state
   */
  resetAllCards() {
    // Reset LUX letter cards
    this.luxuryCards.forEach(card => {
      const cardInner = card.querySelector('.luxury-card__inner');
      const luxVideo = card.querySelector('.luxury-card__video--lux');
      const odeVideo = card.querySelector('.luxury-card__video--ode');

      card.style.transform = 'translateX(100vw)';
      card.style.opacity = this.isTabletLandscape() ? '0' : '1';
      card.classList.remove('is-active');

      // Reset flip rotation
      if (cardInner) {
        cardInner.style.transform = 'rotateY(0deg)';
      }

      // Reset videos
      if (luxVideo) {
        luxVideo.currentTime = 0;
      }
      if (odeVideo) {
        odeVideo.currentTime = 0;
      }
    });

    // Reset LUX Product cards
    this.luxProductCards.forEach(card => {
      card.style.transform = 'translateX(100%)';
      card.style.opacity = '0';
      card.style.pointerEvents = 'none';
    });

    // Reset ODE Product cards
    this.odeProductCards.forEach(card => {
      card.style.transform = 'translateX(-100%)';
      card.style.opacity = '0';
      card.style.pointerEvents = 'none';
    });

    // Reset video opacity
    if (this.bagsVideo) {
      this.bagsVideo.style.opacity = 1;
    }

    this.hasPlayed = false;
  }
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  new LuxuryCardsController();
  setupLuxOdeNavigation();
});

/**
 * Setup navigation for LUX/ODE menu links
 * Scrolls to specific positions within the bags-intro section
 */
function setupLuxOdeNavigation() {
  const bagsSection = document.querySelector('.bags-intro');
  if (!bagsSection) return;

  // Handle clicks on LUX/ODE links
  document.querySelectorAll('[data-scroll-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const target = link.getAttribute('data-scroll-target');
      const sectionTop = bagsSection.offsetTop;
      const sectionHeight = bagsSection.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollRange = sectionHeight - viewportHeight;

      let targetProgress;
      if (target === 'lux') {
        // LUX: scroll to 25% progress (cards fully visible, before flip)
        targetProgress = 0.25;
      } else if (target === 'ode') {
        // ODE: scroll to 80% progress (cards fully flipped)
        targetProgress = 0.80;
      }

      // Calculate scroll position
      const scrollPosition = sectionTop + (scrollRange * targetProgress);

      // Instant scroll to position
      window.scrollTo({
        top: scrollPosition,
        behavior: 'instant'
      });
    });
  });
}
