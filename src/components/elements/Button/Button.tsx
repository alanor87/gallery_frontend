import React from "react";
import { inherits } from "util";
import Icon from "../Icon";
import styles from "./Button.module.scss";

export interface ButtonProps {
  text?: string | number;
  type?: "button" | "submit" | "reset" | undefined;
  title?: string;
  tabIndex?: number;
  disabled?: boolean;
  style?: any;
  icon?: string;
  iconSize?: number;
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
  onHover?: (event: React.MouseEvent) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement, Element>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement, Element>) => void;
}

function Button({
  text,
  type = "button",
  className,
  style,
  title,
  tabIndex = 0,
  disabled = false,
  icon,
  iconSize,
  onClick,
  onFocus,
  onBlur,
}: ButtonProps) {
  const buttonClassName = disabled
    ? styles.commonButton + " " + className + " disabled"
    : styles.commonButton + " " + className;

  return (
    <button
      className={buttonClassName}
      disabled={disabled}
      type={type}
      onClick={onClick && onClick}
      onFocus={onFocus && onFocus}
      onBlur={onBlur && onBlur}
      title={title}
      aria-label={title}
      tabIndex={tabIndex}
      style={disabled ? { opacity: 0.5 } : {}}
    >
      {icon && (
        <span
          className={styles.buttonIcon}
          style={{ ...style, width: iconSize, height: iconSize }}
        >
          <Icon iconName={icon} side={iconSize} />
        </span>
      )}

      {text ? <span className={styles.buttonText}>{text}</span> : null}
    </button>
  );
}

export default Button;
