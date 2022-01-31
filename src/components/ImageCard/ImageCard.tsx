import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { observer } from "mobx-react-lite";
import TagList from "../TagList";
import { Button, Spinner } from "../elements";
import TagEditor from "../TagEditor";
import ImageMenu from "../ImageMenu";
import DeleteOverlay from "../Overlays/DeleteOverlay";
import ShareOverlay from "../Overlays/ShareOverlay";
import SelectOverlay from "../Overlays/SelectOverlay";
import { ImageType } from "../../MST/imagesStoreSettings";
import { ReactComponent as IconLike } from "../../img/icon_like.svg";
import { ReactComponent as IconSettings } from "../../img/icon_settings.svg";
import store from "../../MST/store";
import styles from "./ImageCard.module.scss";

interface Props {
  image: ImageType;
  isSelected: boolean;
  groupSelectMode: boolean;
}

const ImageCard: React.FC<Props> = ({ image, isSelected, groupSelectMode }) => {
  console.log("Image render"); // just for debugging -  to be sure memoization works)

  const {
    getCurrentGalleryMode,
    editImagesInfo,
    groupSelectModeToggle,
    selectedListChange,
  } = store.imagesStoreSettings;
  const { userName, userIsAuthenticated } = store.userSettings;
  const { setModalOpen, setModalComponentType, setModalImageId } =
    store.modalWindowsSettings;
  const { _id, smallImageURL, imageInfo, toggleSelectImage } = image;
  const { tags, likes, openedTo, isPublic } = imageInfo;

  const [deleteOverlayIsOpen, setDeleteOverlayIsOpen] = useState(false);
  const [shareOverlayIsOpen, setShareOverlayIsOpen] = useState(false);
  const [imageMenuIsOpen, setImageMenuIsOpen] = useState(false);
  const [imgInfoIsLoading, setimgInfoIsLoading] = useState(false);
  const [imageIsLoading, setImageIsLoading] = useState(true);
  const [tagEditorOverlayIsOpen, setTagEditorOpen] = useState(false);

  const imageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!groupSelectMode) toggleSelectImage(false);
    console.log("groupSelectMode effect");
  }, [groupSelectMode, toggleSelectImage]);

  useEffect(() => {
    if (imageMenuRef.current && imageMenuIsOpen) {
      imageMenuRef.current.tabIndex = 0;
      imageMenuRef.current.focus();
    }
    console.log("Image menu effect");
  }, [imageMenuIsOpen]);

  const isUserMode = getCurrentGalleryMode === "userGallery";

  const onImageLoad = () => {
    setImageIsLoading(false);
  };

  const imageMenuToggleHandler = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    setImageMenuIsOpen(!imageMenuIsOpen);
  };
  const imageMenuCloseHandler = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    setImageMenuIsOpen(false);
  };

  const toggleImageSelect = () => {
    toggleSelectImage(!isSelected);
    selectedListChange(_id);
  };

  const imageModalOpenHandler = () => {
    setModalImageId(_id);
    setModalComponentType("image");
    setModalOpen(true);
  };

  const groupSelectOnHandler = useCallback(() => {
    setImageMenuIsOpen(false);
    groupSelectModeToggle();
  }, [groupSelectModeToggle]);

  const tagEditOpenHandler = useCallback(() => {
    setTagEditorOpen(true);
    setImageMenuIsOpen(false);
  }, []);
  const deleteOverlayOpenHandler = useCallback(() => {
    setDeleteOverlayIsOpen(true);
    setImageMenuIsOpen(false);
  }, []);
  const shareOverlayOpenHandler = useCallback(() => {
    setShareOverlayIsOpen(true);
    setImageMenuIsOpen(false);
  }, []);

  const onTagEditCloseHandler = () => setTagEditorOpen(false);
  const deleteOverlayCloseHandler = () => setDeleteOverlayIsOpen(false);
  const shareOverlayCloseHandler = () => setShareOverlayIsOpen(false);

  const tagDelHandler = (tagToDelete: string) => {
    const newTags = tags.filter((tag) => tag !== tagToDelete);
    tagsUpdateHandler(newTags);
  };
  const tagAddHandler = (tagsToAdd: string) => {
    const parsedTags = tagsToAdd.split(/,/).map((tag) => tag.trim());
    tagsUpdateHandler([...tags, ...parsedTags]);
  };
  const tagsUpdateHandler = async (newTags: string[]) => {
    setimgInfoIsLoading(true);
    await editImagesInfo([{ _id, imageInfo: { tags: newTags } }]);
    setimgInfoIsLoading(false);
  };

  const toggleLikeHandler = async () => {
    console.log("toggleLikeHandler fires");
    setimgInfoIsLoading(true);
    let newLikesList = [];
    if (!likes.includes(userName)) {
      newLikesList = [...likes, userName];
    } else {
      newLikesList = likes.filter((name) => name !== userName);
    }
    await editImagesInfo([{ _id, imageInfo: { likes: newLikesList } }]);
    setimgInfoIsLoading(false);
  };

  const overlaysAreClosedCheck = () =>
    !tagEditorOverlayIsOpen &&
    !deleteOverlayIsOpen &&
    !shareOverlayIsOpen &&
    !groupSelectMode;

  return (
    <div
      className={styles.cardWrap}
      tabIndex={groupSelectMode ? -1 : 0}
      onMouseLeave={imageMenuCloseHandler}
    >
      {!imgInfoIsLoading ? (
        <>
          <div
            className={styles.cardBackdrop}
            style={{
              backgroundImage: `url(${smallImageURL})`,
              visibility: !imageIsLoading ? "visible" : "hidden",
            }}
          ></div>
          <div
            tabIndex={-1}
            className={styles.imgWrap}
            onClick={imageModalOpenHandler}
          >
            {imageIsLoading && <Spinner side={50} />}
            <img
              className={styles.image}
              src={smallImageURL}
              alt={_id}
              onLoad={onImageLoad}
              style={{ visibility: !imageIsLoading ? "visible" : "hidden" }}
            />
          </div>
          {overlaysAreClosedCheck() && !groupSelectMode && (
            <>
              <div className={styles.menu}>
                <Button
                  type="button"
                  icon={IconLike}
                  onClick={toggleLikeHandler}
                  className={styles.menuButton}
                  text={likes.length}
                  disabled={!userIsAuthenticated}
                  title="Like / Dislike"
                />

                {isUserMode && (
                  <>
                    <div
                      ref={imageMenuRef}
                      className={
                        imageMenuIsOpen
                          ? styles.imageMenuWrapper + " " + styles.isOpened
                          : styles.imageMenuWrapper
                      }
                    >
                      <ImageMenu
                        isOpened={imageMenuIsOpen}
                        onDelete={deleteOverlayOpenHandler}
                        onEdit={tagEditOpenHandler}
                        onSelect={groupSelectOnHandler}
                        onShare={shareOverlayOpenHandler}
                      />
                    </div>

                    <div style={{ position: "relative" }}>
                      <Button
                        type="button"
                        title="Image menu"
                        icon={IconSettings}
                        onClick={imageMenuToggleHandler}
                        className={styles.menuButton}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className={styles.text}>
                <div className={styles.imgCardText}>
                  <TagList
                    tags={tags}
                    title={isUserMode ? "Double click to edit" : "No tags"}
                    placeholder={
                      isUserMode ? "Double click to add tags" : "No tags"
                    }
                    isEditable={true}
                    onDoubleClick={isUserMode ? tagEditOpenHandler : () => null}
                  />
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <Spinner side={30} className={styles.imageCardSpinner} />
      )}

      {!overlaysAreClosedCheck() && (
        <div className={styles.imgOverlay}>
          {" "}
          {tagEditorOverlayIsOpen && (
            <TagEditor
              tags={tags}
              closeHandle={onTagEditCloseHandler}
              onTagDelete={tagDelHandler}
              onAddTags={tagAddHandler}
            />
          )}
          {deleteOverlayIsOpen && (
            <DeleteOverlay
              _id={_id}
              onCloseDeleteOverlay={deleteOverlayCloseHandler}
            />
          )}
          {shareOverlayIsOpen && (
            <ShareOverlay
              _id={_id}
              isPublic={isPublic}
              openedTo={openedTo}
              onCloseShareOverlay={shareOverlayCloseHandler}
              setIsLoading={setimgInfoIsLoading}
            />
          )}
          {groupSelectMode && (
            <SelectOverlay
              isSelected={isSelected}
              onSelectToggle={toggleImageSelect}
            />
          )}
          {imgInfoIsLoading && (
            <Spinner side={30} className={styles.imageCardSpinner} />
          )}
        </div>
      )}
    </div>
  );
};

export default memo(observer(ImageCard));
