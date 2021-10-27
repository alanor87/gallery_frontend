import { types, flow } from "mobx-state-tree";
import axios, { AxiosResponse, AxiosError } from "axios";
import { popupNotice } from "../utils/popupNotice";
import userSettings from "./userSettings";
import imagesStoreSettings from "./imagesStoreSettings";
import { RegisterFormInterface, LoginFormInterface } from "../types/user";

axios.defaults.baseURL = "http://localhost:3030/api/v1";

axios.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: AxiosError) => {
    const errorMsg = err.response?.data.message || "Unknown error.";
    throw new Error(errorMsg);
  }
);

const initialUserSettings = {
  userName: "",
  userEmail: "",
  userToken: "",
  userIsAuthenticated: false,
  userOwnedimages: [],
  userInterface: {
    backgroundImage:
      "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072821_960_720.jpg",
    lightThemeIsOn: false,
    imagesPerPage: 10,
    sidePanelIsOpen: false,
  },
};

const store = types
  .model({
    userSettings: types.optional(userSettings, initialUserSettings),
    imagesStoreSettings: types.optional(imagesStoreSettings, {}),
  })
  .actions((self) => {
    const registerInit = flow(function* (registerData: RegisterFormInterface) {
      try {
        yield self.userSettings.userRegister(registerData);
        yield self.imagesStoreSettings.fetchAllImages();
      } catch (error) {
        popupNotice(`Error user register.
        ${error}`);
      }
    });

    const loginInit = flow(function* (loginData: LoginFormInterface) {
      try {
        yield self.userSettings.userLogin(loginData);
        yield self.imagesStoreSettings.fetchAllImages();
      } catch (error) {
        popupNotice(`Error user login.
        ${error}`);
      }
    });

    const logoutInit = flow(function* () {
      try {
        localStorage.removeItem("token");
        yield self.userSettings.userLogout();
      } catch (error) {
        popupNotice(`Error user logout.
        ${error}`);
      } finally {
        self.imagesStoreSettings.purgeStorage();
        self.userSettings.purgeStorage();
      }
    });

    return { registerInit, loginInit, logoutInit };
  });

export default store.create();
