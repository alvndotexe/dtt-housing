<script lang="ts" setup>
import backIcon from "@/assets/ic_back_grey@3x.png";
import backIconWhite from "@/assets/ic_back_white@3x.png";
import bathIcon from "@/assets/ic_bath@3x.png";
import bedIcon from "@/assets/ic_bed@3x.png";
import buildIcon from "@/assets/ic_construction_date@3x.png";
import deleteIcon from "@/assets/ic_delete@3x.png";
import deleteIconWhite from "@/assets/ic_delete_white@3x.png";
import editIcon from "@/assets/ic_edit@3x.png";
import editIconWhite from "@/assets/ic_edit_white@3x.png";
import garageIcon from "@/assets/ic_garage@3x.png";
import locationIcon from "@/assets/ic_location@3x.png";
import priceIcon from "@/assets/ic_price@3x.png";
import m2Icon from "@/assets/ic_size@3x.png";
import Dialogue from "@/components/Dialogue.vue";
import HouseArticle from "@/components/HouseArticle.vue";
import Icon from "@/components/Icon.vue";
import { House, useStore } from "@/store";
import { computed, ComputedRef, reactive, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const store = useStore();

const house = ref<House | "loading" | "error">("loading");
const showDialogue = reactive({ value: false });
const id = parseInt(route.params.id as string);

store.dispatch("getHouseByID", id).then((r) => {
  if (!r) house.value = "error";
  else house.value = r;
});

const otherHouses = computed(() =>
  typeof house.value === "object"
    ? store.getters.getHouses
        .filter((e: House) => e.location.city === house.value?.location.city)
        .filter((e: House) => e.id !== house?.value?.id)
        .splice(0, 3)
    : null
);

function handleDelete(e: Event) {
  e.preventDefault();
  showDialogue.value = true;
}
</script>
<template>
  <section class="relative sm:static" v-if="typeof house === 'object'">
    <div
      class="absolute top-5 z-10 flex w-full items-center justify-between gap-2 px-3 sm:static sm:my-6 sm:justify-start sm:gap-4"
    >
      <RouterLink to="/">
        <img
          class="h-4 w-4 hover:cursor-pointer sm:hidden"
          :src="backIconWhite"
        />
      </RouterLink>

      <RouterLink to="/">
        <img
          class="hidden h-4 w-4 hover:cursor-pointer sm:block"
          :src="backIcon"
        />
      </RouterLink>
      <p class="buttons-and-tabs hidden sm:block">Back to overview</p>
      <div v-if="house.madeByMe" class="flex gap-3 sm:hidden">
        <RouterLink :to="`/Edit/${house.id}`">
          <img class="h-4 w-4" :src="editIconWhite" alt="" />
        </RouterLink>
        <button @click="handleDelete">
          <img class="h-4 w-4" :src="deleteIconWhite" alt="" />
        </button>
      </div>
    </div>
    <div class="flex flex-col">
      <article class="w-full bg-white">
        <img :src="house?.image" alt="" />
        <div
          class="h-max w-full translate-y-[-1rem] rounded-2xl bg-white p-4 text-grey-500 sm:translate-y-0 sm:rounded-none"
        >
          <div class="flex justify-between">
            <h2 class="header-1 text-black">
              {{ house?.location.street }}
            </h2>
            <div class="hidden gap-4 sm:flex" v-if="house?.madeByMe">
              <RouterLink :to="`/Edit/${house.id}`">
                <img class="aspect-square h-5" :src="editIcon" />
              </RouterLink>
              <button @click="handleDelete">
                <img class="aspect-square h-5" :src="deleteIcon" />
              </button>
            </div>
          </div>
          <Icon
            class="my-3"
            :icon="locationIcon"
            :value="house?.location.zip + '' + house?.location.city"
          />
          <div class="my-3 flex gap-6">
            <Icon :icon="priceIcon" :value="house?.price" />
            <Icon :icon="m2Icon" :value="house?.size" />
            <Icon :icon="buildIcon" :value="house?.constructionYear" />
          </div>
          <div class="my-3 flex gap-6">
            <Icon :icon="bedIcon" :value="house?.rooms.bedrooms" />
            <Icon :icon="bathIcon" :value="house?.rooms.bedrooms" />
            <Icon v-if="house?.hasGarage" :icon="garageIcon" :value="''" />
          </div>
          <p class="body">{{ house?.description }}</p>
        </div>
      </article>
      <div class="p-4 sm:p-0 sm:py-4" v-if="otherHouses.length > 0">
        <h2 class="header-2">Reccommended for you</h2>
        <ul class="w-full">
          <li class="my-4 list-none" v-for="otherHouse in otherHouses">
            <HouseArticle class="my-4 list-none" :house="otherHouse" />
          </li>
        </ul>
      </div>
    </div>
  </section>
  <section v-else>
    <p>{{ house }}</p>
  </section>
  <Dialogue :show="showDialogue" :id="house.id" />
</template>
