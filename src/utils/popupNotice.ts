import * as PNotify from "@pnotify/core";

PNotify.defaultStack.close(true);
PNotify.defaultStack.maxOpen = Infinity;
PNotify.defaultStack.modal = false;

const defaultStack = new PNotify.Stack({
  dir1: "down",
  dir2: "left",
  firstpos1: 75,
  firstpos2: 25,
  spacing1: 20,
  push: "bottom",
  modal: false,
  maxOpen: Infinity,
  context: document.body,
});

const popupNotice = (text: string) =>
  PNotify.notice({
    text,
    styling: "custom",
    width: "300px",
    icon: false,
    stack: defaultStack,
    delay: 4000,
  });
export { popupNotice };
