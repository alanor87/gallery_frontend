import { useEffect } from "react";
import { createPortal } from "react-dom";
import store from "../../../MST/store";
import styles from "./styles.module.scss";

const modalRoot = document.querySelector("#modal-root");

// function Modal({ component, ...props }) {
//   const ModalComponent = component;

//   useEffect(() => {
//     window.addEventListener("keydown", modalBackdropClose);
//     return function cleanup() {
//       window.removeEventListener("keydown", modalBackdropClose);
//     };
//   }, []);

//   const modalBackdropClose = (event) => {
//     if (event.target === event.currentTarget || event.key === "Escape")
//       store.interfaceSettings.toggleAuthModal();
//   };

//   return createPortal(
//     <div className={styles.modalBackdrop} onClick={modalBackdropClose}>
//       <ModalComponent {...props} />
//     </div>,
//     modalRoot
//   );
// }

// export default Modal;
