<script lang="ts" setup>
import logo from "@/assets/img_logo_dtt@3x.png";
</script>

<template>
  <section class="section">
    <h1 class="header-2">About</h1>
    <section>
      <h2 class="header-1">About DTT Real Estate</h2>
      <p class="body">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus
        atque officiis animi itaque consequuntur quam eaque saepe, aperiam
        voluptates ex modi possimus quasi illum ducimus, voluptate consequatur
        expedita cumque eos, eius aliquam repellat sapiente? Deserunt a magnam
        nihil? Quos ad dignissimos veniam beatae iure quo possimus ex ut nihil
        pariatur, perferendis quasi. Est unde reiciendis odit itaque iste velit
        repudiandae cum facilis ducimus nesciunt provident minus sit pariatur
        dicta enim blanditiis fugit, saepe tempore atque sapiente! Consectetur
        officiis aut vel! Alias exercitationem distinctio eveniet velit aperiam
        tenetur, labore harum et reiciendis id possimus, reprehenderit voluptas
        incidunt, autem nobis odit iure.
      </p>
      <p class="body" style="margin-top: 0.75rem">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat dolorum
        laboriosam sed sint tempora maxime iste natus deserunt, corporis
        sapiente neque, enim eos. Distinctio rem porro excepturi unde maxime qui
        voluptas libero animi eius repellendus eaque dignissimos a laboriosam
        debitis ut tempore, quam sunt voluptatem in iure aspernatur ex! Nemo
        consequatur quis tempore sunt, est optio nesciunt esse maxime enim
        architecto at dolores sint eveniet neque quibusdam voluptatibus minima
        et facilis ullam, sapiente aperiam. Odio suscipit recusandae, cupiditate
        neque similique omnis officiis voluptates, a ut, quisquam dolorem
        deserunt totam laudantium eum et labore natus distinctio. Culpa tenetur
        minima porro vero?
      </p>
    </section>
    <section>
      <h2 class="header-1">Design and Development</h2>
      <div class="flex">
        <img :src="logo" alt="" />
        <div class="grid" style="grid-template-rows: repeat(2, 1fr)">
          <p style="place-self: end; justify-self: start">By DTT</p>
          <a style="place-self: start; color: var(--blue)" href="www.d-tt.nl"
            >www.d-tt.nl</a
          >
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
/* <h1 class="header-1 text-center px-3 py-4 sm:hidden">About</h1> */
h1 {
  text-align: center;
  padding-inline: 0.75rem;
  padding-block: 1rem;
}

h2 {
  padding-block: 0.75rem;
}

img {
  width: 14rem;
}

@media (min-width: 640px) {
  h1 {
    display: none;
  }
}
</style>
