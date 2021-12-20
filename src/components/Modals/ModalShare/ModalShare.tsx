import { useState } from "react";
import { Checkbox, Button, Tag, Spinner } from "components/elements";
import TagEditor from "components/TagEditor";
import { ReactComponent as EditIcon } from "img/icon_edit.svg";
import store from "MST/store";
import { NewImageInfoType } from "types/images";
import { ImageOpenedToUserEntry } from "types/common";
import styles from "./ModalShare.module.scss";

const ModalShare = () => {
  const [isPublicState, setisPublicState] = useState(false);
  const [newOpenedToList, setNewOpenedToList] = useState<string[]>([]);
  const [openedToOverlayIsOpen, setOpenedToOverlayIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    if (name === userName) return;
    const userDoesExist = await checkIfUserExistsByName(name);
    if (userDoesExist && !newOpenedToList.includes(name))
      setNewOpenedToList([...newOpenedToList, name]);
  };
  const userRemoveHandler = (name: string) => {
    setNewOpenedToList(newOpenedToList.filter((userName) => userName !== name));
  };

  const cancelHandler = () => {
    deselectAllImages();
    groupSelectModeToggle();
    setModalComponentType("none");
    setModalOpen(false);
  };

  /*
   * Iterating through selectedImages, taking openedTolist - and merging with the newOpenedToList
   * without duplications - using an intermediate Set object, since we have an empty initial newOpenedToList,
   * single for all the selected images. Was told that this way has Big O(n) complexity ))
   */
  const acceptChangesHandler = async () => {
    setIsLoading(true);

    const selectedImagesId = selectedImages.map((image) => image.selectedId);
    const updatedImagesInfo: NewImageInfoType[] = selectedImagesId.map(
      (selectedId) => {
        const currentImage = getImageById(selectedId)!;
        const oldOpenedToList = currentImage.imageInfo.openedTo;
        const newOpenedList = [
          ...new Set([...oldOpenedToList, ...newOpenedToList]),
        ];
        const newImageInfo: NewImageInfoType = {
          _id: selectedId,
          imageInfo: { isPublic: isPublicState, openedTo: newOpenedList },
        };
        return newImageInfo;
      }
    );

    /*
     * Writing the updated images info from the backend to the corresponding images in store.
     */
    await editImagesInfo(updatedImagesInfo);

    /*
     * Creating the object for imagesMultiuserShare. In this case we only use action: 'add', since
     * we are only adding users to each image openedTo List from the group edit modal - to delete those -
     * we have to do that manually in each image shareOverlay. For now its that way.
     */

    const usersList: ImageOpenedToUserEntry[] = newOpenedToList.map((name) => ({
      name,
      action: "add",
    }));

    /*
     * Updating each users selectedUsersList list with the list of selectedImagesId.
     * Performing this operation on the backend.
     */
    await imagesMultiuserShare(selectedImagesId, usersList);
    setIsLoading(false);
    setModalComponentType("none");
    setModalOpen(false);
    deselectAllImages();
    groupSelectModeToggle();
  };

  return (
    <div className={styles.modalShareForm}>
      {!openedToOverlayIsOpen && !isLoading && (
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
              {newOpenedToList.map((entry, index) => (
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

      {openedToOverlayIsOpen && !isLoading && (
        <TagEditor
          tags={newOpenedToList}
          closeHandle={openToOverlayCloseHandler}
          onAddTags={userAddHandler}
          onTagDelete={userRemoveHandler}
        />
      )}
      {isLoading && <Spinner side={50} />}
    </div>
  );
};

export default ModalShare;
