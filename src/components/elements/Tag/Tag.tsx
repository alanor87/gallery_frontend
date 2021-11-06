import styles from "./Tag.module.scss";

interface Props {
  tagValue: string;
  isDeletable: boolean;
  deleteTag: (tagValue: string) => void;
}

const Tag: React.FC<Props> = ({ tagValue, isDeletable, deleteTag }) => {
  return (
    <li className={styles.imgTag}>
      <span>{tagValue}</span>
      {isDeletable && (
        <button
          className={styles.tagDeleteBtn}
          onClick={() => deleteTag(tagValue)}
        />
      )}
    </li>
  );
};

export default Tag;
