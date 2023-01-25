<script lang="ts" setup>
import backIcon from "@/assets/ic_back_grey@3x.png";
import EditHouse from "@/components/EditHouse.vue";
import { useRouter } from "vue-router";

const router = useRouter();
</script>
<template>
  <div
    class="grid [&>*]:[grid-area:1/1] hover:cursor-pointer px-2 py-4 sm:px-0"
    @click="router.go(-1)"
  >
    <img class="w-4 h-4" :src="backIcon" alt="" />
    <p class="hidden text-center sm:hidden">Back to overview</p>
    <h1 class="sm:hidden header-1 w-full text-center">Create new Listing</h1>
  </div>
  <h1 class="hidden sm:block header-1 py-2">Create new Listing</h1>
  <EditHouse :type="{ dispatch: 'addHouse' }" />
</template>
