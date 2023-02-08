<script lang="ts" setup>
import home from "@/assets/ic_mobile_navigarion_home@3x.png";
import homeSelected from "@/assets/ic_mobile_navigarion_home_active@3x.png";
import About from "@/assets/ic_mobile_navigarion_info@3x.png";
import AboutSelected from "@/assets/ic_mobile_navigarion_info_active@3x.png";
import logo from "@/assets/img_logo_dtt@3x.png";
import { computed, reactive } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { useStore } from "./store";

const route = useRoute();
const store = useStore();

const status = reactive<{ value: "loading" | "error" | "done" }>({
  value: "loading",
});

store.dispatch("setHouses", undefined).then((r) => {
  if (r.type === "Error") status.value = "error";
  else status.value = "done";
});
const isOnAboutPage = computed(() =>
  route.fullPath.toLowerCase().includes("about")
);
</script>
<template>
  <div class="nav-container" style="container-type: inline-size; width: 100%">
    <nav class="navbar">
      <RouterLink class="home-icon" to="/">
        <img class="w-10" :src="isOnAboutPage ? home : homeSelected" />
      </RouterLink>
      <RouterLink class="about-icon" to="/About">
        <img class="w-10" :src="isOnAboutPage ? AboutSelected : About" />
      </RouterLink>
      <RouterLink class="logo" :to="`/`">
        <img :src="logo" alt="" />
      </RouterLink>
      <RouterLink
        :style="{ color: isOnAboutPage ? 'var(--gray-400)' : 'black' }"
        class="home-text header-1 font-monster"
        to="/"
        >Houses</RouterLink
      >
      <RouterLink
        :style="{ color: isOnAboutPage ? 'black' : 'var(--gray-400)' }"
        class="about-text header-1 font-monster"
        to="/About"
        >About</RouterLink
      >
    </nav>
  </div>
  <h1 v-if="status.value === 'loading'">loading...</h1>
  <RouterView v-if="status.value === 'done'"></RouterView>
  <h1 v-if="status.value === 'error'">oops something went wrong</h1>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-around;
  padding-block: 1rem;
}

.logo,
.about-text,
.home-text {
  display: none;
}

.logo {
  width: 10rem;
}

@media (min-width: 640px) {
  .logo,
  .about-text,
  .home-text {
    display: block;
  }

  .about-icon,
  .home-icon {
    display: none;
  }

  .navbar {
    gap: 2rem;
    justify-content: start;
    padding-inline: min(10vw, 10rem);
  }
}
</style>
