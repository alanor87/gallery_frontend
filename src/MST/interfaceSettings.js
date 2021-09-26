import axios from "axios";
import { types, flow } from "mobx-state-tree";

const interfaceSettings = types
  .model({
    backgroundImage: types.optional(types.string, 'https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072821_960_720.jpg'),
    lightThemeIsOn: false,
    imagesPerPage: 10,
    sidePanelIsOpen: false,
  })
  .actions((self) => {
    const fetchInterfaceSettings = flow(function* () {
      const newInterfaceSettings = yield axios.get('/interface').then(response => response.data);
      self.lightThemeIsOn = newInterfaceSettings.lightThemeIsOn;
      self.imagesPerPage = newInterfaceSettings.imagesPerPage;
    }
    );
    const setInterfaceSettings = flow(function* () {
      const interfaceSettingsToSave = { ...self };
      delete interfaceSettingsToSave.sidePanelIsOpen;
      yield axios.put('/interface', interfaceSettingsToSave);
    })
    const toggleTheme = (value) => {
      self.lightThemeIsOn = value;
      setInterfaceSettings();
    };
    const toggleSidePanel = (value) => {
      self.sidePanelIsOpen = value;
    };
    return { fetchInterfaceSettings, setInterfaceSettings, toggleTheme, toggleSidePanel }
  });

export default interfaceSettings;
