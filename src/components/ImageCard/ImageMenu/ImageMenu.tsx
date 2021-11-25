import { Button } from "../../elements";
import { ReactComponent as IconSelect } from "../../../img/icon_select.svg";
import { ReactComponent as IconEdit } from "../../../img/icon_edit.svg";
import { ReactComponent as IconShare } from "../../../img/icon_share.svg";
import { ReactComponent as IconDelete } from "../../../img/icon_delete.svg";
import styles from "./ImageMenu.module.scss";

interface Props {
  isOpened: boolean;
}
const ImageMenu: React.FC<Props> = ({ isOpened }) => {
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
        title="Select"
        icon={IconSelect}
      />
      <Button
        className={styles.imageMenuButton}
        type="button"
        title="Edit tags"
        icon={IconEdit}
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
      />
    </div>
  );
};

export default ImageMenu;
