import { useState, useEffect, memo } from "react";
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

  const { editImagesInfo, groupSelectModeToggle, selectedListChange } =
    store.imagesStoreSettings;
  const { userName } = store.userSettings;
  const { _id, imageHostingId, imageURL, imageInfo, toggleSelectImage } = image;
  const { tags, likes, openedTo, isPublic, isLoading } = imageInfo;

  const [deleteOverlayIsOpen, setDeleteOverlayIsOpen] = useState(false);
  const [shareOverlayIsOpen, setShareOverlayIsOpen] = useState(false);
  const [imageMenuIsOpen, setImageMenuIsOpen] = useState(false);
  const [imgInfoIsLoading, setimgInfoIsLoading] = useState(false);
  const [tagEditorOverlayIsOpen, setTagEditorOpen] = useState(false);

  useEffect(() => {
    if (!groupSelectMode) toggleSelectImage(false);
  }, [groupSelectMode, toggleSelectImage]);

  const imageMenuToggleHandler = () => setImageMenuIsOpen(!imageMenuIsOpen);

  const groupSelectOnHandler = () => {
    setImageMenuIsOpen(false);
    groupSelectModeToggle();
  };

  const toggleImageSelect = () => {
    toggleSelectImage(!isSelected);
    selectedListChange(_id, imageHostingId);
  };

  const tagEditOpenHandler = () => {
    setTagEditorOpen(true);
    setImageMenuIsOpen(false);
  };
  const deleteOverlayOpenHandler = () => {
    setDeleteOverlayIsOpen(true);
    setImageMenuIsOpen(false);
  };
  const shareOverlayOpenHandler = () => {
    setShareOverlayIsOpen(true);
    setImageMenuIsOpen(false);
  };

  const onTagEditCloseHandler = () => setTagEditorOpen(false);
  const deleteOverlayCloseHandler = () => setDeleteOverlayIsOpen(false);
  const shareOverlayCloseHandler = () => setShareOverlayIsOpen(false);

  const tagDelHandler = (tagToDelete: string) => {
    const newTags = tags.filter((tag) => tag !== tagToDelete);
    tagsUpdateHandler(newTags);
  };
  const tagAddHandler = (tagToAdd: string) => {
    tagsUpdateHandler([...tags, tagToAdd]);
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
    <div className={styles.cardWrap}>
      {overlaysAreClosedCheck() && !groupSelectMode && (
        <div className={styles.menu}>
          <Button
            type="button"
            icon={IconLike}
            onClick={toggleLikeHandler}
            className={styles.menuButton}
            text={likes.length}
          />
          <div
            className={
              imageMenuIsOpen
                ? styles.imageMenuWrapper + " " + styles.isOpened
                : styles.imageMenuWrapper
            }
          >
            <ImageMenu
              onDelete={deleteOverlayOpenHandler}
              onEdit={tagEditOpenHandler}
              onSelect={groupSelectOnHandler}
              onShare={shareOverlayOpenHandler}
            />
          </div>

          <div style={{ position: "relative" }}>
            <Button
              type="button"
              icon={IconSettings}
              onClick={imageMenuToggleHandler}
              className={styles.menuButton}
            />
          </div>
        </div>
      )}

      <NavLink to={`/image/${_id}`}>
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
              title={"Double click to edit"}
              placeholder={"Double click to add tags"}
              isTagDeletable={false}
              onDoubleClick={tagEditOpenHandler}
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
          onAddTag={tagAddHandler}
          isLoading={imgInfoIsLoading}
        />
      )}

      {deleteOverlayIsOpen && (
        <DeleteOverlay
          _id={_id}
          imageHostingId={imageHostingId}
          onCloseDeleteOverlay={deleteOverlayCloseHandler}
        />
      )}

      {shareOverlayIsOpen && (
        <ShareOverlay
          _id={_id}
          isPublic={isPublic}
          openedTo={openedTo}
          onCloseShareOverlay={shareOverlayCloseHandler}
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
