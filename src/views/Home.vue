<script lang="ts" setup>
import clearIcon from "@/assets/ic_clear@3x.png";
import addIconGrey from "@/assets/ic_plus_grey@3x.png";
import addIcon from "@/assets/ic_plus_white@3x.png";
import searchIcon from "@/assets/ic_search@3x.png";
import Houses from "@/components/Houses.vue";
import { House } from "@/store";
import { computed, reactive, Suspense } from "vue";

const input = reactive({ value: "" });

const sortBy = reactive<{ value: "price" | "size" | "bedrooms" | "bathrooms" }>(
  { value: "price" }
);
const orderBy = reactive<{ value: "asc" | "dsc" }>({ value: "asc" });

const sortMethods = new Map([
  ["price", (a: House, b: House) => a.price - b.price],
  ["size", (a: House, b: House) => a.size - b.size],
  ["bedrooms", (a: House, b: House) => a.rooms.bedrooms - b.rooms.bedrooms],
  ["bathrooms", (a: House, b: House) => a.rooms.bathrooms - b.rooms.bathrooms],
] as const);

const sortMethod = computed(() => {
  if (orderBy.value === "dsc")
    return (a: House, b: House) => sortMethods.get(sortBy.value)!(a, b) * -1;
  return sortMethods.get(sortBy.value)!;
});

const handleOrderBy = () => {
  if (orderBy.value === "asc") orderBy.value = "dsc";
  else orderBy.value = "asc";
};

const toLowerCaseInput = (e: Event) => {
  input.value = e.target.value.toLowerCase();
};
</script>

<template>
  <section class="h-full flex flex-col px-3">
    <div
      class="grid grid-rows-1 sm:flex sm:justify-between my-6 [&>*]:[grid-area:1/1]"
    >
      <p class="text-center sm:text-start grow header-1">Houses</p>
      <RouterLink
        to="/Add"
        class="sm:bg-red place-self-end sm:text-white rounded-md p-2 buttons-and-tabs flex items-center gap-4 px-6"
      >
        <img class="hidden sm:block w-4 h-4" :src="addIcon" alt="" />
        <img class="block sm:hidden w-4 h-4" :src="addIconGrey" alt="" />
        <p class="hidden sm:block">Create New</p>
      </RouterLink>
    </div>
    <div class="grid grid-rows-2 gap-3 sm:flex sm:justify-between">
      <div
        class="grid grid-cols-[auto_1fr_auto] items-center bg-grey-300 px-2 rounded-md"
      >
        <img :src="searchIcon" class="h-5 w-5" alt="" />
        <input
          class="p-2 h-12 bg-grey-300 placeholder:text-grey-500 focus:outline-none"
          @keyup="toLowerCaseInput"
          type="text"
          placeholder="Search for a house"
        />
        <button @click="() => (input.value = '')" v-if="input.value.length > 0">
          <img :src="clearIcon" class="h-5 w-5" alt="" />
        </button>
      </div>
      <ul
        class="flex justify-between bg-grey-400 text-white list-none rounded-full first:rounded-md last:rounded-md"
      >
        <li
          :class="{ 'bg-red': sortBy.value === sortMethod }"
          class="grow text-center rounded-md"
          v-for="[sortMethod, _] in sortMethods"
        >
          <button class="p-2 h-12" @click="() => (sortBy.value = sortMethod)">
            {{ sortMethod }}
          </button>
        </li>
        <button
          class="text-white bg-grey-500 p-2 rounded-r-md"
          @click="handleOrderBy"
        >
          {{ orderBy.value }}
        </button>
      </ul>
    </div>
    <Suspense>
      <template #default>
        <Houses :input="input" :sortMethod="sortMethod" />
      </template>
      <template #fallback>
        <h1>loading...</h1>
      </template>
    </Suspense>
  </section>
</template>
