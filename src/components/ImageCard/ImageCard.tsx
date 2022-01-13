import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { NavLink } from "react-router-dom";
import TagList from "../TagList";
import { Button, Spinner } from "../elements";
import store from "../../MST/store";
import TagEditor from "../TagEditor";
import ImageMenu from "../ImageMenu";
import DeleteOverlay from "./DeleteOverlay";
import ShareOverlay from "./ShareOverlay";
import SelectOverlay from "./SelectOverlay";
import { ImageType } from "../../MST/imagesStoreSettings";
import { ReactComponent as IconLike } from "../../img/icon_like.svg";
import { ReactComponent as IconSettings } from "../../img/icon_settings.svg";
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
  const { setModalOpen, setModalComponentType } = store.modalWindowsSettings;
  const { _id, imageURL, imageInfo, toggleSelectImage } = image;
  const { tags, likes, openedTo, isPublic } = imageInfo;

  const [deleteOverlayIsOpen, setDeleteOverlayIsOpen] = useState(false);
  const [shareOverlayIsOpen, setShareOverlayIsOpen] = useState(false);
  const [imageMenuIsOpen, setImageMenuIsOpen] = useState(false);
  const [imgInfoIsLoading, setimgInfoIsLoading] = useState(false);
  const [tagEditorOverlayIsOpen, setTagEditorOpen] = useState(false);

  const imageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!groupSelectMode) toggleSelectImage(false);
  }, [groupSelectMode, toggleSelectImage]);

  useEffect(() => {
    if (imageMenuRef.current && imageMenuIsOpen) {
      imageMenuRef.current.tabIndex = 0;
      imageMenuRef.current.focus();
    }
  }, [imageMenuIsOpen]);

  const isUserMode = getCurrentGalleryMode === "userGallery";

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
    const parsedTags = tagsToAdd.split(/, | |,/);
    tagsUpdateHandler([...tags, ...parsedTags]);
  };
  const tagsUpdateHandler = async (newTags: string[]) => {
    setimgInfoIsLoading(true);
    await editImagesInfo([{ _id, imageInfo: { tags: newTags } }]);
    setimgInfoIsLoading(false);
  };

  const toggleLikeHandler = async () => {
    setimgInfoIsLoading(true);
    if (!likes.includes(userName)) {
      const newLikesList = [...likes, userName];
      await editImagesInfo([{ _id, imageInfo: { likes: newLikesList } }]);
    } else {
      const newLikesList = likes.filter((name) => name !== userName);
      await editImagesInfo([{ _id, imageInfo: { likes: newLikesList } }]);
    }
    setimgInfoIsLoading(false);
  };

  const overlaysAreClosedCheck = () =>
    !tagEditorOverlayIsOpen && !deleteOverlayIsOpen && !shareOverlayIsOpen;

  return (
    <div
      className={styles.cardWrap}
      tabIndex={groupSelectMode ? -1 : 0}
      onMouseLeave={imageMenuCloseHandler}
    >
      {overlaysAreClosedCheck() && !groupSelectMode && (
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
      )}

      <NavLink
        to={`/${getCurrentGalleryMode}/${_id}`}
        tabIndex={-1}
        className={styles.imageLink}
        title={imageInfo.tags.join(" ")}
        onClick={imageModalOpenHandler}
      >
        <div
          className={styles.imgWrap}
          style={{ backgroundImage: `url(${imageURL})` }}
        ></div>
      </NavLink>

      {overlaysAreClosedCheck() && !groupSelectMode && (
        <div className={styles.text}>
          <div className={styles.imgCardText}>
            <TagList
              tags={tags}
              title={isUserMode ? "Double click to edit" : "No tags"}
              placeholder={isUserMode ? "Double click to add tags" : "No tags"}
              isTagDeletable={false}
              onDoubleClick={isUserMode ? tagEditOpenHandler : () => null}
              tagDelHandler={tagDelHandler}
            />
          </div>
        </div>
      )}

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
  );
};

function areEqual(prevProps: any, nextProps: any) {
  const idTheSame =
    prevProps.image.imageInfo._id === nextProps.image.imageInfo._id;
  const groupingModeIsTheSame =
    prevProps.groupSelectMode === nextProps.groupSelectMode;
  const selectStateIsTheSame = prevProps.isSelected === nextProps.isSelected;
  return idTheSame && groupingModeIsTheSame && selectStateIsTheSame;
}

export default memo(ImageCard, areEqual); // memiozation of image card.
