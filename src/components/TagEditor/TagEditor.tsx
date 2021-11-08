import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import TagList from "../TagList";
import { Button } from "../elements";
import { ReactComponent as CloseIcon } from "../../img/icon_close.svg";
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
        {/* <button
          className={styles.tagEditorCloseBtn}
          onClick={closeHandle}
        ></button> */}
        <Button
          type="button"
          className={styles.tagEditorCloseBtn}
          icon={CloseIcon}
          onClick={closeHandle}
        />
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
