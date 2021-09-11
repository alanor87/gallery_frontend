import { React, useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { onTagsEdit } from "../../redux/gallery/gallery-actions";
import { NavLink } from "react-router-dom";
import { Tag } from "../elements";
import TagEditor from "../../components/TagEditor";
import styles from "./ImageCard.module.scss";

function ImageCard({ image }) {
  console.log("Render"); // just for debugging -  to be sure memoization works)

  const { id, previewURL, tags, likes, comments } = image;

  const [tagEditorIsOpen, setTagEditorOpen] = useState(false);
  const [imageTags, setImageTags] = useState(tags.split(", ")); //storing tags array for this image

  const onTagEditOpen = () => setTagEditorOpen(true);
  const onTagEditClose = () => setTagEditorOpen(false);

  const dispatch = useDispatch();

  useEffect(
    () => dispatch(onTagsEdit({ id, imageTags })), //dispatching action with the image id and new list of tags in payload.
    [imageTags, id, dispatch]
  );

  const tagDelHandler = (tagToDelete) => {
    const newTags = imageTags.filter((tag) => tag !== tagToDelete);
    setImageTags(newTags);
  };

  const tagAddHandler = (newTag) => {
    const newTags = [...imageTags, ...newTag.split(", ")];
    setImageTags(newTags);
  };

  return (
    <div className={styles.cardWrap}>
      {tagEditorIsOpen && (
        <TagEditor
          id={id}
          tags={imageTags}
          closeHandle={onTagEditClose}
          onTagDelete={tagDelHandler}
          onAddTag={tagAddHandler}
        />
      )}
      <NavLink to={`/image/${id}`}>
        <div className={styles.imgWrap}>
          <img className={styles.img} src={previewURL} alt="pic" />
        </div>
      </NavLink>
      {!tagEditorIsOpen && (
        <div className={styles.text}>
          <div className={styles.imgCardText}>
            <ul
              title="Double click to edit"
              className={styles.tagList}
              onDoubleClick={onTagEditOpen}
            >
              {imageTags.map((tag, index) => (
                <Tag tagValue={tag} key={index} />
              ))}
            </ul>

            <div className={styles.addInfo}>
              <span>Likes: {likes}</span>
              <span>Comments: {comments}</span>
            </div>
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
