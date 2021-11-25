import ImageMenu from "../ImageMenu";
import store from "../../MST/store";
import styles from "./GroupMenu.module.scss";

const GroupMenu = () => {
  const { groupSelectModeToggle } = store.imagesStoreSettings;
  return (
    <div className={styles.groupMenuWrapper}>
      <ImageMenu isOpened={true} onSelect={groupSelectModeToggle} />
    </div>
  );
};

export default GroupMenu;
