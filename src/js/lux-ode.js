/**
 * Sasha Khan — LUX to ODE Transition Controller
 * Scroll-driven card flip with coordinated bag sweeps
 */

class LuxOdeTransitionController {
  constructor() {
    this.section = document.querySelector('.lux-ode-transition');
    this.stickyContainer = document.querySelector('.transition-sticky-container');
    this.flipCards = document.querySelectorAll('.flip-card');
    this.luxBags = document.querySelectorAll('.sweep-bag--lux');
    this.odeBags = document.querySelectorAll('.sweep-bag--ode');
    this.cardCount = this.flipCards.length;

    // Animation thresholds per card
    this.cardThresholds = this.calculateThresholds();

    if (this.section && this.flipCards.length > 0) {
      this.init();
    }
  }

  calculateThresholds() {
    // Each card gets ~20% of scroll range (60% total for 3 cards)
    // Remaining 40% is hold time at end
    const progressPerCard = 0.20;
    const thresholds = [];

    for (let i = 0; i < this.cardCount; i++) {
      thresholds.push({
        flipStart: i * progressPerCard,
        flipMid: i * progressPerCard + (progressPerCard / 2),
        flipEnd: (i + 1) * progressPerCard
      });
    }

    return thresholds;
  }

  init() {
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    this.handleScroll();
  }

  handleScroll() {
    const progress = this.calculateProgress();
    this.animateCards(progress);
  }

  calculateProgress() {
    const rect = this.section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const sectionHeight = this.section.offsetHeight;

    const scrollableDistance = sectionHeight - viewportHeight;
    const scrolled = -rect.top;

    const progress = scrolled / scrollableDistance;
    return Math.max(0, Math.min(1, progress));
  }

  animateCards(progress) {
    this.flipCards.forEach((card, index) => {
      const threshold = this.cardThresholds[index];
      const cardInner = card.querySelector('.flip-card__inner');
      const luxBag = this.luxBags[index];
      const odeBag = this.odeBags[index];

      if (progress >= threshold.flipEnd) {
        // Fully flipped
        cardInner.style.transform = 'rotateY(180deg)';

        // LUX bag fully exited
        if (luxBag) {
          luxBag.style.transform = 'translateX(150%)';
          luxBag.style.opacity = '0';
        }
        // ODE bag fully entered
        if (odeBag) {
          odeBag.style.transform = 'translateX(0)';
          odeBag.style.opacity = '1';
        }

      } else if (progress >= threshold.flipStart) {
        // Currently flipping
        const cardProgress = (progress - threshold.flipStart) / (threshold.flipEnd - threshold.flipStart);
        const rotation = cardProgress * 180;
        cardInner.style.transform = `rotateY(${rotation}deg)`;

        // LUX bag exits (first half of flip)
        if (cardProgress < 0.5 && luxBag) {
          const bagExitProgress = cardProgress / 0.5;
          luxBag.style.transform = `translateX(${bagExitProgress * 150}%)`;
          luxBag.style.opacity = `${1 - bagExitProgress}`;
        } else if (luxBag) {
          luxBag.style.transform = 'translateX(150%)';
          luxBag.style.opacity = '0';
        }

        // ODE bag enters (second half of flip)
        if (cardProgress >= 0.5 && odeBag) {
          const bagEnterProgress = (cardProgress - 0.5) / 0.5;
          odeBag.style.transform = `translateX(${-100 + bagEnterProgress * 100}%)`;
          odeBag.style.opacity = `${bagEnterProgress}`;
        } else if (odeBag) {
          odeBag.style.transform = 'translateX(-100%)';
          odeBag.style.opacity = '0';
        }

      } else {
        // Not yet flipping - reset
        cardInner.style.transform = 'rotateY(0deg)';

        if (luxBag) {
          luxBag.style.transform = 'translateX(0)';
          luxBag.style.opacity = '1';
        }
        if (odeBag) {
          odeBag.style.transform = 'translateX(-100%)';
          odeBag.style.opacity = '0';
        }
      }
    });
  }

  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new LuxOdeTransitionController();
});
