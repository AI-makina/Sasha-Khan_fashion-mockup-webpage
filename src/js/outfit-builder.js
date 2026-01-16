/**
 * Sasha Khan — Outfit Builder Controller
 * Interactive outfit combination tool for mixing tops and bottoms
 */

class OutfitBuilder {
  constructor() {
    // Asset paths
    this.basePath = 'assets/images/outfit-builder/freedom';

    // Item data
    this.tops = [
      { code: 'A', name: 'White Satin Blouse', file: 'A_white satin blouse.png', description: 'A timeless white satin blouse with a luxurious sheen. Features a relaxed silhouette with delicate button closures, perfect for elegant day-to-evening transitions.' },
      { code: 'B', name: 'Blouse in Silk Georgette', file: 'B_White, BLOUSE IN SILK GEORGETTE .png', description: 'Ethereal white blouse crafted from flowing silk georgette. The lightweight fabric drapes beautifully, creating an air of effortless sophistication.' },
      { code: 'C', name: 'Brown Blouse in Taffeta', file: 'C_Brown Blouse in taffeta.png', description: 'Rich brown taffeta blouse with structured elegance. The crisp fabric creates beautiful volume while maintaining a refined silhouette.' },
      { code: 'D', name: 'Black Blouse in Taffeta', file: 'D_Black, blouse in taffeta.png', description: 'Dramatic black taffeta blouse with bold presence. Perfect for making a statement with its architectural form and luxurious texture.' },
      { code: 'E', name: 'Boxy Lavallière Top in Organza', file: 'E_BOXY LAVALLIÈRE TOP IN ORGANZA.png', description: 'Modern boxy silhouette meets romantic lavallière detailing in delicate organza. A contemporary interpretation of classic femininity.' },
      { code: 'F', name: 'Oversized Blouse in Lamé Velvet', file: 'F_OVERSIZED BLOUSE IN LAMÉ VELVET DOTTED SILK MUSLIN.png', description: 'Luxurious oversized blouse combining lamé velvet with dotted silk muslin. An opulent piece that captures light with every movement.' },
      { code: 'G', name: 'Lavallière Blouse in Floral Silk', file: 'G_LAVALLIÈRE BLOUSE IN FLORAL SILK MUSLIN.png', description: 'Romantic lavallière blouse in exquisite floral silk muslin. Delicate botanical prints meet timeless elegance in this feminine masterpiece.' }
    ];

    this.bottoms = [
      { code: '1', name: 'Paperbag-Waist Pencil Skirt in Coated Cotton', file: '1_Paperbag-Waist Pencil Skirt in Structured Coated Cotton.png', description: 'Structured pencil skirt with signature paperbag waist in coated cotton. The coating adds subtle sheen while the high waist creates a flattering silhouette.' },
      { code: '2', name: 'Paperbag-Waist Pencil Skirt in Lambskin', file: '2_Paperbag-Waist Pencil Skirt in High-Gloss Lambskin Leather.png', description: 'Luxurious pencil skirt in high-gloss lambskin leather with paperbag waist. Ultra-soft leather meets contemporary design for maximum impact.' },
      { code: '3', name: 'High-Waisted Pencil Skirt in Fluid Satin', file: '3_High-Waisted Pencil Skirt in Fluid Satin with Clean Tailoring.png', description: 'Impeccably tailored pencil skirt in fluid satin. Clean lines and a high waist create timeless elegance perfect for any occasion.' }
    ];

    // Current selection state
    this.currentTop = 0;
    this.currentBottom = 0;

    // DOM elements
    this.topsCarousel = document.querySelector('[data-type="tops"]');
    this.bottomsCarousel = document.querySelector('[data-type="bottoms"]');
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
    this.setupCarousel(this.topsCarousel, 'tops');
    this.setupCarousel(this.bottomsCarousel, 'bottoms');
    this.setupDescriptionClose();

    // Set initial state
    this.updateCarouselDisplay('tops');
    this.updateCarouselDisplay('bottoms');
    this.updateComboImage();
  }

  /**
   * Setup carousel navigation
   */
  setupCarousel(carousel, type) {
    const prevBtn = carousel.querySelector('.outfit-carousel__arrow--prev');
    const nextBtn = carousel.querySelector('.outfit-carousel__arrow--next');
    const detailsBtn = carousel.querySelector('.outfit-carousel__details-btn');

    prevBtn.addEventListener('click', () => this.navigate(type, -1));
    nextBtn.addEventListener('click', () => this.navigate(type, 1));
    detailsBtn.addEventListener('click', () => this.showDetails(type));
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
  navigate(type, direction) {
    const items = type === 'tops' ? this.tops : this.bottoms;
    const current = type === 'tops' ? this.currentTop : this.currentBottom;
    const newIndex = current + direction;

    // Boundary check
    if (newIndex < 0 || newIndex >= items.length) return;

    if (type === 'tops') {
      this.currentTop = newIndex;
    } else {
      this.currentBottom = newIndex;
    }

    this.updateCarouselDisplay(type);
    this.updateComboImage();
    this.hideDetails();
  }

  /**
   * Update carousel display (image, name, arrows)
   */
  updateCarouselDisplay(type) {
    const carousel = type === 'tops' ? this.topsCarousel : this.bottomsCarousel;
    const items = type === 'tops' ? this.tops : this.bottoms;
    const current = type === 'tops' ? this.currentTop : this.currentBottom;
    const item = items[current];

    const image = carousel.querySelector('.outfit-carousel__image');
    const name = carousel.querySelector('.outfit-carousel__name');
    const prevBtn = carousel.querySelector('.outfit-carousel__arrow--prev');
    const nextBtn = carousel.querySelector('.outfit-carousel__arrow--next');

    // Update image with loading state
    image.classList.add('is-loading');
    const newSrc = `${this.basePath}/${type}/${item.file}`;

    const preloader = new Image();
    preloader.onload = () => {
      image.src = newSrc;
      image.alt = item.name;
      image.classList.remove('is-loading');
    };
    preloader.onerror = () => {
      image.src = newSrc;
      image.classList.remove('is-loading');
    };
    preloader.src = newSrc;

    // Update name
    name.textContent = item.name;

    // Update arrow states
    prevBtn.disabled = current <= 0;
    nextBtn.disabled = current >= items.length - 1;
  }

  /**
   * Update combo image based on current selections
   */
  updateComboImage() {
    const topCode = this.tops[this.currentTop].code;
    const bottomCode = this.bottoms[this.currentBottom].code;
    const comboFile = `${bottomCode}+${topCode}.png`;

    this.previewImage.classList.add('is-loading');
    const newSrc = `${this.basePath}/combo/${comboFile}`;

    const preloader = new Image();
    preloader.onload = () => {
      this.previewImage.src = newSrc;
      this.previewImage.alt = `${this.tops[this.currentTop].name} with ${this.bottoms[this.currentBottom].name}`;
      this.previewImage.classList.remove('is-loading');
    };
    preloader.onerror = () => {
      this.previewImage.src = newSrc;
      this.previewImage.classList.remove('is-loading');
    };
    preloader.src = newSrc;
  }

  /**
   * Show details for current item
   */
  showDetails(type) {
    const items = type === 'tops' ? this.tops : this.bottoms;
    const current = type === 'tops' ? this.currentTop : this.currentBottom;
    const item = items[current];

    this.descriptionTitle.textContent = item.name;
    this.descriptionText.textContent = item.description;
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
  new OutfitBuilder();
});
