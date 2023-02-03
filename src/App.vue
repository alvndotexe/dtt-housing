<script lang="ts" setup>
import home from "@/assets/ic_mobile_navigarion_home@3x.png";
import homeSelected from "@/assets/ic_mobile_navigarion_home_active@3x.png";
import About from "@/assets/ic_mobile_navigarion_info@3x.png";
import AboutSelected from "@/assets/ic_mobile_navigarion_info_active@3x.png";
import logo from "@/assets/img_logo_dtt@3x.png";
import { computed, reactive, ref } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import { useStore } from "./store";

const route = useRoute();
const store = useStore();

const status = reactive<{ value: "loading" | "error" | "done" }>({
  value: "loading",
});
const divRef = ref<HTMLDivElement | null>(null);

store.dispatch("setHouses", undefined).then((r) => {
  console.log("gothouses", r);
  if (r.type === "Error") status.value = "error";
  else status.value = "done";
});
const isOnAboutPage = computed(() =>
  route.fullPath.toLowerCase().includes("about")
);
</script>
<template>
  <div ref="divRef" class="flex h-full flex-col justify-between bg-grey-200">
    <nav
      class="order-1 flex grow-0 items-center justify-around bg-white py-4 sm:-order-1 sm:justify-between sm:gap-16 sm:px-[min(10vw,10rem)]"
    >
      <RouterLink class="sm:hidden" to="/">
        <img class="w-10" :src="isOnAboutPage ? home : homeSelected" />
      </RouterLink>
      <RouterLink class="sm:hidden" to="/About">
        <img class="w-10" :src="isOnAboutPage ? AboutSelected : About" />
      </RouterLink>
      <RouterLink :to="`/`">
        <img class="hidden h-[auto] w-40 sm:block" :src="logo" alt="" />
      </RouterLink>
      <RouterLink
        class="header-2 hidden font-monster sm:block"
        :class="{
          'font-bold': !isOnAboutPage,
          'text-grey-400': isOnAboutPage,
        }"
        to="/"
        >Houses</RouterLink
      >
      <RouterLink
        class="header-2 hidden sm:block"
        :class="{
          'font-bold': isOnAboutPage,
          'text-grey-400': !isOnAboutPage,
        }"
        to="/About"
        >About</RouterLink
      >
    </nav>
    <div
      class="flex grow flex-col overflow-scroll bg-grey-200 bg-cover sm:px-[min(10vw,10rem)]"
      id="main"
    >
      <h1 v-if="status.value === 'loading'">loading...</h1>
      <RouterView v-if="status.value === 'done'"></RouterView>
      <h1 v-if="status.value === 'error'">oops something went wrong</h1>
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
