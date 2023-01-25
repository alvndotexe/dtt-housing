import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";
import { z } from "zod";

type Success = {
  type: "success";
};

export type House = {
  id: number;
  image: string;
  price: number;
  rooms: {
    bedrooms: number;
    bathrooms: number;
  };
  size: number;
  description: string;
  location: {
    street: string;
    city: string;
    zip: string;
  };
  createdAt: Date;
  constructionYear: number;
  hasGarage: boolean;
  madeByMe: boolean;
};

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

type HttpConfig = {
  method?: "GET" | "POST" | "DELETE";
  headers?: { "X-API-KEY": "nZ9CatLOv48wohJTdgyAk0pSQic52IEz" };
  body?: any;
};

export class NetworkError extends Error {
  response: Response;
  status: number;
  statusText: string;

  constructor(response: Response) {
    super("Network Error occured");
    this.response = response;
    this.status = response.status;
    this.statusText = response.statusText;
  }
}

function notFetch(url: string, config: Omit<HttpConfig, "headers">) {
  const actualConfig = {
    ...config,
    headers: { "X-API-KEY": "nZ9CatLOv48wohJTdgyAk0pSQic52IEz" },
  };
  return fetch(url, actualConfig)
    .then((result) => {
      if (!result.ok) throw new NetworkError(result);
      return result;
    })
    .catch((error) => error as NetworkError);
}

type State = {
  houses: Array<House>;
};

const acceptedMimeTypes = ["image/jpg", "image/png"];

const imageSchema = z.instanceof(File).superRefine((f, ctx) => {
  if (!acceptedMimeTypes.includes(f.type)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `File must be ${acceptedMimeTypes.join(", ")}`,
    });
  }
});

const getHouseSchema = (type: "addHouse" | "editHouse") =>
  z.object({
    image:
      type === "addHouse"
        ? imageSchema
        : z.union([imageSchema, z.string().min(5)]),
    price: z
      .string()
      .min(1)
      .transform((val) => Number(val)),
    bedrooms: z
      .string()
      .min(1)
      .transform((val) => Number(val)),
    bathrooms: z
      .string()
      .min(1)
      .transform((val) => Number(val)),
    size: z
      .string()
      .min(1)
      .transform((val) => Number(val)),
    description: z.string().min(3),
    houseNumber: z
      .string()
      .min(1)
      .transform((val) => Number(val)),
    streetName: z.string().min(3),
    city: z.string().min(3),
    zip: z.string().min(3),
    constructionYear: z
      .string()
      .min(1)
      .transform((val) => Number(val)),
    hasGarage: z
      .string()
      .min(1)
      .transform((val) => val === "Yes"),
  });

function validateForm(formData: FormData, type: "addHouse" | "editHouse") {
  const partialHouse: Partial<SubmittedHouse> = Object.fromEntries([
    //@ts-ignore formData is iteratable
    ...formData.entries(),
  ]);
  const parsedResults = getHouseSchema(type).safeParse(partialHouse);
  if (!parsedResults.success) {
    const formErrors = parsedResults.error.errors.reduce(
      (errorsMap, issue) => errorsMap.set(String(issue.path[0]), issue.message),
      new Map<string, string>()
    );
    return {
      type: "error",
      data: Object.entries(partialHouse).reduce(
        (errorsMap, [k, v]) =>
          errorsMap.set(k, { value: v, error: formErrors.get(k) }),
        new Map<
          string,
          {
            value: string | number | boolean | File | undefined;
            error: string | undefined;
          }
        >()
      ),
    } as const;
  }
  return {
    type: "success",
    data: parsedResults.data,
  } as const;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: { houses: new Array<House>() },
  getters: {
    getHouses: (state) => state.houses,
    getHouseById: (state) => (id: number) =>
      state.houses.find((e) => e.id === id),
  },
  mutations: {
    setHouses: (state, houses: Array<House>) => {
      state.houses = houses;
      return state.houses;
    },
    addHouse: (state, house: House) =>
      (state.houses = [...state.houses, house]),
    removeHouse: (state, houseOrID: House | number) => {
      if (typeof houseOrID === "number") {
        state.houses = state.houses.filter((e) => e.id !== houseOrID);
      }
      if (typeof houseOrID === "object") {
        state.houses = state.houses.filter((e) => e.id !== houseOrID.id);
      }
    },
    editHouse: (state, house: House) =>
      (state.houses = [
        ...state.houses.filter((e) => e.id !== house.id),
        house,
      ]),
  },
  actions: {
    hasHouses: ({ state }) => state.houses.length > 0,
    getHouses: () =>
      notFetch("https://api.intern.d-tt.nl/api/houses", {
        method: "GET",
      }).then(async (result) => {
        if (result instanceof Response) {
          return (await result.json()) as Array<House>;
        }
        return result;
      }),
    setHouses: ({ dispatch, commit }) => {
      return dispatch("getHouses").then((r) => {
        if (r instanceof NetworkError) {
          return { type: "error" } as const;
        }
        commit("setHouses", r);
        return { type: "success", data: r } as const;
      });
    },
    getLatestHouses: ({ dispatch, commit }) =>
      dispatch("getHouses").then((result) => {
        commit("setHouses", result);
        return result;
      }),
    addHouse: ({ commit, dispatch, state }, formData: FormData) => {
      const formResults = validateForm(formData, "addHouse");
      if (formResults.type === "error") return formResults;
      const houseForm = Object.entries(formResults.data)
        .filter(([_, v]) => !(v instanceof File))
        .reduce((form, [k, v]) => {
          form.set(k, String(v));
          return form;
        }, new FormData());
      const imageForm = new FormData();
      imageForm.set("image", formResults.data.image);
      return notFetch("https://api.intern.d-tt.nl/api/houses", {
        method: "POST",
        body: houseForm,
      })
        .then((result) => {
          if (result instanceof Error) throw result;
          else return dispatch("getHouses");
        })
        .then((result) => {
          const currentHouses = state.houses;
          const newHouse: House | undefined = result.find(
            (e: House) => !currentHouses.find((r) => r.id === e.id)
          );
          if (!newHouse) throw new Error("failed to add new House");
          else {
            commit("setHouses", result);
            return newHouse.id;
          }
        })
        .then((id) =>
          notFetch(`https://api.intern.d-tt.nl/api/houses/${id}/upload`, {
            method: "POST",
            body: imageForm,
          })
        )
        .then((r) => {
          if (r instanceof Error) throw new Error("failed to post Image");
          return r;
        })
        .catch((e) => {
          return e as Error | NetworkError;
        });
    },
    deleteHouse: ({ commit, state }, id: number) =>
      notFetch(`https://api.intern.d-tt.nl/api/houses/${id}`, {
        method: "DELETE",
      })
        .then((r): Success => {
          if (r instanceof Error) throw r;
          commit(
            "setHouses",
            state.houses.filter((e) => e.id !== id)
          );
          return { type: "success" };
        })
        .catch((e) => e as NetworkError),
    editHouse: (
      { commit, dispatch },
      { formData, id }: { formData: FormData; id: number }
    ) => {
      console.log(formData);
      const formResults = validateForm(formData, "editHouse");
      if (formResults.type === "error") return formResults;
      const houseForm = Object.entries(formResults.data)
        .filter(([_, v]) => !(v instanceof File))
        .reduce((form, [k, v]) => {
          form.set(k, v instanceof File ? v : String(v));
          return form;
        }, new FormData());

      const postHouse = notFetch(
        `https://api.intern.d-tt.nl/api/houses/${id}`,
        {
          method: "POST",
          body: houseForm,
        }
      )
        .then((r) => {
          if (r instanceof Error) throw r;
          else return dispatch("getHouses");
        })
        .then((r): Success => {
          if (r instanceof Error) throw r;
          commit("setHouses", r);
          return { type: "success" };
        })
        .catch((e) => e as NetworkError);
      if (formData.get("image") instanceof File) {
        const imageForm = new FormData();
        imageForm.set("image", formResults.data.image);
        return postHouse
          .then(() =>
            notFetch(`https://api.intern.d-tt.nl/api/houses/${id}/upload`, {
              method: "POST",
              body: imageForm,
            })
          )
          .then((r): Success => {
            if (r instanceof Error) throw r;
            const result: Success = { type: "success" };
            return result;
          })
          .catch((e) => e as NetworkError);
      } else return postHouse;
    },
    likeHouse: (_, id: number) => {
      const data = localStorage.getItem("liked");
      const otherHouses = data
        ? (JSON.parse(data) as Array<number>)
        : new Array<number>(id);
      localStorage.setItem("liked", JSON.stringify([...otherHouses, id]));
    },
    unlikeHouse: (_, id: number) => {
      const data = localStorage.getItem("liked");
      const otherHouses = data
        ? (JSON.parse(data) as Array<number>)
        : new Array<number>();
      localStorage.setItem(
        "liked",
        JSON.stringify(otherHouses.filter((e) => e !== id))
      );
    },
  },
});
