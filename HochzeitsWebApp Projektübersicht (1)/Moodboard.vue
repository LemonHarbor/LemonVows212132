<template>
  <div class="moodboard">
    <div class="moodboard__header">
      <h1>{{ $t('moodboard.title') }}</h1>
      <p>{{ $t('moodboard.description') }}</p>
    </div>
    
    <div class="moodboard__content">
      <div class="moodboard__actions">
        <button class="btn btn-primary" @click="showAddImageModal">
          <i class="icon icon-plus"></i> {{ $t('moodboard.addImage') }}
        </button>
        <button class="btn btn-secondary" @click="showAddPinterestModal">
          <i class="icon icon-pinterest"></i> {{ $t('moodboard.importFromPinterest') }}
        </button>
        <button class="btn btn-secondary" @click="analyzeColors">
          <i class="icon icon-droplet"></i> {{ $t('moodboard.analyzeColors') }}
        </button>
      </div>
      
      <div class="moodboard__filters">
        <div class="filter-group">
          <label>{{ $t('moodboard.filterByCategory') }}</label>
          <select v-model="categoryFilter">
            <option value="all">{{ $t('common.all') }}</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>{{ $t('moodboard.filterByColor') }}</label>
          <div class="color-filter">
            <div 
              v-for="color in colorFilters" 
              :key="color.id" 
              class="color-swatch" 
              :class="{ active: selectedColorFilter === color.id }"
              :style="{ backgroundColor: color.hex }"
              @click="toggleColorFilter(color.id)"
            ></div>
            <div 
              class="color-swatch all-colors" 
              :class="{ active: selectedColorFilter === 'all' }"
              @click="toggleColorFilter('all')"
            >
              {{ $t('common.all') }}
            </div>
          </div>
        </div>
        
        <div class="filter-group">
          <label>{{ $t('moodboard.search') }}</label>
          <div class="search-input">
            <i class="icon icon-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              :placeholder="$t('moodboard.searchImages')" 
            />
          </div>
        </div>
      </div>
      
      <div v-if="showColorPalette" class="moodboard__color-palette">
        <div class="color-palette">
          <div class="color-palette__header">
            <h3>{{ $t('moodboard.colorPalette') }}</h3>
            <button class="btn-icon" @click="toggleColorPalette">
              <i class="icon icon-x"></i>
            </button>
          </div>
          <div class="color-palette__content">
            <div class="color-palette__swatches">
              <div 
                v-for="(color, index) in colorPalette" 
                :key="index" 
                class="color-palette__swatch"
              >
                <div 
                  class="color-swatch large" 
                  :style="{ backgroundColor: color.hex }"
                ></div>
                <div class="color-palette__swatch-details">
                  <div class="color-palette__swatch-hex">{{ color.hex }}</div>
                  <div class="color-palette__swatch-name">{{ color.name }}</div>
                </div>
              </div>
            </div>
            <div class="color-palette__actions">
              <button class="btn btn-secondary" @click="copyColorPalette">
                <i class="icon icon-copy"></i> {{ $t('moodboard.copyPalette') }}
              </button>
              <button class="btn btn-primary" @click="saveColorPalette">
                <i class="icon icon-save"></i> {{ $t('moodboard.savePalette') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="moodboard__grid">
        <div 
          v-for="image in filteredImages" 
          :key="image.id" 
          class="moodboard-item"
          :class="{ 'featured': image.featured }"
        >
          <div class="moodboard-item__image">
            <img :src="image.url" :alt="image.title" />
            <div class="moodboard-item__overlay">
              <div class="moodboard-item__actions">
                <button class="btn-icon" @click="toggleFeatured(image)">
                  <i :class="['icon', image.featured ? 'icon-star' : 'icon-star-outline']"></i>
                </button>
                <button class="btn-icon" @click="editImage(image)">
                  <i class="icon icon-edit"></i>
                </button>
                <button class="btn-icon" @click="deleteImage(image)">
                  <i class="icon icon-trash"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="moodboard-item__content">
            <div class="moodboard-item__title">{{ image.title }}</div>
            <div class="moodboard-item__category">{{ getCategoryName(image.categoryId) }}</div>
            <div class="moodboard-item__colors">
              <div 
                v-for="(color, index) in image.colors" 
                :key="index" 
                class="color-dot"
                :style="{ backgroundColor: color }"
              ></div>
            </div>
          </div>
        </div>
        
        <div v-if="filteredImages.length === 0" class="empty-state">
          {{ $t('moodboard.noImagesFound') }}
        </div>
      </div>
    </div>
    
    <!-- Add Image Modal -->
    <div class="modal" v-if="showImageModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditMode ? $t('moodboard.editImage') : $t('moodboard.addImage') }}</h3>
          <button class="btn-icon" @click="closeImageModal">
            <i class="icon icon-x"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>{{ $t('moodboard.imageTitle') }} *</label>
            <input type="text" v-model="imageForm.title" required />
          </div>
          
          <div class="form-group">
            <label>{{ $t('moodboard.imageUrl') }} *</label>
            <input type="text" v-model="imageForm.url" required />
          </div>
          
          <div class="form-group">
            <label>{{ $t('moodboard.imagePreview') }}</label>
            <div class="image-preview">
              <img v-if="imageForm.url" :src="imageForm.url" alt="Preview" />
              <div v-else class="image-preview__placeholder">
                <i class="icon icon-image"></i>
                <div>{{ $t('moodboard.previewUnavailable') }}</div>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label>{{ $t('moodboard.category') }} *</label>
            <div class="category-select">
              <select v-model="imageForm.categoryId">
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              <button class="btn btn-small" @click="showAddCategoryModal">
                <i class="icon icon-plus"></i> {{ $t('moodboard.newCategory') }}
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label>{{ $t('moodboard.notes') }}</label>
            <textarea v-model="imageForm.notes" rows="3"></textarea>
          </div>
          
          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="imageForm.featured" />
              {{ $t('moodboard.markAsFeatured') }}
            </label>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeImageModal">
            {{ $t('common.cancel') }}
          </button>
          <button 
            class="btn btn-primary" 
            @click="saveImage" 
            :disabled="!isImageFormValid"
          >
            {{ $t('common.save') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Add Category Modal -->
    <div class="modal" v-if="showCategoryModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ $t('moodboard.addCategory') }}</h3>
          <button class="btn-icon" @click="closeCategoryModal">
            <i class="icon icon-x"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>{{ $t('moodboard.categoryName') }} *</label>
            <input type="text" v-model="categoryForm.name" required />
          </div>
          
          <div class="form-group">
            <label>{{ $t('moodboard.categoryDescription') }}</label>
            <textarea v-model="categoryForm.description" rows="3"></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeCategoryModal">
            {{ $t('common.cancel') }}
          </button>
          <button 
            class="btn btn-primary" 
            @click="saveCategory" 
            :disabled="!isCategoryFormValid"
          >
            {{ $t('common.save') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Pinterest Import Modal -->
    <div class="modal" v-if="showPinterestModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ $t('moodboard.importFromPinterest') }}</h3>
          <button class="btn-icon" @click="closePinterestModal">
            <i class="icon icon-x"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>{{ $t('moodboard.pinterestBoardUrl') }} *</label>
            <input type="text" v-model="pinterestForm.boardUrl" required />
          </div>
          
          <div class="form-group">
            <label>{{ $t('moodboard.category') }} *</label>
            <select v-model="pinterestForm.categoryId">
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="pinterestForm.extractColors" />
              {{ $t('moodboard.extractColors') }}
            </label>
          </div>
          
          <div class="pinterest-info">
            <i class="icon icon-info"></i>
            <div>{{ $t('moodboard.pinterestImportInfo') }}</div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closePinterestModal">
            {{ $t('common.cancel') }}
          </button>
          <button 
            class="btn btn-primary" 
            @click="importFromPinterest" 
            :disabled="!isPinterestFormValid"
          >
            {{ $t('moodboard.import') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Moodboard',
  
  data() {
    return {
      // UI state
      showImageModal: false,
      showCategoryModal: false,
      showPinterestModal: false,
      isEditMode: false,
      showColorPalette: false,
      
      // Filters
      categoryFilter: 'all',
      selectedColorFilter: 'all',
      searchQuery: '',
      
      // Categories
      categories: [
        { 
          id: 'decoration', 
          name: this.$t('moodboard.categories.decoration'),
          description: ''
        },
        { 
          id: 'flowers', 
          name: this.$t('moodboard.categories.flowers'),
          description: ''
        },
        { 
          id: 'dresses', 
          name: this.$t('moodboard.categories.dresses'),
          description: ''
        },
        { 
          id: 'suits', 
          name: this.$t('moodboard.categories.suits'),
          description: ''
        },
        { 
          id: 'venues', 
          name: this.$t('moodboard.categories.venues'),
          description: ''
        },
        { 
          id: 'cakes', 
          name: this.$t('moodboard.categories.cakes'),
          description: ''
        },
        { 
          id: 'invitations', 
          name: this.$t('moodboard.categories.invitations'),
          description: ''
        }
      ],
      
      // Color filters
      colorFilters: [
        { id: 'red', hex: '#EF476F' },
        { id: 'yellow', hex: '#FFD166' },
        { id: 'green', hex: '#06D6A0' },
        { id: 'blue', hex: '#118AB2' },
        { id: 'navy', hex: '#073B4C' },
        { id: 'white', hex: '#FFFFFF' },
        { id: 'black', hex: '#000000' },
        { id: 'pink', hex: '#FFB6C1' },
        { id: 'purple', hex: '#9370DB' }
      ],
      
      // Color palette
      colorPalette: [],
      
      // Images
      images: [],
      
      // Forms
      imageForm: this.getEmptyImageForm(),
      categoryForm: this.getEmptyCategoryForm(),
      pinterestForm: this.getEmptyPinterestForm()
    };
  },
  
  computed: {
    // Filter images based on category, color, and search filters
    filteredImages() {
      return this.images.filter(image => {
        // Apply category filter
        if (this.categoryFilter !== 'all' && image.categoryId !== this.categoryFilter) {
          return false;
        }
        
        // Apply color filter
        if (this.selectedColorFilter !== 'all') {
          const colorHex = this.colorFilters.find(c => c.id === this.selectedColorFilter)?.hex;
          if (colorHex && !this.imageHasColor(image, colorHex)) {
            return false;
          }
        }
        
        // Apply search filter
        if (this.searchQuery.trim() !== '') {
          const query = this.searchQuery.toLowerCase();
          return (
            image.title.toLowerCase().includes(query) ||
            (image.notes && image.notes.toLowerCase().includes(query)) ||
            this.getCategoryName(image.categoryId).toLowerCase().includes(query)
          );
        }
        
        return true;
      });
    },
    
    // Image form validation
    isImageFormValid() {
      return (
        this.imageForm.title.trim() !== '' &&
        this.imageForm.url.trim() !== '' &&
        this.imageForm.categoryId !== ''
      );
    },
    
    // Category form validation
    isCategoryFormValid() {
      return this.categoryForm.name.trim() !== '';
    },
    
    // Pinterest form validation
    isPinterestFormValid() {
      return (
        this.pinterestForm.boardUrl.trim() !== '' &&
        this.pinterestForm.categoryId !== ''
      );
    }
  },
  
  mounted() {
    // Load data
    this.loadImages();
  },
  
  methods: {
    // Data loading methods
    loadImages() {
      // This would be replaced with actual Supabase query
      // In a real implementation, we would fetch data from the backend
      
      // For demo purposes, we'll use mock data
      this.images = [
        {
          id: '1',
          title: 'Elegante Tischdekoration',
          url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          categoryId: 'decoration',
          colors: ['#FFFFFF', '#E5E5E5', '#FFD166', '#118AB2'],
          featured: true,
          notes: 'Schlichte, elegante Tischdekoration mit goldenen Akzenten.'
        },
        {
          id: '2',
          title: 'Brautstrauß in Pastelltönen',
          url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          categoryId: 'flowers',
          colors: ['#FFB6C1', '#FFFFFF', '#06D6A0', '#E5E5E5'],
          featured: false,
          notes: 'Romantischer Brautstrauß mit Rosen und Pfingstrosen.'
        },
        {
          id: '3',
          title: 'Vintage Brautkleid',
          url: 'https://images.unsplash.com/photo-1494955870715-979ca4f13bf0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          categoryId: 'dresses',
          colors: ['#FFFFFF', '#FFF9EB', '#E5E5E5'],
          featured: true,
          notes: 'Vintage-inspiriertes Brautkleid mit Spitzendetails.'
        },
        {
          id: '4',
          title: 'Klassischer Hochzeitsanzug',
          url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          categoryId: 'suits',
          colors: ['#073B4C', '#000000', '#E5E5E5'],
          featured: false,
          notes: 'Eleganter, klassischer Anzug in Dunkelblau.'
        },
        {
          id: '5',
          title: 'Schloss Hochzeitslocation',
          url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          categoryId: 'venues',
          colors: ['#E5E5E5', '#073B4C', '#FFD166'],
          featured: false,
          notes: 'Historisches Schloss mit wunderschönem Garten für die Zeremonie.'
        },
        {
          id: '6',
          title: 'Dreistöckige Hochzeitstorte',
          url: 'https://images.unsplash.com/photo-1535254973040-607b474d7f5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          categoryId: 'cakes',
          colors: ['#FFFFFF', '#FFB6C1', '#06D6A0'],
          featured: true,
          notes: 'Elegante dreistöckige Torte mit Blumendekoration.'
        },
        {
          id: '7',
          title: 'Handgeschriebene Einladungen',
          url: 'https://images.unsplash.com/photo-1607450854611-2e2e6e8d2d5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          categoryId: 'invitations',
          colors: ['#FFF9EB', '#073B4C', '#FFD166'],
          featured: false,
          notes: 'Handgeschriebene Einladungen auf hochwertigem Papier.'
        },
        {
          id: '8',
          title: 'Boho Blumendekoration',
          url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          categoryId: 'decoration',
          colors: ['#06D6A0', '#FFB6C1', '#FFD166', '#FFFFFF'],
          featured: false,
          notes: 'Boho-inspirierte Blumendekoration für die Tische.'
        }
      ];
    },
    
    // UI interaction methods
    toggleColorFilter(colorId) {
      this.selectedColorFilter = this.selectedColorFilter === colorId ? 'all' : colorId;
    },
    
    toggleColorPalette() {
      this.showColorPalette = !this.showColorPalette;
    },
    
    // Image methods
    showAddImageModal() {
      this.isEditMode = false;
      this.imageForm = this.getEmptyImageForm();
      this.showImageModal = true;
    },
    
    editImage(image) {
      this.isEditMode = true;
      this.imageForm = { ...image };
      this.showImageModal = true;
    },
    
    closeImageModal() {
      this.showImageModal = false;
    },
    
    saveImage() {
      if (!this.isImageFormValid) return;
      
      if (this.isEditMode) {
        // Update existing image
        const index = this.images.findIndex(img => img.id === this.imageForm.id);
        if (index !== -1) {
          this.images.splice(index, 1, { ...this.imageForm });
        }
      } else {
        // Add new image
        const newImage = {
          ...this.imageForm,
          id: Date.now().toString(),
          colors: this.generateRandomColors() // In a real app, this would be extracted from the image
        };
        
        this.images.push(newImage);
      }
      
      this.closeImageModal();
    },
    
    deleteImage(image) {
      if (!confirm(this.$t('moodboard.confirmDeleteImage'))) {
        return;
      }
      
      this.images = this.images.filter(img => img.id !== image.id);
    },
    
    toggleFeatured(image) {
      image.featured = !image.featured;
    },
    
    // Category methods
    showAddCategoryModal() {
      this.categoryForm = this.getEmptyCategoryForm();
      this.showCategoryModal = true;
    },
    
    closeCategoryModal() {
      this.showCategoryModal = false;
    },
    
    saveCategory() {
      if (!this.isCategoryFormValid) return;
      
      // Add new category
      const newCategory = {
        ...this.categoryForm,
        id: this.categoryForm.name.toLowerCase().replace(/\s+/g, '_')
      };
      
      this.categories.push(newCategory);
      this.closeCategoryModal();
      
      // Update the image form to use the new category
      this.imageForm.categoryId = newCategory.id;
    },
    
    // Pinterest methods
    showAddPinterestModal() {
      this.pinterestForm = this.getEmptyPinterestForm();
      this.showPinterestModal = true;
    },
    
    closePinterestModal() {
      this.showPinterestModal = false;
    },
    
    importFromPinterest() {
      if (!this.isPinterestFormValid) return;
      
      // In a real implementation, this would call an API to import images from Pinterest
      // For demo purposes, we'll just add some mock images
      
      const mockPinterestImages = [
        {
          id: `pinterest_${Date.now()}_1`,
          title: 'Pinterest Import: Blumendekoration',
          url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          categoryId: this.pinterestForm.categoryId,
          colors: this.generateRandomColors(),
          featured: false,
          notes: `Importiert von Pinterest: ${this.pinterestForm.boardUrl}`
        },
        {
          id: `pinterest_${Date.now()}_2`,
          title: 'Pinterest Import: Tischdekoration',
          url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          categoryId: this.pinterestForm.categoryId,
          colors: this.generateRandomColors(),
          featured: false,
          notes: `Importiert von Pinterest: ${this.pinterestForm.boardUrl}`
        },
        {
          id: `pinterest_${Date.now()}_3`,
          title: 'Pinterest Import: Hochzeitstorte',
          url: 'https://images.unsplash.com/photo-1535254973040-607b474d7f5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          categoryId: this.pinterestForm.categoryId,
          colors: this.generateRandomColors(),
          featured: false,
          notes: `Importiert von Pinterest: ${this.pinterestForm.boardUrl}`
        }
      ];
      
      this.images = [...this.images, ...mockPinterestImages];
      
      this.closePinterestModal();
      
      // Show success message
      alert(this.$t('moodboard.pinterestImportSuccess', { count: mockPinterestImages.length }));
    },
    
    // Color analysis methods
    analyzeColors() {
      // In a real implementation, this would analyze the colors of all images
      // For demo purposes, we'll just generate a random color palette
      
      this.colorPalette = [
        { hex: '#FFD166', name: 'Mustard Yellow' },
        { hex: '#06D6A0', name: 'Mint Green' },
        { hex: '#EF476F', name: 'Bright Pink' },
        { hex: '#118AB2', name: 'Teal Blue' },
        { hex: '#073B4C', name: 'Navy Blue' }
      ];
      
      this.showColorPalette = true;
    },
    
    copyColorPalette() {
      // In a real implementation, this would copy the color palette to the clipboard
      // For demo purposes, we'll just show an alert
      
      const paletteText = this.colorPalette
        .map(color => `${color.name}: ${color.hex}`)
        .join('\n');
      
      // Copy to clipboard
      navigator.clipboard.writeText(paletteText)
        .then(() => {
          alert(this.$t('moodboard.colorPaletteCopied'));
        })
        .catch(err => {
          console.error('Failed to copy palette: ', err);
          alert(this.$t('moodboard.colorPaletteCopyFailed'));
        });
    },
    
    saveColorPalette() {
      // In a real implementation, this would save the color palette to the backend
      // For demo purposes, we'll just show an alert
      
      alert(this.$t('moodboard.colorPaletteSaved'));
      this.showColorPalette = false;
    },
    
    // Utility methods
    getEmptyImageForm() {
      return {
        id: '',
        title: '',
        url: '',
        categoryId: this.categories.length > 0 ? this.categories[0].id : '',
        colors: [],
        featured: false,
        notes: ''
      };
    },
    
    getEmptyCategoryForm() {
      return {
        id: '',
        name: '',
        description: ''
      };
    },
    
    getEmptyPinterestForm() {
      return {
        boardUrl: '',
        categoryId: this.categories.length > 0 ? this.categories[0].id : '',
        extractColors: true
      };
    },
    
    getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      return category ? category.name : '';
    },
    
    imageHasColor(image, colorHex) {
      // In a real implementation, this would check if the image has a similar color
      // For demo purposes, we'll just check if the exact color is in the image's colors array
      return image.colors.some(color => this.areColorsSimilar(color, colorHex));
    },
    
    areColorsSimilar(color1, color2) {
      // In a real implementation, this would compare colors using a color distance algorithm
      // For demo purposes, we'll just check if the colors are exactly the same
      return color1.toLowerCase() === color2.toLowerCase();
    },
    
    generateRandomColors() {
      // In a real implementation, this would extract colors from the image
      // For demo purposes, we'll just generate random colors
      
      const allColors = [
        '#FFFFFF', '#E5E5E5', '#FFD166', '#06D6A0', '#EF476F', 
        '#118AB2', '#073B4C', '#000000', '#FFB6C1', '#9370DB',
        '#FFF9EB'
      ];
      
      const numColors = Math.floor(Math.random() * 3) + 2; // 2-4 colors
      const colors = [];
      
      for (let i = 0; i < numColors; i++) {
        const randomIndex = Math.floor(Math.random() * allColors.length);
        const color = allColors[randomIndex];
        
        if (!colors.includes(color)) {
          colors.push(color);
        }
      }
      
      return colors;
    }
  }
};
</script>

<style scoped>
.moodboard {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #FFF9EB;
}

.moodboard__header {
  padding: 24px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #F2F2F2;
}

.moodboard__content {
  flex: 1;
  padding: 24px;
  overflow: auto;
}

.moodboard__actions {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.moodboard__filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #4F4F4F;
}

.filter-group select,
.filter-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #BDBDBD;
  border-radius: 8px;
  font-family: inherit;
  font-size: inherit;
}

.color-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-swatch.active {
  border-color: #073B4C;
  transform: scale(1.1);
}

.color-swatch.large {
  width: 48px;
  height: 48px;
  cursor: default;
}

.color-swatch.all-colors {
  background-color: transparent;
  border: 2px solid #BDBDBD;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #4F4F4F;
}

.search-input {
  position: relative;
}

.search-input i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #4F4F4F;
}

.search-input input {
  padding-left: 36px;
}

.moodboard__color-palette {
  margin-bottom: 24px;
}

.color-palette {
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.color-palette__header {
  padding: 16px;
  background-color: #F9F9F9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.color-palette__content {
  padding: 16px;
}

.color-palette__swatches {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.color-palette__swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.color-palette__swatch-details {
  text-align: center;
}

.color-palette__swatch-hex {
  font-weight: 500;
  font-size: 14px;
}

.color-palette__swatch-name {
  font-size: 12px;
  color: #4F4F4F;
}

.color-palette__actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.moodboard__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
}

.moodboard-item {
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s ease;
}

.moodboard-item:hover {
  transform: translateY(-4px);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.moodboard-item.featured {
  grid-column: span 2;
  grid-row: span 2;
}

.moodboard-item__image {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 75%;
  overflow: hidden;
}

.moodboard-item.featured .moodboard-item__image {
  padding-bottom: 56.25%;
}

.moodboard-item__image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.moodboard-item__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.moodboard-item:hover .moodboard-item__overlay {
  opacity: 1;
}

.moodboard-item__actions {
  display: flex;
  gap: 8px;
}

.moodboard-item__actions .btn-icon {
  background-color: rgba(255, 255, 255, 0.8);
  color: #073B4C;
}

.moodboard-item__content {
  padding: 16px;
}

.moodboard-item__title {
  font-weight: 500;
  margin-bottom: 4px;
}

.moodboard-item__category {
  font-size: 14px;
  color: #4F4F4F;
  margin-bottom: 8px;
}

.moodboard-item__colors {
  display: flex;
  gap: 4px;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.empty-state {
  grid-column: 1 / -1;
  padding: 24px;
  text-align: center;
  color: #BDBDBD;
}

.category-select {
  display: flex;
  gap: 8px;
}

.category-select select {
  flex: 1;
}

.image-preview {
  width: 100%;
  height: 200px;
  border: 1px solid #BDBDBD;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-preview__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #BDBDBD;
}

.image-preview__placeholder i {
  font-size: 48px;
}

.pinterest-info {
  margin-top: 16px;
  padding: 12px;
  background-color: #F9F9F9;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #4F4F4F;
}

.pinterest-info i {
  color: #FFD166;
  font-size: 18px;
  flex-shrink: 0;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.modal-content {
  background-color: #FFFFFF;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #F2F2F2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 16px;
  flex: 1;
  overflow-y: auto;
}

.modal-footer {
  padding: 16px;
  border-top: 1px solid #F2F2F2;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  color: #4F4F4F;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #BDBDBD;
  border-radius: 8px;
  font-family: inherit;
  font-size: inherit;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn i {
  margin-right: 8px;
}

.btn-primary {
  background-color: #FFD166;
  color: #073B4C;
}

.btn-primary:hover {
  background-color: #FFBE33;
}

.btn-secondary {
  background-color: transparent;
  border: 2px solid #FFD166;
  color: #FFD166;
}

.btn-secondary:hover {
  background-color: #FFF9EB;
}

.btn-small {
  padding: 8px 16px;
  font-size: 14px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background-color: #F2F2F2;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .moodboard-item.featured {
    grid-column: span 1;
    grid-row: span 1;
  }
  
  .color-palette__swatches {
    justify-content: center;
  }
}
</style>
