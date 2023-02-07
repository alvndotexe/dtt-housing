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

const numberformater = new Intl.NumberFormat("en-EU", {
  style: "currency",
  currency: "EUR",
});

function handleDelete(e: Event) {
  e.preventDefault();
  show.value = true;
}
</script>

<template>
  <article>
    <RouterLink
      :to="`/House/${id}`"
      :style="{ 'background-image': 'url(' + image + ')' }"
      class="house-img"
    >
      &nbsp;
    </RouterLink>
    <RouterLink :to="`/House/${id}`" class="house-data">
      <p class="desktop-header">{{ location.street }}</p>
      <p class="body truncate">{{ numberformater.format(price) }}</p>
      <p class="body truncate">{{ location.zip + " " + location.city }}</p>
      <div style="display: flex; gap: 1rem">
        <Icon :icon="bed" :value="rooms.bedrooms" />
        <Icon :icon="bath" :value="rooms.bedrooms" />
        <Icon :icon="m2" :value="size" />
      </div>
    </RouterLink>
    <div v-if="madeByMe" class="manage-house">
      <RouterLink :to="`/Edit/${id}`">
        <img :src="edit" alt="" />
      </RouterLink>
      <button @click="handleDelete">
        <img :src="deleteIcon" alt="" />
      </button>
    </div>
  </article>
  <Dialogue :id="house.id" :show="show" />
</template>

<style scoped>
article {
  background-color: white;
  border-radius: var(--rounded-md);
  display: flex;
  color: black;
  width: 100%;
}

.house-img {
  margin: 1rem;
  aspect-ratio: 1/1;
  flex-shrink: 0;
  flex: 0 0 7rem;
  border-radius: var(--rounded-md);
  background-size: cover;
}

.house-data {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 1 1;
  padding-block: 1rem;
  background-color: var(--grey-400);
}

.manage-house {
  display: flex;
  flex-shrink: 0;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 1rem;
}
.manage-house > * > img {
  height: 1rem;
}
</style>
