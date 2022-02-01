import { Button } from "../elements";
import store from "MST/store";
import styles from "./AppBar.module.scss";

type Props = {
  filterChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchQueryHandler: (e: any) => void;
};

const AppBarMobile: React.FC<Props> = ({
  filterChangeHandler,
  searchQueryHandler,
}) => {
  const { setModalComponentType, setModalOpen } = store.modalWindowsSettings;

  const menuOpenHandler = () => {
    setModalComponentType("menu");
    setModalOpen(true);
  };
  return (
    <header className={styles.sectionHeader}>
      <input
        type="text"
        className={styles.searchInputDesktop}
        placeholder="Search"
        autoComplete="off"
        onChange={filterChangeHandler}
        onKeyPress={searchQueryHandler}
      />
      <Button icon="icon_menu" onClick={menuOpenHandler} />
    </header>
  );
};

export default AppBarMobile;
