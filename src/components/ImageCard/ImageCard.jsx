import { React, useState, memo } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { Tag } from "../elements";
import store from "../../MST/store";
import TagEditor from "../../components/TagEditor";
import styles from "./ImageCard.module.scss";

function ImageCard({ image }) {
  console.log("Render"); // just for debugging -  to be sure memoization works)

  const { id, imageURL, imageInfo } = image;
  const { tags, likes } = imageInfo;

  const [tagEditorIsOpen, setTagEditorOpen] = useState(false);
  const [tagsAreLoading, setTagsAreLoading] = useState(false);

  const onTagEditOpen = () => setTagEditorOpen(true);
  const onTagEditClose = () => setTagEditorOpen(false);

  const tagDelHandler = (tagToDelete) => {
    const newTags = tags.filter((tag) => tag !== tagToDelete);
    tagsUpdate(newTags);
  };

  const tagAddHandler = (tagToAdd) => {
    tagsUpdate([...tags, tagToAdd]);
  };

  const tagsUpdate = async (newTags) => {
    setTagsAreLoading(true);
    await store.imagesStoreSettings.editTags(id, newTags);
    setTagsAreLoading(false);
  };

  return (
    <div className={styles.cardWrap}>
      {tagEditorIsOpen && (
        <TagEditor
          id={id}
          tags={tags}
          closeHandle={onTagEditClose}
          onTagDelete={tagDelHandler}
          onAddTag={tagAddHandler}
          isLoading={tagsAreLoading}
        />
      )}
      <NavLink to={`/image/${id}`}>
        <div className={styles.imgWrap}>
          <img className={styles.img} src={imageURL} alt="pic" />
        </div>
      </NavLink>
      {!tagEditorIsOpen && (
        <div className={styles.text}>
          <div className={styles.imgCardText}>
            {!tagsAreLoading ? (
              <>
                {" "}
                <ul
                  title="Double click to edit"
                  className={styles.tagList}
                  onDoubleClick={onTagEditOpen}
                >
                  {tags.map((tag, index) => (
                    <Tag tagValue={tag} key={index} />
                  ))}
                </ul>
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
}

ImageCard.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.number.isRequired,
    previewURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    comments: PropTypes.number.isRequired,
  }),
};

function areEqual(prevImg, nextImg) {
  // memoization comparison function. If the tag list is the same -
  return prevImg.tags === nextImg.tags; // the image card is not rendered again.
}

export default memo(ImageCard, areEqual); // memization of image card.
