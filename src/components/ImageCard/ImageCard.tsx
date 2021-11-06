import { useState, memo } from "react";
import { NavLink } from "react-router-dom";
import TagList from "../TagList";
import store from "../../MST/store";
import TagEditor from "../TagEditor";
import { ImageType } from "../../MST/imagesStoreSettings";
import { ReactComponent as IconDelete } from "../../img/icon_delete.svg";
import styles from "./ImageCard.module.scss";

interface Props {
  image: ImageType;
}

const ImageCard: React.FC<Props> = ({ image }) => {
  console.log("Render"); // just for debugging -  to be sure memoization works)

  const { _id, imageURL, imageInfo } = image;
  const { tags, likes } = imageInfo;

  const [tagEditorIsOpen, setTagEditorOpen] = useState(false);
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
    await store.imagesStoreSettings.editTags(_id, newTags);
    setTagsAreLoading(false);
  };

  return (
    <div className={styles.cardWrap}>
      <div className={styles.menu}>
        <button type="button">
          <IconDelete style={{ width: "30px", height: "30px" }} />
        </button>
      </div>
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
        >
          {/* <img className={styles.img} src={imageURL} alt="pic"/> */}
        </div>
      </NavLink>
      {!tagEditorIsOpen && (
        <div className={styles.text}>
          <div className={styles.imgCardText}>
            {!tagsAreLoading ? (
              <>
                <TagList
                  tags={tags}
                  title={"Double click to edit"}
                  placeholder={"Double click to add tags"}
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
    </div>
  );
};

function areEqual(prevProps: any, nextProps: any) {
  const prevTags = JSON.stringify(prevProps.image.imageInfo.tags);
  const nextTags = JSON.stringify(nextProps.image.imageInfo.tags);
  return prevTags === nextTags;
}

export default memo(ImageCard, areEqual); // memization of image card.
