import { useState, memo } from "react";
import { NavLink } from "react-router-dom";
import TagList from "../TagList";
import { Button } from "../elements";
import store from "../../MST/store";
import TagEditor from "../TagEditor";
import DeleteWindow from "../DeleteWindow";
import { ImageType } from "../../MST/imagesStoreSettings";
import { ReactComponent as IconDelete } from "../../img/icon_delete.svg";
import { ReactComponent as IconLike } from "../../img/icon_like.svg";
import styles from "./ImageCard.module.scss";

interface Props {
  image: ImageType;
}

const ImageCard: React.FC<Props> = ({ image }) => {
  console.log("Render"); // just for debugging -  to be sure memoization works)

  const { editTags } = store.imagesStoreSettings;
  const { _id, imageHostingId, imageURL, imageInfo } = image;
  const { tags, likes } = imageInfo;

  const [tagEditorIsOpen, setTagEditorOpen] = useState(false);
  const [deleteWindowIsOpen, setdeleteWindowIsOpen] = useState(false);
  const [tagsAreLoading, setTagsAreLoading] = useState(imageInfo.isLoading);

  const onTagEditOpen = () => setTagEditorOpen(true);
  const onTagEditClose = () => setTagEditorOpen(false);

  const tagDelHandler = (tagToDelete: string) => {
    const newTags = tags.filter((tag) => tag !== tagToDelete);
    tagsUpdate(newTags);
  };

  const tagAddHandler = (tagToAdd: string) => {
    tagsUpdate([...tags, tagToAdd]);
  };

  const tagsUpdate = async (newTags: string[]) => {
    setTagsAreLoading(true);
    await editTags(_id, newTags);
    setTagsAreLoading(false);
  };

  const deleteWindowOpenHandler = () => {
    setdeleteWindowIsOpen(true);
  };

  const deleteWindowCloseHandler = () => {
    setdeleteWindowIsOpen(false);
  };

  return (
    <div className={styles.cardWrap}>
      {!tagEditorIsOpen && !deleteWindowIsOpen && (
        <div className={styles.menu}>
          <Button
            type="button"
            icon={IconDelete}
            onClick={deleteWindowOpenHandler}
            className={styles.menuButton}
          />
          <Button
            type="button"
            icon={IconLike}
            onClick={() => null}
            className={styles.menuButton}
          />
        </div>
      )}
      {tagEditorIsOpen && (
        <TagEditor
          tags={tags}
          closeHandle={onTagEditClose}
          onTagDelete={tagDelHandler}
          onAddTag={tagAddHandler}
          isLoading={tagsAreLoading}
        />
      )}

      <NavLink to={`/image/${_id}`}>
        <div
          className={styles.imgWrap}
          style={{ backgroundImage: `url(${imageURL})` }}
        ></div>
      </NavLink>

      {!tagEditorIsOpen && !deleteWindowIsOpen && (
        <div className={styles.text}>
          <div className={styles.imgCardText}>
            {!tagsAreLoading ? (
              <>
                <TagList
                  tags={tags}
                  title={"Double click to edit"}
                  placeholder={"Double click to add tags"}
                  isTagDeletable={false}
                  onDoubleClick={onTagEditOpen}
                  tagDelHandler={tagDelHandler}
                />
                <div className={styles.addInfo}>
                  <span>Likes: {likes}</span>
                </div>{" "}
              </>
            ) : (
              <p>is Loading</p>
            )}
          </div>
        </div>
      )}
      {deleteWindowIsOpen && (
        <DeleteWindow
          _id={_id}
          imageHostingId={imageHostingId}
          onCloseDeleteWindow={deleteWindowCloseHandler}
        />
      )}
    </div>
  );
};

function areEqual(prevProps: any, nextProps: any) {
  const prevTags = JSON.stringify(prevProps.image.imageInfo.tags);
  const nextTags = JSON.stringify(nextProps.image.imageInfo.tags);
  return prevTags === nextTags;
}

export default memo(ImageCard, areEqual); // memiozation of image card.
