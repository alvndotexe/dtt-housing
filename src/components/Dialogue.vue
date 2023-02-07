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
  <dialog ref="dialogRef">
    <div>
      <h1 class="header-1">Delete listing</h1>
      <p class="body">Are you sure you want to delet this listing?</p>
      <p class="body">This action cannot be undone</p>
      <button @click="deleteHouse" class="buttons-and-tabs">YES,DELETE</button>
      <button @click="handleCancle" class="buttons-and-tabs">GO BACK</button>
    </div>
  </dialog>
</template>

<style scoped>
/* class="m-auto rounded-md p-6 text-center backdrop:bg-[rgba(0,0,0,0.7)]" */
dialog {
  margin: auto;
  border-radius: var(--rounded-md);
  text-align: center;
  padding: 1.5rem;
}

div {
  margin-inline: 2.5rem;
}

p:first-of-type {
  margin-top: 1rem;
}

p:last-of-type {
  margin-bottom: 1rem;
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.7);
}

/* class="buttons-and-tabs mt-6 block w-full rounded-md bg-grey-500 py-3 text-white" */
button {
  width: 100%;
  padding-block: 0.75rem;
  border-radius: var(--rounded-md);
  color: white;
}

button:first-of-type {
  background-color: var(--red);
}

button:last-of-type {
  margin-top: 1.25rem;
  background-color: var(--gray-500);
}
</style>
