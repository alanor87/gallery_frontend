import { Formik, Form } from "formik";
import { NavLink } from "react-router-dom";
import Input from "../elements/Input";
import store from "../../MST/store";
import * as Yup from "yup";
import Button from "../elements/Button";
import RegisterFormInterface from "./types";
import styles from "./RegisterForm.module.scss";

const validationSchema = Yup.object({
  userName: Yup.string().required(),
  userEmail: Yup.string()
    .matches(/^[\w.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .required(),
  userPassword: Yup.string().min(6).required(),
});

const formInitialValues = {
  userName: "",
  userEmail: "",
  userPassword: "",
};

function RegisterForm() {
  const { userRegister } = store.userSettings;
  const formSubmitHandler = (values: RegisterFormInterface) => {
    console.log(values);
    userRegister(values);
  };
  return (
    <div className={styles.registerForm}>
      <h2>Register</h2>
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={formSubmitHandler}
      >
        <Form action="#" method="GET">
          <label className={styles.labelAuthorisation}>
            Name
            <Input fieldType="text" fieldName="userName" />
          </label>
          <label className={styles.labelAuthorisation}>
            E-mail
            <Input fieldType="text" fieldName="userEmail" />
          </label>
          <label className={styles.labelAuthorisation}>
            Password
            <Input fieldType="password" fieldName="userPassword" />
          </label>
          <div className={styles.btnWrapper}>
            <Button type="submit" text="Register" />
          </div>
          <NavLink to="/login" className="navLink">
            Login
          </NavLink>
        </Form>
      </Formik>
    </div>
  );
}

export default RegisterForm;
