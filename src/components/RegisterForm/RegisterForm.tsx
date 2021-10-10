import { Formik, Form, Field } from "formik";
import { NavLink } from "react-router-dom";
import store from "../../MST/store";
import * as Yup from "yup";
import Button from "../elements/Button";
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
  const { registerUser } = store.userSettings;
  const formSubmitHandler = (values: any) => {
    console.log(values);
    registerUser(values);
  };
  return (
    <div className={styles.registerForm}>
      <h2>Register</h2>
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={formSubmitHandler}
      >
        {({ values, errors }) => {
          const className = (fieldName: string, className: string) => {
            return fieldName in values && fieldName in errors
              ? className + " " + styles.error
              : className;
          };

          return (
            <Form action="#" method="GET">
              <label className={styles.labelAuthorisation}>
                Name
                <Field
                  type="text"
                  name="userName"
                  className={className("name", styles.labelAuthorisationInput)}
                />
              </label>
              <label className={styles.labelAuthorisation}>
                E-mail
                <Field
                  type="text"
                  name="userEmail"
                  className={className("email", styles.labelAuthorisationInput)}
                />
              </label>
              <label className={styles.labelAuthorisation}>
                Password
                <Field
                  type="password"
                  name="userPassword"
                  className={className(
                    "password",
                    styles.labelAuthorisationInput
                  )}
                />
              </label>
              <div className={styles.btnWrapper}>
                <Button type="submit" text="Register" />
              </div>
              <NavLink to="/login" className="navLink">
                Login
              </NavLink>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default RegisterForm;
