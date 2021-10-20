import { useEffect } from "react";
import { createPortal } from "react-dom";

const ModalImage = () => {
  const modalDivRef = document.querySelector("#modal-root");
  return modalDivRef && createPortal(<div>Modal</div>, modalDivRef);
};

export default ModalImage;
