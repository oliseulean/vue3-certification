<script setup>
/* Emits */
const emit = defineEmits(['editMovie', 'removeMovie']);

/* Methods */
const editMovie = () => emit('editMovie');
const removeMovie = () => emit('removeMovie');
</script>

<template>
  <div class="update-buttons-wrapper">
    <button
      class="update-movie-button"
      @click="editMovie"
    >
      Edit
    </button>
    <button
      class="remove-movie-button"
      @click="removeMovie"
    >
      Remove
    </button>
  </div>
</template>

<style lang="scss" scoped>
.update-buttons-wrapper {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>