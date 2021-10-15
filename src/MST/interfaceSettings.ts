import axios from "axios";
import { types, flow, Instance } from "mobx-state-tree";
import { alert, error, defaults } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";

const interfaceSettings = types
  .model({
    _id: types.optional(types.string, "6159d94c4361380380d82f9e"),
    backgroundImage: types.optional(
      types.string,
      "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072821_960_720.jpg"
    ),
    lightThemeIsOn: false,
    imagesPerPage: 10,
    sidePanelIsOpen: false,
  })
  .actions((self) => {
    const fetchGetInterfaceSettings = flow(function* () {
      try {
        const response = yield axios.get("/interface");
        const settings = response.data;
        self._id = response._id;
        self.backgroundImage = settings.backgroundImage;
        self.lightThemeIsOn = settings.lightThemeIsOn;
        self.imagesPerPage = settings.imagesPerPage;
      } catch (error) {
        alert({
          text: `Error while fetching interface settings. Error info : ${error}`,
          type: "error",
        });
      }
    });

    const fetchSetInterfaceSettings = flow(function* () {
      try {
        const interfaceSettingsToSave = { ...self };
        yield axios.put("/interface", interfaceSettingsToSave);
      } catch (error) {
        alert({
          text: `Error while saving interface settings. Error info : ${error}`,
          type: "error",
        });
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
      fetchGetInterfaceSettings,
      fetchSetInterfaceSettings,
      toggleTheme,
      toggleSidePanel,
    };
  });

export interface interfaceSettingsType
  extends Instance<typeof interfaceSettings> {}
export default interfaceSettings;
