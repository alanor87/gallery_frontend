import { types } from "mobx-state-tree";
import axios from "axios";
import userSettings from "./userSettings";
import interfaceSettings from "./interfaceSettings";
import imagesStoreSettings from "./imagesStoreSettings";

axios.defaults.baseURL = "http://localhost:3001";

const store = types.model({
  userSettings: types.optional(userSettings, {}),
  interfaceSettings: types.optional(interfaceSettings, {}),
  imagesStoreSettings: types.optional(imagesStoreSettings, {}),
});

export default store.create();