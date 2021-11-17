import React from "react";
import styles from "./Button.module.scss";

interface Props {
  text?: string;
  type: "button" | "submit" | "reset" | undefined;
  title?: string;
  style?: any;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  className?: string;
  onClick?: () => void;
}

function Button({
  text,
  type,
  title,
  style,
  icon: Icon,
  className,
  onClick,
}: Props) {
  return (
    <button
      className={styles.commonButton + " " + className}
      type={type}
      onClick={onClick}
      title={title}
    >
      {Icon && (
        <span className={styles.buttonIcon} style={{ ...style }}>
          <Icon />
        </span>
      )}

      {text && <span className={styles.buttonText}>{text}</span>}
    </button>
  );
}

export default Button;
