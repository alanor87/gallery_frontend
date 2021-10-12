import { Formik, Form } from "formik";
import { NavLink } from "react-router-dom";
import Input from "../elements/Input";
import * as Yup from "yup";
import Button from "../elements/Button";
import styles from "./LoginForm.module.scss";

interface LoginFormInterface {
  userEmail: string;
  userPassword: string;
}

const validationSchema = Yup.object({
  userEmail: Yup.string()
    .matches(/^[\w.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .required(),
  userPassword: Yup.string().min(6).required(),
});

const formInitialValues = {
  userEmail: "",
  userPassword: "",
};

function LoginForm() {
  const formSubmitHandler = (values: LoginFormInterface) => {};

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
