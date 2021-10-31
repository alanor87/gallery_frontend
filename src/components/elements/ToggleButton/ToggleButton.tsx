import React from "react";
import styles from "./ToggleButton.module.scss";

interface Props {
  isChecked?: boolean;
  hint?: string;
  toggleHandler: (value: boolean) => void;
  style?: {};
}
const ToggleButton: React.FC<Props> = ({
  toggleHandler,
  isChecked,
  hint,
  style,
}) => {
  const onToggle = (event: any) => {
    toggleHandler(event.target.checked);
  };

  return (
    <label className={styles.toggleElement} style={style}>
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
