import { types } from "mobx-state-tree";

const userSettings = types.model({
  userName: types.optional(types.string, ""),
  userEmail: types.optional(types.string, ""),
  userToken: types.optional(types.string, ""),
  userIsAuthenticated: types.optional(types.boolean, false),
});

export default userSettings;
