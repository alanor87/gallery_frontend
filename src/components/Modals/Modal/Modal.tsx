import React, { useState, useEffect, useCallback } from "react";
import ModalUpload from "../ModalUpload";
import ModalDelete from "../ModalDelete";
import ModalShare from "../ModalShare";
import ModalImage from "../ModalImage";
import { observer } from "mobx-react-lite";
import { createPortal } from "react-dom";
import store from "../../../MST/store";
import styles from "./Modal.module.scss";

const modalRoot = document.querySelector("#modal-root")!;

interface Props {
  style?: any;
}

const Modal: React.FunctionComponent<Props> = ({ style }) => {
  const {
    modalComponentType,
    modalIsOpened,
    setModalOpen,
    setModalComponentType,
  } = store.modalWindowsSettings;

  const [isLoading, setIsLoading] = useState(false);
  const modalBackdropClose = useCallback(
    (event: any) => {
      if (event.target === event.currentTarget || event.key === "Escape") {
        setModalOpen(false);
        setModalComponentType("none");
      }
    },
    [setModalOpen, setModalComponentType]
  );

  const getCurrentModalComponent = () => {
    switch (modalComponentType) {
      case "image":
        return <ModalImage />;
      case "delete":
        return (
          <ModalDelete isLoading={isLoading} setIsLoading={setIsLoading} />
        );
      case "share":
        return <ModalShare isLoading={isLoading} setIsLoading={setIsLoading} />;
      case "upload":
        return (
          <ModalUpload isLoading={isLoading} setIsLoading={setIsLoading} />
        );
      case "none":
        return null;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (modalIsOpened && !isLoading)
      window.addEventListener("keydown", modalBackdropClose);
    return function cleanup() {
      window.removeEventListener("keydown", modalBackdropClose);
    };
  }, [modalIsOpened, modalBackdropClose, isLoading]);

  return createPortal(
    <div
      className={
        modalIsOpened
          ? styles.modalBackdrop + " " + styles.isOpened
          : styles.modalBackdrop
      }
      onClick={modalBackdropClose}
      style={style}
    >
      {getCurrentModalComponent()}
    </div>,
    modalRoot
  );
};

export default observer(Modal);
