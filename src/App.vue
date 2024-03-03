<script setup>
/* Imports */
import { ref, computed } from 'vue';
import { StarIcon } from '@heroicons/vue/24/solid';
import { items } from './movies.json';

/* State */
const state = ref({
  movies: items,
  maximumRating: 5,
  isFormVisible: false,
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

const toggleVisibility = () => {
  if (state.value.isFormVisible) {
    clearForm();
  }
  return state.value.isFormVisible = !state.value.isFormVisible;
};

const computedWrapperClass = computed(() => {
  return {
    'add-movie-wrapper': true,
    'add-movie-wrapper--visible': state.value.isFormVisible,
  };
});

const computedMovieListClass = computed(() => {
  return {
    'movie-list': true,
    'movie-list--is-form-visible': state.value.isFormVisible,
  };
});

const clearForm = () => {
  document.querySelector('.add-movie-name').value = '';
  document.querySelector('.add-movie-description').value = '';
  document.querySelector('.add-movie-image').value = '';
  document.querySelector('.add-movie-genres').selectedIndex = -1;
  document.querySelector('#theaters').checked = false;
};

const addMovie = () => {
  const name = document.querySelector('.add-movie-name').value.trim();
  const description = document.querySelector('.add-movie-description').value.trim();
  const image = document.querySelector('.add-movie-image').value.trim();
  const genres = Array.from(document.querySelector('.add-movie-genres').selectedOptions).map(option => option.value);
  const isInTheaters = document.querySelector('#theaters').checked;

  // Validate if name and at least one genre are provided
  if (!name || genres.length === 0) {
    alert('Please provide a name and select at least one genre.');
    return;
  }

  // Create a new movie object
  const newMovie = {
    name,
    description,
    image,
    genres,
    isInTheaters,
    rating: 0,
  };

  // Add the new movie to the state
  state.value.movies.push(newMovie);

  // Reset form fields
  clearForm();

  // Hide the form
  toggleVisibility();
};
</script>

<template>
  <div class="app">
    <div :class="computedWrapperClass">
      <button
        v-if="!state.isFormVisible"
        class="add-movie-button"
        @click="toggleVisibility()"
      >
        Add Movie
      </button>
      <form
        class="add-movie-form"
        v-if="state.isFormVisible"
      >
        <label for="name">Name: </label>
        <input
          type="text"
          class="add-movie-name"
          name="name"
          required="true"
        >
        <label for="description">Description: </label>
        <textarea
          class="add-movie-description"
          name="description"
        />
        <label for="image">Image: </label>
        <input
          type="text"
          class="add-movie-image"
          name="image"
        >

        <label for="genres">Genres: </label>
        <select
          class="add-movie-genres"
          name="genres"
          multiple="true"
          required="true"
        >
          <option value="Drama">
            Drama
          </option>
          <option value="Crime">
            Crime
          </option>
          <option value="Action">
            Action
          </option>
          <option value="Comedy">
            Comedy
          </option>
        </select>

        <div class="add-movie-checkbox-wrapper">
          <input
            type="checkbox"
            id="theaters"
            name="theaters"
            value="theaters"
          >
          <label for="theaters">In theaters</label>
        </div>

        <div class="add-movie-buttons-wrapper">
          <button
            class="add-movie-cancel"
            @click="toggleVisibility()"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="add-movie-submit"
            @click="addMovie()"
          >
            Create
          </button>
        </div>
      </form>
    </div>
    <div :class="computedMovieListClass">
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
              <span class="movie-item-rating-text">-</span>
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

<style lang="scss">
.add-movie-wrapper {
  position: absolute;
  top: 4rem;
  right: 14rem;
  background-color: blue;
  z-index: 2;

  &--visible {
    background-color: gray;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.add-movie-form {
  display: flex;
  flex-direction: column;
  margin: 1rem;
}

.add-movie-buttons-wrapper {
  display: flex;
  justify-content: space-between;
}

.movie-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding-top: 7rem;

  .movie-item {
    width: calc(33.33% - 50px);
    margin-bottom: 1rem;
  }

  .movie-item .movie-item-image {
    width: 100%;
  }
}

.movie-item-rating {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.movie-item-star-icon-container {
  position: relative;
  display: inline-block;
}

.movie-item-star-icon-image-gold {
  width: 3rem !important;
  height: 3rem !important;
  fill: gold;
}

.movie-item-star-icon-image-gray {
  width: 3rem !important;
  height: 3rem !important;
  fill: gray;
}

.movie-item-rating-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: black;
  font-size: 0.8rem;
}
</style>