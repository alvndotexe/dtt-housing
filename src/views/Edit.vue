<script lang="ts" setup>
import backIcon from "@/assets/ic_back_grey@3x.png";
import EditHouse from "@/components/EditHouse.vue";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const id = computed(() => {
  const id = route.params.id;
  return id instanceof Array ? parseInt(id[0]) : parseInt(id);
});
</script>
<template>
  <div
    class="grid [&>*]:[grid-area:1/1] hover:cursor-pointer px-2 py-4 sm:px-0"
    @click="router.go(-1)"
  >
    <img class="w-4 h-4" :src="backIcon" alt="" />
    <p class="hidden text-center sm:hidden">Back to overview</p>
    <h1 class="sm:hidden header-1 w-full text-center">Edit Listing</h1>
  </div>
  <h1 class="hidden sm:block header-1 py-2">Edit Listing</h1>
  <EditHouse :type="{ dispatch: 'editHouse', id }" />
</template>
