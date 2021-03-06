import { Formik, Form } from "formik";
import Input from "components/elements/Input";
import { NavLink } from "react-router-dom";
import store from "MST/store";
import * as Yup from "yup";
import { Button } from "components/elements";
import { RegisterFormInterface } from "types/user";
import styles from "./RegisterForm.module.scss";

const validationSchema = Yup.object({
  userName: Yup.string().required(),
  userEmail: Yup.string()
    .matches(/^[\w.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .required(),
  userPassword: Yup.string().min(6).required(),
});

const formInitialValues: RegisterFormInterface = {
  userName: "",
  userEmail: "",
  userPassword: "",
};

function RegisterForm() {
  const formSubmitHandler = (values: RegisterFormInterface) => {
    const { registerInit } = store;
    registerInit(values);
  };
  return (
    <div className={styles.authForm}>
      <h2>Register</h2>
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={formSubmitHandler}
      >
        <Form action="#" method="GET">
          <label className={styles.labelAuthorisation}>
            Name
            <Input
              fieldType="text"
              fieldName="userName"
              className={styles.labelAuthorisationInput}
            />
          </label>
          <label className={styles.labelAuthorisation}>
            E-mail
            <Input
              fieldType="text"
              fieldName="userEmail"
              className={styles.labelAuthorisationInput}
            />
          </label>
          <label className={styles.labelAuthorisation}>
            Password
            <Input
              fieldType="password"
              fieldName="userPassword"
              className={styles.labelAuthorisationInput}
            />
          </label>
          <div className={styles.btnWrapper}>
            <Button type="submit" text="Register" />
          </div>
        </Form>
      </Formik>
      <div className={styles.bottomLinksWrapper}>
        {" "}
        <NavLink to="/login" className="navLink">
          Login
        </NavLink>
        <NavLink to="/publicGallery" className="navLink">
          To public gallery
        </NavLink>
      </div>
    </div>
  );
}

export default RegisterForm;
