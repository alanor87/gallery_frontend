import { types, Instance } from "mobx-state-tree";

const userSettings = types
  .model({
    userName: types.optional(types.string, ""),
    userEmail: types.optional(types.string, ""),
    userToken: types.optional(types.string, ""),
    userIsAuthenticated: types.optional(types.boolean, true),
  })
  .actions((self) => ({
    toggleUserIsAuthenticated(isAuthenticated: boolean) {
      self.userIsAuthenticated = isAuthenticated;
    },
  }));

export interface UserSettingsType extends Instance<typeof userSettings> {}
export default userSettings;
