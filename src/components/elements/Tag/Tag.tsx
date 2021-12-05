import styles from "./Tag.module.scss";

interface Props {
  tagValue: string;
  isDeletable?: boolean;
  deleteTag?: (tagValue: string) => void;
}

const Tag: React.FC<Props> = ({ tagValue, isDeletable, deleteTag }) => {
  const tagDeleteHandler = () => {
    deleteTag && deleteTag(tagValue);
  };
  return (
    <li className={styles.imgTag}>
      <span>{tagValue}</span>
      {isDeletable && (
        <button
          className={styles.tagDeleteBtn}
          onClick={tagDeleteHandler}
          title="Delete tag"
        />
      )}
    </li>
  );
};

export default Tag;
