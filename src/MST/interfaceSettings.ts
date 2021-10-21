import axios from "axios";
import { popupNotice } from "../utils/popupNotice";
import { types, flow, Instance, applySnapshot } from "mobx-state-tree";

const initialInterfaceSettings = {
  backgroundImage: "",
  lightThemeIsOn: false,
  imagesPerPage: 10,
  sidePanelIsOpen: false,
};

const interfaceSettings = types
  .model({
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
        self.backgroundImage = settings.backgroundImage;
        self.lightThemeIsOn = settings.lightThemeIsOn;
        self.imagesPerPage = settings.imagesPerPage;
      } catch (error) {
        popupNotice(
          `Error while fetching interface settings.
           ${error}`
        );
      }
    });

    const fetchSetInterfaceSettings = flow(function* () {
      try {
        const interfaceSettingsToSave = { ...self };
        yield axios.put("/interface", interfaceSettingsToSave);
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

    const purgeStorage = () => {
      console.log("Clear interface");
      applySnapshot(self, initialInterfaceSettings);
    };

    return {
      fetchGetInterfaceSettings,
      fetchSetInterfaceSettings,
      toggleTheme,
      toggleSidePanel,
      purgeStorage,
    };
  });

export interface interfaceSettingsType
  extends Instance<typeof interfaceSettings> {}
export default interfaceSettings;
