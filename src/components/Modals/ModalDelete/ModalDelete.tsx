import { Button } from "../../elements";
import store from "../../../MST/store";
import styles from "./styles.module.scss";

const ModalDelete = () => {
  const { selectedImages, deleteMultipleImages } = store.imagesStoreSettings;
  const { setDeleteModalOpen } = store.modalWindowsSettings;

  const deleteClickHandler = () => {
    deleteMultipleImages();
    setDeleteModalOpen(false);
  };
  return (
    <div className={styles.modalDeleteForm}>
      <h2>Group delete</h2>
      <p className={styles.text}>
        Sure you want to delete these {selectedImages.length} items?
      </p>
      <div className={styles.buttonWrapper}>
        <Button text="Delete" onClick={deleteClickHandler} />
        <Button text="Cancel" onClick={() => setDeleteModalOpen(false)} />
      </div>
    </div>
  );
};

export default ModalDelete;
