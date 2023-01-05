import { types, flow, applySnapshot } from "mobx-state-tree";
import axios, { AxiosResponse, AxiosError } from "axios";
import { popupNotice } from "utils/popupNotice";
import userSettings from "./userSettings";
import modalSettings from "./modalSettings";
import imagesStoreSettings from "./imagesStoreSettings";
import { RegisterFormInterface, LoginFormInterface } from "types/user";

// const backendUrl =
//   process.env.NODE_ENV === "production" || window.innerWidth < 900
//     ? "https://gallery-app-mj.herokuapp.com/api/v1"
//     : "http://localhost:3030/api/v1";

// const backendUrl = "http://192.168.1.132:3030/api/v1";
const backendUrl = "https://gallery-app-mj.herokuapp.com/api/v1";

axios.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: AxiosError) => {
    switch (err.response?.status) {
      // 401 comes in case if the token is expired or invalid for some other reason, therefore - rejected by server.
      // In this case the popup will be shown with the incoming message about that from server (invoked from catch clause
      // anywhere down the road) -  and the page will be reloaded in 3 seconds.
      case 401: {
        localStorage.removeItem("token");
        axios.defaults.headers.common.Authorization = ``;
        const errorMsg =
          err.response?.data?.message +
            " Page will be reloaded in 3 seconds." || "Unknown error.";
        setTimeout(() => window.location.reload(), 3000);
        throw new Error(errorMsg);
      }

      //403 - in case of wrong email/password combination on the login stage.
      case 403: {
        const errorMsg = err.response?.data.message || "Unknown error.";
        throw new Error(errorMsg);
      }

      default: {
        const errorMsg = err.response?.data || "Unknown error.";
        throw new Error(errorMsg);
      }
    }
  }
);

const initialUserSettings = {
  userName: "",
  userEmail: "",
  userToken: "",
  userIsAuthenticated: false,
  userOwnedimages: [],
  userInterface: {
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
    backendUrl: types.optional(types.string, backendUrl),
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
        applySnapshot(self.publicSettings, response.data.body);
      } catch (error) {
        popupNotice(`Error getting public settings.
        ${error}.
        `);
      }
    });

    const localTokenInit = flow(function* () {
      try {
        yield self.userSettings.getTokenFromLocalStorage();
      } catch (error: any) {
        popupNotice(`Local token authentication failed. ${error.message}`);
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

    const setBackendUrl = (value: string) => {
      self.backendUrl = value;
    };

    return {
      publicSettingsInit,
      localTokenInit,
      registerInit,
      loginInit,
      logoutInit,
      setCurrentWindowWidth,
      setBackendUrl,
    };
  });

export default store.create();
