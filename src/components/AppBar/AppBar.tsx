import { useState } from "react";
import { useWindowWidth } from "hooks";
import AppBarDesktop from "./AppBarDesktop";
import AppBarMobile from "./AppBarMobile";
import store from "../../MST/store";
import styles from "./AppBar.module.scss";

export type AppBarProps = {
  filterValue: string;
  filterChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchQueryHandler: (e: any) => void;
};

function AppBar() {
  const isMobileScreen = useWindowWidth() <= 900;

  const { setFilter } = store.imagesStoreSettings;

  const [filterValue, setFilterValue] = useState("");

  const onFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
    if (!e.target.value) setFilter("");
  };

  const onSearchQuery = (e: any) => {
    if (e.type === "click") {
      setFilter(filterValue);
      return;
    }
    if (e.type === "keypress" && e.key === "Enter") {
      setFilter(filterValue);
      return;
    }
  };

  return (
    <header className={styles.sectionHeader}>
      {isMobileScreen ? (
        <AppBarMobile
          filterValue={filterValue}
          filterChangeHandler={onFilterChange}
          searchQueryHandler={onSearchQuery}
        />
      ) : (
        <AppBarDesktop
          filterValue={filterValue}
          filterChangeHandler={onFilterChange}
          searchQueryHandler={onSearchQuery}
        />
      )}
    </header>
  );
}

export default AppBar;
