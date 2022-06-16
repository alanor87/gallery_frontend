import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import axios from "axios";
import LoginForm from "components/LoginForm";
import RegisterForm from "components/RegisterForm";
import { Spinner } from "components/elements";
import store from "MST/store";

import styles from "./LoginRegisterView.module.scss";

interface Props {
  path: string;
}

const LoginRegisterView: React.FC<Props> = ({ path }) => {
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    if (!backgroundImage) fetchBg();
  }, [backgroundImage]);

  const fetchBg = async () => {
    try {
      const response = await axios.get(
        store.backendUrl + "/public/getBackgroundImage"
      );
      setBackgroundImage(response.data.body.backgroundImage);
    } catch (error) {
      setBackgroundImage(
        "https://" + store.backendUrl + "/static/default_background.jpg"
      );
    }
  };
  return backgroundImage ? (
    <div
      className={styles.sectionLoginRegister}
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className={styles.backdropBlur}>
        {path === "/login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  ) : (
    <Spinner side={100} />
  );
};

export default observer(LoginRegisterView);
