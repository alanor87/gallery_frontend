import { ToggleButton, Button } from "../elements";
import { useDispatch } from "react-redux";
import { debounce } from "debounce";
import { onChangeFilter } from "../../redux/gallery/gallery-actions";
import store from "../../MST/store";
import styles from "./AppBar.module.scss";

export default function AppBar({ onAuthModalOpen }) {
  const lightTheme = store.interfaceSettings.lightThemeIsOn;
  const dispatch = useDispatch();

  const onFilterChange = (event) => {
    const filterValue = event.target.value;
    dispatch(onChangeFilter(filterValue));
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
        onKeyUp={debounce(onFilterChange, 300)}
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
