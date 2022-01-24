import { types } from "mobx-state-tree";
import { modalWindowTypes } from "types/interface";

const modalSettings = types
  .model({
    modalComponentType: types.optional(
      types.enumeration(["image", "delete", "share", "upload", "none"]),
      "none"
    ),
    modalIsOpened: types.optional(types.boolean, false),
    modalImageId: types.optional(types.string, ""),
  })
  .actions((self) => {
    const setModalOpen = (value: boolean) => {
      self.modalIsOpened = value;
    };
    const setModalComponentType = (value: modalWindowTypes) => {
      self.modalComponentType = value;
    };
    const setModalImageId = (value: string) => {
      self.modalImageId = value;
    };
    return {
      setModalOpen,
      setModalComponentType,
      setModalImageId,
    };
  });

export default modalSettings;
