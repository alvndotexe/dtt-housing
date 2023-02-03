<script lang="ts" setup>
import { useStore } from "@/store";
import { ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps<{
  show: { value: boolean };
  id: number;
}>();
const store = useStore();
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
    class="m-auto rounded-md p-6 text-center backdrop:bg-[rgba(0,0,0,0.7)]"
    ref="dialogRef"
  >
    <div class="mx-10">
      <h1 class="header-1">Delete listing</h1>
      <p class="body pt-4 text-grey-500">
        Are you sure you want to delet this listing?
      </p>
      <p class="body pb-10 text-grey-500">This action cannot be undone</p>
      <button
        @click="deleteHouse"
        class="buttons-and-tabs block w-full rounded-md bg-red py-3 text-white"
      >
        YES,DELETE
      </button>
      <button
        @click="handleCancle"
        class="buttons-and-tabs mt-6 block w-full rounded-md bg-grey-500 py-3 text-white"
      >
        GO BACK
      </button>
    </div>
  </dialog>
</template>
