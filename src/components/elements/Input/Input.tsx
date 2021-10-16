import { Field, useFormikContext } from "formik";
import styles from "./Input.module.scss";

interface Props {
  fieldName: string;
  fieldType: string;
  onClick?: () => void;
}

function Input({ fieldName, fieldType }: Props) {
  const { values, errors, touched } = useFormikContext<any>();

  const getFieldClassName = () => {
    return fieldName in values && fieldName in errors && fieldName in touched
      ? styles.input + " " + styles.error
      : styles.input;
  };

  return (
    <Field type={fieldType} name={fieldName} className={getFieldClassName()} />
  );
}

export default Input;
