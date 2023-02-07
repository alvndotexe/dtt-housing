<script lang="ts" setup>
const { icon, value } = defineProps<{ icon: string; value: string | number }>();
</script>

<template>
  <div>
    <img :src="icon" alt="" />
    <p class="list">{{ value }}</p>
  </div>
</template>

<style scoped>
div {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

img {
  height: 1.25rem;
  width: 1.25rem;
}

p {
  color: var(--grey-500);
}
</style>
