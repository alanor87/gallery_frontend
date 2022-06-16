import { useState } from "react";
import store from "MST/store";
import { Button, Spinner } from "components/elements";
import styles from "./DeleteOverlay.module.scss";

interface Props {
  _id: string;
  onCloseDeleteOverlay: () => void;
  onConfirmDeleteOverlay?: () => void;
}

const DeleteOverlay: React.FunctionComponent<Props> = ({
  _id,
  onCloseDeleteOverlay,
  onConfirmDeleteOverlay,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { deleteImages, selectedListChange, clearSelectedList } =
    store.imagesStoreSettings;

  const deleteImageHandler = async () => {
    setIsLoading(true);
    selectedListChange(_id);
    await deleteImages();
    clearSelectedList();
    onConfirmDeleteOverlay && onConfirmDeleteOverlay();
  };

  const closeDeleteOverlayHandler = () => {
    onCloseDeleteOverlay();
  };

  return (
    <div className="overlay">
      <div className={styles.deleteOverlay}>
        <p className={styles.deleteOverlayTitle}>
          Sure you want to delete this item?
        </p>
        <div className="overlay-buttonWrapper">
          <Button type="button" text="Delete" onClick={deleteImageHandler} />
          <Button
            type="button"
            text="Cancel"
            onClick={closeDeleteOverlayHandler}
          />
        </div>
        {isLoading && <Spinner side={20} />}
      </div>
    </div>
  );
};

export default DeleteOverlay;
