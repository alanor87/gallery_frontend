import styles from "./Button.module.scss";

interface Props {
  text?: string;
  type: "button" | "submit" | "reset" | undefined;
  title?: string;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  className?: string;
  onClick?: () => void;
}

function Button({ text, type, title, icon: Icon, className, onClick }: Props) {
  return (
    <button
      className={styles.commonButton + " " + className}
      type={type}
      onClick={onClick}
      title={title}
    >
      {Icon && <Icon style={{ width: "20px", height: "20px" }} />}
      {text}
    </button>
  );
}

export default Button;
