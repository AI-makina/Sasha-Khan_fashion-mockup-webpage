/**
 * Sasha Khan — Product Modals
 * Handles detail button clicks and modal interactions
 */

class ProductModals {
  constructor() {
    this.detailButtons = document.querySelectorAll('.product-card__detail-btn');
    this.modals = document.querySelectorAll('.product-modal');
    this.closeButtons = document.querySelectorAll('.product-modal__close');
    this.activeModal = null;

    this.init();
  }

  init() {
    // Detail button click handlers
    this.detailButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const product = btn.dataset.product;
        this.openModal(product);
      });
    });

    // Close button handlers
    this.closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeModal();
      });
    });

    // Click outside to close
    this.modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal();
        }
      });
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeModal();
      }
    });
  }

  openModal(product) {
    const modal = document.getElementById(`modal-${product}`);
    if (modal) {
      this.activeModal = modal;
      modal.classList.add('is-active');
      document.body.classList.add('modal-open');
    }
  }

  closeModal() {
    if (this.activeModal) {
      this.activeModal.classList.remove('is-active');
      document.body.classList.remove('modal-open');
      this.activeModal = null;
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ProductModals();
});
