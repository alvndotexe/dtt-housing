import About from "@/views/About.vue";
import Add from "@/views/Add.vue";
import Edit from "@/views/Edit.vue";
import Home from "@/views/Home.vue";
import House from "@/views/House.vue";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import { store, key } from "./store";
import "./style.css";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "Home", component: Home },
    { path: "/About", name: "About", component: About },
    { path: "/House/:id", name: "House", component: House },
    { path: "/Edit/:id", name: "Edit", component: Edit },
    { path: "/Add", name: "Add", component: Add },
  ],
});

createApp(App).use(router).use(store, key).mount("#app");
