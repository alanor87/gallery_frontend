import { ToggleButton, Button } from "../elements";
import { debounce } from "debounce";
import store from "../../MST/store";
import styles from "./AppBar.module.scss";

export default function AppBar({ onAuthModalOpen }) {
  const lightTheme = store.interfaceSettings.lightThemeIsOn;

  const onFilterChange = (event) => {
    const filterValue = event.target.value;
  };

  const toggleSideMenuHandler = () => {
    console.log("Toggle!");
    store.interfaceSettings.toggleSidePanel();
  };

  const toggleThemeHandler = () => {
    store.interfaceSettings.toggleTheme();
  };

  return (
    <header className={styles.sectionHeader}>
      <ToggleButton
        toggleHandler={toggleSideMenuHandler}
        hint="Show/hide side menu"
      />
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search"
        autoComplete="off"
      />{" "}
      <Button text="Authorisation" type="button" onClick={onAuthModalOpen} />
      <Button text="Upload" type="button" />
      <ToggleButton
        toggleHandler={toggleThemeHandler}
        isChecked={lightTheme}
        hint="Dark/light theme"
      />
    </header>
  );
}
