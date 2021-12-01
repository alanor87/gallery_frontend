import React, { useState } from "react";
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
  const [isFocused, setIsFocused] = useState(false);
  const onToggle = (event: any) => {
    toggleHandler(event.target.checked);
  };

  const onFocusHandler = (e: React.FocusEvent) => {
    console.log(e);
    setIsFocused(true);
  };

  const onBlurHandler = (e: React.FocusEvent) => {
    console.log(e);
    setIsFocused(false);
  };

  return (
    <label
      className={
        isFocused
          ? styles.toggleElement + " " + styles.inFocus
          : styles.toggleElement
      }
      style={style}
    >
      <input
        type="checkbox"
        className={`${styles.sideMenuCheckbox} ${styles.toggleCheckbox} ${styles.isHidden}`}
        autoComplete="off"
        onChange={onToggle}
        checked={isChecked}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
      />
      <span className={styles.innerFrame}>
        <span className={styles.toggleButton} title={hint}></span>
      </span>
    </label>
  );
};

export default ToggleButton;
