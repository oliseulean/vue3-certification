<script setup>
/* Imports */
import { computed } from 'vue';

/* Props */
const props = defineProps({
  movies: {
    type: Array,
    default: () => [],
  },
  isFormVisible: {
    type: Boolean,
    default: false,
  },
});

/* Emits */
const emit = defineEmits(['toggle-visibility']);

/* Computed */
const moviesLength = computed(() => props.movies?.length);
const computedAverageRating = computed(() => {
  let totalRatings = 0;

  props.movies.forEach((movie) => {
    totalRatings += movie.rating || 0;
  });

  return `Average rating: <strong>${moviesLength.value ? (totalRatings / moviesLength.value).toFixed(2) : 0}</strong>`;
});

const concateTotalMoviesAndAverageRatingWithSpans = computed(() => {
  const totalMovies = `<span class="total-movies">Total Movies: <strong>${moviesLength.value}</strong></span>`;
  const averageRating = `<span class="average-rating">${computedAverageRating.value}</span>`;
  return `${totalMovies} / ${averageRating}`;
});

/* Methods -> Remove Ratings */
const removeRatingsFromAllMovies = () => {
  props.movies.forEach((movie) => {
    movie.rating = 0;
  });
};

/* Methods -> Emits */
const toggleVisibility = () => emit('toggle-visibility');
</script>

<template>
  <div class="navbar">
    <div
      class="navbar__movies-rating"
      v-html="concateTotalMoviesAndAverageRatingWithSpans"
    />
    <div class="navbar__buttons-wrapper">
      <button
        class="navbar__buttons-wrapper__remove-ratings"
        @click="removeRatingsFromAllMovies()"
      >
        Remove Ratings
      </button>
      <button
        v-if="!props.isFormVisible"
        class="navbar__buttons-wrapper__add-movie-button"
        @click="toggleVisibility()"
      >
        Add Movie
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4rem;
  width: 100%;

  &__movies-rating {
    color: white;
    padding: 0.3rem 1.5rem 0.3rem 0;
  }

  &__buttons-wrapper {
    display: flex;
    gap: 1rem;

    &__remove-ratings,
    &__add-movie-button {
      color: white;
      border: 1px red solid;
      padding: 0.3rem 1.5rem;
    }
  }
}

:deep(.total-movies) {
  padding-right: 1rem;
}

:deep(.average-rating) {
  padding-left: 1rem;
}
</style>