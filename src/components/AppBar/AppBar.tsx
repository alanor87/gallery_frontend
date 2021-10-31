import { ToggleButton } from "../elements";
import { observer } from "mobx-react-lite";
import store from "../../MST/store";
import styles from "./AppBar.module.scss";

function AppBar() {
  const { logoutInit } = store;
  const { uploadModalToggle } = store.modalWindowsSettings;
  const { userIsAuthenticated } = store.userSettings;
  const { lightThemeIsOn, sidePanelIsOpen, toggleSidePanel, toggleTheme } =
    store.userSettings.userInterface;

  return (
    <header className={styles.sectionHeader}>
      {userIsAuthenticated && (
        <ToggleButton
          toggleHandler={toggleSidePanel}
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
          <span className={styles.logoutSpan} onClick={logoutInit}>
            Logout
          </span>
          <span className={styles.logoutSpan} onClick={uploadModalToggle}>
            Upload
          </span>
          <ToggleButton
            toggleHandler={toggleTheme}
            isChecked={lightThemeIsOn}
            hint="Dark/light theme"
          />
        </>
      )}
    </header>
  );
}

export default observer(AppBar);
