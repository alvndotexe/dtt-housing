<script lang="ts" setup>
import emtpy from "@/assets/img_empty_houses@3x.png";
import { House, useStore } from "@/store";
import { NetworkError } from "@/utils";
import { computed, reactive, watchEffect } from "vue";
import HouseArticle from "./HouseArticle.vue";

const props = defineProps<{
  input: { value: string };
  sortMethod: (a: House, b: House) => number;
}>();

const store = useStore();
const status = reactive<{ value: "done" | "loading" | "error" }>({
  value: "loading",
});

const data = await store.dispatch("getHouses", undefined).then((result) => {
  if (result instanceof NetworkError) {
    status.value = "error";
    return [];
  } else {
    status.value = "done";
    return result.map((e: House) => ({
      ...e,
      location: { ...e.location, city: e.location.city.toLowerCase() },
    }));
  }
});

const houses = computed(() =>
  props.input.value.length === 0
    ? data.sort(props.sortMethod)
    : data
        .filter((e) => e.location.city.includes(props.input.value))
        .sort(props.sortMethod)
);

watchEffect(() => console.log(houses.value.map((e) => e.id)));
</script>

<template>
  <p
    class="desktop-header"
    v-if="props.input.value.length > 0 && houses.length > 0"
  >
    {{ houses.length }} results found
  </p>
  <ul v-if="status.value === 'done'">
    <li
      class="house-list-item"
      v-if="houses.length > 0"
      v-for="house in houses"
    >
      <HouseArticle :house="house" />
    </li>
  </ul>
  <div class="empty-houses-placholder">
    <figure v-if="houses.length === 0">
      <img :src="emtpy" alt="" />
      <figcaption>
        <p>No results found.</p>
        <p>Please try another keyword</p>
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.house-list-item {
  margin-block: 0.5rem;
  list-style: none;
}

.empty-houses-placholder {
  text-align: center;
  flex-grow: 1;
  display: grid;
  place-items: center;
}

.empty-houses-placholder > figure > img {
  padding-inline: 3rem;
}

@media (min-width: 640px) {
  .empty-houses-placholder > figure > img {
    width: 35rem;
  }
}
</style>
