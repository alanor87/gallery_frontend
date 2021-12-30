import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useLocation } from "react-router";
import { ToggleButton, Button } from "../elements";
import store from "../../MST/store";
import styles from "./AppBar.module.scss";

function AppBar() {
  const { logoutInit } = store;
  const { setModalComponentType, setModalOpen } = store.modalWindowsSettings;
  const { getCurrentGalleryMode, setFilter } = store.imagesStoreSettings;
  const { userIsAuthenticated, userName, userEmail } = store.userSettings;
  const { lightThemeIsOn, toggleTheme, toggleSidePanel, sidePanelIsOpen } =
    store.userSettings.userInterface;

  const [appBarVisible, setAppBarVisible] = useState(true);
  const [filterValue, setFilterValue] = useState("");

  const location = useLocation();
  useEffect(() => {
    setAppBarVisible(!["/login", "/register"].includes(location.pathname));
  }, [location]);

  const searchQueryHandler = (e: any) => {
    if (e.type === "click") {
      setFilter(filterValue);
      return;
    }
    if (e.type === "keypress" && e.key === "Enter") {
      setFilter(filterValue);
      return;
    }
  };

  const uploadModalHandler = () => {
    setModalComponentType("upload");
    setModalOpen(true);
  };

  const filterChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
    if (!e.target.value) setFilter("");
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

  return appBarVisible ? (
    <header className={styles.sectionHeader}>
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
    </header>
  ) : null;
}

export default observer(AppBar);
