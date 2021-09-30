import React from "react";
import styles from "./ToggleButton.module.scss";

interface Props {
  isChecked: boolean;
  hint: string;
  toggleHandler: (value: boolean) => void;
}
const ToggleButton: React.FC<Props> = ({ toggleHandler, isChecked, hint }) => {
  const onToggle = (event: any) => {
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
};

export default ToggleButton;
