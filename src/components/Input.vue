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
  () => props.formData.get(props.name)?.errorMessage
);
</script>
<template>
  <div>
    <label class="input-field-title" :for="props.name">{{ props.label }}</label>
    <input
      :class="errorMessage ? 'incorrect' : ''"
      :type="props.type"
      :id="props.name"
      :name="props.name"
      v-model.trim="input.value"
      @input="$emit('handleChange', input.value, props.name)"
    />
    <p class="error-message" v-if="errorMessage">
      {{ formData.get(props.name)?.errorMessage }}
    </p>
  </div>
</template>

<style scoped>
.container {
  border-radius: var(--rounded-md);
}

label {
  margin-block: 0.5rem;
  display: block;
}

input {
  height: 3rem;
  border-radius: var(--rounded-md);
  padding: 1rem;
  width: 100%;
}

p {
  margin-block: 0.5rem;
  color: red;
}

.incorrect:is(input) {
  outline: var(--red) solid 2px;
}

.incorrect {
  color: var(--red);
}
</style>
