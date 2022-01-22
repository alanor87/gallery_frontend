import { Button, Spinner } from "../../elements";
import store from "../../../MST/store";
import { ModalWindowProps } from "types/modal";
import styles from "./styles.module.scss";

const ModalDelete: React.FC<ModalWindowProps> = ({
  isLoading,
  setIsLoading,
}) => {
  const { selectedImages, deleteImages, groupSelectModeToggle } =
    store.imagesStoreSettings;

  const { setModalComponentType, setModalOpen } = store.modalWindowsSettings;

  const deleteClickHandler = async () => {
    setIsLoading(true);
    await deleteImages();
    groupSelectModeToggle();
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
      {isLoading && <Spinner side={20} />}
    </div>
  );
};

export default ModalDelete;
