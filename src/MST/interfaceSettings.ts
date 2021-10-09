import axios from "axios";
import { types, flow, Instance } from "mobx-state-tree";

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
      const response = yield axios.get("/interface");
      const settings = response.data;
      self._id = response._id;
      self.backgroundImage = settings.backgroundImage;
      self.lightThemeIsOn = settings.lightThemeIsOn;
      self.imagesPerPage = settings.imagesPerPage;
    });

    const fetchSetInterfaceSettings = flow(function* () {
      const interfaceSettingsToSave = { ...self };
      yield axios.put("/interface", interfaceSettingsToSave);
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
