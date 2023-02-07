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
  <section class="section" id="main">
    <RouterLink to="/">
      <img :src="backIcon" alt="" />
      <p>Back to overview</p>
      <h1 class="header-1 mobile-header">Edit Listing</h1>
    </RouterLink>
    <h1 class="header-1 header">Edit Listing</h1>

    <EditHouse
      :type="{ dispatch: 'editHouse', house }"
      :on-success="onSuccess"
      v-if="houseExists && house"
    />
    <div v-else>not found</div>
  </section>
</template>

<style scoped>
a {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding-block: 1rem;
  padding-inline: 0.5rem;
}

a:hover {
  cursor: pointer;
}

a > * {
  grid-area: 1/1;
}

img {
  width: 1rem;
  height: 1rem;
}

p {
  text-align: center;
  color: black;
  display: none;
}

h1 {
  display: inline;
  text-align: center;
}

.header {
  display: none;
}

@container (min-width: calc(640px - 0.75rem)) {
  div {
    padding-inline: 0rem;
  }

  p {
    display: block;
  }

  .mobile-header {
    display: none;
  }

  .header {
    text-align: left;
    display: block;
  }
}
</style>
