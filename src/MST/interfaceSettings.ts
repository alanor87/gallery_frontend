import axios from "axios";
import { popupNotice } from "../utils/popupNotice";
import { types, flow } from "mobx-state-tree";

export const interfaceSettings = types
  .model({
    backgroundImage: types.string,
    lightThemeIsOn: types.boolean,
    imagesPerPage: types.number,
    sidePanelIsOpen: types.boolean,
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
      self.lightThemeIsOn = value;
      fetchSetInterfaceSettings();
    };

    const toggleSidePanel = (value: boolean) => {
      self.sidePanelIsOpen = value;
    };

    return {
      fetchSetInterfaceSettings,
      toggleTheme,
      toggleSidePanel,
    };
  });

export default interfaceSettings;
