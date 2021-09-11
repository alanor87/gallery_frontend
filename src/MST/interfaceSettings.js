import { types } from "mobx-state-tree";

const interfaceSettings = types.model({
    authModalIsOpen: false,
    lightThemeIsOn: false,
    sidePanelIsOpen: false,
}).actions(self => ({
    toggleTheme() {
        self.lightThemeIsOn = !self.lightThemeIsOn
    },
    toggleAuthModal() {
        self.authModalIsOpen = !self.authModalIsOpen
    },
    toggleSidePanel() {
        self.sidePanelIsOpen = !self.sidePanelIsOpen
    }
}))

export default interfaceSettings;