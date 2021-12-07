import { useState } from "react";
import { Checkbox, Button } from "../../elements";
import TagEditor from "../../TagEditor";
import store from "../../../MST/store";
import styles from "./ModalShare.module.scss";

const ModalShare = () => {
  const [isPublicState, setisPublicState] = useState(false);
  const [openedToList, setOpenedToList] = useState<string[]>([]);
  const [openedToOverlayIsOpen, setOpenedToOverlayIsOpen] = useState(false);
  const { setModalComponentType, setModalOpen } = store.modalWindowsSettings;
  const { selectedImages, groupSelectMode, clearSelectedList, editImagesInfo } =
    store.imagesStoreSettings;
  const { checkIfUserExistsByName } = store.userSettings;

  const openToOverlayOpenHandler = () => {
    setOpenedToOverlayIsOpen(true);
  };
  const openToOverlayCloseHandler = () => {
    setOpenedToOverlayIsOpen(false);
  };

  const publicStateChangeHandler = () => {
    setisPublicState(!isPublicState);
  };
  const userAddHandler = async (name: string) => {
    const userDoesExist = await checkIfUserExistsByName(name);
    if (userDoesExist && !openedToList.includes(name))
      setOpenedToList([...openedToList, name]);
  };
  const userRemoveHandler = (name: string) => {
    setOpenedToList(openedToList.filter((userName) => userName !== name));
  };

  const cancelHandler = () => {
    clearSelectedList();
    setModalComponentType("none");
    setModalOpen(false);
  };
  const acceptShareHandler = async () => {
    // await editImagesInfo();
    setModalComponentType("none");
    setModalOpen(false);
    clearSelectedList();
  };

  return (
    <div className={styles.modalShareForm}>
      {!openedToOverlayIsOpen && (
        <>
          <h2>Sharing options</h2>
          <div className={styles.optionsWrapper}>
            <div className={styles.option}>
              <Checkbox
                className={styles.shareModalCheckbox}
                onChange={publicStateChangeHandler}
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
            <Button text="Accept" type="submit" onClick={acceptShareHandler} />
            <Button text="Cancel" onClick={cancelHandler} />
          </div>
        </>
      )}

      {openedToOverlayIsOpen && (
        <TagEditor
          tags={openedToList}
          closeHandle={openToOverlayCloseHandler}
          onAddTag={userAddHandler}
          onTagDelete={userRemoveHandler}
        />
      )}
    </div>
  );
};

export default ModalShare;
