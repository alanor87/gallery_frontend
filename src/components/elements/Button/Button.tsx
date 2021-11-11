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
  const defaultStyle = {
    width: `20px`,
    height: `20px`,
  };
  return (
    <button
      className={styles.commonButton + " " + className}
      type={type}
      onClick={onClick}
      title={title}
    >
      {Icon && <Icon style={{ ...defaultStyle, ...style }} />}
      {text}
    </button>
  );
}

export default Button;
