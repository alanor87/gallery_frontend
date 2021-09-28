import styles from "./Tag.module.scss";

export default function Tag({ tagValue, edit, deleteTag }) {
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
}
