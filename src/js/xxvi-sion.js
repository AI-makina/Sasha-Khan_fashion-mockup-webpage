/**
 * Sasha Khan — 20-XXVI-SION Eyewear Collection
 * Interactive eyewear showcase controller
 */

class EyewearSection {
  constructor(sectionElement) {
    this.section = sectionElement;
    this.model = sectionElement.dataset.model;

    // Elements
    this.display = sectionElement.querySelector('.eyewear-display');
    this.transitionVideo = sectionElement.querySelector('.eyewear-display__transition-video');
    this.modelVideo = sectionElement.querySelector('.eyewear-display__model-video');
    this.displayImage = sectionElement.querySelector('.eyewear-display__image');
    this.transitionBtn = sectionElement.querySelector('.eyewear-controls__btn--transition');
    this.modelBtn = sectionElement.querySelector('.eyewear-controls__btn--model');
    this.clearBtn = sectionElement.querySelector('.eyewear-controls__btn--clear');
    this.viewBtn = sectionElement.querySelector('.eyewear-controls__btn--view');
    this.carousel = sectionElement.querySelector('.eyewear-carousel');
    this.carouselWrapper = sectionElement.querySelector('.eyewear-carousel__wrapper');
    this.carouselTrack = sectionElement.querySelector('.eyewear-carousel__track');
    this.carouselItems = sectionElement.querySelectorAll('.eyewear-carousel__item');
    this.prevBtn = sectionElement.querySelector('.eyewear-carousel__arrow--prev');
    this.nextBtn = sectionElement.querySelector('.eyewear-carousel__arrow--next');
    this.infoName = sectionElement.querySelector('.eyewear-info__name');
    this.infoDesc = sectionElement.querySelector('.eyewear-info__description');

    // State
    this.state = {
      selectedFrame: 1,
      displayMode: 'modeling', // 'modeling' | 'transition' | 'video'
      transitionPlayed: false,
      isViewingCarousel: false
    };

    // Frame data
    this.frameData = this.getFrameData();

    // Initialize
    this.init();
  }

  getFrameData() {
    const basePath = `assets/images/glasses/${this.model}`;
    const videoPath = `assets/videos/glasses/${this.model}`;

    if (this.model === 'bianca') {
      return {
        1: {
          name: 'Soleil Transition',
          description: 'A refined clear frame equipped with advanced transition lenses that adapt smoothly to changing light. Lightweight construction and elegant curves blend innovation with understated luxury.',
          modelingImage: `${basePath}/frame_modeling/Frame_1_Bianca.png`,
          polarizedImage: `${basePath}/frame_modeling/Frame_1_Polarize_Bianca.png`,
          transitionVideo: `${videoPath}/Frame_1_Polarize transition_Bianca.mp4`,
          modelVideo: `${videoPath}/Frames_1_Bianca.mp4`,
          hasTransition: true
        },
        2: {
          name: 'Nocturne Square',
          description: 'A bold square silhouette in polished black acetate, finished with softly tinted lenses for controlled contrast. Architectural lines deliver confident, statement-making sophistication.',
          modelingImage: `${basePath}/frame_modeling/Frame_2_Bianca.png`,
          modelVideo: `${videoPath}/Frames_2_Bianca.mp4`
        },
        3: {
          name: 'Rouge Lumière',
          description: 'Translucent red acetate frames vibrant gradient lenses with striking depth. Designed to balance bold color with refined structure, this style radiates modern glamour.',
          modelingImage: `${basePath}/frame_modeling/Frame_3_Bianca.png`,
          modelVideo: `${videoPath}/Frames_3_Bianca.mp4`
        },
        4: {
          name: 'Champagne Fade',
          description: 'Warm champagne-toned acetate meets softly shaded lenses for a luminous, elevated look. Subtle transparency and rounded proportions evoke timeless elegance.',
          modelingImage: `${basePath}/frame_modeling/Frame_4_Bianca.png`,
          modelVideo: `${videoPath}/Frames_4_Bianca.mp4`
        },
        5: {
          name: 'Obsidian Icon',
          description: 'An oversized black frame accented with metallic signature detailing at the temples. Deep gradient lenses and commanding proportions create unmistakable luxury presence.',
          modelingImage: `${basePath}/frame_modeling/Frames_5_Bianca.png`,
          modelVideo: `${videoPath}/Frames_5_Bianca.mp4`
        },
        6: {
          name: 'Rose Prism',
          description: 'Faceted blush acetate frames with angular contours offer a sculptural, fashion-forward silhouette. Light-catching transparency adds a refined yet playful sophistication.',
          modelingImage: `${basePath}/frame_modeling/Frames_6_Bianca.png`,
          modelVideo: `${videoPath}/Frames_6_Bianca.mp4`
        },
        7: {
          name: 'Crystal Amber',
          description: 'A softly contoured crystal-clear frame warmed with amber undertones. Feminine curvature and minimalist detailing create an effortlessly chic everyday statement.',
          modelingImage: `${basePath}/frame_modeling/Frames_7_Bianca.png`,
          modelVideo: `${videoPath}/Frames_7_Bianca.mp4`
        }
      };
    } else {
      // Kat
      return {
        1: {
          name: 'Éclipse Clear',
          description: 'A sculpted clear acetate frame paired with adaptive transition lenses that shift seamlessly from indoor clarity to outdoor protection. Clean geometry and technical refinement create an effortlessly modern essential.',
          modelingImage: `${basePath}/frame_modeling/Frames_1_Kat.png`,
          polarizedImage: `${basePath}/frame_modeling/Frames_1_Polarized_Kat.png`,
          transitionVideo: `${videoPath}/Frames_1_Polarized transition_Kat.mp4`,
          modelVideo: `${videoPath}/Frames_1_Kat.mp4`,
          hasTransition: true
        },
        2: {
          name: 'Nocturne Square',
          description: 'A bold square silhouette in polished black acetate, finished with softly tinted lenses for controlled contrast. Architectural lines deliver confident, statement-making sophistication.',
          modelingImage: `${basePath}/frame_modeling/Frames_2_Kat.png`,
          modelVideo: `${videoPath}/Frames_2_Kat.mp4`
        },
        3: {
          name: 'Rouge Lumière',
          description: 'Translucent red acetate frames vibrant gradient lenses with striking depth. Designed to balance bold color with refined structure, this style radiates modern glamour.',
          modelingImage: `${basePath}/frame_modeling/Frames_3_Kat.png`,
          modelVideo: `${videoPath}/Frames_3_Kat.mp4`
        },
        4: {
          name: 'Champagne Fade',
          description: 'Warm champagne-toned acetate meets softly shaded lenses for a luminous, elevated look. Subtle transparency and rounded proportions evoke timeless elegance.',
          modelingImage: `${basePath}/frame_modeling/Frames_4_Kat.png`,
          modelVideo: `${videoPath}/Frames_4_Kat.mp4`
        },
        5: {
          name: 'Obsidian Icon',
          description: 'An oversized black frame accented with metallic signature detailing at the temples. Deep gradient lenses and commanding proportions create unmistakable luxury presence.',
          modelingImage: `${basePath}/frame_modeling/Frames_5_Kat.png`,
          modelVideo: `${videoPath}/Frames_5_Kat.mp4`
        },
        6: {
          name: 'Rose Prism',
          description: 'Faceted blush acetate frames with angular contours offer a sculptural, fashion-forward silhouette. Light-catching transparency adds a refined yet playful sophistication.',
          modelingImage: `${basePath}/frame_modeling/Frames_6_Kat.png`,
          modelVideo: `${videoPath}/Frames_6_Kat.mp4`
        },
        7: {
          name: 'Crystal Amber',
          description: 'A softly contoured crystal-clear frame warmed with amber undertones. Feminine curvature and minimalist detailing create an effortlessly chic everyday statement.',
          modelingImage: `${basePath}/frame_modeling/Frames_7_Kat.png`,
          modelVideo: `${videoPath}/Frames_7_Kat.mp4`
        }
      };
    }
  }

  init() {
    this.setupCarousel();
    this.setupButtons();
    this.setupVideoEvents();
    this.selectFrame(1);
  }

  // ═══════════════════════════════════════════════════════════
  // CAROUSEL
  // ═══════════════════════════════════════════════════════════

  setupCarousel() {
    // Calculate item dimensions for positioning
    this.itemWidth = 200; // Base item width
    this.itemGap = 16; // Gap between items (--space-md)

    // Arrow navigation
    this.prevBtn.addEventListener('click', () => this.navigateCarousel(-1));
    this.nextBtn.addEventListener('click', () => this.navigateCarousel(1));

    // Click on item to select
    this.carouselItems.forEach(item => {
      item.addEventListener('click', () => {
        const frame = parseInt(item.dataset.frame);
        this.selectFrame(frame);
      });
    });

    // Swipe/drag support on wrapper
    let startX = 0;
    let isDragging = false;
    let hasMoved = false;

    const handleDragStart = (clientX) => {
      startX = clientX;
      isDragging = true;
      hasMoved = false;
      this.carouselTrack.style.transition = 'none';
    };

    const handleDragEnd = (clientX) => {
      if (!isDragging) return;
      isDragging = false;

      this.carouselTrack.style.transition = 'transform 0.4s cubic-bezier(0.19, 1, 0.22, 1)';

      const diff = startX - clientX;

      if (Math.abs(diff) > 50) {
        this.navigateCarousel(diff > 0 ? 1 : -1);
      } else {
        // Snap back to current position
        this.centerCarouselItem(this.state.selectedFrame);
      }
    };

    // Touch events on wrapper
    this.carouselWrapper.addEventListener('touchstart', (e) => {
      handleDragStart(e.touches[0].clientX);
    }, { passive: true });

    this.carouselWrapper.addEventListener('touchend', (e) => {
      handleDragEnd(e.changedTouches[0].clientX);
    });

    // Mouse events on wrapper
    this.carouselWrapper.addEventListener('mousedown', (e) => {
      handleDragStart(e.clientX);
      e.preventDefault();
    });

    this.carouselWrapper.addEventListener('mouseleave', (e) => {
      if (isDragging) {
        handleDragEnd(e.clientX);
      }
    });

    document.addEventListener('mouseup', (e) => {
      if (isDragging) {
        handleDragEnd(e.clientX);
      }
    });

    // Wheel/trackpad horizontal scroll with throttle
    let wheelThrottled = false;
    this.carouselWrapper.addEventListener('wheel', (e) => {
      // Check if horizontal scroll or shift+wheel
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
        e.preventDefault();

        if (wheelThrottled) return;
        wheelThrottled = true;

        const direction = (e.deltaX || e.deltaY) > 0 ? 1 : -1;
        this.navigateCarousel(direction);

        setTimeout(() => {
          wheelThrottled = false;
        }, 300);
      }
    }, { passive: false });

    // Initial centering after setup
    requestAnimationFrame(() => {
      this.centerCarouselItem(1);
    });
  }

  navigateCarousel(direction) {
    const totalFrames = this.carouselItems.length;
    let newFrame = this.state.selectedFrame + direction;

    // Endless carousel
    if (newFrame < 1) newFrame = totalFrames;
    if (newFrame > totalFrames) newFrame = 1;

    this.selectFrame(newFrame);
  }

  selectFrame(frameNum) {
    this.state.selectedFrame = frameNum;
    const frameData = this.frameData[frameNum];

    // Update carousel active state
    this.carouselItems.forEach(item => {
      const isActive = parseInt(item.dataset.frame) === frameNum;
      item.classList.toggle('is-active', isActive);
    });

    // Center the selected item
    this.centerCarouselItem(frameNum);

    // Update info
    this.infoName.textContent = frameData.name;
    this.infoDesc.textContent = frameData.description;

    // Update display based on frame type
    if (frameData.hasTransition) {
      this.showTransitionMode(frameData);
    } else {
      this.showModelingMode(frameData);
    }

    // Reset view state
    this.state.isViewingCarousel = false;
    this.viewBtn.classList.remove('is-active');
  }

  centerCarouselItem(frameNum) {
    const items = Array.from(this.carouselItems);
    const selectedIndex = items.findIndex(item => parseInt(item.dataset.frame) === frameNum);

    if (selectedIndex === -1) return;

    // Get actual dimensions from the DOM
    const wrapperWidth = this.carouselWrapper.offsetWidth;
    const firstItem = items[0];
    const itemWidth = firstItem.offsetWidth;
    const computedStyle = getComputedStyle(this.carouselTrack);
    const gap = parseFloat(computedStyle.gap) || 16;

    // Calculate offset to center the selected item
    // Each item position = index * (itemWidth + gap)
    const itemPosition = selectedIndex * (itemWidth + gap);
    const itemCenter = itemPosition + (itemWidth / 2);
    const wrapperCenter = wrapperWidth / 2;
    const offset = wrapperCenter - itemCenter;

    this.carouselTrack.style.transform = `translateX(${offset}px)`;
  }

  // ═══════════════════════════════════════════════════════════
  // BUTTONS
  // ═══════════════════════════════════════════════════════════

  setupButtons() {
    // Transition button - plays transition video (only for Frame 1)
    this.transitionBtn.addEventListener('click', () => {
      this.playTransitionVideo();
    });

    // Model button - plays model video once then returns to image
    this.modelBtn.addEventListener('click', () => {
      this.playModelVideo();
    });

    // Clear button - resets to start (only for frames with transition)
    this.clearBtn.addEventListener('click', () => {
      this.resetToStart();
    });

    // View button - toggles between carousel image and modeling image
    this.viewBtn.addEventListener('click', () => {
      this.toggleView();
    });
  }

  playTransitionVideo() {
    const frameData = this.frameData[this.state.selectedFrame];
    if (!frameData.hasTransition || !frameData.transitionVideo) return;

    // Preload the polarized image for smooth transition at end
    if (frameData.polarizedImage) {
      const preloadImg = new Image();
      preloadImg.src = frameData.polarizedImage;
    }

    // Hide other media, show transition video
    this.displayImage.hidden = true;
    this.modelVideo.hidden = true;
    this.transitionVideo.hidden = false;

    // Set video source if needed
    const source = this.transitionVideo.querySelector('source');
    if (source.src !== frameData.transitionVideo) {
      source.src = frameData.transitionVideo;
      this.transitionVideo.load();
    }

    // Play from start
    this.transitionVideo.currentTime = 0;
    this.transitionVideo.play();

    // Hide transition button while playing
    this.transitionBtn.classList.add('is-active');
  }

  toggleView() {
    const frameData = this.frameData[this.state.selectedFrame];
    this.state.isViewingCarousel = !this.state.isViewingCarousel;
    this.viewBtn.classList.toggle('is-active', this.state.isViewingCarousel);

    if (this.state.isViewingCarousel) {
      // Show carousel thumbnail (the frame image without model)
      const carouselItem = this.section.querySelector(`.eyewear-carousel__item[data-frame="${this.state.selectedFrame}"] img`);
      this.displayImage.src = carouselItem ? carouselItem.src : frameData.modelingImage;
      this.showImage();

      // Hide action buttons while viewing
      this.transitionBtn.hidden = true;
      this.modelBtn.hidden = true;
      this.clearBtn.hidden = true;
    } else {
      // Return to modeling image or transition mode
      if (frameData.hasTransition) {
        this.showTransitionMode(frameData);
      } else {
        this.showModelingMode(frameData);
      }
    }
  }

  // ═══════════════════════════════════════════════════════════
  // VIDEO EVENTS
  // ═══════════════════════════════════════════════════════════

  setupVideoEvents() {
    // When transition video ends, pause at last frame and enable Model button
    this.transitionVideo.addEventListener('ended', () => {
      this.onTransitionVideoEnded();
    });

    // When model video ends, return to image
    this.modelVideo.addEventListener('ended', () => {
      this.returnToImage();
    });
  }

  onTransitionVideoEnded() {
    const frameData = this.frameData[this.state.selectedFrame];

    // Pause video at last frame
    this.transitionVideo.pause();

    // Show polarized image underneath the video first
    if (frameData.polarizedImage) {
      this.displayImage.src = frameData.polarizedImage;
      this.displayImage.hidden = false;
    }

    // Fade out video after a brief moment to allow smooth crossfade
    requestAnimationFrame(() => {
      this.transitionVideo.hidden = true;
    });

    // Mark transition as played
    this.state.transitionPlayed = true;

    // Reset transition button state
    this.transitionBtn.classList.remove('is-active');
    this.transitionBtn.hidden = true;

    // Show Model button, hide Clear button
    this.modelBtn.hidden = false;
    this.clearBtn.hidden = true;
  }

  playModelVideo() {
    const frameData = this.frameData[this.state.selectedFrame];

    // For frame 1 with transition, use the model video if available
    let videoSrc = frameData.modelVideo;

    if (!videoSrc) return;

    // Hide other media
    this.transitionVideo.hidden = true;
    this.displayImage.hidden = true;

    // Setup and play model video
    this.modelVideo.src = videoSrc;
    this.modelVideo.hidden = false;
    this.modelVideo.currentTime = 0;
    this.modelVideo.play();
  }

  returnToImage() {
    const frameData = this.frameData[this.state.selectedFrame];

    this.modelVideo.hidden = true;
    this.modelVideo.pause();

    // For frames with transition, show polarized image and Clear button
    if (frameData.hasTransition && frameData.polarizedImage) {
      this.displayImage.src = frameData.polarizedImage;
      this.displayImage.hidden = false;

      // Show Clear button, hide Model button
      this.modelBtn.hidden = true;
      this.clearBtn.hidden = false;
      this.transitionBtn.hidden = true;
    } else {
      // Return to modeling image for regular frames
      this.displayImage.src = frameData.modelingImage;
      this.displayImage.hidden = false;
    }
  }

  resetToStart() {
    const frameData = this.frameData[this.state.selectedFrame];

    // Reset to initial state - modeling image with Transition button
    this.state.transitionPlayed = false;

    this.displayImage.src = frameData.modelingImage;
    this.displayImage.hidden = false;
    this.transitionVideo.hidden = true;
    this.modelVideo.hidden = true;

    // Show Transition button, hide Model and Clear buttons
    this.transitionBtn.hidden = false;
    this.modelBtn.hidden = true;
    this.clearBtn.hidden = true;
  }

  // ═══════════════════════════════════════════════════════════
  // DISPLAY MODES
  // ═══════════════════════════════════════════════════════════

  showTransitionMode(frameData) {
    // For frames with transition, show modeling image initially
    // Transition button plays the transition video
    this.displayImage.src = frameData.modelingImage;
    this.displayImage.hidden = false;
    this.transitionVideo.hidden = true;
    this.modelVideo.hidden = true;

    // Show transition button, hide model and clear buttons
    this.transitionBtn.hidden = false;
    this.modelBtn.hidden = true;
    this.clearBtn.hidden = true;

    // Reset transition state for this frame
    this.state.transitionPlayed = false;
  }

  showModelingMode(frameData) {
    // Show modeling image
    this.displayImage.src = frameData.modelingImage;
    this.displayImage.hidden = false;
    this.transitionVideo.hidden = true;
    this.modelVideo.hidden = true;

    // Hide transition and clear buttons, show model button
    this.transitionBtn.hidden = true;
    this.modelBtn.hidden = false;
    this.clearBtn.hidden = true;
  }

  showImage() {
    this.displayImage.hidden = false;
    this.transitionVideo.hidden = true;
    this.modelVideo.hidden = true;
  }
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.eyewear-section');
  sections.forEach(section => {
    new EyewearSection(section);
  });
});
