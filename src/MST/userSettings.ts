import axios from "axios";
import { types, flow, applySnapshot } from "mobx-state-tree";
import { interfaceSettings } from "./interfaceSettings";
import { popupNotice } from "utils/popupNotice";
import {
  AuthenticatedUserType,
  UserInterfaceSettings,
  RegisterFormInterface,
  LoginFormInterface,
} from "types/user";

const initialUserSettings = {
  userName: "",
  userEmail: "",
  userToken: "",
  userIsAuthenticated: false,
  userOwnedImages: [],
  userOpenedToImages: [],
  userInterface: {
    lightThemeIsOn: false,
    imagesPerPage: 10,
    sidePanelIsOpen: false,
  },
};

const userSettings = types
  .model({
    userName: types.optional(types.string, ""),
    userEmail: types.optional(types.string, ""),
    userToken: types.optional(types.string, ""),
    userIsAuthenticated: types.optional(types.boolean, false),
    userOwnedImages: types.optional(types.array(types.string), []),
    userOpenedToImages: types.optional(types.array(types.string), []),
    userInterface: interfaceSettings,
  })
  .actions((self) => {
    const savingAuthenticatedUserData = (
      authenticatedUserData: AuthenticatedUserType & {
        userInterface: UserInterfaceSettings;
      }
    ) => {
      applySnapshot(self, { ...self, ...authenticatedUserData });
      localStorage.setItem("token", self.userToken);
      axios.defaults.headers.common.Authorization = `Bearer ${self.userToken}`;
      applySnapshot(self.userInterface, authenticatedUserData.userInterface);
      self.userIsAuthenticated = true;
    };

    /*
     * Error processing for possible exception in register/login/logout takes place a level higher -
     * in the store.loginInit()/store.logoutInit() actions.
     */
    const userRegister = flow(function* (newUser: RegisterFormInterface) {
      const registeredUser = yield axios.post("/auth/register", newUser);
      savingAuthenticatedUserData(registeredUser.data.body);
    });
    const userLogin = flow(function* (userLoginData: LoginFormInterface) {
      const authenticatedUser = yield axios.post("/auth/login", userLoginData);
      savingAuthenticatedUserData(authenticatedUser.data.body);
    });
    const userLogout = flow(function* () {
      yield axios.get("/users/logout");
      self.userToken = "";
      self.userIsAuthenticated = false;
    });

    /*
     *
     */

    const getTokenFromLocalStorage = flow(function* () {
      const token = localStorage.getItem("token");
      if (token) {
        self.userToken = token;
        axios.defaults.headers.common.Authorization = `Bearer ${self.userToken}`;
        const authenticatedUser = yield axios.get("users/getUserByToken");
        savingAuthenticatedUserData(authenticatedUser.data.body);
      }
    });

    const checkIfUserExistsByName = flow(function* (name) {
      try {
        const response = yield axios.post("users/getUserByName", {
          userName: name,
        });
        if (!response.data.userDoesExist)
          popupNotice(`User with the name "${name}" does not exist.`);
        return response.data.userDoesExist;
      } catch (error: any) {
        popupNotice(`${error.message}`);
      }
    });

    const updateUserOwnedImages = (newImagesIdList: string[]) => {
      applySnapshot(self.userOwnedImages, newImagesIdList);
    };

    const purgeStorage = () => {
      applySnapshot(self, initialUserSettings);
    };

    return {
      userRegister,
      userLogin,
      userLogout,
      getTokenFromLocalStorage,
      checkIfUserExistsByName,
      updateUserOwnedImages,
      purgeStorage,
    };
  });
export default userSettings;
