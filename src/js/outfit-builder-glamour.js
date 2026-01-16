/**
 * Sasha Khan — Glamour Outfit Builder Controller
 * Single carousel for dress selection
 */

class GlamourOutfitBuilder {
  constructor() {
    // Asset paths
    this.basePath = 'assets/images/outfit-builder/glamour';

    // Dress data
    this.dresses = [
      { code: '1', name: 'Sequined Evening Gown', file: '1_Sequined Evening Gown.png', description: 'A breathtaking floor-length gown adorned with thousands of hand-sewn sequins. This masterpiece captures and reflects light with every movement, creating a mesmerizing effect perfect for red carpet moments.' },
      { code: '2', name: 'Mini Dress in Knit', file: '2_mini dress in knit.png', description: 'Contemporary mini dress crafted from luxurious knit fabric. The body-conscious silhouette celebrates the feminine form while the premium knit ensures comfort and elegant drape.' },
      { code: '3', name: 'Ruffled Dress in Silk Satin', file: '3_ruffled dress in silk satin.png', description: 'Romantic ruffled dress in sumptuous silk satin. Cascading ruffles create movement and drama, while the lustrous fabric adds timeless sophistication to this show-stopping piece.' },
      { code: '4', name: 'Ruched Mini Dress in Leopard Tulle', file: '4_RUCHED MINI DRESS IN LEOPARD TULLE JERSEY.png', description: 'Bold and daring mini dress featuring ruched leopard tulle jersey. The strategic ruching flatters the figure while the leopard print makes an unforgettable statement.' },
      { code: '5', name: 'V-Neck Dress in Embroidered Muslin', file: '5_V-NECK DRESS IN EMBROIDERED MUSLIN.png', description: 'Ethereal V-neck dress in delicately embroidered muslin. Intricate embroidery details elevate this feminine piece, perfect for garden parties and romantic evenings.' },
      { code: '6', name: 'Backless Mini Dress in Sable', file: '6_BACKLESS MINI DRESS IN SABLE SAINT LAURENT.png', description: 'Seductive backless mini dress in luxurious sable. The dramatic open back creates allure while the premium fabric ensures an impeccable fit and finish.' }
    ];

    // Current selection
    this.currentDress = 0;

    // DOM elements
    this.carousel = document.querySelector('[data-type="dresses"]');
    this.previewImage = document.querySelector('.outfit-preview__image');
    this.descriptionCard = document.querySelector('.outfit-description');
    this.descriptionTitle = document.querySelector('.outfit-description__title');
    this.descriptionText = document.querySelector('.outfit-description__text');

    this.init();
  }

  /**
   * Initialize the outfit builder
   */
  init() {
    this.setupCarousel();
    this.setupDescriptionClose();

    // Set initial state
    this.updateDisplay();
  }

  /**
   * Setup carousel navigation
   */
  setupCarousel() {
    const prevBtn = this.carousel.querySelector('.outfit-carousel__arrow--prev');
    const nextBtn = this.carousel.querySelector('.outfit-carousel__arrow--next');
    const detailsBtn = this.carousel.querySelector('.outfit-carousel__details-btn');

    prevBtn.addEventListener('click', () => this.navigate(-1));
    nextBtn.addEventListener('click', () => this.navigate(1));
    detailsBtn.addEventListener('click', () => this.showDetails());
  }

  /**
   * Setup description card close button
   */
  setupDescriptionClose() {
    const closeBtn = document.querySelector('.outfit-description__close');
    closeBtn.addEventListener('click', () => this.hideDetails());
  }

  /**
   * Navigate carousel
   */
  navigate(direction) {
    const newIndex = this.currentDress + direction;

    // Boundary check
    if (newIndex < 0 || newIndex >= this.dresses.length) return;

    this.currentDress = newIndex;
    this.updateDisplay();
    this.hideDetails();
  }

  /**
   * Update display (carousel and preview)
   */
  updateDisplay() {
    const dress = this.dresses[this.currentDress];

    // Update carousel image
    const carouselImage = this.carousel.querySelector('.outfit-carousel__image');
    const carouselName = this.carousel.querySelector('.outfit-carousel__name');
    const prevBtn = this.carousel.querySelector('.outfit-carousel__arrow--prev');
    const nextBtn = this.carousel.querySelector('.outfit-carousel__arrow--next');

    carouselImage.classList.add('is-loading');
    const dressSrc = `${this.basePath}/dresses/${dress.file}`;

    const preloader1 = new Image();
    preloader1.onload = () => {
      carouselImage.src = dressSrc;
      carouselImage.alt = dress.name;
      carouselImage.classList.remove('is-loading');
    };
    preloader1.onerror = () => {
      carouselImage.src = dressSrc;
      carouselImage.classList.remove('is-loading');
    };
    preloader1.src = dressSrc;

    // Update name
    carouselName.textContent = dress.name;

    // Update arrow states
    prevBtn.disabled = this.currentDress <= 0;
    nextBtn.disabled = this.currentDress >= this.dresses.length - 1;

    // Update preview image
    this.previewImage.classList.add('is-loading');
    const comboSrc = `${this.basePath}/combo/${dress.code}.png`;

    const preloader2 = new Image();
    preloader2.onload = () => {
      this.previewImage.src = comboSrc;
      this.previewImage.alt = dress.name;
      this.previewImage.classList.remove('is-loading');
    };
    preloader2.onerror = () => {
      this.previewImage.src = comboSrc;
      this.previewImage.classList.remove('is-loading');
    };
    preloader2.src = comboSrc;
  }

  /**
   * Show details for current dress
   */
  showDetails() {
    const dress = this.dresses[this.currentDress];

    this.descriptionTitle.textContent = dress.name;
    this.descriptionText.textContent = dress.description;
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
  new GlamourOutfitBuilder();
});
