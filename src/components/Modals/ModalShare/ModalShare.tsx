import React, { useState } from "react";
import { ToggleButton, Button, Spinner } from "components/elements";
import TagEditor from "components/TagEditor";
import store from "MST/store";
import { NewImageInfoType } from "types/images";
import { ImageOpenedToUserEntry } from "types/common";
import { ModalWindowProps } from "types/modal";
import styles from "./ModalShare.module.scss";

const ModalShare: React.FC<ModalWindowProps> = ({
  isLoading,
  setIsLoading,
  modalCloseHandle,
}) => {
  const [isPublicState, setisPublicState] = useState(false);
  const [newOpenedToList, setNewOpenedToList] = useState<string[]>([]);
  const [openedToOverlayIsOpen, setOpenedToOverlayIsOpen] = useState(false);
  const {
    selectedImages,
    editImagesInfo,
    getImageById,
    deselectAllImages,
    groupSelectModeToggle,
    imagesMultiuserShare,
  } = store.imagesStoreSettings;
  const { userName, checkIfUserExistsByName } = store.userSettings;

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
    modalCloseHandle();
  };

  /*
   * Iterating through selectedImages, taking openedTolist - and merging with the newOpenedToList
   * without duplications - using an intermediate Set object, since we have an empty initial newOpenedToList,
   * single for all the selected images. Was told that this way has Big O(n) complexity ))
   */
  const acceptChangesHandler = async () => {
    setIsLoading && setIsLoading(true);

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
    setIsLoading && setIsLoading(false);
    modalCloseHandle();
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
              Make the image public
              <ToggleButton
                isChecked={isPublicState}
                toggleHandler={publicStateChangeHandler}
                className={styles.modalShareToggleBtn}
              />
            </div>
            <div className={styles.option}>
              Is opened to users
              {newOpenedToList.length ? (
                <span className="footnote">users available</span>
              ) : null}
              <ToggleButton
                isChecked={openedToOverlayIsOpen}
                toggleHandler={setOpenedToOverlayIsOpen}
                className={styles.modalShareToggleBtn}
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
