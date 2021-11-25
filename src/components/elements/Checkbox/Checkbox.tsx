import React from "react";
import { ReactComponent as IconSelect } from "../../../img/icon_select.svg";
import styles from "./Checkbox.module.scss";

interface Props {
  isChecked: boolean;
  title?: string;
  disabled?: boolean;
  style?: any;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  className?: string;
  onChange?: (event: any) => void;
}

function Checkbox({
  isChecked,
  title,
  disabled = false,
  style,
  onChange,
  className,
}: Props) {
  console.log("isChecked : ", isChecked);
  const checkboxClassName = disabled
    ? styles.commonCheckbox + " " + styles.disabled + " " + className
    : styles.commonCheckbox + " " + className;
  return (
    <label className={checkboxClassName}>
      <input
        type="checkbox"
        checked={isChecked}
        className="isHidden"
        onChange={onChange}
      />
      {isChecked && <IconSelect className={styles.checkboxIcon} />}
    </label>
  );
}

export default Checkbox;