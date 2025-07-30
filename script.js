class ExploreMyGallery {
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImg = document.getElementById('lightbox-img');
        this.lightboxTitle = document.getElementById('lightbox-title');
        this.lightboxDescription = document.getElementById('lightbox-description');
        this.imageCounter = document.getElementById('image-counter');
        this.closeBtn = document.getElementById('close-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        
        this.currentImageIndex = 0;
        this.visibleImages = Array.from(this.galleryItems);
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.animateGalleryItems();
        this.updateImageCounter();
    }

    setupEventListeners() {
        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterImages(e.target.dataset.filter));
        });

        // Gallery items
        this.galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => this.openLightbox(index));
        });

        // Lightbox controls
        this.closeBtn.addEventListener('click', () => this.closeLightbox());
        this.prevBtn.addEventListener('click', () => this.previousImage());
        this.nextBtn.addEventListener('click', () => this.nextImage());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.previousImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                }
            }
        });

        // Close lightbox when clicking outside image
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });

        // Touch/swipe support for mobile
        let startX = 0;
        let endX = 0;

        this.lightbox.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.lightbox.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });

        this.handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = startX - endX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.nextImage();
                } else {
                    this.previousImage();
                }
            }
        };
    }

    animateGalleryItems() {
        this.galleryItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.03}s`;
        });
    }

    filterImages(category) {
        // Update active filter button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${category}"]`).classList.add('active');

        // Filter images with staggered animation
        let visibleCount = 0;
        this.galleryItems.forEach((item, index) => {
            const itemCategory = item.dataset.category;
            const shouldShow = category === 'all' || itemCategory === category;
            
            if (shouldShow) {
                item.style.animation = `imageLoad 0.6s ease ${visibleCount * 0.03}s both`;
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.classList.add('hidden');
            }
        });

        // Update visible images array for lightbox navigation
        this.updateVisibleImages();
    }

    updateVisibleImages() {
        this.visibleImages = Array.from(this.galleryItems).filter(item => 
            !item.classList.contains('hidden')
        );
    }

    updateImageCounter() {
        if (this.visibleImages.length > 0) {
            this.imageCounter.textContent = `${this.currentImageIndex + 1} / ${this.visibleImages.length}`;
        }
    }

    openLightbox(index) {
        // Find the index in visible images
        const clickedItem = this.galleryItems[index];
        this.currentImageIndex = this.visibleImages.indexOf(clickedItem);
        
        if (this.currentImageIndex === -1) return;

        const item = this.visibleImages[this.currentImageIndex];
        const img = item.querySelector('img');
        
        this.lightboxImg.src = img.src;
        this.lightboxImg.alt = img.alt;
        this.lightboxTitle.textContent = item.dataset.title;
        this.lightboxDescription.textContent = item.dataset.description;
        
        this.updateImageCounter();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    previousImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.visibleImages.length) % this.visibleImages.length;
        this.updateLightboxImage();
    }

    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.visibleImages.length;
        this.updateLightboxImage();
    }

    updateLightboxImage() {
        const item = this.visibleImages[this.currentImageIndex];
        const img = item.querySelector('img');
        
        // Add smooth transition effect
        this.lightboxImg.style.opacity = '0';
        this.lightboxImg.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            this.lightboxImg.src = img.src;
            this.lightboxImg.alt = img.alt;
            this.lightboxTitle.textContent = item.dataset.title;
            this.lightboxDescription.textContent = item.dataset.description;
            
            this.lightboxImg.style.opacity = '1';
            this.lightboxImg.style.transform = 'scale(1)';
            
            this.updateImageCounter();
        }, 200);
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ExploreMyGallery();
});