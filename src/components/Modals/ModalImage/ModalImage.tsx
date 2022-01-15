import { useState } from "react";
import { useLocation } from "react-router";
import { Button, Spinner } from "../../elements";
import store from "../../../MST/store";
import styles from "./styles.module.scss";

const ModalImage = () => {
  const location = useLocation();
  console.log(location.pathname);
  return <div className={styles.modalImage}></div>;
};

export default ModalImage;
