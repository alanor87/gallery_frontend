import { types, flow } from "mobx-state-tree";
import axios, { AxiosResponse, AxiosError } from "axios";
import { popupNotice } from "../utils/popupNotice";
import userSettings from "./userSettings";
import interfaceSettings from "./interfaceSettings";
import imagesStoreSettings from "./imagesStoreSettings";

axios.defaults.baseURL = "http://localhost:3030/api/v1";

axios.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: AxiosError) => {
    const errorMsg = err.response?.data.message || "Unknown error.";
    throw new Error(errorMsg);
  }
);

const store = types
  .model({
    userSettings: types.optional(userSettings, {}),
    interfaceSettings: types.optional(interfaceSettings, {}),
    imagesStoreSettings: types.optional(imagesStoreSettings, {}),
  })
  .actions((self) => {
    const loginInit = flow(function* (loginData: any) {
      try {
        yield self.userSettings.userLogin(loginData);
        yield self.imagesStoreSettings.fetchAllImages();
      } catch (error) {
        popupNotice(`Error user login.
        ${error}`);
      }
    });
    return { loginInit };
  });

export default store.create();
