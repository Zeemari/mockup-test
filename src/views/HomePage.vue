<template>
  <main>
    <!-- Search Bar -->
    <div class="search-background">
      <div class="search-container">
        <template v-if="searching && !searchComplete">
          <span class="search-text">
            <strong
              >Searching for
              <span style="color: #bdbdbd">"{{ searchQuery }}"</span>
            </strong>
          </span>
        </template>

        <div v-if="searchComplete && !loading" class="search-result-message">
          <strong
            >Search Results for
            <span style="color: #bdbdbd">"{{ searchQuery }}"</span>
          </strong>
          &nbsp; &nbsp;<button @click="clearSearch" class="clear-btn">✕</button>
        </div>

        <template v-else-if="!searching">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            class="input-text"
            v-model="searchQuery"
            placeholder="Search for photo"
            @keyup.enter="handleSearch"
          />
        </template>
      </div>
    </div>

    <!-- Gallery -->
    <div class="gallery-container">
      <div class="gallery">
        <!-- Loading Placeholder -->
        <template v-if="loading">
          <div class="card skeleton-card" v-for="index in 6" :key="index">
            <div class="skeleton-image"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text small"></div>
          </div>
        </template>

        <!-- Photo Cards -->
        <template v-else>
          <div
            v-for="(photo, index) in photos"
            :key="photo.id"
            class="card"
            :class="{ tall: index === 1 || index === 4 }"
          >
            <img
              :src="photo.image"
              :alt="photo.name"
              @click="openModal(photo)"
            />
            <div class="overlay"></div>
            <div v-if="index !== 4" class="info">
              <h3>{{ photo.name }}</h3>
              <p>{{ photo.location || "Unknown Location" }}</p>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="selectedPhoto" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeModal">✕</button>
        <img
          :src="selectedPhoto.image"
          :alt="selectedPhoto.name"
          class="modal-image"
        />
        <div class="modal-info">
          <h3>{{ selectedPhoto.name }}</h3>
          <p>{{ selectedPhoto.location || "Unknown Location" }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { fetchPhotos, searchPhotos } from "../services/apiService";

export default {
  data() {
    return {
      selectedPhoto: null,
      photos: [],
      searchQuery: "",
      loading: true,
      searching: false,
      searchComplete: false,
    };
  },
  methods: {
    async loadPhotos() {
      this.loading = true;
      this.photos = await fetchPhotos();
      this.photos = this.photos.map((photo) => ({
        id: photo.id,
        image: photo.urls.small,
        name: photo.user.name,
        location: photo.user.location || "Unknown Location",
      }));
      this.loading = false;
    },
    async handleSearch() {
      if (!this.searchQuery) return;

      this.searching = true; 
      this.searchComplete = false;
      this.loading = true;

      try {
        const results = await searchPhotos(this.searchQuery);
        this.photos = results.map((photo) => ({
          id: photo.id,
          image: photo.urls.small,
          name: photo.user.name,
          location: photo.user.location || "Unknown Location",
        }));

        setTimeout(() => {
          this.loading = false;
          this.searching = false;
          this.searchComplete = true;
        }, 500);
      } catch (error) {
        console.error("Error fetching search results:", error);
        this.loading = false;
      }
    },
    clearSearch() {
      this.searching = false;
      this.searchComplete = false;
      this.searchQuery = "";
      this.loadPhotos();
    },
    openModal(photo) {
      this.selectedPhoto = photo;
    },
    closeModal() {
      this.selectedPhoto = null;
    },
  },
  mounted() {
    this.loadPhotos();
  },
};
</script>

<style scoped>
main {
  text-align: start;
}

.search-text, .search-result-message{
    font-size: 20px;
}

.input-text::placeholder {
  color: black !important;
  opacity: 1;
}
</style>
