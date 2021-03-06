import React, { useState, useRef } from "react";
import QRCode from "react-qr-code";
import store from "MST/store";
import TagEditor from "components/TagEditor";
import { Button, ToggleButton } from "components/elements";
import { ImageOpenedToUserEntry } from "types/common";
import { popupNotice } from "utils/popupNotice";
import styles from "./ShareOverlay.module.scss";

interface Props {
  _id: string;
  isPublic: boolean;
  openedTo: string[];
  sharedByLink: boolean;
  imageURL: string;
  onCloseShareOverlay: () => void;
  setIsLoading: (value: boolean) => void;
}

const ShareOverlay: React.FC<Props> = ({
  _id,
  isPublic,
  openedTo,
  sharedByLink,
  imageURL,
  onCloseShareOverlay,
  setIsLoading,
}) => {
  const { backendUrl } = store;
  const { editImagesInfo, imagesMultiuserShare } = store.imagesStoreSettings;
  const { userName, checkIfUserExistsByName } = store.userSettings;

  const initialOpenedToEntries: ImageOpenedToUserEntry[] = openedTo.map(
    (name) => ({ name, action: "none" })
  );
  const standaloneImageLink = backendUrl + "/public/standaloneShare/" + _id;

  const [isPublicState, setIsPublicState] = useState(isPublic);
  const initialSharedByLinkState = useRef(sharedByLink);
  const [isSharedByLinkState, setIsSharedByLinkState] = useState(sharedByLink);
  const [openedToEntriesList, setOpenedToEntriesList] = useState(
    initialOpenedToEntries
  ); // For the imagesMultiuserShare - user names and action - to add or to remove the imagesOpenedToUser user property.
  const [openedToOverlayIsOpen, setOpenedToOverlayIsOpen] = useState(false);
  const [qrIsOpen, setQrIsOpen] = useState(false);

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

  // The link sharing is being activated or deactivated as soon as the toggle button is presses.
  // Therefore - if its state was changed, but afterwards user decided to discard all changes with Cancel button -
  // the link sharing state is being reset to the state that it initially had on the share overlay opening.
  const closeOverlayHandler = async () => {
    if (isSharedByLinkState !== initialSharedByLinkState.current) {
      setIsLoading(true);
      await editImagesInfo([
        {
          _id,
          imageInfo: {
            sharedByLink: initialSharedByLinkState.current,
          },
        },
      ]);
      setIsLoading(false);
    }
    onCloseShareOverlay();
  };

  const getOpenegToNamesList = () =>
    openedToEntriesList
      .filter((entry) => entry.action !== "remove")
      .map((entry) => entry.name);

  const sharedByLinkStateToggleHandler = async (value: boolean) => {
    setIsLoading(true);
    await editImagesInfo([
      {
        _id,
        imageInfo: {
          sharedByLink: value,
        },
      },
    ]);
    setIsSharedByLinkState(value);
    setIsLoading(false);
  };

  const shareLinkCopyHandler = (e: React.SyntheticEvent) => {
    navigator.clipboard.writeText(standaloneImageLink);
    popupNotice("Sharing link copied to clipboard.");
  };

  const qrIsOpenToggleHandler = () => {
    setQrIsOpen(!qrIsOpen);
  };

  const socialShareButtonClickHandler = (socialNetwork: string) => () => {
    let socialNetShareUrl;
    switch (socialNetwork) {
      case "facebook": {
        socialNetShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${standaloneImageLink}&amp;src=sdkpreparse`;
        break;
      }
      case "twitter": {
        socialNetShareUrl = `https://twitter.com/intent/tweet?url=${standaloneImageLink}`;
        break;
      }
      case "pinterest": {
        socialNetShareUrl = `https://www.pinterest.com/pin/create/button/?url=${standaloneImageLink}&media=${imageURL}&description=Next%20stop%3A%20Pinterest`;
        break;
      }
    }
    window.open(socialNetShareUrl, "_blank", "popup=1");
  };

  return (
    <div className={`overlay`}>
      <div className={styles.shareOverlay}>
        <div className={styles.option}>
          Make the image public
          <ToggleButton
            isChecked={isPublicState}
            toggleHandler={publicStateChangeHandler}
            className={styles.shareOverlayToggleBtn}
          />
        </div>
        <div className={styles.option}>
          Is opened to users
          {getOpenegToNamesList().length ? (
            <span className="footnote">users available</span>
          ) : null}
          <ToggleButton
            isChecked={openedToOverlayIsOpen}
            toggleHandler={setOpenedToOverlayIsOpen}
            className={styles.shareOverlayToggleBtn}
          />
        </div>
        <div className={styles.option}>
          {isSharedByLinkState ? (
            <>
              Link :
              <span onClick={shareLinkCopyHandler} className="footnote">
                click here to copy link
              </span>
            </>
          ) : (
            "Activate sharing link"
          )}
          <ToggleButton
            isChecked={isSharedByLinkState}
            toggleHandler={sharedByLinkStateToggleHandler}
            className={styles.shareOverlayToggleBtn}
          />
        </div>
        <div className={styles.option}>
          <div
            className={
              isSharedByLinkState
                ? styles.socialNetWrapper
                : styles.socialNetWrapper + " " + styles.disabled
            }
          >
            {" "}
            <Button
              className={styles.socialNetButton}
              onClick={socialShareButtonClickHandler("facebook")}
              icon="icon_social_facebook"
              iconSize={30}
            />
            <Button
              className={styles.socialNetButton}
              onClick={socialShareButtonClickHandler("twitter")}
              icon="icon_social_twitter"
              iconSize={30}
            />
            <Button
              className={styles.socialNetButton}
              onClick={socialShareButtonClickHandler("pinterest")}
              icon="icon_social_pinterest"
              iconSize={30}
            />
          </div>
        </div>
        <div className={styles.option}>
          Show QR code link
          <ToggleButton
            isChecked={qrIsOpen}
            toggleHandler={qrIsOpenToggleHandler}
            className={styles.shareOverlayToggleBtn}
            disabled={!isSharedByLinkState}
          />
        </div>
        <div className="overlay-buttonWrapper">
          <Button type="button" text="Accept" onClick={acceptChangesHandler} />
          <Button type="button" text="Cancel" onClick={closeOverlayHandler} />
        </div>{" "}
        {openedToOverlayIsOpen && (
          <TagEditor
            tags={getOpenegToNamesList()}
            closeHandle={openToOverlayCloseHandler}
            onTagDelete={userDelHandler}
            onAddTags={userAddHandler}
          />
        )}
      </div>{" "}
      {qrIsOpen && (
        <div className={styles.qrWrapper} onClick={qrIsOpenToggleHandler}>
          <QRCode value={standaloneImageLink} size={300} />
        </div>
      )}
    </div>
  );
};

export default ShareOverlay;
