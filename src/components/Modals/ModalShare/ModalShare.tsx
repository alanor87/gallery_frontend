import { Button } from "../../elements";
import { Formik, Form } from "formik";
import { Checkbox, Input } from "../../elements";
import store from "../../../MST/store";
import styles from "./ModalShare.module.scss";

const initialFormValues = {
  makePublic: false,
  usersShareList: [],
  directImageLink: "",
};

const ModalShare = () => {
  const { setModalComponentType, setModalOpen } = store.modalWindowsSettings;
  const { selectedImages, groupSelectMode } = store.imagesStoreSettings;

  const acceptShareHandler = () => {
    setModalComponentType("none");
    setModalOpen(false);
  };

  const cancelHandler = () => {
    setModalComponentType("none");
    setModalOpen(false);
  };

  return (
    <div className={styles.modalShareForm}>
      <h2>Sharing options</h2>
      <Formik initialValues={initialFormValues} onSubmit={acceptShareHandler}>
        <Form>
          <div className={styles.optionsWrapper}>
            <div className={styles.option}>
              <Checkbox
                className={styles.shareModalCheckbox}
                isChecked={groupSelectMode ? false : selectedImages[0].isPublic}
              />
              Make the image public.
            </div>
          </div>
          <div className={styles.buttonWrapper}>
            <Button text="Accept" type="submit" />
            <Button text="Cancel" onClick={cancelHandler} />
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default ModalShare;
