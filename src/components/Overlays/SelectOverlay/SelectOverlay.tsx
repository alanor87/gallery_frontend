import React from "react";
import { Checkbox } from "components/elements";
import styles from "./SelectOverlay.module.scss";

interface Props {
  isSelected: boolean;
  onSelectToggle: () => void;
}

const SelectOverlay: React.FC<Props> = ({
  isSelected = false,
  onSelectToggle,
}) => {
  const toggleCheckImage = (e: React.MouseEvent | React.KeyboardEvent) => {
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
      onKeyPress={toggleCheckImage}
      tabIndex={0}
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
