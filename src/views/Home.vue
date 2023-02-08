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
</script>

<template>
  <section class="section">
    <div class="header">
      <p class="header-1 header-text">Houses</p>
      <RouterLink to="/Add" class="create-new-button buttons-and-tabs">
        <img class="icon white" :src="addIcon" alt="" />
        <img class="icon gray" :src="addIconGrey" alt="" />
        <p class="create-new-button-text">Create New</p>
      </RouterLink>
    </div>
    <div class="search">
      <div class="search-bar-container">
        <img :src="searchIcon" alt="" />
        <input
          class="input"
          type="text"
          v-model="input.value"
          placeholder="Search for a house"
        />
        <button @click="() => (input.value = '')" v-if="input.value.length > 0">
          <img :src="clearIcon" class="small-icon" alt="" />
        </button>
      </div>
      <ul class="search-category-list">
        <li
          :style="{
            'background-color':
              sortBy.value === sortMethod ? 'var(--red)' : 'var(--gray-400)',
          }"
          v-for="[sortMethod, _] in sortMethods"
        >
          <button
            class="buttons-and-tabs"
            @click="() => (sortBy.value = sortMethod)"
          >
            {{ sortMethod }}
          </button>
        </li>
        <button class="buttons-and-tabs" @click="handleOrderBy">
          {{ orderBy.value }}
        </button>
      </ul>
    </div>
    <Suspense>
      <template #default>
        <Houses
          :key="sortMethod"
          :input="{ value: input.value.toLowerCase() }"
          :sortMethod="sortMethod"
        />
      </template>
      <template #fallback>
        <h1>loading...</h1>
      </template>
    </Suspense>
  </section>
</template>

<style scoped>
ul {
  border-radius: var(--rounded-md);
}

li:first-child {
  border-top-left-radius: var(--rounded-md);
  border-bottom-left-radius: var(--rounded-md);
}

li:last-child {
  border-radius: var(--rounded-md);
}

.header {
  margin-block: 1.25rem;
  display: grid;
  isolation: isolate;
}

.header > * {
  grid-column: 1/-1;
  grid-row: 1/-1;
}

.header > .create-new-button {
  z-index: 10;
  place-self: end end;
}

.icon {
  grid-row: auto/ -1;
  z-index: 10;
  height: 1rem;
  width: 1rem;
}

.icon.gray {
  display: block;
}

.icon.white {
  display: none;
}

.create-new-button {
  width: 1rem;
}

.search {
  display: grid;
  grid-template-rows: repeat(1, minmax(1, 1fr));
  gap: 0.75rem;
}

.search-bar-container {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  border-radius: var(--rounded-md);
  background-color: var(--gray-300);
  padding-inline: 0.5rem;
}

.search-bar-container > img {
  height: 1.25rem;
  width: 1.25rem;
}

.search-bar-container > input {
  height: 3rem;
  background-color: var(--gray-300);
}

.search-bar-container > input::placeholder {
  color: var(--gray-500);
}

.search-bar-container > input:focus {
  outline: none;
}

.search-category-list {
  display: flex;
  list-style: none;
  justify-content: space-between;
  background-color: var(--gray-400);
  border-radius: var(--rounded-md);
  color: white;
}

.search-category-list > li {
  text-align: center;
  flex-grow: 1;
}

.search-category-list > li > button {
  height: 3rem;
  padding: 0.5rem;
}

.search-category-list > button {
  background-color: var(--gray-500);
  padding: 0.5rem;
  border-top-right-radius: var(--rounded-md);
  border-bottom-right-radius: var(--rounded-md);
}

/* class="buttons-and-tabs flex items-center gap-4 place-self-end rounded-md p-2 px-6 sm:bg-red sm:text-white" */

.create-new-button-text {
  display: none;
  color: white;
}

@media (min-width: 640px) {
  .header {
    display: flex;
    justify-content: space-between;
  }

  .icon.white {
    display: block;
  }

  .icon.gray {
    display: none;
  }

  .create-new-button-text {
    display: block;
  }

  .create-new-button {
    width: auto;
    display: flex;
    background-color: var(--red);
    gap: 1rem;
    align-items: center;
    border-radius: 0.375rem;
    padding-block: 0.5rem;
    padding-inline: 1.5rem;
  }

  .search {
    display: flex;
    justify-content: space-between;
  }
}
</style>
