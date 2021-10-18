import { createPortal } from "react-dom";

const modalRoot: HTMLElement = document.querySelector("modal-root")!;

const ModalImage = () => {
  return createPortal(<div>Modal</div>, modalRoot);
};

export default ModalImage;
