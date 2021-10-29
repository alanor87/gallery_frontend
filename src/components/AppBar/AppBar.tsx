import React from "react";
import { ToggleButton } from "../elements";
import { observer } from "mobx-react-lite";
import store from "../../MST/store";
import styles from "./AppBar.module.scss";

function AppBar() {
  const { userIsAuthenticated } = store.userSettings;
  const { lightThemeIsOn, sidePanelIsOpen } = store.userSettings.userInterface;

  const toggleSideMenuHandler = (value: boolean) => {
    store.userSettings.userInterface.toggleSidePanel(value);
  };

  const toggleThemeHandler = (value: boolean) => {
    store.userSettings.userInterface.toggleTheme(value);
  };

  const logoutHandler = () => {
    store.logoutInit();
  };

  return (
    <header className={styles.sectionHeader}>
      {userIsAuthenticated && (
        <ToggleButton
          toggleHandler={toggleSideMenuHandler}
          hint="Show/hide side menu"
          isChecked={sidePanelIsOpen}
        />
      )}
      {userIsAuthenticated && (
        <>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search"
            autoComplete="off"
          />
          <span className={styles.logoutSpan} onClick={logoutHandler}>
            Logout
          </span>
          <ToggleButton
            toggleHandler={toggleThemeHandler}
            isChecked={lightThemeIsOn}
            hint="Dark/light theme"
          />
        </>
      )}
    </header>
  );
}

export default observer(AppBar);
