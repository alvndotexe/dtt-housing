<script lang="ts" setup>
import clearIcon from "@/assets/ic_clear_white@3x.png";
import addIcon from "@/assets/ic_plus_grey@3x.png";
import { computed, reactive, ref, watchEffect } from "vue";
import { Form, FormElement, SubmittedHouse } from "./EditHouse.vue";

const props = defineProps<{
  formData: Form;
}>();

const div = ref<HTMLDivElement | null>(null);
const input = ref<HTMLInputElement | null>(null);

const emit = defineEmits(["handleChange"]);
const backgroundImage = computed(() => {
  const image = props.formData.get("image") as
    | FormElement<SubmittedHouse["image"]>
    | undefined;
  console.log(image);
  if (!image) return null;
  if (image.value instanceof File) return URL.createObjectURL(image.value);
  if (image.value.length === 0) return null;
  else return image.value;
});

const errorMessage = computed(() => props.formData.get("image")?.errorMessage);

const imagePreviewSrc = (e: Event) => {
  if (input.value == null || div.value == null) return;
  const files = input.value.files;
  if (!files) return;
  const file = files.item(0);
  if (!file) return;
  emit("handleChange", file, "image");
  const url = URL.createObjectURL(file);
  div.value.style.backgroundImage = `url(${url})`;
};
const redirectButtonPress = (e: Event) => {
  if (input.value == null) return;
  input.value.click();
};

const removeImage = (e: Event) => {
  if (div.value == null || input.value === null) return;
  emit("handleChange", "", "image");
  input.value.value = "";
  div.value.style.backgroundImage = "";
};
</script>
<template>
  <div class="container">
    <label for="image" class="input-field-title my-2 block"
      >Upload File(PNG or JPG)</label
    >
    <div
      ref="div"
      :style="{ 'background-image': `url(${backgroundImage})` }"
      :class="!backgroundImage ? 'pending' : ''"
      class="preview-img-container"
      @click="redirectButtonPress"
    >
      <img
        :class="backgroundImage ? 'hidden' : ''"
        class="add-img-icon"
        :src="addIcon"
        alt=""
      />
    </div>
    <input
      hidden
      ref="input"
      @change="imagePreviewSrc"
      type="file"
      accept="image/png, image/jpg, image/jpeg"
      name="image"
      id="image"
    />
    <button
      type="button"
      :class="backgroundImage ? '' : 'hidden'"
      @click="removeImage"
    >
      <img :src="clearIcon" class="clear-icon" alt="" />
    </button>
    <span class="error-message" v-if="errorMessage"> Required field </span>
  </div>
</template>

<style scoped>
label {
  display: block;
  margin-block: 0.5rem;
}

button {
  position: absolute;
  left: 5.8rem;
  top: 20px;
  z-index: 10;
  display: block;
  background-size: contain;
}

span {
  color: var(--red);
}

.clear-icon,
.add-img-icon {
  height: 2.5rem;
}

.container {
  position: relative;
}

.preview-img-container {
  display: grid;
  height: 7rem;
  width: 7rem;
  place-items: center;
  border-radius: var(--rounded-md);
  background-size: contain;
}

.pending {
  border: 2px dashed var(--gray-500);
}
</style>
