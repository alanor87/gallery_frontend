import axios from "axios";
import { types, flow, Instance } from "mobx-state-tree";
import LoginFormInterface from "../components/LoginForm/types";
import RegisterFormInterface from "../components/RegisterForm/types";

const userSettings = types
  .model({
    userName: types.optional(types.string, ""),
    userEmail: types.optional(types.string, ""),
    userToken: types.optional(types.string, ""),
    userIsAuthenticated: types.optional(types.boolean, false),
  })
  .actions((self) => {
    const toggleUserIsAuthenticated = (isAuthenticated: boolean) => {
      self.userIsAuthenticated = isAuthenticated;
    };

    const userRegister = flow(function* (newUser: RegisterFormInterface) {
      try {
        const registeredUser = yield axios.post("/auth/register", newUser);
        console.log(registeredUser.data);
      } catch (error) {
        console.log(error);
      }
    });

    const userLogin = flow(function* (userLoginData: LoginFormInterface) {
      try {
        const authenticatedUser = yield axios.post(
          "/auth/login",
          userLoginData
        );
        console.log(authenticatedUser.data);
      } catch (error) {
        console.log(error);
      }
    });
    return { userRegister, userLogin, toggleUserIsAuthenticated };
  });

export interface UserSettingsType extends Instance<typeof userSettings> {}
export default userSettings;
