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
import { reactive, ref, watchEffect } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

const route = useRoute();
const store = useStore();

const house = ref<House | "loading" | "error">("loading");
let otherHouses = reactive<[] | Array<House>>([]);
const showDialogue = reactive({ value: false });
const id = parseInt(route.params.id as string);

store.dispatch("getHouses", undefined).then((result) => {
  if (result instanceof Error) house.value = "error";
  else {
    const possibleHouse = result.find(
      (e) => e.id === parseInt(route.params.id as string)
    );
    if (!possibleHouse) house.value = "error";
    else {
      house.value = possibleHouse;
      otherHouses = result
        .filter(
          (e) =>
            e.location.street ===
              (house.value as unknown as House).location.street &&
            e.id !== (house.value as unknown as House).id
        )
        .slice(0, 3);
    }
  }
});

function handleDelete(e: Event) {
  e.preventDefault();
  showDialogue.value = true;
}
</script>
<template>
  <section class="section">
    <RouterLink to="/" class="back">
      <img :src="backIcon" alt="" />
      <p class="header-2">Back to overview</p>
    </RouterLink>
    <div class="container" v-if="typeof house === 'object'">
      <div class="house">
        <div class="mobile-navigation">
          <RouterLink to="/">
            <img class="small-icon" :src="backIconWhite" />
          </RouterLink>
          <div v-if="house.madeByMe" class="house-article-made-by-me">
            <RouterLink :to="`/Edit/${house.id}`">
              <img class="small-icon" :src="editIconWhite" alt="" />
            </RouterLink>
            <button @click="handleDelete">
              <img class="small-icon" :src="deleteIconWhite" alt="" />
            </button>
          </div>
        </div>
        <article class="house-article">
          <img :src="house?.image" alt="" />
          <div class="house-article-text">
            <div class="flex justify-between">
              <h2 class="header-1">
                {{ house?.location.street }}
              </h2>
              <div class="house-article-made-by-me" v-if="house?.madeByMe">
                <RouterLink :to="`/Edit/${house.id}`">
                  <img class="small-icon" :src="editIcon" />
                </RouterLink>
                <button @click="handleDelete">
                  <img class="small-icon" :src="deleteIcon" />
                </button>
              </div>
            </div>
            <Icon
              style="margin-top: 0.75rem"
              :icon="locationIcon"
              :value="house?.location.zip + '' + house?.location.city"
            />
            <div class="icon-row">
              <Icon :icon="priceIcon" :value="house?.price" />
              <Icon :icon="m2Icon" :value="house?.size" />
              <Icon :icon="buildIcon" :value="house?.constructionYear" />
            </div>
            <div class="icon-row">
              <Icon :icon="bedIcon" :value="house?.rooms.bedrooms" />
              <Icon :icon="bathIcon" :value="house?.rooms.bedrooms" />
              <Icon v-if="house?.hasGarage" :icon="garageIcon" :value="''" />
            </div>
            <p class="body">{{ house?.description }}</p>
          </div>
        </article>
      </div>
      <div class="other-houses" v-if="otherHouses && otherHouses.length > 0">
        <h2 class="header-2">Reccommended for you</h2>
        <ul>
          <li v-for="otherHouse in otherHouses">
            <HouseArticle :house="otherHouse" />
          </li>
        </ul>
      </div>
    </div>
  </section>
  <Dialogue :show="showDialogue" :id="house.id" />
</template>

<style scoped>
li {
  margin-top: 1rem;
  width: 100%;
  list-style: none;
}
.back {
  display: none;
  align-items: center;
  gap: 0.5rem;
}
.back > img {
  height: 1.25rem;
  margin-block: 2rem;
}

.container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.house {
  position: relative;
  flex: 2;
}

.other-houses {
  padding: 0.5rem;
  padding-top: 0;
  flex: 1;
}

.icon-row {
  display: flex;
  margin-top: 0.75rem;
  gap: 2rem;
}

.body {
  padding-top: 1rem;
}

/* class="h-max w-full translate-y-[-1rem] rounded-2xl bg-white p-4 text-grey-500 sm:translate-y-0 sm:rounded-none" */

.house-article-text {
  border-top-right-radius: var(--rounded-2xl);
  border-top-left-radius: var(--rounded-2xl);
  color: var(--gray-500);
  background-color: white;
  transform: translate(0, -1rem);
  padding: 0.5rem;
}

.house-article-made-by-me {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-navigation {
  position: absolute;
  top: 1.25rem;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-inline: 0.75rem;
  width: 100vw;
}

@media (min-width: 640px) {
  .back {
    display: flex;
  }

  .mobile-navigation {
    display: none;
  }

  .house-article {
    border-radius: 0px;
  }

  .house-article-made-by-me {
    display: flex;
  }

  .house-article-text {
    transform: translate(0);
  }
}

@media (max-width: 800px) {
  .container {
    flex-direction: column;
  }
}
</style>
