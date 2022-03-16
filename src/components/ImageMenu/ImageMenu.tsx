import { Button } from "../elements";
import store from "../../MST/store";
import styles from "./ImageMenu.module.scss";

interface Props {
  className?: string;
  isOpened?: boolean;
  groupMenuMode?: boolean;
  modalImageMode?: boolean;
  onDelete?: () => void;
  onSelect?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
}
const ImageMenu: React.FC<Props> = ({
  className,
  isOpened = true,
  groupMenuMode = false,
  modalImageMode = false,
  onDelete,
  onEdit,
  onShare,
  onSelect,
}) => {
  const { toggleSelectAllImages, selectedImages } = store.imagesStoreSettings;
  const buttonsTabIndex = isOpened ? 0 : -1;
  return (
    <div className={"imageMenu" + (className ? className : "")}>
      {!modalImageMode && (
        <Button
          className={styles.imageMenuButton}
          type="button"
          title="Select mode on/off"
          icon="icon_select"
          onClick={onSelect}
          tabIndex={buttonsTabIndex}
        />
      )}
      {groupMenuMode && (
        <Button
          className={styles.imageMenuButton}
          type="button"
          title="Select / deselect all"
          icon="icon_select_all"
          onClick={toggleSelectAllImages}
          tabIndex={buttonsTabIndex}
        />
      )}
      {!groupMenuMode && (
        <Button
          className={styles.imageMenuButton}
          type="button"
          title="Edit tags"
          icon="icon_edit"
          onClick={onEdit}
          tabIndex={buttonsTabIndex}
        />
      )}
      <Button
        className={styles.imageMenuButton}
        type="button"
        title="Share"
        icon="icon_share"
        disabled={groupMenuMode && !selectedImages.length}
        onClick={onShare}
        tabIndex={buttonsTabIndex}
      />
      <Button
        className={styles.imageMenuButton}
        type="button"
        title="Delete"
        icon="icon_delete"
        disabled={groupMenuMode && !selectedImages.length}
        onClick={onDelete}
        tabIndex={buttonsTabIndex}
      />
    </div>
  );
};

export default ImageMenu;
