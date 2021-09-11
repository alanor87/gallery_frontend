const isAuthenticated = state => state.userReducer.isAuthenticated;
const getToken = state => state.userReducer.token;
const getUserData = state => state.userReducer.userData;
const getThemeSettings = state => state.userReducer.interfaceSettings.lightTheme;
const getSideMenuState = state => state.userReducer.interfaceSettings.sideMenuOn;

export const userSelectors = {
    isAuthenticated,
    getToken,
    getUserData,
    getThemeSettings,
    getSideMenuState,
}