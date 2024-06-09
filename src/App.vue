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
import MovieItem from './MovieItem.vue';
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

const setMovieRating = (rating) => movieState.value.movieRating = rating;

const addUpdateMovieStarIconClass = computed(() => {
  return (star) => ({
    'text-yellow-500': star <= movieState.value.movieRating,
    'text-gray-500': star > movieState.value.movieRating,
  });
});
</script>

<template>
  <MovieMenu
    :movies="state.movies"
    :is-form-visible="state.isFormVisible"
    @toggle-visibility="toggleVisibility"
  />
  <div class="app">
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

        <div class="add-movie-rating-stars">
          <button
            v-for="star in state.maximumRating"
            :key="star"
            class="add-movie-rating-star"
            @click.prevent="setMovieRating(star)"
            :class="addUpdateMovieStarIconClass(star)"
          >
            <StarIcon class="h-6 w-6" />
          </button>
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
    <MovieItem
      v-for="movie in state.movies"
      :key="movie.id"
      :movie="movie"
      :is-form-visible="state.isFormVisible"
      :maximum-rating="state.maximumRating"
      @edit-movie="editMovie"
      @remove-movie="removeMovie"
      class="movie-item-child"
    />
  </div>
</template>

<style lang="scss" scoped>
.app {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1rem;
}

.movie-item-child {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
}

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

.add-movie-rating-stars {
  padding: 1rem 0;
}
</style>