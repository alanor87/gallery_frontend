import { useState } from "react";
import { Button, Spinner } from "../../elements";
import store from "../../../MST/store";
import styles from "./styles.module.scss";

const ModalImage = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className={styles.modalImage}>
      {isLoading && <Spinner side={20} />}
    </div>
  );
};

export default ModalImage;
