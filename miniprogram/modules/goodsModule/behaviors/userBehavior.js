import { userStore } from "@/store/userStore";
import { BehaviorWithStore } from "mobx-miniprogram-bindings";

export const userBehavior = BehaviorWithStore({
  storeBindings: {
    store: userStore,
    fields: ["token"],
  },
});
