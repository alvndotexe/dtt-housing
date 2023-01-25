<script lang="ts" setup>
const { icon, value } = defineProps<{ icon: string; value: string | number }>();
</script>

<template>
  <div class="flex gap-2 items-center">
    <img class="w-5 h-5" :src="icon" alt="" />
    <p class="list text-grey-500">{{ value }}</p>
  </div>
</template>
