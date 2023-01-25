<script lang="ts" setup>
import { key } from "@/store";
import { ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const props = defineProps<{
  show: { value: boolean };
  id: number;
}>();
const store = useStore(key);
const route = useRoute();
const router = useRouter();

const dialogRef = ref<HTMLDialogElement | null>(null);

function handleCancle(e: Event) {
  e.preventDefault();
  if (!dialogRef.value) return;
  dialogRef.value.close();
}

function deleteHouse(e: Event) {
  e.preventDefault();
  store.dispatch("deleteHouse", props.id).then((r) => {
    if (route.fullPath === "/") window.location.reload();
    else router.push({ name: "Home" });
  });
}

watchEffect(() => {
  if (!dialogRef.value) return;
  if (props.show.value) dialogRef.value.showModal();
  dialogRef.value.addEventListener("close", () => {
    props.show.value = false;
  });
});
</script>

<template>
  <dialog
    class="m-auto backdrop:bg-[rgba(0,0,0,0.7)] text-center rounded-md p-6"
    ref="dialogRef"
  >
    <div class="mx-10">
      <h1 class="header-1">Delete listing</h1>
      <p class="body text-grey-500 pt-4">
        Are you sure you want to delet this listing?
      </p>
      <p class="body text-grey-500 pb-10">This action cannot be undone</p>
      <button
        @click="deleteHouse"
        class="block w-full text-white bg-red rounded-md py-3 buttons-and-tabs"
      >
        YES,DELETE
      </button>
      <button
        @click="handleCancle"
        class="block w-full mt-6 text-white bg-grey-500 py-3 rounded-md buttons-and-tabs"
      >
        GO BACK
      </button>
    </div>
  </dialog>
</template>
