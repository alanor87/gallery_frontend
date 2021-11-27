import React from "react";
import { Checkbox } from "../../elements";
import styles from "./styles.module.scss";

interface Props {
  isSelected: boolean;
  onSelectToggle: () => void;
}

const SelectOverlay: React.FC<Props> = ({
  isSelected = false,
  onSelectToggle,
}) => {
  const toggleCheckImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onSelectToggle();
  };
  return (
    <div
      className={
        isSelected
          ? styles.selectOverlay + " " + styles.checked
          : styles.selectOverlay
      }
      onClick={toggleCheckImage}
    >
      <Checkbox
        title="check / uncheck"
        isChecked={isSelected}
        onChange={toggleCheckImage}
        className={
          isSelected
            ? styles.selectCheckbox + " " + styles.checked
            : styles.selectCheckbox
        }
      />
    </div>
  );
};

export default SelectOverlay;
