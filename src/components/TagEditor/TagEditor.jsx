import { React, useRef } from "react";
import { Tag } from "../elements";
import styles from "./TagEditor.module.scss";

export default function TagEditor({
  tags,
  closeHandle,
  onTagDelete,
  onAddTag,
}) {
  const tagInput = useRef(null);

  const addTag = () => {
    const newTag = tagInput.current.value;
    if (newTag) onAddTag(newTag);
  };
  return (
    <div className={styles.tagEditor}>
      <button
        className={styles.tagEditorCloseBtn}
        onClick={closeHandle}
      ></button>
      <div className={styles.tagInputForm}>
        <input ref={tagInput} type="text" className={styles.newTagInput} />
        <button className={styles.newTagBtn} onClick={addTag}>
          Add tag
        </button>
      </div>
      <ul className={styles.tagList}>
        {tags.map((tag, index) => (
          <Tag tagValue={tag} edit={true} key={index} deleteTag={onTagDelete} />
        ))}
      </ul>
    </div>
  );
}
