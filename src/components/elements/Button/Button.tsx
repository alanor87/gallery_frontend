import React from "react";
import styles from "./Button.module.scss";

interface Props {
  text?: string;
  type: "button" | "submit" | "reset" | undefined;
  title?: string;
  disabled?: boolean;
  style?: any;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  className?: string;
  onClick?: (event: any) => void;
}

function Button({
  text,
  type,
  title,
  disabled = false,
  style,
  icon: Icon,
  className,
  onClick,
}: Props) {
  const buttonClassName = disabled
    ? styles.commonButton + " " + styles.disabled + " " + className
    : styles.commonButton + " " + className;
  return (
    <button
      className={buttonClassName}
      disabled={disabled}
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
