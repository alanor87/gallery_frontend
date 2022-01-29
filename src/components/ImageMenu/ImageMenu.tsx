import { Button } from "../elements";
import store from "../../MST/store";
import { ReactComponent as IconSelect } from "../../img/icon_select.svg";
import { ReactComponent as IconEdit } from "../../img/icon_edit.svg";
import { ReactComponent as IconShare } from "../../img/icon_share.svg";
import { ReactComponent as IconDelete } from "../../img/icon_delete.svg";
import { ReactComponent as IconSelectAll } from "../../img/icon_select_all.svg";
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
    <div className={`${styles.imageMenuWrapper} ${className}`}>
      {!modalImageMode && (
        <Button
          className={styles.imageMenuButton}
          type="button"
          title="Select mode on/off"
          icon={IconSelect}
          onClick={onSelect}
          tabIndex={buttonsTabIndex}
        />
      )}
      {groupMenuMode && (
        <Button
          className={styles.imageMenuButton}
          type="button"
          title="Select / deselect all"
          icon={IconSelectAll}
          onClick={toggleSelectAllImages}
          tabIndex={buttonsTabIndex}
        />
      )}
      {!groupMenuMode && (
        <Button
          className={styles.imageMenuButton}
          type="button"
          title="Edit tags"
          icon={IconEdit}
          onClick={onEdit}
          tabIndex={buttonsTabIndex}
        />
      )}
      <Button
        className={styles.imageMenuButton}
        type="button"
        title="Share"
        icon={IconShare}
        disabled={groupMenuMode && !selectedImages.length}
        onClick={onShare}
        tabIndex={buttonsTabIndex}
      />
      <Button
        className={styles.imageMenuButton}
        type="button"
        title="Delete"
        icon={IconDelete}
        disabled={groupMenuMode && !selectedImages.length}
        onClick={onDelete}
        tabIndex={buttonsTabIndex}
      />
    </div>
  );
};

export default ImageMenu;
