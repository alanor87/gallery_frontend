import { observer } from "mobx-react-lite";
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";
import styles from "./LoginRegisterView.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  path: string;
}

const LoginRegisterView: React.FC<Props> = ({ path }) => {
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    if (!backgroundImage) fetchBg();
  }, [backgroundImage]);

  const fetchBg = async () => {
    const response = await axios.get(
      "http://localhost:3030/api/v1/public/getBackgroundImage"
    );
    console.log(response.data.body.backgroundImage);
    setBackgroundImage(response.data.body.backgroundImage);
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
  ) : null;
};

export default observer(LoginRegisterView);
