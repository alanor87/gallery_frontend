import React, { useState } from "react";
import { Checkbox } from "../../elements";
import styles from "./styles.module.scss";

const SelectOverlay = () => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheckImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsChecked(!isChecked);
  };
  return (
    <div
      className={
        isChecked
          ? styles.selectOverlay + " " + styles.checked
          : styles.selectOverlay
      }
      onClick={toggleCheckImage}
    >
      <Checkbox
        title="check / uncheck"
        isChecked={isChecked}
        onChange={toggleCheckImage}
        className={
          isChecked
            ? styles.selectCheckbox + " " + styles.checked
            : styles.selectCheckbox
        }
      />
    </div>
  );
};

export default SelectOverlay;
