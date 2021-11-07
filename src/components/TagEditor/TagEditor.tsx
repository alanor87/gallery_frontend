import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import TagList from "../TagList";
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
    if (tagName) onAddTag(tagName);
    setTagName("");
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
          maxLength={30}
          className={styles.newTagInput}
          onChange={handleInputChange}
          onKeyPress={handleEnterPress}
        />
        <button className={styles.newTagBtn} onClick={addTag}>
          Add tag
        </button>
      </div>
      {!isLoading ? (
        <TagList
          tags={tags}
          tagDelHandler={onTagDelete}
          isTagDeletable={true}
        />
      ) : (
        <p>is loading</p>
      )}
    </div>
  );
};

export default observer(TagEditor);
