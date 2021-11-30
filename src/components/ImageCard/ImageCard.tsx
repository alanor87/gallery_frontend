import { useState, useEffect, memo } from "react";
import { NavLink } from "react-router-dom";
import TagList from "../TagList";
import { Button } from "../elements";
import store from "../../MST/store";
import TagEditor from "../TagEditor";
import ImageMenu from "../ImageMenu";
import DeleteOverlay from "./DeleteOverlay";
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

  const { editImageInfo, groupSelectModeToggle, selectedListChange } =
    store.imagesStoreSettings;
  const { userName } = store.userSettings;
  const { _id, imageHostingId, imageURL, imageInfo, toggleSelectImage } = image;
  const { tags, likes } = imageInfo;

  const [deleteOverlayIsOpen, setdeleteOverlayIsOpen] = useState(false);
  const [imageMenuIsOpen, setImageMenuIsOpen] = useState(false);
  const [imgInfoIsLoading, setimgInfoIsLoading] = useState(false);
  const [tagEditorIsOpen, setTagEditorOpen] = useState(false);

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
  const onTagEditClose = () => setTagEditorOpen(false);

  const deleteOverlayOpenHandler = () => {
    setdeleteOverlayIsOpen(true);
    setImageMenuIsOpen(false);
  };

  const deleteOverlayCloseHandler = () => setdeleteOverlayIsOpen(false);

  const tagDelHandler = (tagToDelete: string) => {
    const newTags = tags.filter((tag) => tag !== tagToDelete);
    tagsUpdateHandler(newTags);
  };

  const tagAddHandler = (tagToAdd: string) => {
    tagsUpdateHandler([...tags, tagToAdd]);
  };

  const tagsUpdateHandler = async (newTags: string[]) => {
    setimgInfoIsLoading(true);
    await editImageInfo(_id, { tags: newTags });
    setimgInfoIsLoading(false);
  };

  const toggleLikeHandler = async () => {
    setimgInfoIsLoading(true);
    if (!likes.includes(userName)) {
      const newLikesList = [...likes, userName];
      await editImageInfo(_id, { likes: newLikesList });
    } else {
      const newLikesList = likes.filter((name) => name !== userName);
      await editImageInfo(_id, { likes: newLikesList });
    }
    setimgInfoIsLoading(false);
  };

  return (
    <div className={styles.cardWrap}>
      {!tagEditorIsOpen && !deleteOverlayIsOpen && !groupSelectMode && (
        <div className={styles.menu}>
          <Button
            type="button"
            icon={IconLike}
            onClick={toggleLikeHandler}
            className={styles.menuButton}
            text={likes.length}
          />
          <ImageMenu
            isOpened={imageMenuIsOpen}
            onDelete={deleteOverlayOpenHandler}
            onEdit={tagEditOpenHandler}
            onSelect={groupSelectOnHandler}
          />
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

      {tagEditorIsOpen && (
        <TagEditor
          tags={tags}
          closeHandle={onTagEditClose}
          onTagDelete={tagDelHandler}
          onAddTag={tagAddHandler}
          isLoading={imgInfoIsLoading}
        />
      )}

      <NavLink to={`/image/${_id}`}>
        <div
          className={styles.imgWrap}
          style={{ backgroundImage: `url(${imageURL})` }}
        ></div>
      </NavLink>

      {!tagEditorIsOpen && !deleteOverlayIsOpen && !groupSelectMode && (
        <div className={styles.text}>
          <div className={styles.imgCardText}>
            {!imgInfoIsLoading ? (
              <>
                <TagList
                  tags={tags}
                  title={"Double click to edit"}
                  placeholder={"Double click to add tags"}
                  isTagDeletable={false}
                  onDoubleClick={tagEditOpenHandler}
                  tagDelHandler={tagDelHandler}
                />
              </>
            ) : (
              <p>is Loading</p>
            )}
          </div>
        </div>
      )}

      {deleteOverlayIsOpen && (
        <DeleteOverlay
          _id={_id}
          imageHostingId={imageHostingId}
          onCloseDeleteOverlay={deleteOverlayCloseHandler}
        />
      )}

      {groupSelectMode && (
        <SelectOverlay
          isSelected={isSelected}
          onSelectToggle={toggleImageSelect}
        />
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
