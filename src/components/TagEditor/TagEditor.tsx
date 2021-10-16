import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Tag } from "../elements";
import styles from "./TagEditor.module.scss";

interface Props {
  tags: string[];
  closeHandle: () => void;
  onTagDelete: (tagToDelete: string) => void;
  onAddTag: (newTag: string) => void;
  isLoading: boolean;
}

const TagEditor: React.FC<Props> = ({
  tags,
  closeHandle,
  onTagDelete,
  onAddTag,
  isLoading,
}) => {
  const [tagName, setTagName] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagName(event.target.value);
  };

  const handleEnterPress = (event: React.KeyboardEvent) => {
    if (event.code === "Enter") {
      onAddTag(tagName);
      setTagName("");
    }
  };

  const addTag = () => {
    onAddTag(tagName);
  };

  return (
    <div className={styles.tagEditor}>
      <button
        className={styles.tagEditorCloseBtn}
        onClick={closeHandle}
      ></button>
      <div className={styles.tagInputForm}>
        <input
          value={tagName}
          type="text"
          className={styles.newTagInput}
          onChange={handleInputChange}
          onKeyPress={handleEnterPress}
        />
        <button className={styles.newTagBtn} onClick={addTag}>
          Add tag
        </button>
      </div>
      {!isLoading ? (
        <ul className={styles.tagList}>
          {tags.map((tag, index) => (
            <Tag
              tagValue={tag}
              edit={true}
              key={index}
              deleteTag={onTagDelete}
            />
          ))}
        </ul>
      ) : (
        <p>is loading</p>
      )}
    </div>
  );
};

export default observer(TagEditor);
