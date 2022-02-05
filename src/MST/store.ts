import { types, flow, applySnapshot } from "mobx-state-tree";
import axios, { AxiosResponse, AxiosError } from "axios";
import { popupNotice } from "../utils/popupNotice";
import userSettings from "./userSettings";
import modalSettings from "./modalSettings";
import imagesStoreSettings from "./imagesStoreSettings";
import { RegisterFormInterface, LoginFormInterface } from "types/user";

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

const publicSettings = types.model({
  publicImagesList: types.optional(types.array(types.string), []),
});

const store = types
  .model({
    userSettings: types.optional(userSettings, initialUserSettings),
    imagesStoreSettings: types.optional(imagesStoreSettings, {}),
    modalWindowsSettings: types.optional(modalSettings, {}),
    publicSettings: types.optional(publicSettings, {}),
    currentWindowWidth: types.optional(types.number, window.innerWidth),
  })
  .actions((self) => {
    const registerInit = flow(function* (registerData: RegisterFormInterface) {
      try {
        yield self.userSettings.userRegister(registerData);
      } catch (error) {
        popupNotice(`Error user register.
            ${error}`);
      }
    });

    const publicSettingsInit = flow(function* () {
      try {
        const response = yield axios("/public/publicSettings");
        applySnapshot(self.publicSettings, response.data.body.publicSettings);
      } catch (error) {
        popupNotice(`Error getting public settings.
        ${error}.
        `);
      }
    });

    const localTokenInit = flow(function* () {
      try {
        yield self.userSettings.getTokenFromLocalStorage();
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

    const loginInit = flow(function* (loginData: LoginFormInterface) {
      try {
        yield self.userSettings.userLogin(loginData);
      } catch (error) {
        popupNotice(`Error user login.
        ${error}`);
      }
    });

    const logoutInit = flow(function* () {
      try {
        localStorage.removeItem("token");
        yield self.userSettings.userLogout();
        window.location.href = "/login";
      } catch (error) {
        popupNotice(`Error user logout.
        ${error}`);
      } finally {
        self.imagesStoreSettings.purgeStorage();
        self.userSettings.purgeStorage();
      }
    });

    const setCurrentWindowWidth = (value: number) => {
      self.currentWindowWidth = value;
    };

    return {
      publicSettingsInit,
      localTokenInit,
      registerInit,
      loginInit,
      logoutInit,
      setCurrentWindowWidth,
    };
  });

export default store.create();
