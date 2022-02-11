import { useState } from "react";
import store from "../../../MST/store";
import TagEditor from "../../TagEditor";
import { Checkbox, Button, Tag } from "../../elements";
import { ImageOpenedToUserEntry } from "types/common";
import styles from "./ShareOverlay.module.scss";

interface Props {
  _id: string;
  isPublic: boolean;
  openedTo: string[];
  sharedByLink: boolean;
  onCloseShareOverlay: () => void;
  setIsLoading: (value: boolean) => void;
}

const ShareOverlay: React.FC<Props> = ({
  _id,
  isPublic,
  openedTo,
  sharedByLink,
  onCloseShareOverlay,
  setIsLoading,
}) => {
  const initialOpenedToEntries: ImageOpenedToUserEntry[] = openedTo.map(
    (name) => ({ name, action: "none" })
  );

  const [isPublicState, setisPublicState] = useState(isPublic);
  const [openedToEntriesList, setOpenedToEntriesList] = useState(
    initialOpenedToEntries
  ); // For the imagesMultiuserShare - user names and action - to add or to remove the imagesOpenedToUser user property.
  const [openedToOverlayIsOpen, setOpenedToOverlayIsOpen] = useState(false);

  const { backendUrl } = store;
  const { editImagesInfo, imagesMultiuserShare } = store.imagesStoreSettings;
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

  const userAddHandler = async (nameToAdd: string) => {
    const userDoesExist = await checkIfUserExistsByName(nameToAdd);
    if (nameToAdd === userName || !userDoesExist) return;

    const indexOfEntry = openedToEntriesList.findIndex(
      (entry) => entry.name === nameToAdd
    );

    if (indexOfEntry !== -1) {
      const updatedEntriesList: ImageOpenedToUserEntry[] = [
        ...openedToEntriesList,
      ];
      updatedEntriesList[indexOfEntry].action = "add";
      setOpenedToEntriesList(updatedEntriesList);
    } else {
      setOpenedToEntriesList([
        ...openedToEntriesList,
        { name: nameToAdd, action: "add" },
      ]);
    }
  };

  const userDelHandler = (nameToRemove: string) => {
    const updatedEntriesList: ImageOpenedToUserEntry[] =
      openedToEntriesList.map((entry) => {
        if (entry.name === nameToRemove)
          return { name: entry.name, action: "remove" };
        return entry;
      });
    setOpenedToEntriesList(updatedEntriesList);
  };

  const acceptChangesHandler = async () => {
    setIsLoading(true);
    /*
     *  Mapping the array of just user names for the image object openedTo property
     *  and writing the updated image info from the backend to the corresponding images in store.
     */
    const openedToNamesList = getOpenegToNamesList();
    await editImagesInfo([
      {
        _id,
        imageInfo: { isPublic: isPublicState, openedTo: openedToNamesList },
      },
    ]);

    /*
     * Updating each users selectedUsersList list with the current image id.
     * Performing this operation on the backend.
     */
    await imagesMultiuserShare([_id], openedToEntriesList);
    onCloseShareOverlay();
    setIsLoading(false);
  };

  const getOpenegToNamesList = () =>
    openedToEntriesList
      .filter((entry) => entry.action !== "remove")
      .map((entry) => entry.name);

  const setSharedByLink = async () => {
    setIsLoading(true);
    await editImagesInfo([{ _id, imageInfo: { sharedByLink: true } }]);
    setIsLoading(false);
  };

  return !openedToOverlayIsOpen ? (
    <div className={`imageCardOverlay`}>
      <div className={`${styles.shareOverlay}`}>
        <p className={`imageCardOverlay-title ${styles.shareOverlayTitle}`}>
          Image share options
        </p>
        <div className={styles.option}>
          <label>
            Make the image public.
            <Checkbox
              isChecked={isPublicState}
              onChange={publicStateChangeHandler}
              className={styles.shareOverlayCheckbox}
            />
          </label>
        </div>
        <div className={styles.option}>
          <p className={styles.openedTo}>Is opened to users : </p>
          {openedToEntriesList.map((entry) => {
            if (entry.action === "remove") return null;
            return <Tag key={entry.name} tagValue={entry.name} />;
          })}
          <Button
            className={styles.addUserBtn}
            text="Edit"
            title="Edit list of users with acces to this image"
            icon="icon_edit"
            onClick={openToOverlayOpenHandler}
          />
        </div>
        <div className={styles.option}>
          {sharedByLink ? (
            <div className={styles.standaloneShareLink}>
              {backendUrl + "/public/standaloneShare/" + _id}
            </div>
          ) : (
            <Button
              type="button"
              className={styles.sharedByLinkBtn}
              text="Generate sharing link"
              onClick={setSharedByLink}
            />
          )}
        </div>
        <div className={styles.buttonWrapper}>
          <Button type="button" text="Accept" onClick={acceptChangesHandler} />
          <Button type="button" text="Cancel" onClick={onCloseShareOverlay} />
        </div>
      </div>
    </div>
  ) : (
    <TagEditor
      tags={getOpenegToNamesList()}
      closeHandle={openToOverlayCloseHandler}
      onTagDelete={userDelHandler}
      onAddTags={userAddHandler}
    />
  );
};

export default ShareOverlay;
