import { Button } from "../../elements";
import store from "../../../MST/store";
import styles from "./ModalShare.module.scss";

const ModalShare = () => {
  return (
    <div className={styles.modalDeleteForm}>
      <h2>Share image</h2>

      <div className={styles.buttonWrapper}>
        <Button text="Accept" onClick={() => null} />
        <Button text="Cancel" onClick={() => null} />
      </div>
    </div>
  );
};

export default ModalShare;
