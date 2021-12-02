import { Button } from "../../elements";
import { Formik, Form } from "formik";
import Input from "../../elements/Input";
import store from "../../../MST/store";
import styles from "./ModalShare.module.scss";

const initialFormValues = {
  makePublic: false,
  usersShareList: [],
  directImageLink: "",
};

const shareOptionsSubmit = (values: any) => console.log(values);

const ModalShare = () => {
  return (
    <div className={styles.modalShareForm}>
      <h2>Sharing options</h2>
      <Formik initialValues={initialFormValues} onSubmit={shareOptionsSubmit}>
        <Form></Form>
      </Formik>

      <div className={styles.buttonWrapper}>
        <Button text="Accept" onClick={() => null} />
        <Button text="Cancel" onClick={() => null} />
      </div>
    </div>
  );
};

export default ModalShare;
