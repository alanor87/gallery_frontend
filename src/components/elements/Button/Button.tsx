import styles from "./Button.module.scss";

export default function Button({ text, type, onClick }) {
  return (
    <button className={styles.commonButton} type={type} onClick={onClick}>
      {text}
    </button>
  );
}
