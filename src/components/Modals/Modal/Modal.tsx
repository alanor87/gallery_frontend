import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.scss";

const modalRoot = document.querySelector("#modal-root")!;

interface Props {
  component: React.FunctionComponent;
  closeModalHandler: () => void;
  style?: any;
}

const Modal: React.FunctionComponent<Props> = ({
  component,
  closeModalHandler,
  style,
  ...props
}) => {
  const ModalComponent = component;

  useEffect(() => {
    window.addEventListener("keydown", modalBackdropClose);
    return function cleanup() {
      window.removeEventListener("keydown", modalBackdropClose);
    };
  }, []);

  const modalBackdropClose = (event: any) => {
    if (event.target === event.currentTarget || event.key === "Escape")
      closeModalHandler();
  };

  return createPortal(
    <div
      className={styles.modalBackdrop}
      onClick={modalBackdropClose}
      style={style}
    >
      <ModalComponent {...props} />
    </div>,
    modalRoot
  );
};

export default Modal;
