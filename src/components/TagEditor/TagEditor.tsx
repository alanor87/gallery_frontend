import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import TagList from "../TagList";
import { Button } from "../elements";
import { ReactComponent as CloseIcon } from "../../img/icon_close.svg";
import { ReactComponent as PlusIcon } from "../../img/icon_plus.svg";
import styles from "./TagEditor.module.scss";

interface Props {
  tags: string[];
  closeHandle: () => void;
  onTagDelete: (tagToDelete: string) => void;
  onAddTag: (newTag: string) => void;
  isLoading?: boolean;
}

const TagEditor: React.FC<Props> = ({
  tags,
  closeHandle,
  onTagDelete,
  onAddTag,
  isLoading = false,
}) => {
  const [tagName, setTagName] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagName(event.target.value);
  };

  const parseInput = (inputValue: string) => {
    const tags = inputValue.split(/[,]|[ ]|, /);
    console.log(tags);
  };

  const handleEnterPress = (event: React.KeyboardEvent) => {
    if (event.code === "Enter") {
      parseInput(tagName);
      onAddTag(tagName);
      setTagName("");
    }
  };

  const addTag = () => {
    if (tagName) {
      onAddTag(tagName);
    }
    setTagName("");
  };

  return (
    <div className={`imageCardOverlay ${styles.tagEditor}`}>
      <div className={styles.tagInputForm}>
        <Button
          type="button"
          title="Close tag editor"
          className={styles.tagEditorInputFormBtn}
          icon={CloseIcon}
          onClick={closeHandle}
        />
        <input
          value={tagName}
          type="text"
          maxLength={30}
          className={styles.newTagInput}
          onChange={handleInputChange}
          onKeyPress={handleEnterPress}
        />
        <Button
          type="button"
          className={styles.tagEditorInputFormBtn}
          title="Add tag"
          icon={PlusIcon}
          onClick={addTag}
        />
      </div>
      <TagList tags={tags} tagDelHandler={onTagDelete} isTagDeletable={true} />
    </div>
  );
};

export default observer(TagEditor);
