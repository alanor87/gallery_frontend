import React from "react";
import { ReactComponent as IconSelect } from "../../../img/icon_select.svg";
import styles from "./Checkbox.module.scss";

interface Props {
  name?: string;
  id?: string;
  isChecked: boolean;
  title?: string;
  disabled?: boolean;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  className?: string;
  onChange?: (event: any) => void;
}

function Checkbox({
  name,
  id,
  isChecked,
  title,
  disabled = false,
  onChange,
  className,
}: Props) {
  const checkboxClassName = disabled
    ? styles.commonCheckbox + " " + styles.disabled + " " + className
    : styles.commonCheckbox + " " + className;
  return (
    <label className={checkboxClassName} title={title}>
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={isChecked}
        className="isHidden"
        onChange={onChange}
        tabIndex={-1}
      />
      {isChecked && <IconSelect className={styles.checkboxIcon} />}
    </label>
  );
}

export default Checkbox;
