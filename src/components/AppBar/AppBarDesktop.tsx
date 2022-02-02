import { observer } from "mobx-react-lite";
import { ToggleButton, Button } from "../elements";
import store from "../../MST/store";
import { AppBarProps } from "./AppBar";
import styles from "./AppBar.module.scss";

function AppBarDesktop({
  filterValue,
  filterChangeHandler,
  searchQueryHandler,
}: AppBarProps) {
  const { logoutInit } = store;
  const { setModalComponentType, setModalOpen } = store.modalWindowsSettings;
  const { getCurrentGalleryMode } = store.imagesStoreSettings;
  const { userIsAuthenticated, userName, userEmail } = store.userSettings;
  const { lightThemeIsOn, toggleTheme, toggleSidePanel, sidePanelIsOpen } =
    store.userSettings.userInterface;

  const uploadModalHandler = () => {
    setModalComponentType("upload");
    setModalOpen(true);
  };

  const loginLogoutButtonProps = {
    text: userIsAuthenticated ? "Logout" : "Login",
    onClick: userIsAuthenticated
      ? () => {
          logoutInit();
          window.location.pathname = "/login";
        }
      : () => (window.location.pathname = "/login"),
  };

  return (
    <>
      {userIsAuthenticated && (
        <ToggleButton
          toggleHandler={toggleSidePanel}
          isChecked={sidePanelIsOpen}
          hint="Toggle side panel"
        />
      )}
      <div className={styles.searchInputWrap}>
        <input
          type="text"
          value={filterValue}
          className={styles.searchInput}
          placeholder="Search"
          autoComplete="off"
          onChange={filterChangeHandler}
          onKeyPress={searchQueryHandler}
        />
        <Button
          type="button"
          text="Search"
          className={styles.searchButton}
          onClick={searchQueryHandler}
        />
      </div>
      <Button type="button" {...loginLogoutButtonProps} />
      {userIsAuthenticated && (
        <>
          <Button
            type="button"
            text="Upload"
            onClick={uploadModalHandler}
            disabled={getCurrentGalleryMode !== "userGallery"}
          />
          <p>
            {userName}, {userEmail}
          </p>
          <ToggleButton
            toggleHandler={toggleTheme}
            isChecked={lightThemeIsOn}
            hint="Dark/light theme"
          />
        </>
      )}
    </>
  );
}

export default observer(AppBarDesktop);
