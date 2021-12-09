import { useState } from "react";
import { Checkbox, Button, Tag } from "../../elements";
import TagEditor from "../../TagEditor";
import { ReactComponent as EditIcon } from "../../../img/icon_edit.svg";
import store from "../../../MST/store";
import { NewImageInfo } from "../../../MST/imagesStoreSettings";
import styles from "./ModalShare.module.scss";

const ModalShare = () => {
  const [isPublicState, setisPublicState] = useState(false);
  const [usersOpenedToList, setUsersOpenedToList] = useState<string[]>([]);
  const [openedToOverlayIsOpen, setOpenedToOverlayIsOpen] = useState(false);
  const { setModalComponentType, setModalOpen } = store.modalWindowsSettings;
  const {
    selectedImages,
    editImagesInfo,
    getImageById,
    deselectAllImages,
    groupSelectModeToggle,
    imagesMultiuserShare,
  } = store.imagesStoreSettings;
  const { userName, checkIfUserExistsByName } = store.userSettings;

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
    console.log(name === userName);
    if (name === userName) return;
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
    deselectAllImages();
    groupSelectModeToggle();
    setModalComponentType("none");
    setModalOpen(false);
  };

  /*
   * Iterating through selectedImages, taking openedTolist - and merging with the usersOpenedToList
   * without duplications - using an intermediate Set object, since we have an empty initial usersOpenedToList,
   * single for all the selected images. Was told that this way has Big O(n) complexity ))
   */

  const acceptChangesHandler = async () => {
    const selectedImagesId = selectedImages.map((image) => image.selectedId);
    const updatedImagesInfo: NewImageInfo[] = selectedImagesId.map(
      (selectedId) => {
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
    await imagesMultiuserShare(selectedImagesId, usersOpenedToList);
    setModalComponentType("none");
    setModalOpen(false);
    deselectAllImages();
    groupSelectModeToggle();
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
              <p className={styles.openedTo}>Is opened to users : </p>
              {usersOpenedToList.map((entry, index) => (
                <Tag key={index} tagValue={entry} />
              ))}
              <Button
                className={styles.addUserBtn}
                text="Edit"
                title="Edit list of users with acces to this image"
                icon={EditIcon}
                onClick={openToOverlayOpenHandler}
              />
            </div>
          </div>
          <div className={styles.buttonWrapper}>
            <Button
              text="Accept"
              type="submit"
              onClick={acceptChangesHandler}
            />
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
