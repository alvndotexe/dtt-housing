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
  <p>{{ houses.map((e) => e.id) }}</p>
  <p
    class="desktop-header"
    v-if="props.input.value.length > 0 && houses.length > 0"
  >
    {{ houses.length }} results found
  </p>
  <ul v-if="status.value === 'done'">
    <li class="my-2 list-none" v-if="houses.length > 0" v-for="house in houses">
      <HouseArticle :house="house" />
    </li>
  </ul>
  <div class="grid h-full place-items-center">
    <figure class="text-center" v-if="houses.length === 0">
      <img class="px-12 sm:w-[35rem]" :src="emtpy" alt="" />
      <figcaption class="p-6">
        <p>No results found.</p>
        <p>Please try another keyword</p>
      </figcaption>
    </figure>
  </div>
</template>
