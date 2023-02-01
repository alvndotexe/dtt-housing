<script lang="ts" setup>
import logo from "@/assets/img_logo_dtt@3x.png";
import homeSelected from "@/assets/ic_mobile_navigarion_home_active@3x.png";
import home from "@/assets/ic_mobile_navigarion_home@3x.png";
import AboutSelected from "@/assets/ic_mobile_navigarion_info_active@3x.png";
import About from "@/assets/ic_mobile_navigarion_info@3x.png";
import { computed, reactive, ref, watchEffect } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { key } from "./store";

const route = useRoute();
const router = useRouter();
const store = useStore(key);
const loading = reactive({ value: true });
const divRef = ref<HTMLDivElement | null>(null);

store.dispatch("setHouses").then(() => {
  loading.value = false;
});
const isOnAboutPage = computed(() =>
  route.fullPath.toLowerCase().includes("about")
);
</script>
<template>
  <div ref="divRef" class="h-full bg-grey-200 flex flex-col justify-between">
    <nav
      class="order-1 sm:-order-1 grow-0 flex justify-around sm:justify-between sm:px-[min(10vw,10rem)] sm:gap-16 items-center py-4 bg-white"
    >
      <RouterLink class="sm:hidden" to="/">
        <img class="w-10" :src="isOnAboutPage ? home : homeSelected" />
      </RouterLink>
      <RouterLink class="sm:hidden" to="/About">
        <img class="w-10" :src="isOnAboutPage ? AboutSelected : About" />
      </RouterLink>
      <RouterLink :to="`/`">
        <img class="hidden sm:block w-40 h-[auto]" :src="logo" alt="" />
      </RouterLink>

      <RouterLink
        class="hidden sm:block header-2 font-monster"
        :class="{
          'font-bold': !isOnAboutPage,
          'text-grey-400': isOnAboutPage,
        }"
        to="/"
        >Houses</RouterLink
      >
      <RouterLink
        class="hidden sm:block header-2"
        :class="{
          'font-bold': isOnAboutPage,
          'text-grey-400': !isOnAboutPage,
        }"
        to="/About"
        >About</RouterLink
      >
    </nav>
    <div
      class="overflow-scroll sm:px-[min(10vw,10rem)] bg-grey-200 flex flex-col bg-cover grow"
      id="main"
    >
      <h1 v-if="loading.value">loading...</h1>
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
