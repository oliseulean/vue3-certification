<script setup>
/* Imports */
import { ref } from 'vue';
import { StarIcon } from '@heroicons/vue/24/solid';
import { items } from './movies.json';

/* State */
const state = ref({
  movies: items,
  maximumRating: 5,
})

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
  return star > (movie.rating || 0);
};
</script>

<template>
  <div class="app">
    <div class="movie-list">
      <div
        v-for="(movie, index) in state.movies"
        :key="`movie-${index}`"
        class="movie-item"
      >
        <div class="movie-item-image-wrapper">
          <img
            :src="movie.image"
            class="movie-item-image"
            alt="Movie Image"
          >
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
            <span class="movie-item-rating-text">
              Rating: {{ movie.rating || '-' }}/{{ state.maximumRating }}
            </span>
            <div class="movie-item-star-icon-wrapper">
              <button
                v-for="star in state.maximumRating"
                :key="star"
                class="movie-item-star-icon-button"
                :class="starIconClass(star, movie)"
                :disabled="disableStar(star, movie)"
                @click="updateRating(movie, star)"
              >
                <StarIcon class="movie-item-star-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>