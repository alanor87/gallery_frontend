import store from "../../MST/store";
import { Button } from "../elements";
import styles from "./styles.module.scss";

interface Props {
  _id: string;
  imageHostingId: string;
  onCloseDeleteWindow: () => void;
}

const DeleteWindow: React.FunctionComponent<Props> = ({
  _id,
  imageHostingId,
  onCloseDeleteWindow,
}) => {
  const { deleteImage } = store.imagesStoreSettings;

  const deleteImageHandler = () => {
    deleteImage(_id, imageHostingId);
  };

  const closeDeleteWindowHandler = () => {
    onCloseDeleteWindow();
  };

  return (
    <div className={styles.deleteWindow}>
      <p className={styles.deleteWindowTitle}>
        Sure you want to delete this item?
      </p>
      <div className={styles.buttonWrapper}>
        <Button type="button" text="Delete" onClick={deleteImageHandler} />
        <Button
          type="button"
          text="Cancel"
          onClick={closeDeleteWindowHandler}
        />
      </div>
    </div>
  );
};

export default DeleteWindow;
