<script lang="ts" setup>
import { computed, watchEffect } from "vue";

const props = defineProps<{
  min?: number;
  max?: number;
  errors: Map<string, string>;
  value?: string;
  change?: (e: Event) => void;
  type: "text" | "number";
  name: string;
  required?: boolean;
  label: string;
  getErrorMessage: (name: string) => string | undefined | false;
}>();

const errorMessage = computed(() =>
  props.errors.has(props.name) ? props.getErrorMessage(props.name) : undefined
);

//text-[14px] sm:text-[12px] font-monster font-semibold;
</script>
<template>
  <div class="rounded-md ">
      <label class="my-2 input-field-title block" :for="props.name">{{
        props.label
      }}</label>
      <input
        class="h-12 p-4 w-full rounded-md"
        :class="
          !!errorMessage
            ? 'text-red outline outline-[2px] outline-red'
            : ''
        "
        @change="props.change"
        :value="props.value"
        :type="props.type"
        :id="props.name"
        :name="props.name"
        :min="props.min"
        :max="props.max"
      />
      <p class="error-message text-red my-2" v-if="errorMessage">
        {{ 'Required field' }}
      </p>
  </div>
</template>
