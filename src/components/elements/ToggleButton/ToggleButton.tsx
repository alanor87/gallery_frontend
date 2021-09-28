import styles from "./ToggleButton.module.scss";

function ToggleButton({ toggleHandler, isChecked, hint }) {
  const onToggle = (event) => {
    toggleHandler(event.target.checked);
  };

  return (
    <label className={styles.toggleElement}>
      <input
        type="checkbox"
        className={`${styles.sideMenuCheckbox} ${styles.toggleCheckbox} ${styles.isHidden}`}
        autoComplete="off"
        onChange={onToggle}
        checked={isChecked}
      />
      <span className={styles.innerFrame}>
        <span className={styles.toggleButton} title={hint}></span>
      </span>
    </label>
  );
}

export default ToggleButton;
