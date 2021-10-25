import { Formik, Form } from "formik";
import { NavLink } from "react-router-dom";
import Input from "../elements/Input";
import store from "../../MST/store";
import * as Yup from "yup";
import Button from "../elements/Button";
import styles from "./LoginForm.module.scss";
import { LoginFormInterface } from "../../types/user";

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
    console.log(values);
    loginInit(values);
  };

  return (
    <div className={styles.loginForm}>
      <h2>Login</h2>
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        validateOnBlur={false}
        onSubmit={formSubmitHandler}
      >
        <Form action="#" method="GET">
          <label className={styles.labelAuthorisation}>
            E-mail
            <Input fieldType="text" fieldName="userEmail" />
          </label>
          <label className={styles.labelAuthorisation}>
            Password
            <Input fieldType="password" fieldName="userPassword" />
          </label>
          <div className={styles.btnWrapper}>
            <Button type="submit" text="Login" />
          </div>
          <NavLink to="/register" className="navLink">
            Register
          </NavLink>
        </Form>
      </Formik>
    </div>
  );
}

export default LoginForm;
