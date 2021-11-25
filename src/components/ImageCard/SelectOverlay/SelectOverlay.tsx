import { useState } from "react";
import { Checkbox } from "../../elements";
import styles from "./styles.module.scss";

const SelectOverlay = () => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheckImage = () => setIsChecked(!isChecked);
  return (
    <div className={styles.selectOverlay}>
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
