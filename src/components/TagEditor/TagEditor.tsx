import React, { useState } from "react";
import TagList from "components/TagList";
import { Button } from "components/elements";
import styles from "./TagEditor.module.scss";

interface Props {
  tags: string[];
  closeHandle?: () => void;
  onTagDelete: (tagToDelete: string) => void;
  onAddTags: (newTag: string) => void;
}

const TagEditor: React.FC<Props> = ({
  tags,
  closeHandle,
  onTagDelete,
  onAddTags,
}) => {
  const [tagName, setTagName] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagName(event.target.value);
  };

  const handleEnterPress = (event: React.KeyboardEvent) => {
    if (event.code === "Enter") {
      onAddTags(tagName);
      setTagName("");
    }
  };

  const addTag = () => {
    if (tagName) {
      onAddTags(tagName);
    }
    setTagName("");
  };

  return (
    <div className="tagEditor">
      <div className={styles.tagInputForm}>
        {closeHandle && (
          <Button
            type="button"
            title="Close tag editor"
            className="closeBtn"
            icon="icon_close"
            onClick={closeHandle}
          />
        )}
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
          className={styles.inputFormBtn}
          title="Add tag"
          icon="icon_plus"
          onClick={addTag}
        />
      </div>
      {tags.length > 0 && (
        <TagList tags={tags} isEditable={true} tagDelHandler={onTagDelete} />
      )}
    </div>
  );
};

export default TagEditor;
