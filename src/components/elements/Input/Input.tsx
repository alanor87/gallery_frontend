import { Field, FormikContextType, useFormikContext } from "formik";
import styles from "./Input.module.scss";

interface Props {
  className?: string;
  fieldName: string;
  fieldType: string;
  onClick?: () => void;
}

function Input({ className, fieldName, fieldType }: Props) {
  const { values, errors, touched } =
    useFormikContext<FormikContextType<any>>();
  const getFieldClassName = () => {
    return fieldName in values && fieldName in errors && fieldName in touched
      ? styles.input + " " + className + " " + styles.error
      : styles.input + " " + className;
  };

  return (
    <Field type={fieldType} name={fieldName} className={getFieldClassName()} />
  );
}

export default Input;
