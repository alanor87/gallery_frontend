import { Formik, Form } from "formik";
import { NavLink } from "react-router-dom";
import Input from "components/elements/Input";
import store from "MST/store";
import * as Yup from "yup";
import { Button } from "components/elements";
import { LoginFormInterface } from "types/user";
import styles from "./LoginForm.module.scss";

const validationSchema = Yup.object({
  userEmail: Yup.string()
    .matches(/^[\w.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .required(),
  userPassword: Yup.string().min(6).required(),
});

const formInitialValues: LoginFormInterface = {
  userEmail: "",
  userPassword: "",
};

function LoginForm() {
  const { loginInit } = store;
  const formSubmitHandler = (values: LoginFormInterface) => {
    loginInit(values);
  };

  return (
    <div className={styles.authForm}>
      <h2>Login</h2>
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        validateOnBlur={false}
        onSubmit={formSubmitHandler}
      >
        <Form>
          <label className={styles.labelAuthorisation}>
            E-mail
            <Input
              className={styles.labelAuthorisationInput}
              fieldType="text"
              fieldName="userEmail"
            />
          </label>
          <label className={styles.labelAuthorisation}>
            Password
            <Input
              className={styles.labelAuthorisationInput}
              fieldType="password"
              fieldName="userPassword"
            />
          </label>
          <div className={styles.btnWrapper}>
            <Button type="submit" text="Login" />
          </div>
        </Form>
      </Formik>
      <div className={styles.bottomLinksWrapper}>
        <NavLink to="/register" className="navLink">
          Register
        </NavLink>
        <NavLink to="/publicGallery" className="navLink">
          To public gallery
        </NavLink>
      </div>
    </div>
  );
}

export default LoginForm;
