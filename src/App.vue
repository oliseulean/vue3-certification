<script setup>
/* Imports */
import { items } from './movies.json';
import { StarIcon } from '@heroicons/vue/24/solid';

/* handle formatted rating */
const formattedRating = (rating) => `Rating: (${rating}/5)`;
</script>

<template>
  <div class="app__container">
    <div class="app__cards">
      <div
        v-for="item in items"
        :key="item.id"
        class="app__card"
      >
        <img
          :src="item.image"
          alt="movie poster"
          class="app__card__image"
        >
        <div class="app__card__content">
          <h2 class="app__card__title">
            {{ item.name }}
          </h2>
          <div class="app__card__genre">
            <button
              v-for="genre in item.genres"
              :key="genre"
            >
              {{ genre }}
            </button>
          </div>
          <h2 class="app__card__description">
            {{ item.description }}
          </h2>
          <div class="app__card__rating">
            <p class="app__card__rating__number">
              {{ formattedRating(item.rating) }}
            </p>
            <StarIcon
              v-for="rating in item.rating"
              :key="rating"
              class="app__card__rating__star"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.app__container {
  display: flex;
  margin: 5rem;
}

.app__cards {
  display: flex;
}

.app__card {
  background-color: white;
  margin: 0.3rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: left;

  &__content {
    padding: 1rem;
  }

  &__image {
    width: 100%;
    height: 40rem;
  }

  &__genre,
  &__description,
  &__title {
    color: black;
  }

  &__description {
    font-size: 0.875rem;
    min-height: 7vh;
    margin-bottom: 1rem;
  }

  &__genre {
    flex-direction: column;
    align-items: left;

    button {
      border-radius: 0.25%;
      color: white;
      background-color: blue;
      margin-bottom: 1.25rem;
      padding: 0.25rem 1rem;
    }

    button:not(:first-child) {
      margin-left: 0.5rem;
    }
  }

  &__title {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  &__rating {
    display: flex;

    &__number {
      color: black;
      font-size: 0.875rem;
    }

    &__star {
      color: #EAB30A;
    }

    &__number {
      margin-right: 1rem;
    }

    &__star {
      margin-right: 0.1rem;
      width: 1rem;
    }
  }
}
</style>
