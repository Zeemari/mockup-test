<template>
  <main>
      <RouterView />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Define loading state
const loading = ref(true);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 3000);
});
</script>

<style scoped>
</style>
