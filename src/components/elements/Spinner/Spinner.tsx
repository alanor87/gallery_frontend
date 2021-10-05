import styles from "./Spinner.module.scss";

interface Props {
  side: number;
}

const Spinner: React.FC<Props> = ({ side }) => {
  const containerSize = {
    width: side,
    height: side,
  };

  return (
    <div className={styles.spinnerContainer} style={containerSize}>
      <div className={styles.spinnerInnerContainer} style={containerSize}>
        Loading{" "}
      </div>
    </div>
  );
};

export default Spinner;
