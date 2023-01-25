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
import { House, key } from "@/store";
import { computed, ComputedRef, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const router = useRouter();
const store = useStore(key);

const showDialogue = reactive({ value: false });
const id = computed(() => {
  const id = route.params.id;
  return id instanceof Array ? null : parseInt(id);
});

const house: ComputedRef<House> = computed(() =>
  store.getters.getHouseById(id.value)
);
const otherHouses: ComputedRef<Array<House>> = computed(() =>
  house.value
    ? store.getters.getHouses
        .filter((e: House) => e.location.city === house.value!.location.city)
        .filter((e: House) => e.id !== house?.value.id)
        .splice(0, 3)
    : null
);

function handleDelete(e: Event) {
  e.preventDefault();
  showDialogue.value = true;
}
</script>
<template>
  <section class="relative sm:static">
    <div
      class="flex px-3 top-5 absolute sm:static w-full z-10 gap-2 justify-between sm:justify-start sm:gap-4 sm:my-6 items-center"
    >
      <img
        @click="router.go(-1)"
        class="w-4 h-4 sm:hidden hover:cursor-pointer"
        :src="backIconWhite"
      />
      <img
        @click="router.go(-1)"
        class="w-4 h-4 sm:block hidden hover:cursor-pointer"
        :src="backIcon"
      />
      <p class="hidden buttons-and-tabs sm:block">Back to overview</p>
      <div v-if="house.madeByMe" class="flex gap-3 sm:hidden">
        <button
          @click="
            () => router.push({ name: 'Edit', params: { id: house?.id } })
          "
        >
          <img class="w-4 h-4" :src="editIconWhite" alt="" />
        </button>
        <button @click="handleDelete">
          <img class="w-4 h-4" :src="deleteIconWhite" alt="" />
        </button>
      </div>
    </div>
    <div class="flex flex-col">
      <article class="bg-white w-full">
        <img :src="house?.image" alt="" />
        <div
          class="p-4 rounded-2xl sm:rounded-none w-full h-max text-grey-500 translate-y-[-1rem] sm:translate-y-0 bg-white"
        >
          <div class="flex justify-between">
            <h2 class="header-1 text-black">
              {{ house?.location.street }}
            </h2>
            <div class="hidden sm:flex gap-4" v-if="house?.madeByMe">
              <button
                @click="
                  () => router.push({ name: 'Edit', params: { id: house?.id } })
                "
              >
                <img class="h-5 aspect-square" :src="editIcon" />
              </button>
              <button @click="handleDelete">
                <img class="h-5 aspect-square" :src="deleteIcon" />
              </button>
            </div>
          </div>
          <Icon
            class="my-3"
            :icon="locationIcon"
            :value="house?.location.zip + '' + house?.location.city"
          />
          <div class="flex gap-6 my-3">
            <Icon :icon="priceIcon" :value="house?.price" />
            <Icon :icon="m2Icon" :value="house?.size" />
            <Icon :icon="buildIcon" :value="house?.constructionYear" />
          </div>
          <div class="flex gap-6 my-3">
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
          <li class="list-none my-4" v-for="otherHouse in otherHouses">
            <HouseArticle class="list-none my-4" :house="otherHouse" />
          </li>
        </ul>
      </div>
    </div>
  </section>
  <Dialogue :show="showDialogue" :id="house.id" />
</template>
