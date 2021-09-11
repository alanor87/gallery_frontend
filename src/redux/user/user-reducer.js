import { createReducer, combineReducers } from "@reduxjs/toolkit";
import {
   loginSuccess,
   loginError,
   registerSuccess,
   registerError,
   logoutSuccess,
   logoutError,
   getCurrentUserSuccess,
   getCurrentUserError,
   toggleTheme,
   toggleSideMenu,
} from './user-actions';

const initUserData = {
   userName: '',
   userId: '',
   userEmail: '',
}

const initInterfaceSettings = {
   lightTheme: true,
   sideMenuOn: false,
}

const isAuthenticated = createReducer(true, {
   [loginSuccess.type]: () => true,
   [registerSuccess.type]: () => true,
   [getCurrentUserSuccess.type]: () => true,
   [loginError.type]: () => false,
   [logoutSuccess.type]: () => false,
   [logoutError.type]: () => false,
   [registerError.type]: () => false,
   [getCurrentUserError.type]: () => false,
});

const token = createReducer(null, {
   [loginSuccess.type]: (_, { payload }) => payload,
   [registerSuccess.type]: (_, { payload }) => payload,
   [getCurrentUserSuccess.type]: (_, { payload }) => payload,
   [loginError.type]: () => null,
   [logoutSuccess.type]: () => null,
   [logoutError.type]: () => null,
   [registerError.type]: () => null,
   [getCurrentUserError.type]: () => null,
})

const userData = createReducer(initUserData, {
   [loginSuccess.type]: (state, { payload }) => { return { ...state, ...payload } },
   [registerSuccess.type]: (state, { payload }) => { return { ...state, ...payload } },
   [getCurrentUserSuccess.type]: (state, { payload }) => { return { ...state, ...payload } },
   [loginError.type]: () => initUserData,
   [logoutSuccess.type]: () => initUserData,
   [logoutError.type]: () => initUserData,
   [registerError.type]: () => initUserData,
   [getCurrentUserError.type]: () => initUserData,
})

const interfaceSettings = createReducer(initInterfaceSettings, {
   [toggleTheme.type]: (state, { payload }) => {
      return { ...state, lightTheme: payload };
   },
   [toggleSideMenu.type]: (state, { payload }) => {
      return { ...state, sideMenuOn: payload };
   },
})


export default combineReducers({
   isAuthenticated, token, userData, interfaceSettings
})