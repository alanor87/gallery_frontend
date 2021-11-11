import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { createPortal } from "react-dom";
import store from "../../../MST/store";
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
  const { uploadModalIsOpen, imageModalIsOpen } = store.modalWindowsSettings;

  const modalBackdropClose = (event: any) => {
    if (event.target === event.currentTarget || event.key === "Escape")
      closeModalHandler();
  };

  useEffect(() => {
    if (uploadModalIsOpen || imageModalIsOpen)
      window.addEventListener("keydown", modalBackdropClose);
    return function cleanup() {
      window.removeEventListener("keydown", modalBackdropClose);
    };
  }, [uploadModalIsOpen, imageModalIsOpen]);

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

export default observer(Modal);
