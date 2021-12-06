import { Button } from "../../elements";
import store from "../../../MST/store";
import styles from "./styles.module.scss";

const ModalDelete = () => {
  const { selectedImages, deleteImages } = store.imagesStoreSettings;

  const { setModalComponentType, setModalOpen } = store.modalWindowsSettings;

  const deleteClickHandler = () => {
    deleteImages();
    setModalComponentType("none");
    setModalOpen(false);
  };

  return (
    <div className={styles.modalDeleteForm}>
      <h2>Group delete</h2>
      <p className={styles.text}>
        Sure you want to delete these {selectedImages.length} items?
      </p>
      <div className={styles.buttonWrapper}>
        <Button text="Delete" onClick={deleteClickHandler} />
        <Button text="Cancel" onClick={() => setModalOpen(false)} />
      </div>
    </div>
  );
};

export default ModalDelete;
