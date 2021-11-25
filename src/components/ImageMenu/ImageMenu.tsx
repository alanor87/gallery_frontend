import { Button } from "../elements";
import { ReactComponent as IconSelect } from "../../img/icon_select.svg";
import { ReactComponent as IconEdit } from "../../img/icon_edit.svg";
import { ReactComponent as IconShare } from "../../img/icon_share.svg";
import { ReactComponent as IconDelete } from "../../img/icon_delete.svg";
import styles from "./ImageMenu.module.scss";

interface Props {
  isOpened: boolean;
  onDelete?: () => void;
  onSelect?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
}
const ImageMenu: React.FC<Props> = ({
  isOpened,
  onDelete,
  onEdit,
  onSelect,
}) => {
  return (
    <div
      className={
        isOpened
          ? styles.imageMenuWrapper + " " + styles.isOpened
          : styles.imageMenuWrapper
      }
    >
      <Button
        className={styles.imageMenuButton}
        type="button"
        title="Select mode on/off"
        icon={IconSelect}
        onClick={onSelect}
      />
      <Button
        className={styles.imageMenuButton}
        type="button"
        title="Edit tags"
        icon={IconEdit}
        onClick={onEdit}
      />
      <Button
        className={styles.imageMenuButton}
        type="button"
        title="Share"
        icon={IconShare}
      />
      <Button
        className={styles.imageMenuButton}
        type="button"
        title="Delete"
        icon={IconDelete}
        onClick={onDelete}
      />
    </div>
  );
};

export default ImageMenu;
