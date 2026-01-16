/**
 * Sasha Khan — Elite Outfit Builder Controller
 * Features: Swipe navigation, click-to-select combo, color variants
 */

class EliteOutfitBuilder {
  constructor() {
    // Asset paths
    this.basePath = 'assets/images/outfit-builder/elite';

    // Outfit data - items 2,3,4 are color variants grouped together
    this.outfits = [
      {
        id: 1,
        name: 'Tuxedo Dress in Grain de Poudre',
        file: '1_TUXEDO DRESS IN GRAIN DE POUDRE.png',
        comboFile: '1_TUXEDO DRESS IN GRAIN DE POUDRE_model.png',
        description: 'A sophisticated tuxedo dress crafted from luxurious grain de poudre wool. Sharp tailoring meets feminine elegance in this powerful statement piece.',
        hasColorVariants: false
      },
      {
        id: 2,
        name: 'Boxy Dress in Stretch Silk',
        file: '2_BOXY DRESS IN STRETCH SILK_BLACK.png',
        comboFile: '2_BOXY DRESS IN STRETCH SILK_BLACK_model.png',
        description: 'Modern boxy silhouette in sumptuous stretch silk. Available in three sophisticated colorways: classic black, romantic pink, and vibrant yellow.',
        hasColorVariants: true,
        currentColor: 'black',
        colorVariants: {
          black: {
            file: '2_BOXY DRESS IN STRETCH SILK_BLACK.png',
            comboFile: '2_BOXY DRESS IN STRETCH SILK_BLACK_model.png'
          },
          pink: {
            file: '3_BOXY DRESS IN STRETCH SILK_PINK.png',
            comboFile: '3_BOXY DRESS IN STRETCH SILK_PINK_model.png'
          },
          yellow: {
            file: '4_BOXY DRESS IN STRETCH SILK_YELLOW.png',
            comboFile: '4_BOXY DRESS IN STRETCH SILK_YELLOW_model.png'
          }
        }
      },
      {
        id: 5,
        name: 'Lavallière Romper in Silk',
        file: '5_LAVALLIERE ROMPER IN SILK.png',
        comboFile: '5_LAVALLIERE ROMPER IN SILK_model.png',
        description: 'Elegant romper featuring a romantic lavallière neckline in flowing silk. A modern interpretation of classic femininity.',
        hasColorVariants: false
      },
      {
        id: 6,
        name: 'Strapless Dress in Silk Satin',
        file: '6_STRAPLESS DRESS IN SILK SATIN.png',
        comboFile: '6_STRAPLESS DRESS IN SILK SATIN_model.png',
        description: 'Timeless strapless silhouette in lustrous silk satin. The perfect canvas for showcasing refined elegance.',
        hasColorVariants: false
      },
      {
        id: 7,
        name: 'Wool Peacoat',
        file: '7_WOOL PEACOAT.png',
        comboFile: '7_WOOL PEACOAT_model.png',
        description: 'Classic peacoat reimagined in premium wool. Structured shoulders and clean lines create commanding presence.',
        hasColorVariants: false
      },
      {
        id: 8,
        name: 'Strap Tank Dress in Crepe Jersey',
        file: '8_STRAP TANK DRESS IN CREPE JERSEY.png',
        comboFile: '8_STRAP TANK DRESS IN CREPE JERSEY_model.png',
        description: 'Minimalist tank dress in fluid crepe jersey. Delicate straps frame the décolletage while the fabric drapes effortlessly.',
        hasColorVariants: false
      }
    ];

    // Current state
    this.currentIndex = 0;
    this.selectedIndex = 0; // The one showing in combo preview

    // Swipe tracking
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.minSwipeDistance = 50;

    // DOM elements
    this.carousel = document.querySelector('[data-type="outfits"]');
    this.carouselItem = document.querySelector('.outfit-carousel__item');
    this.previewImage = document.querySelector('.outfit-preview__image');
    this.descriptionCard = document.querySelector('.outfit-description');
    this.descriptionTitle = document.querySelector('.outfit-description__title');
    this.descriptionText = document.querySelector('.outfit-description__text');
    this.colorSwatches = document.querySelector('.outfit-carousel__colors');

    this.init();
  }

  /**
   * Initialize the outfit builder
   */
  init() {
    this.setupCarousel();
    this.setupSwipe();
    this.setupClickToSelect();
    this.setupColorSwatches();
    this.setupDescriptionClose();

    // Set initial state
    this.updateCarouselDisplay();
    this.updateComboImage(); // Show first item initially
  }

  /**
   * Setup carousel arrow navigation
   */
  setupCarousel() {
    const prevBtn = this.carousel.querySelector('.outfit-carousel__arrow--prev');
    const nextBtn = this.carousel.querySelector('.outfit-carousel__arrow--next');
    const detailsBtn = this.carousel.querySelector('.outfit-carousel__details-btn');

    prevBtn.addEventListener('click', () => this.navigate(-1));
    nextBtn.addEventListener('click', () => this.navigate(1));
    detailsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showDetails();
    });
  }

  /**
   * Setup swipe/trackpad navigation
   */
  setupSwipe() {
    // Touch events for mobile
    this.carouselItem.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.carouselItem.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });

    // Mouse events for trackpad swipe
    let isMouseDown = false;
    let mouseStartX = 0;

    this.carouselItem.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      mouseStartX = e.clientX;
      this.carouselItem.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', (e) => {
      if (isMouseDown) {
        const mouseEndX = e.clientX;
        const diff = mouseStartX - mouseEndX;

        if (Math.abs(diff) > this.minSwipeDistance) {
          if (diff > 0) {
            this.navigate(1); // Swipe left = next
          } else {
            this.navigate(-1); // Swipe right = prev
          }
        }

        isMouseDown = false;
        this.carouselItem.style.cursor = 'pointer';
      }
    });

    // Wheel event for horizontal scroll
    this.carouselItem.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 30) {
        e.preventDefault();
        if (e.deltaX > 0) {
          this.navigate(1);
        } else {
          this.navigate(-1);
        }
      }
    }, { passive: false });
  }

  /**
   * Handle touch swipe
   */
  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > this.minSwipeDistance) {
      if (diff > 0) {
        this.navigate(1); // Swipe left = next
      } else {
        this.navigate(-1); // Swipe right = prev
      }
    }
  }

  /**
   * Setup click to select (updates combo image)
   */
  setupClickToSelect() {
    const image = this.carousel.querySelector('.outfit-carousel__image');

    image.addEventListener('click', () => {
      this.selectedIndex = this.currentIndex;
      this.updateComboImage();

      // Visual feedback
      this.carouselItem.classList.add('is-selected');
      setTimeout(() => {
        this.carouselItem.classList.remove('is-selected');
      }, 300);
    });
  }

  /**
   * Setup color swatch buttons
   */
  setupColorSwatches() {
    const swatches = this.colorSwatches.querySelectorAll('.outfit-carousel__color-swatch');

    swatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        const color = swatch.dataset.color;
        this.selectColor(color);

        // Update active state
        swatches.forEach(s => s.classList.remove('is-active'));
        swatch.classList.add('is-active');
      });
    });
  }

  /**
   * Select a color variant
   */
  selectColor(color) {
    const outfit = this.outfits[this.currentIndex];

    if (outfit.hasColorVariants) {
      outfit.currentColor = color;
      outfit.file = outfit.colorVariants[color].file;
      outfit.comboFile = outfit.colorVariants[color].comboFile;

      this.updateCarouselDisplay();

      // Also update combo if this is the selected item
      if (this.currentIndex === this.selectedIndex) {
        this.updateComboImage();
      }
    }
  }

  /**
   * Setup description card close button
   */
  setupDescriptionClose() {
    const closeBtn = document.querySelector('.outfit-description__close');
    closeBtn.addEventListener('click', () => this.hideDetails());
  }

  /**
   * Navigate carousel (does NOT update combo image)
   */
  navigate(direction) {
    const newIndex = this.currentIndex + direction;

    // Boundary check
    if (newIndex < 0 || newIndex >= this.outfits.length) return;

    this.currentIndex = newIndex;
    this.updateCarouselDisplay();
    this.hideDetails();
  }

  /**
   * Update carousel display
   */
  updateCarouselDisplay() {
    const outfit = this.outfits[this.currentIndex];

    const image = this.carousel.querySelector('.outfit-carousel__image');
    const name = this.carousel.querySelector('.outfit-carousel__name');
    const prevBtn = this.carousel.querySelector('.outfit-carousel__arrow--prev');
    const nextBtn = this.carousel.querySelector('.outfit-carousel__arrow--next');

    // Update image
    image.classList.add('is-loading');
    const src = `${this.basePath}/outfits/${outfit.file}`;

    const preloader = new Image();
    preloader.onload = () => {
      image.src = src;
      image.alt = outfit.name;
      image.classList.remove('is-loading');
    };
    preloader.onerror = () => {
      image.src = src;
      image.classList.remove('is-loading');
    };
    preloader.src = src;

    // Update name
    name.textContent = outfit.name;

    // Update arrow states
    prevBtn.disabled = this.currentIndex <= 0;
    nextBtn.disabled = this.currentIndex >= this.outfits.length - 1;

    // Show/hide color swatches
    if (outfit.hasColorVariants) {
      this.colorSwatches.hidden = false;
      // Update active swatch
      const swatches = this.colorSwatches.querySelectorAll('.outfit-carousel__color-swatch');
      swatches.forEach(s => {
        s.classList.toggle('is-active', s.dataset.color === outfit.currentColor);
      });
    } else {
      this.colorSwatches.hidden = true;
    }

    // Visual indicator if this is the selected item
    this.carouselItem.classList.toggle('is-current-selection', this.currentIndex === this.selectedIndex);
  }

  /**
   * Update combo/preview image (only called on click)
   */
  updateComboImage() {
    const outfit = this.outfits[this.selectedIndex];

    this.previewImage.classList.add('is-loading');
    const src = `${this.basePath}/combo/${outfit.comboFile}`;

    const preloader = new Image();
    preloader.onload = () => {
      this.previewImage.src = src;
      this.previewImage.alt = outfit.name;
      this.previewImage.classList.remove('is-loading');
    };
    preloader.onerror = () => {
      this.previewImage.src = src;
      this.previewImage.classList.remove('is-loading');
    };
    preloader.src = src;
  }

  /**
   * Show details for current outfit
   */
  showDetails() {
    const outfit = this.outfits[this.currentIndex];

    this.descriptionTitle.textContent = outfit.name;
    this.descriptionText.textContent = outfit.description;
    this.descriptionCard.hidden = false;
  }

  /**
   * Hide details card
   */
  hideDetails() {
    this.descriptionCard.hidden = true;
  }
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  new EliteOutfitBuilder();
});
