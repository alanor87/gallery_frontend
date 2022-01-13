import store from "../../MST/store";
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";
import styles from "./LoginRegisterView.module.scss";

interface Props {
  path: string;
}

const LoginRegisterView: React.FC<Props> = ({ path }) => {
  const backgroundImage = store.userSettings.userInterface.backgroundImage;
  return (
    <div
      className={styles.sectionLoginRegister}
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className={styles.backdropBlur}>
        {path === "/login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default LoginRegisterView;
