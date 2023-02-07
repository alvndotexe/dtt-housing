<script lang="ts" setup>
import backIcon from "@/assets/ic_back_grey@3x.png";
import EditHouse from "@/components/EditHouse.vue";
</script>
<template>
  <section class="section" id="main">
    <RouterLink to="/">
      <img :src="backIcon" alt="" />
      <p>Back to overview</p>
      <h1 class="header-1 mobile-header">Create new Listing</h1>
    </RouterLink>
    <h1 class="header-1 header">Create new Listing</h1>
    <EditHouse :type="{ dispatch: 'addHouse' }" />
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
