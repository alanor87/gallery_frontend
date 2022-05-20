import { useState } from "react";
import { Button } from "components/elements";
import TagEditor from "components/TagEditor";
import styles from "./EditOverlay.module.scss";

type Props = {
  title: string;
  descriptionText: string;
  tags: string[];
  tagAddHandler: (tag: string) => void;
  tagDelHandler: (tag: string) => void;
  onAccept: (title: string, description: string, descriptionIsChanged: boolean) => void;
  onCancel: () => void;
};

const EditOverlay: React.FC<Props> = ({
  title: initTitle,
  descriptionText: initDescriptionText,
  tags,
  tagAddHandler,
  tagDelHandler,
  onAccept,
  onCancel,
}) => {
  const [title, setTitle] = useState(initTitle);
  const [descriptionText, setDescriptionText] = useState(initDescriptionText);

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setTitle(e.target.value);
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    setDescriptionText(e.target.value);
  };

  const onAcceptClickHandle = () => {
    const descriptionIsChanged = initDescriptionText !== descriptionText;
    onAccept(title, descriptionText, descriptionIsChanged);
  };
  return (
    <div className={`overlay`}>
      <div className={styles.editOverlay}>
        <TagEditor
          tags={tags}
          onTagDelete={tagDelHandler}
          onAddTags={tagAddHandler}
        />
        <span className={styles.fieldTitle}>Title</span>
        <input
          className={styles.title}
          value={title}
          onChange={onTitleChange}
        />
        <span className={styles.fieldTitle}>Description</span>
        <textarea
          className={styles.description}
          value={descriptionText}
          onChange={onDescriptionChange}
        />
        <span
          style={{
            display:
              initDescriptionText !== descriptionText ? "inline" : "none",
          }}
        >
          Clicking Accept after Description edit will delete all anchors in text
        </span>
        <div className="overlay-buttonWrapper">
          <Button text="Accept" onClick={onAcceptClickHandle} />
          <Button text="Cancel" onClick={onCancel} />
        </div>
      </div>
    </div>
  );
};

export default EditOverlay;
