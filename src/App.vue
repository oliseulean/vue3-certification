<script setup>
/* Imports */
import {
  ref,
  computed,
  onMounted,
} from 'vue';
import { StarIcon } from '@heroicons/vue/24/solid';
import { items } from './movies.json';

/* Components */
import UpdateButtonsWrapper from './UpdateButtonsWrapper.vue';
import MovieMenu from './MovieMenu.vue';

/* Global Component State */
const state = ref({
  movies: items,
  maximumRating: 5,
  isFormVisible: false,
  isEditing: false,
  editingMovieId: null,
});

/* Movie State */
const movieState = ref({
  movieName: '',
  movieDescription: '',
  movieImage: '',
  movieGenres: [],
  movieInTheaters: false,
});

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
  Object.assign(movieState.value, {
    movieName: '',
    movieDescription: '',
    movieImage: '',
    movieGenres: [],
    movieInTheaters: false,
  });
};

const clearFormAndToggleVisibility = () => {
  clearForm();
  toggleVisibility();
};

const addMovie = () => {
  const movieData = prepareMovieData();
  if (movieData) {
    // Add the new movie to the movies array
    state.value.movies.push(movieData);
    // Clear the form and toggle the visibility
    clearFormAndToggleVisibility();
  }
};

const updateMovie = () => {
  const movieData = prepareMovieData();
  if (movieData) {
    // Find the index of the movie to be edited
    const currIndex = state.value.movies.findIndex((movie) => movie.id === state.value.editingMovieId);

    // Check if the movie is being edited and the index is found
    if (state.value.isEditing && currIndex !== -1) {
      const editedMovie = state.value.movies[currIndex];
      Object.assign(editedMovie, movieData);
      clearFormAndToggleVisibility();
    }
  }
};

const prepareMovieData = () => {
  const {
    movieName,
    movieDescription,
    movieImage,
    movieGenres,
    movieInTheaters,
    movieRating,
  } = movieState.value;

  const name = movieName.trim();

  if (!name || movieGenres.length === 0) {
    alert('Please provide a name and select at least one genre.');
    return null;
  }

  return {
    name,
    description: movieDescription,
    image: movieImage,
    genres: movieGenres,
    isInTheaters: movieInTheaters,
    rating: movieRating,
  };
};

/* Lifecycle hooks */
onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey);
});

/* Event handlers -> Keyboard form visibility */
const handleEscapeKey = (event) => {
  if (state.value.isFormVisible && (event.key === 'Escape' || event.key === 'Esc')) {
    state.value.isFormVisible = false;
    clearForm();
  }
};

const editMovie = (movie) => {
  state.value.isEditing = true;
  state.value.editingMovieId = movie.id;

  Object.assign(movieState.value, {
    movieName: movie.name,
    movieDescription: movie.description,
    movieImage: movie.image,
    movieGenres: movie.genres,
    movieInTheaters: movie.isInTheaters,
  });

  // Preserve the current rating of the movie being edited
  movieState.value.movieRating = movie.rating;

  toggleVisibility();
};

const removeMovie = (movie) => {
  const currIndex = state.value.movies.indexOf(movie);
  state.value.movies.splice(currIndex, 1);
};

const appUpdateMovie = (movie) => state.value.isEditing ? updateMovie(movie) : addMovie(movie);

const computedEditVerbiage = computed(() => state.value.isEditing ? 'Update' : 'Create');
</script>

<template>
  <div class="app">
    <MovieMenu
      :movies="state.movies"
      :is-form-visible="state.isFormVisible"
      @toggle-visibility="toggleVisibility"
    />
    <div :class="computedWrapperClass">
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
          v-model="movieState.movieName"
        >
        <label for="description">Description: </label>
        <textarea
          class="add-movie-description"
          name="description"
          v-model="movieState.movieDescription"
        />
        <label for="image">Image: </label>
        <input
          type="text"
          class="add-movie-image"
          name="image"
          v-model="movieState.movieImage"
        >

        <label for="genres">Genres: </label>
        <select
          class="add-movie-genres"
          name="genres"
          multiple="true"
          required="true"
          v-model="movieState.movieGenres"
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
            v-model="movieState.movieInTheaters"
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
            @click="appUpdateMovie()"
          >
            {{ computedEditVerbiage }}
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
              <UpdateButtonsWrapper
                @edit-movie="editMovie(movie)"
                @remove-movie="removeMovie(movie)"
              />
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

.movie-item-rating-text-rating {
  font-size: 0.875rem;
  margin-right: 1rem;
}
</style>