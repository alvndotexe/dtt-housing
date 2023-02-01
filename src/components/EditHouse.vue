<script lang="ts" setup>
import { House, key } from "@/store";
import background from "@/assets/img_background@3x.png";
import { computed, onBeforeMount, onBeforeUnmount, ref } from "vue";
import { useStore } from "vuex";
import FilteInput from "./FilteInput.vue";
import Input from "./Input.vue";

type addHouse = {
  dispatch: "addHouse";
};

type editHouse = {
  dispatch: "editHouse";
  id: number;
};

const store = useStore(key);
const props = defineProps<{
  type: addHouse | editHouse;
  onSuccess?: (args?: unknown) => void;
}>();
const errors = ref<Map<string, string>>(new Map());
const form = ref<HTMLFormElement | null>(null);
const formState = ref<"inert" | "sent" | "sending" | "error">("inert");
const house = computed<Partial<House>>({
  //very confused on what to do here since actions are asynchronous and async getters dont sound like a good idea
  get: (): Partial<House> =>
    props.type.dispatch === "editHouse"
      ? computed(() =>
          store.getters.getHouses.filter((e: House) => e.id === props.type.id)
        ).value
      : {},
  set: (newValue) => newValue,
});

const getInputValue = (value: string | number | undefined) =>
  props.type.dispatch === "editHouse" ? String(value) : undefined;

const getErrorMessage = (name: string) =>
  errors.value.has(name) ? errors.value.get(name) : false;

const handleSubmit = (e: Event) => {
  const formData = new FormData(e.target);
  if (props.type.dispatch === "editHouse") {
    const file = formData.get("image") as File;
    console.log(file.size);
    if (file.size === 0) formData.set("image", house.value.image!);
  }
  const dispatchProps =
    props.type.dispatch === "addHouse"
      ? formData
      : { formData, id: house.value.id };
  formState.value = "sending";
  store.dispatch(props.type.dispatch, dispatchProps).then((results) => {
    if (results.type === "error") {
      [...results.data.entries()].forEach(([k, v]) => {
        if (v.value instanceof File) {
          if (v.value.size === 0) errors.value.set(k, "Required field");
        }
        if (v.value.length === 0 && v.error !== undefined) {
          errors.value.set(
            k,
            v.error.includes("must") ? "incompatible type" : "Required field"
          );
        }
      });
    }
    if (results instanceof Error) {
      formState.value = "error";
    }
    console.log(results);

    if (results.ok) {
      if (props.onSuccess) props.onSuccess();
      else formState.value = "sent";
    }
  });
};

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

const main = ref(document.getElementById("main")!);

onBeforeMount(() => (main.value.style.backgroundImage = `url(${background})`));
onBeforeUnmount(() => (main.value.style.backgroundImage = ""));
</script>

<template>
  <div
    class="sm:m-0 [background-image:linear-gradient(to_botton,blue,red)] px-3 sm:px-0"
  >
    <form
      ref="form"
      @submit.prevent="handleSubmit"
      class="flex flex-col w-full sm:w-[min(100vw,400px)]"
    >
      <Input
        :errors="errors"
        :value="getInputValue(house.location?.street.replaceAll(/[0-9]*/g, ''))"
        placeholder="Enter the street name"
        :required="true"
        :type="'text'"
        :name="'streetName'"
        :getErrorMessage="getErrorMessage"
        :label="'Street name*'"
      />
      <div class="flex gap-2">
        <Input
          :errors="errors"
          :getErrorMessage="getErrorMessage"
          :label="'House number*'"
          :value="getInputValue(house.location?.street.replaceAll(/[a-zA-Z]*/g, '')) ? parseInt(getInputValue(house.location?.street.replaceAll(/[a-zA-Z]*/g, ''))!) : null"
          :required="true"
          :type="'number'"
          :name="'houseNumber'"
          :min="0"
        />
        <Input
          :label="'Addition (optional)'"
          :errors="errors"
          :getErrorMessage="getErrorMessage"
          :required="true"
          type="text"
          name="numberAddition"
        />
      </div>
      <Input
        :errors="errors"
        :getErrorMessage="getErrorMessage"
        :value="getInputValue(house.location?.zip)"
        :label="'Postal code*'"
        :required="true"
        :placeholder="house.location?.zip"
        type="text"
        name="zip"
      />
      <Input
        :errors="errors"
        :getErrorMessage="getErrorMessage"
        :value="getInputValue(house.location?.city)"
        label="City*"
        name="city"
        type="text"
      />
      <div>
        <FilteInput :errors="errors" :backgroundImage="house.image" />
      </div>
      <Input
        :label="'Price*'"
        :value="getInputValue(house.price)"
        :errors="errors"
        :getErrorMessage="getErrorMessage"
        name="price"
        :placeholder="house.price?.toString()"
        required
        type="number"
      />
      <div>
        <Input
          :errors="errors"
          :value="getInputValue(house.size)"
          :getErrorMessage="getErrorMessage"
          :placeholder="house.size?.toString()"
          label="Size*"
          required
          type="number"
          name="size"
        />
        <div>
          <label class="block input-field-title" for="hasGarage">Garage*</label>
          <select
            selected="yes"
            class="w-full h-12 p-4 rounded-md bg-white"
            :class="
              errors.has('hasGarage')
                ? 'text-red outline outline-[2px] outline-red'
                : ''
            "
            :value="
              house.hasGarage === undefined
                ? undefined
                : house.hasGarage
                ? 'yes'
                : 'no'
            "
            name="hasGarage"
            id="hasGarage"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <p class="error-message text-red my-2" v-if="errors.has('hasGarage')">
            {{ "Required field" }}
          </p>
        </div>
      </div>
      <div>
        <Input
          :errors="errors"
          :getErrorMessage="getErrorMessage"
          :placeholder="house.rooms?.bedrooms.toString()"
          :value="getInputValue(house.rooms?.bedrooms)"
          label="Bedrooms*"
          type="number"
          name="bedrooms"
          required
        />
        <Input
          label="Bathrooms"
          :value="getInputValue(house.rooms?.bathrooms)"
          :getErrorMessage="getErrorMessage"
          :errors="errors"
          :placeholder="house.rooms?.bathrooms.toString()"
          required
          type="number"
          name="bathrooms"
        />
      </div>
      <Input
        :errors="errors"
        :getErrorMessage="getErrorMessage"
        :value="getInputValue(house.constructionYear?.toString())"
        label="construction date*"
        :placeholder="house.constructionYear?.toString()"
        required
        type="number"
        name="constructionYear"
        :min="0"
        :max="9999"
      />
      <div>
        <label class="block input-field-title my-2" for="description"
          >Description</label
        >
        <textarea
          class="w-full p-4 rounded-md"
          :class="
            errors.has('description')
              ? 'text-red outline outline-[2px] outline-red'
              : ''
          "
          :value="house.description"
          cols="30"
          rows="10"
          name="description"
          id="description"
        />
        <p class="error-message text-red my-2" v-if="errors.has('description')">
          {{ "Required field" }}
        </p>
      </div>
      <button
        class="bg-red rounded-md px-2 py-4 my-4 text-white buttons-and-tabs"
      >
        {{ buttonText }}
      </button>
    </form>
  </div>
</template>
