import { useState } from "react";
import { Checkbox, Button } from "../../elements";
import store from "../../../MST/store";
import styles from "./ModalShare.module.scss";

const ModalShare = () => {
  const [isPublicState, setisPublicState] = useState(false);
  const [openedToOverlayIsOpen, setOpenedToOverlayIsOpen] = useState(false);
  const { setModalComponentType, setModalOpen } = store.modalWindowsSettings;
  const { selectedImages, groupSelectMode, clearSelectedList } =
    store.imagesStoreSettings;

  const acceptShareHandler = () => {
    setModalComponentType("none");
    setModalOpen(false);
  };

  const cancelHandler = () => {
    clearSelectedList();
    setModalComponentType("none");
    setModalOpen(false);
  };

  const publicStateChangeHandler = () => {
    setisPublicState(!isPublicState);
  };

  const openToOverlayOpenHandler = () => {
    setOpenedToOverlayIsOpen(true);
  };
  const openToOverlayCloseHandler = () => {
    setOpenedToOverlayIsOpen(false);
  };

  return (
    <div className={styles.modalShareForm}>
      <h2>Sharing options</h2>
      <div className={styles.optionsWrapper}>
        <div className={styles.option}>
          <Checkbox
            className={styles.shareModalCheckbox}
            isChecked={groupSelectMode ? false : selectedImages[0].isPublic}
          />
          Make the image public.
        </div>
        <div className={styles.option}>
          <Button
            text="Edit shared users list"
            title="Edit shared users list"
            onClick={openToOverlayOpenHandler}
          />
        </div>
      </div>
      <div className={styles.buttonWrapper}>
        <Button text="Accept" type="submit" />
        <Button text="Cancel" onClick={cancelHandler} />
      </div>
    </div>
  );
};

export default ModalShare;
