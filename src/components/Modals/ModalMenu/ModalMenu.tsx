import { NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { ToggleButton, Button } from "components/elements";
import { ModalWindowProps } from "types/modal";
import store from "MST/store";
import styles from "./ModalMenu.module.scss";

const ModalMenu: React.FC<ModalWindowProps> = ({ modalCloseHandle }) => {
  const { logoutInit } = store;
  const { userIsAuthenticated, userName, userEmail } = store.userSettings;
  const { setModalComponentType, setModalOpen } = store.modalWindowsSettings;
  const { getCurrentGalleryMode } = store.imagesStoreSettings;
  const { lightThemeIsOn, toggleTheme } = store.userSettings.userInterface;

  const uploadModalHandler = () => {
    setModalComponentType("upload");
    setModalOpen(true);
  };

  return (
    <div className={styles.modalMenu}>
      <Button
        type="button"
        title="Close menu"
        className={"closeBtn " + styles.modalImageCloseBtn}
        icon="icon_close"
        iconSize={30}
        onClick={modalCloseHandle}
      />
      {userIsAuthenticated ? (
        <>
          {" "}
          <ul className={styles.navLinksList}>
            <li>
              <NavLink
                to={"/userGallery"}
                className="navLink"
                exact
                onClick={modalCloseHandle}
              >
                Your gallery
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/sharedGallery"}
                className="navLink"
                exact
                onClick={modalCloseHandle}
              >
                Shared images
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/publicGallery"}
                className="navLink"
                exact
                onClick={modalCloseHandle}
              >
                Public images
              </NavLink>
            </li>
          </ul>
          <span>
            {userName}, {userEmail}
          </span>
          <div className={styles.buttonsWrapper}>
            <Button
              type="button"
              className={styles.modalMenuButton}
              onClick={logoutInit}
              text="Logout"
            />
            <Button
              type="button"
              className={styles.modalMenuButton}
              text="Upload"
              onClick={uploadModalHandler}
              disabled={getCurrentGalleryMode !== "userGallery"}
            />
          </div>
          <div className="themeToggleWrapper">
            <span>dark theme</span>
            <ToggleButton
              toggleHandler={toggleTheme}
              isChecked={lightThemeIsOn}
              hint="Dark/light theme"
            />
            <span>light theme</span>
          </div>
        </>
      ) : (
        <>
          <ul className={styles.navLinksList}>
            <li>
              {" "}
              <NavLink
                to={"/login"}
                className="navLink"
                exact
                onClick={modalCloseHandle}
              >
                Login
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/register"}
                className="navLink"
                exact
                onClick={modalCloseHandle}
              >
                Register
              </NavLink>
            </li>
          </ul>

          <div className="themeToggleWrapper">
            <span>dark theme</span>
            <ToggleButton
              toggleHandler={toggleTheme}
              isChecked={lightThemeIsOn}
              hint="Dark/light theme"
            />
            <span>light theme</span>
          </div>
        </>
      )}
    </div>
  );
};

export default observer(ModalMenu);
