import React from "react";
import { NavLink } from "react-router-dom";
import store from "../../MST/store";
import RegisterForm from "../../components/RegisterForm";
import styles from "./RegisterView.module.scss";

const RegisterView = () => {
  const backgroundImage = store.interfaceSettings.backgroundImage;
  return (
    <div
      className={styles.sectionRegister}
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <RegisterForm />
    </div>
  );
};

export default RegisterView;
