import { Button } from "../elements";
import store from "../../MST/store";
import { ReactComponent as IconSelect } from "../../img/icon_select.svg";
import { ReactComponent as IconEdit } from "../../img/icon_edit.svg";
import { ReactComponent as IconShare } from "../../img/icon_share.svg";
import { ReactComponent as IconDelete } from "../../img/icon_delete.svg";
import { ReactComponent as IconSelectAll } from "../../img/icon_select_all.svg";
import styles from "./ImageMenu.module.scss";

interface Props {
  groupMenuMode?: boolean;
  onDelete?: () => void;
  onSelect?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
}
const ImageMenu: React.FC<Props> = ({
  groupMenuMode = false,
  onDelete,
  onEdit,
  onShare,
  onSelect,
}) => {
  const { toggleSelectAllImages, selectedImages } = store.imagesStoreSettings;
  return (
    <div className={styles.imageMenuWrapper}>
      <Button
        className={styles.imageMenuButton}
        type="button"
        title="Select mode on/off"
        icon={IconSelect}
        onClick={onSelect}
      />
      {groupMenuMode && (
        <Button
          className={styles.imageMenuButton}
          type="button"
          title="Select / deselect all"
          icon={IconSelectAll}
          onClick={toggleSelectAllImages}
        />
      )}
      {!groupMenuMode && (
        <Button
          className={styles.imageMenuButton}
          type="button"
          title="Edit tags"
          icon={IconEdit}
          onClick={onEdit}
        />
      )}
      <Button
        className={styles.imageMenuButton}
        type="button"
        title="Share"
        icon={IconShare}
        disabled={groupMenuMode && !selectedImages.length}
        onClick={onShare}
      />
      <Button
        className={styles.imageMenuButton}
        type="button"
        title="Delete"
        icon={IconDelete}
        disabled={groupMenuMode && !selectedImages.length}
        onClick={onDelete}
      />
    </div>
  );
};

export default ImageMenu;
