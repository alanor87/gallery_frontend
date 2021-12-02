import { ToggleButton } from "../elements";
import { observer } from "mobx-react-lite";
import { Button } from "../elements";
import store from "../../MST/store";
import styles from "./AppBar.module.scss";

function AppBar() {
  const { logoutInit } = store;
  const { setModalComponentType, setModalOpen } = store.modalWindowsSettings;
  const { userIsAuthenticated } = store.userSettings;
  const { lightThemeIsOn, sidePanelIsOpen, toggleSidePanel, toggleTheme } =
    store.userSettings.userInterface;

  const uploadModalHandler = () => {
    setModalComponentType("upload");
    setModalOpen(true);
  };

  return (
    <header className={styles.sectionHeader}>
      {userIsAuthenticated && (
        <>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search"
            autoComplete="off"
          />
          <Button type="button" text="Logout" onClick={logoutInit} />
          <Button type="button" text="Upload" onClick={uploadModalHandler} />
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
