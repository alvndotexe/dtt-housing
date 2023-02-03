<script lang="ts" setup>
import backIcon from "@/assets/ic_back_grey@3x.png";
import EditHouse from "@/components/EditHouse.vue";
import { House, key, useStore } from "@/store";
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const store = useStore();

const house = ref<House | undefined>(undefined);
const houseExists = reactive({ value: false });
store
  .dispatch("getHouseByID", parseInt(route.params.id as string))
  .then((r) => {
    if (!r) houseExists.value = false;
    else house.value = r;
  });

function onSuccess() {
  router.push({ name: "House", params: { id: route.params.id } });
}
</script>
<template>
  <div v-if="house">
    <RouterLink
      to="/"
      class="grid px-2 py-4 hover:cursor-pointer sm:px-0 [&>*]:[grid-area:1/1]"
    >
      <img class="h-4 w-4" :src="backIcon" alt="" />
      <p class="hidden text-center sm:hidden">Back to overview</p>
      <h1 class="header-1 w-full text-center sm:hidden">Edit Listing</h1>
    </RouterLink>
    <h1 class="header-1 hidden py-2 sm:block">Edit Listing</h1>
    <EditHouse
      :type="{ dispatch: 'editHouse', house }"
      :on-success="onSuccess"
    />
  </div>
  <div v-if="!house"></div>
  <div v-if="!houseExists">not found</div>
</template>
