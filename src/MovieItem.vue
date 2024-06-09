<script setup>
/* Components */
import UpdateButtonsWrapper from './UpdateButtonsWrapper.vue';
import { StarIcon } from '@heroicons/vue/24/solid';

/* Props */
const props = defineProps({
  movie: {
    type: Object,
    default: () => ({}),
  },
  isFormVisible: {
    type: Boolean,
    default: false,
  },
  maximumRating: {
    type: Number,
    default: 5,
  },
});

/* Emits */
const emit = defineEmits([
  'edit-movie',
  'remove-movie',
  'update-rating',
]);

const updateRating = (movie, rating) => {
  movie.rating = rating;
};

const starIconClass = (star, movie) => {
  return {
    'text-yellow-500': star <= (movie.rating || 0),
    'text-gray-500': star > (movie.rating || 0),
  };
};

const disableStar = (star, movie) => {
  return star === movie.rating;
};

const editMovie = (movie) => emit('edit-movie', movie);
const removeMovie = (movie) => emit('remove-movie', movie);
</script>

<template>
  <div class="movie-list">
    <div class="movie-item-image-wrapper">
      <img
        :src="movie.image"
        class="movie-item-image"
        alt="Movie Image"
      >
      <div class="movie-item-rating">
        <div class="movie-item-star-icon-container">
          <template v-if="movie.rating > 0">
            <StarIcon class="movie-item-star-icon-image-gold" />
          </template>
          <template v-else>
            <StarIcon
              class="movie-item-star-icon-image-gray"
            />
          </template>
          <span class="movie-item-rating-text">{{ movie.rating ?? '-' }}</span>
        </div>
      </div>
    </div>
    <div class="movie-item-content-wrapper">
      <div class="movie-item-title-wrapper">
        <h3 class="movie-item-title">
          {{ movie.name }}
        </h3>
        <div class="movie-item-genres-wrapper">
          <span
            v-for="genre in movie.genres"
            :key="genre"
            class="movie-item-genre-tag"
          >
            {{ genre }}
          </span>
        </div>
      </div>
      <div class="movie-item-description-wrapper">
        <p class="movie-item-description">
          {{ movie.description }}
        </p>
      </div>
      <div class="movie-item-rating-wrapper">
        <span class="movie-item-rating-text-rating">
          Rating: {{ movie.rating || '-' }}/{{ props.maximumRating }}
        </span>
        <div class="movie-item-star-icon-wrapper">
          <button
            v-for="star in props.maximumRating"
            :key="star"
            class="movie-item-star-icon-button"
            :class="starIconClass(star, movie)"
            :disabled="disableStar(star, movie)"
            @click="updateRating(movie, star)"
          >
            <StarIcon class="movie-item-star-icon" />
          </button>
          <UpdateButtonsWrapper
            @edit-movie="editMovie(movie)"
            @remove-movie="removeMovie(movie)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.movie-item-content-wrapper {
  padding: 1rem;
}

.movie-item-description {
  padding: 1rem 0;
}
</style>