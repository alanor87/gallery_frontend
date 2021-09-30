import React from "react";
import styles from "./Button.module.scss";

interface Props {
  text: string;
  type: "button" | "submit" | "reset" | undefined;
  onClick: () => void;
}

function Button({ text, type, onClick }: Props) {
  return (
    <button className={styles.commonButton} type={type} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
