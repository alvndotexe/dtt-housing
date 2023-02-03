import { InjectionKey } from "vue";
import {
  ActionContext,
  ActionTree,
  CommitOptions,
  createStore,
  DispatchOptions,
  GetterTree,
  MutationTree,
  Store as VuexStore,
  useStore as baseUseStore,
} from "vuex";
import {
  ErrorType,
  handleNetworkError,
  NetworkError,
  notFetch,
  Success,
} from "./utils";

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

function handleForms(form: FormData) {
  const houseForm = form;
  const imageForm = new FormData();
  for (const [key, value] of form) {
    if (key === "image") houseForm.delete(key);
    imageForm.set("image", value);
  }
  return [houseForm, imageForm] as const;
}

type State = Array<House>;
const state: State = new Array<House>();

type Mutations = {
  setHouses: (state: State, houses: Array<House>) => State;
  addHouse: (state: State, house: House) => State;
  removeHouse: (state: State, houseOrID: House | number) => State;
  editHouse: (state: State, house: House) => State;
};
const mutations: MutationTree<State> & Mutations = {
  setHouses: (state, houses: Array<House>) => {
    state = houses;
    return state;
  },
  addHouse: (state, house: House): State => {
    state = [...state, house];
    return state;
  },
  removeHouse: (state, houseOrID: House | number): State => {
    state = state.filter((e) =>
      typeof houseOrID === "object" ? e.id === houseOrID.id : e.id === houseOrID
    );
    return state;
  },

  editHouse: (state, house: House) => {
    state = [...state.filter((e) => e.id !== house.id), house];
    return state;
  },
};

type Getters = {
  getHouses: (state: State) => State;
};

const getters: GetterTree<State, State> & Getters = {
  getHouses: (state) => state,
};

type AugmentedActionContext = {
  commit: <K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ) => ReturnType<Mutations[K]>;
  dispatch: <K extends keyof Actions<State>>(
    key: K,
    payload: Parameters<Actions<State>[K]>[1]
  ) => ReturnType<Actions<State>[K]>;
} & Omit<ActionContext<State, State>, "commit" | "dispatch">;

type Actions<S> = {
  hasHouses: (this: VuexStore<S>, { state }: AugmentedActionContext) => boolean;
  getHouses: (this: VuexStore<S>) => Promise<NetworkError | House[]>;
  setHouses: (
    this: VuexStore<State>,
    { dispatch, commit }: AugmentedActionContext
  ) => Promise<Success<Array<House>> | ErrorType<undefined, string>>;
  getHouseByID: (
    this: VuexStore<State>,
    { dispatch }: AugmentedActionContext,
    id: number
  ) => Promise<undefined | House>;
  addHouse: (
    this: VuexStore<State>,
    { commit, dispatch, state }: AugmentedActionContext,
    form: FormData
  ) => Promise<Success<undefined> | ErrorType<NetworkError, string>>;
  editHouse: (
    this: VuexStore<State>,
    { commit, dispatch, state }: AugmentedActionContext,
    payload: { form: FormData; id: number }
  ) => Promise<Success<undefined> | ErrorType<NetworkError, string>>;
  deleteHouse: (
    this: VuexStore<State>,
    { commit, state }: AugmentedActionContext,
    id: number
  ) => Promise<NetworkError | Success<undefined>>;
  likeHouse: (
    this: VuexStore<State>,
    _: AugmentedActionContext,
    id: number
  ) => void;
  unlikeHouse: (
    this: VuexStore<State>,
    _: AugmentedActionContext,
    id: number
  ) => void;
};

const actions: ActionTree<State, State> & Actions<State> = {
  hasHouses: ({ state, dispatch, commit, getters, rootGetters, rootState }) => {
    return state.length > 0;
  },
  getHouses: () =>
    notFetch("houses", {
      method: "GET",
    }).then(async (result) => {
      if (result instanceof Response) {
        return (await result.json()) as Array<House>;
      }
      return result;
    }),
  setHouses: ({ dispatch, commit }) => {
    return dispatch("getHouses", undefined).then((r) => {
      if (r instanceof NetworkError) {
        return { type: "Error", data: undefined, message: r.message };
      }
      commit("setHouses", r);
      return { type: "Success", data: r };
    });
  },
  getHouseByID: ({ dispatch }, id: number) => {
    return dispatch("getHouses", undefined)
      .then((r) => {
        if (r instanceof NetworkError) throw r;
        else return r;
      })
      .then((r) => r.find((e: House) => e.id === id));
  },
  addHouse: ({ commit, dispatch, state }, form) => {
    const [houseForm, imageForm] = handleForms(form);
    return notFetch("houses", {
      method: "POST",
      body: houseForm,
    })
      .then((result) => {
        if (result instanceof Error) throw result;
        return dispatch("getHouses", undefined);
      })
      .then(async (result) => {
        if (result instanceof NetworkError) throw result;
        const oldHouses = state.map((e) => e.id);
        const newHouse = result.find(
          (e: House) => !oldHouses.includes(e.id)
        ) as House;
        commit("setHouses", result);
        return newHouse;
      })
      .then(
        async (house) =>
          [
            await notFetch(`houses/${house.id}/upload`, {
              method: "POST",
              body: imageForm,
            }),
            house.id,
          ] as const
      )
      .then(async ([result, houseID]): Promise<Success<undefined>> => {
        if (result instanceof NetworkError) throw result;
        console.log(result.status);
        if (result.status !== 200)
          return await dispatch("deleteHouse", houseID).then(
            (r): Success<undefined> => {
              if (r instanceof NetworkError) {
                throw Error;
              } else {
                console.log(result);

                return { type: "Success", data: undefined };
              }
            }
          );
        return { type: "Success", data: undefined };
      })
      .catch(handleNetworkError);
  },
  deleteHouse: ({ commit, state }, id: number) =>
    notFetch(`houses/${id}`, {
      method: "DELETE",
    })
      .then((r): Success<undefined> => {
        if (r instanceof Error) throw r;
        commit(
          "setHouses",
          state.filter((e) => e.id !== id)
        );
        return { type: "Success", data: undefined };
      })
      .catch((e) => e as NetworkError),
  editHouse: ({ commit, dispatch }, { form, id }) => {
    const [houseForm, imageForm] = handleForms(form);
    const postHouse = notFetch(`houses/${id}`, {
      method: "POST",
      body: houseForm,
    })
      .then((r) => {
        if (r instanceof Error) throw r;
        else return dispatch("getHouses", undefined);
      })
      .then((r): Success<undefined> => {
        if (r instanceof Error) throw r;
        commit("setHouses", r);
        return { type: "Success", data: undefined };
      })
      .catch(handleNetworkError);
    if (imageForm.get("image") instanceof File) {
      return postHouse
        .then(() =>
          notFetch(`houses/${id}/upload`, {
            method: "POST",
            body: imageForm,
          })
        )
        .then((r): Success<undefined> => {
          if (r instanceof Error) throw r;
          return { type: "Success", data: undefined };
        })
        .catch(handleNetworkError);
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
};

export type Store = Omit<
  VuexStore<State>,
  "getters" | "commit" | "dispatch"
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;
} & {
  dispatch<K extends keyof Actions<State>>(
    key: K,
    payload: Parameters<Actions<State>[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions<State>[K]>;
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
};

export const key: InjectionKey<Store> = Symbol();

export const store = createStore({
  state,
  actions,
  getters,
  mutations,
});

export function useStore() {
  return baseUseStore(key) as unknown as Store;
}
