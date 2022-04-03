import styles from "./Spinner.module.scss";

interface Props {
  className?: string;
  backdropClassName?: string;
  text?: string;
  side?: number;
}

const Spinner: React.FC<Props> = ({
  text = "Loading",
  side = 40,
  className,
  backdropClassName,
}) => {
  const containerSize = {
    width: side,
    height: side,
  };

  return (
    <div className={`${styles.spinnerBackdrop} ${backdropClassName}`}>
      <div className={`${styles.spinnerContainerWrapper} ${className}`}>
        <div className={styles.spinnerContainer} style={containerSize}>
          <div
            className={styles.spinnerInnerContainer}
            style={containerSize}
          ></div>
        </div>
        <span className={styles.spinnerText}>{text}</span>
      </div>
    </div>
  );
};

export default Spinner;
