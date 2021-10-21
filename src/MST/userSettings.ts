import axios from "axios";
import { popupNotice } from "../utils/popupNotice";
import { types, flow, Instance, applySnapshot } from "mobx-state-tree";
import LoginFormInterface from "../components/LoginForm/types";
import RegisterFormInterface from "../components/RegisterForm/types";

const initialUserSettings = {
  userName: "",
  userEmail: "",
  userToken: "",
  userIsAuthenticated: false,
};

const userSettings = types
  .model({
    userName: types.optional(types.string, ""),
    userEmail: types.optional(types.string, ""),
    userToken: types.optional(types.string, ""),
    userIsAuthenticated: types.optional(types.boolean, false),
  })
  .actions((self) => {
    const userRegister = flow(function* (newUser: RegisterFormInterface) {
      try {
        const registeredUser = yield axios.post("/auth/register", newUser);
        self.userName = registeredUser.data.userName;
        self.userEmail = registeredUser.data.userEmail;
        self.userIsAuthenticated = true;
      } catch (error) {
        popupNotice(`Error registering user.
         ${error}`);
      }
    });

    // Error processing for possible exception in login/logout takes place a level higher -
    // in the store.loginInit()/store.logoutInit() actions.
    const userLogin = flow(function* (userLoginData: LoginFormInterface) {
      const authenticatedUser = yield axios.post("/auth/login", userLoginData);
      self.userName = authenticatedUser.data.body.userName;
      self.userEmail = authenticatedUser.data.body.userEmail;
      self.userToken = authenticatedUser.data.body.userToken;
      localStorage.setItem("token", self.userToken);
      axios.defaults.headers.common.Authorization = `Bearer ${self.userToken}`;
      self.userIsAuthenticated = true;
    });

    const userLogout = flow(function* () {
      yield axios.get("/users/logout");
      self.userToken = "";
      self.userIsAuthenticated = false;
    });

    const purgeStorage = () => {
      console.log("Clear user");
      applySnapshot(self, initialUserSettings);
    };

    return { userRegister, userLogin, userLogout, purgeStorage };
  });

export interface UserSettingsType extends Instance<typeof userSettings> {}
export default userSettings;
