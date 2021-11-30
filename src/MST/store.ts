import { types, flow, getSnapshot, applySnapshot } from "mobx-state-tree";
import axios, { AxiosResponse, AxiosError } from "axios";
import { popupNotice } from "../utils/popupNotice";
import userSettings from "./userSettings";
import imagesStoreSettings from "./imagesStoreSettings";
import { RegisterFormInterface, LoginFormInterface } from "../types/user";

axios.defaults.baseURL = "http://localhost:3030/api/v1";
// axios.defaults.baseURL = "https://gallery-app-mj.herokuapp.com/api/v1";

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

const modalSettings = types
  .model({
    uploadModalIsOpen: types.optional(types.boolean, false),
    imageModalIsOpen: types.optional(types.boolean, false),
  })
  .actions((self) => {
    const uploadModalToggle = () => {
      self.uploadModalIsOpen = !self.uploadModalIsOpen;
    };
    const imageModalToggle = () => {
      self.imageModalIsOpen = !self.imageModalIsOpen;
    };
    return {
      uploadModalToggle,
      imageModalToggle,
    };
  });

const store = types
  .model({
    userSettings: types.optional(userSettings, initialUserSettings),
    imagesStoreSettings: types.optional(imagesStoreSettings, {}),
    modalWindowsSettings: types.optional(modalSettings, {}),
  })
  .actions((self) => {
    const localTokenInit = flow(function* () {
      try {
        yield self.userSettings.getTokenFromLocalStorage();
        applySnapshot(
          self.imagesStoreSettings.images,
          getSnapshot(self.userSettings.userOwnedImages)
        );
      } catch (error) {
        popupNotice(`Error user login.
        ${error}.
        Reloading page.`);
        self.userSettings.userToken = "";
        localStorage.removeItem("token");
        axios.defaults.headers.common.Authorization = ``;
        setTimeout(() => window.location.reload(), 3000);
      }
    });

    const registerInit = flow(function* (registerData: RegisterFormInterface) {
      try {
        yield self.userSettings.userRegister(registerData);
      } catch (error) {
        popupNotice(`Error user register.
        ${error}`);
      }
    });

    const loginInit = flow(function* (loginData: LoginFormInterface) {
      try {
        yield self.userSettings.userLogin(loginData);
        applySnapshot(
          self.imagesStoreSettings.images,
          getSnapshot(self.userSettings.userOwnedImages)
        );
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

    const backendToggle = (value: boolean) => {
      axios.defaults.baseURL = value
        ? "https://gallery-app-mj.herokuapp.com/api/v1"
        : "http://localhost:3030/api/v1";
    };

    return {
      localTokenInit,
      registerInit,
      loginInit,
      logoutInit,
      backendToggle,
    };
  });

export default store.create();
