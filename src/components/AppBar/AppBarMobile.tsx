import { Button } from "../elements";
import store from "MST/store";
import { AppBarProps } from "./AppBar";
import styles from "./AppBar.module.scss";

function AppBarMobile({
  filterValue,
  filterChangeHandler,
  searchQueryHandler,
}: AppBarProps) {
  const { setModalComponentType, setModalOpen } = store.modalWindowsSettings;

  const menuOpenHandler = () => {
    setModalComponentType("menu");
    setModalOpen(true);
  };
  return (
    <>
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
        className={styles.mobileMenuBtn}
        icon="icon_menu"
        iconSize={30}
        onClick={menuOpenHandler}
      />
    </>
  );
}

export default AppBarMobile;
