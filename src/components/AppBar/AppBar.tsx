import React from "react";
import { ToggleButton } from "../elements";
import { observer } from "mobx-react-lite";
import store from "../../MST/store";
import styles from "./AppBar.module.scss";

function AppBar() {
  const { userIsAuthenticated } = store.userSettings;
  const { lightThemeIsOn } = store.interfaceSettings;

  const toggleSideMenuHandler = (value: boolean) => {
    store.interfaceSettings.toggleSidePanel(value);
  };

  const toggleThemeHandler = (value: boolean) => {
    store.interfaceSettings.toggleTheme(value);
  };

  const toggleAuthHandler = (value: boolean) => {
    store.userSettings.toggleUserIsAuthenticated(value);
  };

  return (
    <header className={styles.sectionHeader}>
      <ToggleButton
        toggleHandler={toggleSideMenuHandler}
        hint="Show/hide side menu"
        isChecked={false}
      />
      {userIsAuthenticated && (
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search"
          autoComplete="off"
        />
      )}
      <ToggleButton
        toggleHandler={toggleAuthHandler}
        isChecked={userIsAuthenticated}
        hint="LogIn / LogOut"
      />
      <ToggleButton
        toggleHandler={toggleThemeHandler}
        isChecked={lightThemeIsOn}
        hint="Dark/light theme"
      />
    </header>
  );
}

export default observer(AppBar);
