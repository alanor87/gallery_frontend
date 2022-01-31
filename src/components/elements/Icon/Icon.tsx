import React from "react";
import sprite from "../../../img/sprite.svg";
import styles from "./Checkbox.module.scss";

interface Props {
  iconName: string;
}

function Icon({ iconName }: Props) {
  return (
    <svg>
      <use href={sprite + "#" + iconName} />
    </svg>
  );
}

export default Icon;
