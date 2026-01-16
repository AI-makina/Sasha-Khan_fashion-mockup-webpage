/**
 * Sasha Khan — Clothing Section Controller
 * Click-to-shift animation with sequenced panel fading
 */

class ClothingController {
  constructor() {
    this.container = document.querySelector('.clothing__container');
    this.panels = document.querySelectorAll('.clothing-panel');
    this.isAnimating = false;

    if (this.container && this.panels.length === 3) {
      this.init();
    }
  }

  /**
   * Initialize click handlers on panels
   */
  init() {
    this.panels.forEach((panel, index) => {
      panel.addEventListener('click', () => {
        if (!this.isAnimating) {
          this.handlePanelClick(index);
        }
      });
    });
  }

  /**
   * Handle panel click - shift clicked panel to right, fade others
   * @param {number} clickedIndex - Index of clicked panel (0=Freedom, 1=Glamour, 2=Elite)
   */
  handlePanelClick(clickedIndex) {
    // If clicking Elite (already on right), do nothing
    if (clickedIndex === 2) return;

    this.isAnimating = true;

    const freedomPanel = this.panels[0];
    const glamourPanel = this.panels[1];
    const elitePanel = this.panels[2];

    // Add cursor style during animation
    this.container.style.cursor = 'wait';

    if (clickedIndex === 0) {
      // Clicked FREEDOM - shift to right, fade Glamour then Elite

      // Start Freedom shifting immediately (takes full 1.5s)
      freedomPanel.classList.add('is-shifting-right');

      // Glamour starts fading at 0ms, completes by 600ms
      glamourPanel.classList.add('is-fading');

      // Elite starts fading at 400ms, completes by 1000ms
      setTimeout(() => {
        elitePanel.classList.add('is-fading');
      }, 400);

    } else if (clickedIndex === 1) {
      // Clicked GLAMOUR - shift to right, fade Elite

      // Start Glamour shifting immediately
      glamourPanel.classList.add('is-shifting-right-from-center');

      // Elite starts fading at 200ms
      setTimeout(() => {
        elitePanel.classList.add('is-fading');
      }, 200);

      // Freedom fades after a slight delay
      setTimeout(() => {
        freedomPanel.classList.add('is-fading');
      }, 100);
    }

    // Reset after animation completes
    setTimeout(() => {
      this.resetAnimation();
    }, 1500);
  }

  /**
   * Reset all animation states
   */
  resetAnimation() {
    this.panels.forEach(panel => {
      panel.classList.remove('is-shifting-right', 'is-shifting-right-from-center', 'is-fading');
    });
    this.container.style.cursor = '';
    this.isAnimating = false;
  }
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  new ClothingController();
});
