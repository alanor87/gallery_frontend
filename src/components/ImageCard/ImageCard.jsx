import { React, useState, useEffect, memo } from "react";
import { useDispatch } from "react-redux";
import { onTagsEdit } from "../../redux/gallery/gallery-actions";
import { NavLink } from "react-router-dom";
import Tag from "../../components/Tag";
import TagEditor from "../../components/TagEditor";

function ImageCard({ image }) {
  console.log("Render"); // just for debugging -  to be sure memoization works)

  const { id, previewURL, tags, likes, comments } = image;
  const tagsArray = tags.split(", ");
  const [tagEditorIsOpen, setTagEditorOpen] = useState(false);
  const [imageTags, setImageTags] = useState(tagsArray);
  const onTagEditOpen = () => setTagEditorOpen(true);
  const onTagEditClose = () => setTagEditorOpen(false);
  const dispatch = useDispatch();

  useEffect(
    () => dispatch(onTagsEdit({ id, imageTags })),
    [imageTags, id, dispatch]
  );

  const tagDelHandler = (tagToDelete) => {
    const newTags = imageTags.filter((tag) => tag !== tagToDelete);
    setImageTags(newTags);
  };

  const tagAddHandler = (newTag) => {
    const newTags = [...imageTags, newTag];
    setImageTags(newTags);
  };

  return (
    <div className="gallery-page-card-wrap">
      {tagEditorIsOpen && (
        <TagEditor
          id={id}
          tags={imageTags}
          closeHandle={onTagEditClose}
          onTagDelete={tagDelHandler}
          onAddTag={tagAddHandler}
        />
      )}
      <NavLink to={`/${id}`}>
        <div className="gallery-page-img-wrap">
          <img className="gallery-page-img" src={previewURL} alt="pic" />
        </div>
      </NavLink>
      {!tagEditorIsOpen && (
        <div className="gallery-page-text">
          <div className="gallery-page-img-info">
            <ul
              title="Double click to edit"
              className="gallery-page-tag-list"
              onDoubleClick={() => onTagEditOpen()}
            >
              {imageTags.map((tag, index) => (
                <Tag tagValue={tag} key={index} />
              ))}
            </ul>

            <div className="gallery-page-add-info">
              <span>Likes: {likes}</span>
              <span>Comments: {comments}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function areEqual(prevImg, nextImg) { // memoization comparison function. If the tag list is the same -
  return prevImg.tags === nextImg.tags; // the image card is not rendered again.
}

export default memo(ImageCard, areEqual); // memization of image card.
