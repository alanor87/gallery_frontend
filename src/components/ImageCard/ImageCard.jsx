import {React, useState, useEffect, } from "react";
import { useDispatch } from "react-redux";
import { onTagsEdit } from '../../redux/gallery/gallery-actions';
import { NavLink } from "react-router-dom";
import Tag from "../../components/Tag";
import TagEditor from "../../components/TagEditor";

export default function ImageCard({ image }) {
    
    const { id, previewURL, tags, likes, comments } = image;
    const tagsArray = tags.split(", ");
    const [tagEditorIsOpen, setTagEditorOpen] = useState(false);
    const [imageTags, setImageTags] = useState(tagsArray);
    const onTagEditOpen = () => setTagEditorOpen(true);
    const onTagEditClose = () => setTagEditorOpen(false);
    const dispatch = useDispatch();

    useEffect(() => dispatch(onTagsEdit({ id, imageTags })), [imageTags]);

    const tagDelHandler = (tagToDelete) => {
        const newTags = imageTags.filter(tag => tag !== tagToDelete);
        setImageTags(newTags);
    }

    const tagAddHandler = (newTag) => {
        const newTags = [...imageTags, newTag];
        setImageTags(newTags);
    }

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
      <div className="gallery-page-text">
        <div className="gallery-page-img-info">
          <ul
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
    </div>
  );
}
