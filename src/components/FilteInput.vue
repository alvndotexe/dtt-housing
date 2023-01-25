<script lang="ts" setup>
import clearIcon from "@/assets/ic_clear_white@3x.png";
import addIcon from "@/assets/ic_plus_grey@3x.png";
import { computed, reactive, ref } from "vue";

const props = defineProps<{
  errors: Map<string, string>;
  backgroundImage?: string;
}>();

const div = ref<HTMLDivElement | null>(null);
const input = ref<HTMLInputElement | null>(null);

const errorMessage = computed(() => props.errors.get("image"));
const hasImage = reactive({ value: false });

const imagePreviewSrc = (e: Event) => {
  if (input.value == null || div.value == null) return;
  const files = input.value.files;
  if (!files) return;
  const file = files.item(0);
  if (!file) return;
  div.value.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
  hasImage.value = true;
};
const redirectButtonPress = (e: Event) => {
  e.preventDefault();
  if (input.value == null) return;
  input.value.click();
};

const removeImage = (e: Event) => {
  e.preventDefault();
  if (div.value == null || input.value === null) return;
  input.value = null;
  div.value.style.backgroundImage = "";
  hasImage.value = false;
};

console.log(props.backgroundImage);
</script>
<template>
  <div class="relative">
    <label for="image" class="block input-field-title my-2"
      >Upload File(PNG or JPG)</label
    >
    <div
      ref="div"
      :style="{ 'background-image': `url(${props.backgroundImage})` }"
      :class="{
        'border-dashed': !props.backgroundImage,
        'border-black': !props.backgroundImage,
        'border-[2px]': !props.backgroundImage,
      }"
      class="grid place-items-center h-28 w-28 bg-contain rounded-md"
      @click="redirectButtonPress"
    >
      <img
        :class="hasImage.value ? 'hidden' : ''"
        class="h-10"
        v-if="!props.backgroundImage"
        :src="addIcon"
        alt=""
      />
    </div>
    <input
      hidden
      ref="input"
      @change="imagePreviewSrc"
      type="file"
      accept="image/png,image/jpg"
      name="image"
      id="image"
    />
    <button
      :class="hasImage.value ? '' : 'hidden'"
      class="absolute z-10 left-[5.8rem] top-[20px] bg-contain block"
      @click="removeImage"
    >
      <img :src="clearIcon" class="h-10" alt="" />
    </button>
    <div
      :class="errorMessage ? 'text-red error-message' : ''"
      v-if="errorMessage"
    >
      Required field
    </div>
  </div>
</template>
