import { ToggleButton } from "../elements";
import { observer } from "mobx-react-lite";
import { Button } from "../elements";
import store from "../../MST/store";
import styles from "./AppBar.module.scss";

function AppBar() {
  const { logoutInit } = store;
  const { setUploadModalOpen } = store.modalWindowsSettings;
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
          <Button type="button" text="Logout" onClick={logoutInit} />
          <Button
            type="button"
            text="Upload"
            onClick={() => setUploadModalOpen(true)}
          />
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
