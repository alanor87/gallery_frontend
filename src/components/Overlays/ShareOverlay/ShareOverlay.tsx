import React, { SyntheticEvent, useState } from "react";
import QRCode from "react-qr-code";
import store from "../../../MST/store";
import TagEditor from "../../TagEditor";
import { Checkbox, Button, Tag } from "../../elements";
import { ImageOpenedToUserEntry } from "types/common";
import stringTrimmer from "utils/stringTrimmer";
import { popupNotice } from "utils/popupNotice";
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
  const { backendUrl } = store;
  const { editImagesInfo, imagesMultiuserShare } = store.imagesStoreSettings;
  const { userName, checkIfUserExistsByName } = store.userSettings;

  const initialOpenedToEntries: ImageOpenedToUserEntry[] = openedTo.map(
    (name) => ({ name, action: "none" })
  );

  const [isPublicState, setIsPublicState] = useState(isPublic);
  const [isSharedByLinkState, setIsSharedByLinkState] = useState(sharedByLink);
  const [openedToEntriesList, setOpenedToEntriesList] = useState(
    initialOpenedToEntries
  ); // For the imagesMultiuserShare - user names and action - to add or to remove the imagesOpenedToUser user property.
  const [openedToOverlayIsOpen, setOpenedToOverlayIsOpen] = useState(false);

  const openToOverlayOpenHandler = () => {
    setOpenedToOverlayIsOpen(true);
  };
  const openToOverlayCloseHandler = () => {
    setOpenedToOverlayIsOpen(false);
  };

  const publicStateChangeHandler = () => {
    setIsPublicState(!isPublicState);
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
        imageInfo: {
          isPublic: isPublicState,
          openedTo: openedToNamesList,
          sharedByLink: isSharedByLinkState,
        },
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

  const sharedByLinkStateCreateHandler = () => {
    setIsSharedByLinkState(true);
    popupNotice("Sharing link created. Click accept to activate it.");
  };
  const sharedByLinkStateRemoveHandler = (e: SyntheticEvent) => {
    e.stopPropagation();
    setIsSharedByLinkState(false);
    popupNotice("Sharing link removed. Click accept to deactivate it.");
  };

  const shareLinkCopyHandler = () => {
    navigator.clipboard.writeText(
      backendUrl + "/public/standaloneShare/" + _id
    );
    popupNotice("Sharing link copied to clipboard.");
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
          {isSharedByLinkState ? (
            <div
              className={styles.standaloneShareLinkWrapper}
              onClick={shareLinkCopyHandler}
            >
              Sharing link:{" "}
              <span className={styles.standaloneShareLink}>
                {stringTrimmer(
                  backendUrl + "/public/standaloneShare/" + _id,
                  50
                )}
              </span>
              <Button
                className={`${styles.linkRemoveBtn} closeBtn`}
                iconSize={10}
                icon="icon_close"
                onClick={sharedByLinkStateRemoveHandler}
              />
            </div>
          ) : (
            <Button
              type="button"
              className={styles.sharedByLinkBtn}
              text="Generate sharing link"
              onClick={sharedByLinkStateCreateHandler}
            />
          )}
        </div>
        <div className={styles.qrWrapper}>
          <QRCode
            value={backendUrl + "/public/standaloneShare/" + _id}
            size={180}
          />
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
