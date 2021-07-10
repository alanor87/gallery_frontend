import { React, useRef } from "react";
import Tag from "../Tag";

export default function TagEditor({ tags, closeHandle, onTagDelete, onAddTag }) {
  const tagInput = useRef(null);

    const addTag = () => {
        const newTag = tagInput.current.value;
        if (newTag) onAddTag(newTag);
    }
  return (
    <div className="tag-editor">
      <button
        className="tag-editor-close-btn"
        onClick={closeHandle}
      ></button>
      <div className="tag-input-form">
        <input ref={tagInput} type="text" className="new-tag-input" />
        <button className="new-tag-btn" onClick={addTag}>
          Add tag
        </button>
      </div>
      <ul className="gallery-page-tag-list">
        {tags.map((tag, index) => (
          <Tag tagValue={tag} edit={true} key={index} deleteTag={onTagDelete} />
        ))}
      </ul>
    </div>
  );
}
