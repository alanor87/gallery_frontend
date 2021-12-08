import { useState } from "react";
import { Checkbox, Button } from "../../elements";
import TagEditor from "../../TagEditor";
import store from "../../../MST/store";
import { NewImageInfo } from "../../../MST/imagesStoreSettings";
import styles from "./ModalShare.module.scss";

const ModalShare = () => {
  const [isPublicState, setisPublicState] = useState(false);
  const [usersOpenedToList, setUsersOpenedToList] = useState<string[]>([]);
  const [openedToOverlayIsOpen, setOpenedToOverlayIsOpen] = useState(false);
  const { setModalComponentType, setModalOpen } = store.modalWindowsSettings;
  const { selectedImages, clearSelectedList, editImagesInfo, getImageById } =
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
    if (userDoesExist && !usersOpenedToList.includes(name))
      setUsersOpenedToList([...usersOpenedToList, name]);
  };
  const userRemoveHandler = (name: string) => {
    setUsersOpenedToList(
      usersOpenedToList.filter((userName) => userName !== name)
    );
  };

  const cancelHandler = () => {
    clearSelectedList();
    setModalComponentType("none");
    setModalOpen(false);
  };

  /*
   * Iterating through selectedImages, taking openedTolist - and merging with the usersOpenedToList
   * without duplications - using an intermediate Set object, since we have an empty initial usersOpenedToList,
   * single for all the selected images. Was told that this way has Big O(n) complexity ))
   */

  const acceptShareHandler = async () => {
    const updatedImagesInfo: NewImageInfo[] = selectedImages.map(
      ({ selectedId }) => {
        const currentImage = getImageById(selectedId)!;
        const oldOpenedToList = currentImage.imageInfo.openedTo;
        const newOpenedList = [
          ...new Set([...oldOpenedToList, ...usersOpenedToList]),
        ];
        const newImageInfo: NewImageInfo = {
          _id: selectedId,
          imageInfo: { isPublic: isPublicState, openedTo: newOpenedList },
        };
        return newImageInfo;
      }
    );

    await editImagesInfo(updatedImagesInfo);
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
                isChecked={isPublicState}
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
          tags={usersOpenedToList}
          closeHandle={openToOverlayCloseHandler}
          onAddTags={userAddHandler}
          onTagDelete={userRemoveHandler}
        />
      )}
    </div>
  );
};

export default ModalShare;
