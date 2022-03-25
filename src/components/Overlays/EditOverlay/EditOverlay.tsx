import { useState } from "react";
import { Button } from "components/elements";
import TagEditor from "components/TagEditor";
import styles from "./EditOverlay.module.scss";

type Props = {
  title: string;
  description: string;
  tags: string[];
  tagAddHandler: (tag: string) => void;
  tagDelHandler: (tag: string) => void;
  onAccept: (title: string, description: string) => void;
  onCancel: () => void;
};

const EditOverlay: React.FC<Props> = ({
  title: initTitle,
  description: initDescription,
  tags,
  tagAddHandler,
  tagDelHandler,
  onAccept,
  onCancel,
}) => {
  const [title, setTitle] = useState(initTitle);
  const [description, setDescription] = useState(initDescription);

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setTitle(e.target.value);
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    setDescription(e.target.value);
  };

  const onAcceptClickHandle = () => {
    onAccept(title, description);
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
          value={description}
          onChange={onDescriptionChange}
        />
        <div className="overlay-buttonWrapper">
          <Button text="Accept" onClick={onAcceptClickHandle} />
          <Button text="Cancel" onClick={onCancel} />
        </div>
      </div>
    </div>
  );
};

export default EditOverlay;
