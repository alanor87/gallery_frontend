import axios from "axios";
import { types, flow, applySnapshot } from "mobx-state-tree";
import { Image } from "./imagesStoreSettings";
import { ImageType } from "./imagesStoreSettings";
import { interfaceSettings } from "./interfaceSettings";
import { UserInterfaceSettings } from "../types/user";
import AuthenticatedUserType, {
  RegisterFormInterface,
  LoginFormInterface,
} from "../types/user";

const initialUserSettings = {
  userName: "",
  userEmail: "",
  userToken: "",
  userIsAuthenticated: false,
  userOwnedImages: [],
  userInterface: {
    backgroundImage:
      "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072821_960_720.jpg",
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
    userOwnedImages: types.optional(types.array(Image), []),
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

    // Error processing for possible exception in register/login/logout takes place a level higher -
    // in the store.loginInit()/store.logoutInit() actions.
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

    const getTokenFromLocalStorage = flow(function* () {
      const token = localStorage.getItem("token");
      if (token) {
        self.userToken = token;
        axios.defaults.headers.common.Authorization = `Bearer ${self.userToken}`;
        const authenticatedUser = yield axios.get("users/getUserByToken");
        savingAuthenticatedUserData(authenticatedUser.data.body);
      }
    });

    const addUserOwnedImage = (image: ImageType) => {
      self.userOwnedImages.push(image);
    };

    const purgeStorage = () => {
      applySnapshot(self, initialUserSettings);
    };

    return {
      userRegister,
      userLogin,
      userLogout,
      getTokenFromLocalStorage,
      addUserOwnedImage,
      purgeStorage,
    };
  });
export default userSettings;
