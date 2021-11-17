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

  const { editImageInfo } = store.imagesStoreSettings;
  const { userName } = store.userSettings;
  const { _id, imageHostingId, imageURL, imageInfo } = image;
  const { tags, likes } = imageInfo;

  const [tagEditorIsOpen, setTagEditorOpen] = useState(false);
  const [deleteWindowIsOpen, setdeleteWindowIsOpen] = useState(false);
  const [imgInfoIsLoading, setimgInfoIsLoading] = useState(false);

  const onTagEditOpen = () => setTagEditorOpen(true);
  const onTagEditClose = () => setTagEditorOpen(false);

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

  const deleteWindowOpenHandler = () => {
    setdeleteWindowIsOpen(true);
  };

  const deleteWindowCloseHandler = () => {
    setdeleteWindowIsOpen(false);
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
            onClick={toggleLikeHandler}
            className={styles.menuButton}
            text={String(likes.length)}
          />
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

      {!tagEditorIsOpen && !deleteWindowIsOpen && (
        <div className={styles.text}>
          <div className={styles.imgCardText}>
            {!imgInfoIsLoading ? (
              <>
                <TagList
                  tags={tags}
                  title={"Double click to edit"}
                  placeholder={"Double click to add tags"}
                  isTagDeletable={false}
                  onDoubleClick={onTagEditOpen}
                  tagDelHandler={tagDelHandler}
                />
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
  const prevTagsLength = prevProps.image.imageInfo._id;
  const nextTagsLength = nextProps.image.imageInfo._id;
  return prevTagsLength === nextTagsLength;
}

export default memo(ImageCard, areEqual); // memiozation of image card.
