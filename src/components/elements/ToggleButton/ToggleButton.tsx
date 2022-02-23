import React, { useState } from "react";
import styles from "./ToggleButton.module.scss";

interface Props {
  isChecked?: boolean;
  hint?: string;
  toggleHandler: (value: boolean) => void;
  className?: string;
  disabled?: boolean;
  style?: {};
}
const ToggleButton: React.FC<Props> = ({
  toggleHandler,
  isChecked,
  hint,
  className,
  disabled = false,
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const onToggle = (event: any) => {
    toggleHandler(event.target.checked);
  };

  const onFocusHandler = (e: React.FocusEvent) => {
    setIsFocused(true);
  };

  const onBlurHandler = (e: React.FocusEvent) => {
    setIsFocused(false);
  };

  const toggleClassName = isFocused
    ? styles.toggleElement + " " + styles.inFocus + " " + (className || null)
    : styles.toggleElement +
      " " +
      (className || null) +
      " " +
      (disabled ? styles.disabled : null);

  return (
    <label className={toggleClassName} style={style}>
      <input
        type="checkbox"
        className={`${styles.sideMenuCheckbox} ${styles.toggleCheckbox} isHidden`}
        autoComplete="off"
        onChange={onToggle}
        checked={isChecked}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        disabled={disabled}
      />
      <span className={styles.innerFrame}>
        <span className={styles.toggleButton} title={hint}></span>
      </span>
    </label>
  );
};

export default ToggleButton;
