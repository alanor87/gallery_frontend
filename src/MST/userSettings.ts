import axios from "axios";
import { types, flow, Instance } from "mobx-state-tree";

const userSettings = types
  .model({
    userName: types.optional(types.string, ""),
    userEmail: types.optional(types.string, ""),
    userToken: types.optional(types.string, ""),
    userIsAuthenticated: types.optional(types.boolean, true),
  })
  .actions((self) => {
    const toggleUserIsAuthenticated = (isAuthenticated: boolean) => {
      self.userIsAuthenticated = isAuthenticated;
    };

    const registerUser = flow(function* (newUser) {
      try {
        const registeredUser = yield axios.post("/auth/register", newUser);
        console.log(registeredUser.data);
      } catch (error) {
        console.log(error);
      }
    });
    return { registerUser, toggleUserIsAuthenticated };
  });

export interface UserSettingsType extends Instance<typeof userSettings> {}
export default userSettings;
