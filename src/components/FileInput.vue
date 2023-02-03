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
const file = reactive<{
  value: FormElement<SubmittedHouse["image"]>["value"] | undefined;
}>({
  value: props.formData.get("image")?.value,
});
const emit = defineEmits(["handleChange"]);
const backgroundImage = computed(() => {
  const image = props.formData.get("image") as
    | FormElement<SubmittedHouse["image"]>
    | undefined;
  if (!image) return null;
  if (image.value instanceof File) return URL.createObjectURL(image.value);
  if (image.value.length === 0) return null;
  else return image.value;
});

const errorMessage = computed(() => props.formData.get("image")?.errorMessage);
watchEffect(() => console.log(props.formData.get("image")?.value));

const imagePreviewSrc = (e: Event) => {
  if (input.value == null || div.value == null) return;
  const files = input.value.files;
  if (!files) return;
  const file = files.item(0);
  if (!file) return;
  emit("handleChange", file, "image");
  div.value.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
};
const redirectButtonPress = (e: Event) => {
  e.preventDefault();
  if (input.value == null) return;
  input.value.click();
};

const removeImage = (e: Event) => {
  if (div.value == null || input.value === null) return;
  input.value = null;
  div.value.style.backgroundImage = "";
};
</script>
<template>
  <div class="relative">
    <label for="image" class="input-field-title my-2 block"
      >Upload File(PNG or JPG)</label
    >
    <div
      ref="div"
      :style="{ 'background-image': `url(${backgroundImage})` }"
      :class="{
        'border-dashed': !backgroundImage,
        'border-black': !backgroundImage,
        'border-[2px]': !backgroundImage,
      }"
      class="grid h-28 w-28 place-items-center rounded-md bg-contain"
      @click="redirectButtonPress"
    >
      <img
        :class="backgroundImage ? '' : 'hidden'"
        class="h-10"
        v-if="!backgroundImage"
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
      class="absolute left-[5.8rem] top-[20px] z-10 block bg-contain"
      @click="removeImage"
    >
      <img :src="clearIcon" class="h-10" alt="" />
    </button>
    <div
      :class="errorMessage ? 'error-message text-red' : ''"
      v-if="errorMessage"
    >
      Required field
    </div>
  </div>
</template>
