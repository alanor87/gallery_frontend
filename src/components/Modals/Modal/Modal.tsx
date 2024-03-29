import React, { useState, useEffect, lazy, Suspense } from "react";
import { observer } from "mobx-react-lite";
import { createPortal } from "react-dom";
import { Spinner } from "components/elements";
import store from "MST/store";
import styles from "./Modal.module.scss";

const ModalUpload = lazy(() => import("../ModalUpload"));
const ModalDelete = lazy(() => import("../ModalDelete"));
const ModalShare = lazy(() => import("../ModalShare"));
const ModalImage = lazy(() => import("../ModalImage"));
const ModalMenu = lazy(() => import("../ModalMenu"));

const modalRoot = document.querySelector("#modal-root")!;

interface Props {
  style?: any;
}

const Modal: React.FunctionComponent<Props> = () => {
  const {
    modalComponentType,
    modalIsOpened,
    setModalOpen,
    setModalComponentType,
  } = store.modalWindowsSettings;

  const [isLoading, setIsLoading] = useState(false);

  const modalBackdropClose = (event: any) => {
    if (isLoading) return;
    if (event.target === event.currentTarget || event.key === "Escape") {
      modalCloseHandle();
    }
  };

  const modalCloseHandle = () => {
    setModalOpen(false);
    setModalComponentType("none");
  };

  const getCurrentModalComponent = () => {
    switch (modalComponentType) {
      case "image":
        return <ModalImage />;
      case "delete":
        return (
          <ModalDelete
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            modalCloseHandle={modalCloseHandle}
          />
        );
      case "share":
        return (
          <ModalShare
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            modalCloseHandle={modalCloseHandle}
          />
        );
      case "upload":
        return (
          <ModalUpload
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            modalCloseHandle={modalCloseHandle}
          />
        );
      case "menu":
        return <ModalMenu modalCloseHandle={modalCloseHandle} />;
      case "none":
        return null;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (modalIsOpened && !isLoading)
      window.addEventListener("keydown", modalBackdropClose);
    return () => {
      window.removeEventListener("keydown", modalBackdropClose);
    };
  }, [modalIsOpened, isLoading]);

  return createPortal(
    <div
      className={
        modalIsOpened ? "modalBackdrop " + styles.isOpened : "modalBackdrop"
      }
      onClick={modalBackdropClose}
    >
      <Suspense fallback={<Spinner side={50} />}>
        {" "}
        {getCurrentModalComponent()}
      </Suspense>
    </div>,
    modalRoot
  );
};

export default observer(Modal);
