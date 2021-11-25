import styles from "./Spinner.module.scss";

interface Props {
  text?: string;
  side: number;
}

const Spinner: React.FC<Props> = ({ text = "Loading", side }) => {
  const containerSize = {
    width: side,
    height: side,
  };

  return (
    <div className={styles.spinnerContainerWrapper}>
      <div className={styles.spinnerContainer} style={containerSize}>
        <div
          className={styles.spinnerInnerContainer}
          style={containerSize}
        ></div>
      </div>
      <span className={styles.spinnerText}>{text}</span>
    </div>
  );
};

export default Spinner;
