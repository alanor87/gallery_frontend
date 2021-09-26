import { ToggleButton } from "../elements";
import { observer } from "mobx-react-lite";
import store from "../../MST/store";
import styles from "./AppBar.module.scss";

function AppBar() {
  const { userIsAuthenticated } = store.userSettings;
  const { lightThemeIsOn } = store.interfaceSettings;

  const toggleSideMenuHandler = (value) => {
    store.interfaceSettings.toggleSidePanel(value);
  };

  const toggleThemeHandler = (value) => {
    store.interfaceSettings.toggleTheme(value);
  };

  const toggleAuthHandler = (value) => {
    store.userSettings.toggleUserIsAuthenticated(value);
  };

  return (
    <header className={styles.sectionHeader}>
      <ToggleButton
        toggleHandler={toggleSideMenuHandler}
        hint="Show/hide side menu"
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
