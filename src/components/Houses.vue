<script lang="ts" setup>
import emtpy from "@/assets/img_empty_houses@3x.png";
import { House, key } from "@/store";
import { computed, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import HouseArticle from "./HouseArticle.vue";

const props = defineProps<{
  input: { value: string };
  sortMethod: (a: House, b: House) => number;
}>();

const store = useStore(key);

let data = ref<Array<House>>([]);
data.value = await store.dispatch("getHouses");

const houses = computed(() =>
  props.input.value.length == 0
    ? data.value
        .sort(props.sortMethod)
        .filter((e) =>
          e.location.city.toLowerCase().includes(props.input.value)
        )
    : data.value
        .filter((e) =>
          e.location.city.toLowerCase().includes(props.input.value)
        )
        .sort(props.sortMethod)
        .filter((e) =>
          e.location.city.toLowerCase().includes(props.input.value)
        )
);

watchEffect(() => console.log(houses.value.map((e) => e.price)));
</script>

<template>
  <p
    class="desktop-header"
    v-if="props.input.value.length > 0 && houses.length > 0"
  >
    {{ houses.length }} results found
  </p>
  <ul>
    <li class="list-none my-2" v-if="houses.length > 0" v-for="house in houses">
      <HouseArticle :house="house" />
    </li>
  </ul>
  <div class="grid place-items-center h-full">
    <figure class="text-center" v-if="houses.length === 0">
      <img class="px-12 sm:w-[35rem]" :src="emtpy" alt="" />
      <figcaption class="p-6">
        <p>No results found.</p>
        <p>Please try another keyword</p>
      </figcaption>
    </figure>
  </div>
</template>
