import React from "react";
import styles from "./Button.module.scss";

interface Props {
  text?: string | number;
  type?: "button" | "submit" | "reset" | undefined;
  title?: string;
  disabled?: boolean;
  style?: any;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
  onHover?: (event: React.MouseEvent) => void;
}

function Button({
  text,
  type = "button",
  title,
  disabled = false,
  style,
  icon: Icon,
  className,
  onClick,
}: Props) {
  const buttonClassName = disabled
    ? styles.commonButton + " " + className + " " + styles.disabled
    : styles.commonButton + " " + className;
  return (
    <button
      className={buttonClassName}
      disabled={disabled}
      type={type}
      onClick={onClick && onClick}
      title={title}
    >
      {Icon && (
        <span className={styles.buttonIcon} style={{ ...style }}>
          <Icon />
        </span>
      )}

      {text ? <span className={styles.buttonText}>{text}</span> : null}
    </button>
  );
}

export default Button;
