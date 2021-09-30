import styles from "./Tag.module.scss";

interface Props {
  tagValue: string;
  edit: boolean;
  deleteTag: (tagValue: string) => void;
}

const Tag: React.FC<Props> = ({ tagValue, edit, deleteTag }) => {
  return (
    <li className={styles.imgTag}>
      <span>{tagValue}</span>
      {edit && (
        <button
          className={styles.tagDeleteBtn}
          onClick={() => deleteTag(tagValue)}
        ></button>
      )}
    </li>
  );
};

export default Tag;
