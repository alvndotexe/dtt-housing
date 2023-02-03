<script lang="ts" setup>
import { computed, reactive } from "vue";
import { Form, SubmittedHouse } from "./EditHouse.vue";

const props = defineProps<{
  formData: Form;
  max?: number;
  change?: (e: Event) => void;
  type: "text" | "number" | "date";
  name: keyof SubmittedHouse;
  required?: boolean;
  label: string;
}>();

const input = reactive({ value: props.formData.get(props.name)?.value });
const errorMessage = computed(
  () => props.formData.get(props.name)!.errorMessage
);
</script>
<template>
  <div class="rounded-md">
    <label class="my-2 input-field-title block" :for="props.name">{{
      props.label
    }}</label>
    <input
      class="h-12 p-4 w-full rounded-md"
      :class="
        errorMessage.length > 0
          ? 'text-red outline outline-[2px] outline-red'
          : ''
      "
      :type="props.type"
      :id="props.name"
      :name="props.name"
      v-model.trim="input.value"
      @input="$emit('handleChange', input.value, props.name)"
    />
    <p class="error-message text-red my-2" v-if="errorMessage.length > 0">
      {{ formData.get(props.name)?.errorMessage }}
    </p>
  </div>
</template>
