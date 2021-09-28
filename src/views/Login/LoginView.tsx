import React from "react";
import { NavLink } from "react-router-dom";
import store from "../../MST/store";
import LoginForm from "../../components/LoginForm";
import styles from "./LoginView.module.scss";

const LoginView = () => {
  const backgroundImage = store.interfaceSettings.backgroundImage;
  return (
    <div
      className={styles.sectionLogin}
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <LoginForm />
    </div>
  );
};

export default LoginView;
