import axios from "axios";
import { popupNotice } from "utils/popupNotice";
import { types, flow, getParent, Instance } from "mobx-state-tree";
import { UserSettingsStoreType } from "./userSettings";

export const interfaceSettings = types
  .model({
    backgroundImage: types.optional(types.string, ''),
    lightThemeIsOn: types.optional(types.boolean, false),
    imagesPerPage: types.optional(types.number, 10),
    sidePanelIsOpen: types.optional(types.boolean, false),
  })
  .actions((self) => {
    const fetchSetInterfaceSettings = flow(function* () {
      try {
        const interfaceSettingsToSave = { ...self };
        yield axios.patch("/users/interface", interfaceSettingsToSave);
      } catch (error) {
        popupNotice(
          `Error while saving interface settings.
           ${error}`
        );
      }
    });

    const toggleTheme = (value: boolean) => {
      const { userIsAuthenticated } = getParent<UserSettingsStoreType>(self);
      self.lightThemeIsOn = value;
      if (userIsAuthenticated) fetchSetInterfaceSettings();
    };

    const toggleSidePanel = (value: boolean) => {
      self.sidePanelIsOpen = value;
      fetchSetInterfaceSettings();
    };

    return {
      fetchSetInterfaceSettings,
      toggleTheme,
      toggleSidePanel,
    };
  });

export type UserInterfaceSettingsType = Instance<typeof interfaceSettings>

export default interfaceSettings;
