<script lang="ts" setup>
import bath from "@/assets/ic_bath@3x.png";
import bed from "@/assets/ic_bed@3x.png";
import m2 from "@/assets/ic_size@3x.png";
import edit from "@/assets/ic_edit@3x.png";
import deleteIcon from "@/assets/ic_delete@3x.png";
import { House } from "@/store";
import { useRouter } from "vue-router";
import Dialogue from "./Dialogue.vue";
import Icon from "./Icon.vue";
import { reactive } from "vue";

const props = defineProps<{
  house: House;
}>();
const router = useRouter();

const show = reactive({ value: false });
const { location, id, price, rooms, size, image, madeByMe } = props.house;

const numberformater = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "EUR",
});

function handleDelete(e: Event) {
  e.preventDefault();
  show.value = true;
}

function handleEdit(e: Event) {
  e.preventDefault();
  router.push({ name: "Edit", params: { id } });
}
</script>

<template>
  <article class="bg-white rounded-md flex">
    <div
      @click="router.push({ name: 'House', params: { id } })"
      :style="{ 'background-image': 'url(' + image + ')' }"
      class="basis-28 shrink-0 aspect-square bg-cover grow-0 rounded-md m-4"
    >
      &nbsp;
    </div>
    <div
      @click="router.push({ name: 'House', params: { id } })"
      class="shrink flex flex-col justify-around py-4 grow text-grey-500"
    >
      <p class="desktop-header text-black">{{ location.street }}</p>
      <p class="body truncate">{{ numberformater.format(price) }}</p>
      <p class="body truncate">{{ location.zip + " " + location.city }}</p>
      <div class="flex gap-4">
        <Icon :icon="bed" :value="rooms.bedrooms" />
        <Icon :icon="bath" :value="rooms.bedrooms" />
        <Icon :icon="m2" :value="size" />
      </div>
    </div>
    <div v-if="madeByMe" class="p-4 flex items-start gap-2 shrink-0">
      <button @click="handleEdit">
        <img class="h-4" :src="edit" alt="" />
      </button>
      <button @click="handleDelete">
        <img class="h-4" :src="deleteIcon" alt="" />
      </button>
    </div>
  </article>
  <Dialogue :id="house.id" :show="show" />
</template>
