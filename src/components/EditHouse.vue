<script lang="ts" setup>
export type ToStringProprties<T extends Object> = {
  [p in keyof T]: string;
};
export type FormObject<T> = {
  [p in keyof T]: FormElement<T>;
};
export type FormElement<T> = T extends any
  ? { value: T extends string ? string : T; errorMessage: string }
  : never;
export type Form = Map<
  keyof SubmittedHouse,
  {
    value: string;
    errorMessage: string;
  }
>;

export type SubmittedHouse = {
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  streetName: string;
  houseNumber: number;
  numberAddition: number | string;
  zip: string;
  city: string;
  constructionYear: number;
  hasGarage: boolean;
  description: "string";
  image: File | string;
};

import background from "@/assets/img_background@3x.png";
import { House, useStore } from "@/store";
import { NetworkError } from "@/utils";
import { computed, onBeforeMount, onBeforeUnmount, reactive, ref } from "vue";
import { z, ZodDate, ZodEffects, ZodNumber, ZodOptional, ZodString } from "zod";
import FileInput from "./FileInput.vue";
import Input from "./Input.vue";

type addHouse = {
  dispatch: "addHouse";
};

type editHouse = {
  dispatch: "editHouse";
  house: House;
};

type ValidationSchemas =
  | ZodString
  | ZodNumber
  | z.ZodEffects<z.ZodNumber, number, number>
  | ZodDate
  | ZodEffects<ZodString, boolean, string>
  | z.ZodEffects<z.ZodType<File, z.ZodTypeDef, File>, File, File>
  | ZodOptional<ZodString>
  | z.ZodUnion<
      [
        z.ZodEffects<z.ZodType<File, z.ZodTypeDef, File>, File, File>,
        z.ZodString
      ]
    >;

const store = useStore();
const props = defineProps<{
  type: addHouse | editHouse;
  onSuccess?: (args?: unknown) => void;
}>();
const form = ref<HTMLFormElement | null>(null);
const formState = ref<"inert" | "sent" | "sending" | "error">("inert");
const [formData, validationMap] = reactive<ReturnType<typeof getInitialState>>(
  getInitialState()
);
const isFormReady = computed(() =>
  [...validationMap.entries()].every(([key, schema]) => {
    const value = formData.get(key);
    if (!value)
      throw `validation schema for ${key} exists but there is not value to validate`;
    const result = schema.safeParse(value.value);
    if (!result.success) {
      console.log(key, result.error.format()._errors[0], value.value);
    }
    return schema.safeParse(value.value).success;
  })
);

function getInitialState() {
  const imageSchema = z.instanceof(File).superRefine((f, ctx) => {
    const acceptedMimeTypes = ["image/jpg", "image/png", "image/jpeg"];
    if (!acceptedMimeTypes.includes(f.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `File must be ${acceptedMimeTypes.join(", ")}`,
      });
    }
  });

  const formNumber = z.coerce
    .number({ invalid_type_error: "invalid format" })
    .min(1, { message: "Required Field" })
    .transform((e) => Number(e));

  const house =
    props.type.dispatch === "editHouse" ? props.type.house : undefined;
  const pain = {
    bathrooms: [
      house?.rooms.bathrooms ? String(house?.rooms.bathrooms) : "",
      formNumber,
    ],
    bedrooms: [
      house?.rooms.bedrooms ? String(house?.rooms.bedrooms) : "",
      formNumber,
    ],
    city: [house?.location.city ?? "", z.string()],
    constructionYear: [
      house?.constructionYear ? String(house.constructionYear) : "",
      z.string(),
    ],
    description: [house?.description ?? "", z.string().min(5)],
    hasGarage: [
      !house?.hasGarage ? "no" : house.hasGarage ? "yes" : "no",
      z
        .string()
        .min(2)
        .transform((e) => e === "yes"),
    ],
    houseNumber: [
      house?.location.street
        ? house.location.street.replaceAll(/[a-zA-Z]/g, "")
        : "",
      formNumber,
    ],
    image: [
      house?.image ?? "",
      props.type.dispatch === "addHouse"
        ? imageSchema
        : z.union([imageSchema, z.string().min(5)]),
    ],
    numberAddition: ["", z.string()],
    price: [house?.price ? String(house.price) : "", formNumber],
    size: [house?.size ? String(house.size) : "", formNumber],
    streetName: [
      house?.location.street
        ? house.location.street.replaceAll(/[0-9]/g, "")
        : "",
      z.string().min(3),
    ],
    zip: [house?.location.zip ?? "", z.string().min(3)],
  } satisfies Record<keyof SubmittedHouse, [string, ValidationSchemas]>;
  const formMap = new Map<
    keyof SubmittedHouse,
    FormElement<keyof SubmittedHouse>
  >();
  const validationMap = new Map<keyof SubmittedHouse, ValidationSchemas>();

  for (const [key, [value, schema]] of Object.entries(pain)) {
    formMap.set(key as keyof SubmittedHouse, { value, errorMessage: "" });
    validationMap.set(key as keyof SubmittedHouse, schema);
  }

  return [formMap, validationMap] as const;
}

function handleSubmit(e: Event) {
  const htmlFormData = [...formData.entries()].reduce(
    (htmlForData, [key, { value }]) => {
      htmlForData.set(key, value);
      return htmlForData;
    },
    new FormData()
  );
  const dispatchProps =
    props.type.dispatch === "editHouse"
      ? {
          form: htmlFormData,
          id: props.type.house.id,
        }
      : htmlFormData;
  formState.value = "sending";
  console.log(props.type.dispatch, dispatchProps);

  store.dispatch(props.type.dispatch, dispatchProps).then((results) => {
    if (results.type === "Error") formState.value = "error";
    else {
      console.log(results);
      formState.value = "sent";
      if (props.onSuccess) props.onSuccess();
      formState.value = "inert";
    }
  });
}

const buttonText = computed(() => {
  switch (formState.value) {
    case "inert":
      return props.type.dispatch === "editHouse" ? "SAVE" : "POST";
    case "sending":
      return "SENDING";
    case "sent":
      return "SENT";
    case "error":
      return "TRY AGAIN";
  }
});

function handleChange(value: string | File, name: keyof SubmittedHouse) {
  const oldValue = formData.get(name);
  if (!oldValue) throw `element ${name} does not exist in the schema`;
  if (!validationMap.has(name))
    throw `element ${name} does not have a validation method`;
  const result = validationMap.get(name)!.safeParse(value);
  let errorMessage: string | undefined = undefined;
  if (!result.success) {
    const errors = result.error.format()._errors;
    errorMessage = errors[0];
  }
  formData.set(name, {
    ...oldValue,
    value: value,
    errorMessage: errorMessage ?? "",
  });
}

onBeforeMount(() => {
  const section = document.getElementById("main");
  if (!section) return;
  section.style.backgroundImage = `url(${background})`;
});
onBeforeUnmount(() => {
  const section = document.getElementById("main");
  if (!section) return;
  section.style.backgroundImage = "";
});
</script>

<template>
  <form ref="form" @submit.prevent="handleSubmit">
    <Input
      @handle-change="handleChange"
      :formData="formData"
      placeholder="Enter the street name"
      :type="'text'"
      :name="'streetName'"
      :label="'Street name*'"
      required
    />
    <div class="input-container">
      <Input
        @handle-change="handleChange"
        :formData="formData"
        placeholder="Enter the street name"
        :type="'text'"
        :name="'houseNumber'"
        :label="'House number*'"
        required
      /><Input
        @handle-change="handleChange"
        :formData="formData"
        placeholder="Enter the street name"
        :type="'text'"
        :name="'numberAddition'"
        :label="'Addition'"
        required
      />
    </div>
    <Input
      @handle-change="handleChange"
      :formData="formData"
      :label="'Postal code*'"
      type="text"
      name="zip"
      required
    />
    <Input
      @handle-change="handleChange"
      :formData="formData"
      label="City*"
      name="city"
      type="text"
    />
    <div>
      <FileInput @handle-change="handleChange" :formData="formData" />
    </div>
    <Input
      @handle-change="handleChange"
      :formData="formData"
      label="Price*"
      name="price"
      type="number"
    />
    <div class="input-container">
      <Input
        @handle-change="handleChange"
        :formData="formData"
        label="Sizes*"
        name="size"
        type="number"
      />
      <div>
        <label class="input-field-title" for="hasGarage">Garage*</label>
        <select
          selected="yes"
          :class="formData.get('hasGarage')?.errorMessage ? 'incorrect' : ''"
          :value="formData.get('hasGarage')?.value"
          name="hasGarage"
          id="hasGarage"
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <p
          :class="formData.get('hasGarage')?.errorMessage ? 'incorrect' : ''"
          class="error-message my-2 text-red"
          v-if="formData.get('hasGarage')?.errorMessage"
        >
          {{ "Required field" }}
        </p>
      </div>
    </div>
    <div class="input-container">
      <Input
        @handle-change="handleChange"
        :formData="formData"
        label="Bedrooms*"
        name="bedrooms"
        type="number"
      />
      <Input
        @handle-change="handleChange"
        :formData="formData"
        label="Bathrooms*"
        name="bathrooms"
        type="number"
      />
    </div>
    <Input
      @handle-change="handleChange"
      :formData="formData"
      label="Construction date*"
      name="constructionYear"
      type="date"
    />
    <div>
      <label class="input-field-title my-2 block" for="description"
        >Description</label
      >
      <textarea
        :class="formData.get('description')?.errorMessage ? 'incorrect' : ''"
        :value="formData.get('description')?.value"
        @input="(e) => handleChange(e.target.value, 'description')"
        cols="30"
        rows="10"
        name="description"
        id="description"
      />
      <p
        class="error-message incorrect"
        v-if="formData.get('description')?.errorMessage"
      >
        {{ "Required field" }}
      </p>
    </div>
    <button
      :disabled="!isFormReady"
      :style="{ opacity: !isFormReady ? '0.25' : '' }"
      class="buttons-and-tabs"
    >
      {{ buttonText }}
    </button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}

button {
  margin-block: 1rem;
  display: block;
  border-radius: var(--rounded-md);
  background-color: var(--red);
  padding-block: 1rem;
  padding-inline: 0.5rem;
  color: white;
}

select {
  height: 3rem;
  flex-grow: 1;
  border-radius: var(--rounded-md);
  display: block;
  width: 100%;
  background-color: white;
  padding: 1rem;
}

label {
  display: block;
  margin-block: 0.5rem;
}

textarea {
  width: 100%;
  border-radius: var(--rounded-md);
  padding: 1rem;
}

.incorrect {
  color: var(--red);
}

.incorrect:is(:not(p)) {
  outline: var(--red) solid 2px;
}

.input-container {
  display: flex;
  gap: 0.5rem;
}

.input-container > * {
  align-items: center;
  flex-grow: 1;
}

@media (min-width: 640px) {
  form {
    width: min(100vw, 400px);
  }
}
</style>
