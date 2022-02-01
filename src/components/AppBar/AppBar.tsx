import { useState } from "react";
import { useWindowWidth } from "hooks";
import AppBarDesktop from "./AppBarDesktop";
import AppBarMobile from "./AppBarMobile";
import store from "../../MST/store";

function AppBar() {
  const isMobileScreen = useWindowWidth() < 800;

  const { setModalComponentType, setModalOpen } = store.modalWindowsSettings;
  const { getCurrentGalleryMode, setFilter } = store.imagesStoreSettings;

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

  return isMobileScreen ? (
    <AppBarMobile
      filterChangeHandler={onFilterChange}
      searchQueryHandler={onSearchQuery}
    />
  ) : (
    <AppBarDesktop />
  );
}

export default AppBar;
