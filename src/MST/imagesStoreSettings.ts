import axios from "axios";
import {
  types,
  flow,
  Instance,
  applySnapshot,
  destroy,
  getSnapshot,
} from "mobx-state-tree";
import { popupNotice } from "../utils/popupNotice";

const initialImageStoreSettings = {
  images: [],
  imagesPerPage: 10,
};

const ImageInfo = types
  .model({
    tags: types.optional(types.array(types.string), []),
    likes: types.optional(types.array(types.string), []),
    isLoading: types.optional(types.boolean, false),
    isSelected: types.optional(types.boolean, false),
    error: types.optional(types.boolean, false),
  })
  .actions((self) => {
    const setIsLoading = (value: boolean) => {
      self.isLoading = value;
    };
    return { setIsLoading };
  });

export const Image = types
  .model({
    _id: types.string,
    imageHostingId: types.string,
    imageURL: types.optional(types.string, ""),
    smallImageURL: types.optional(types.string, ""),
    imageInfo: types.optional(ImageInfo, {}),
    isPublic: types.optional(types.boolean, true),
    belongsTo: types.optional(types.string, ""),
    isSelected: types.optional(types.boolean, false),
  })
  .actions((self) => {
    const updateImageInfo = (newImageInfo: ImageInfoType) => {
      self.imageInfo = newImageInfo;
    };
    const toggleSelectImage = (value: boolean) => {
      self.isSelected = value;
    };
    return { updateImageInfo, toggleSelectImage };
  });

const ImagesStore = types
  .model({
    images: types.array(Image),
    groupSelectMode: types.optional(types.boolean, false),
    selectedImagesId: types.optional(types.array(types.string), []),
  })
  .views((self) => ({
    get getAllImages(): ImageType[] {
      return self.images;
    },
    get getFilteredImages(): ImageType[] {
      return self.images.filter((image) => image.imageInfo.tags.includes(""));
    },
  }))
  .actions((self) => {
    const getImageById = (id: string) =>
      self.images.find((image) => image._id === id);

    const editImageInfo = flow(function* (_id, newImageInfo) {
      try {
        const imageToEdit: ImageType = getImageById(_id)!;
        const updatedImage: any = {
          ...imageToEdit,
          imageInfo: { ...imageToEdit.imageInfo, ...newImageInfo },
        };
        delete updatedImage.isSelected;
        const updatedImageFromServer = yield axios
          .put(`/images/${_id}`, updatedImage)
          .then((res) => res.data.body);
        imageToEdit.updateImageInfo(updatedImageFromServer.imageInfo);
      } catch (error: any) {
        popupNotice(`Error while updating image info.
        ${error}`);
      }
    });

    const uploadImage = flow(function* (imagesToUpload) {
      try {
        const uploadedImages = yield axios.post(
          "/images/upload",
          imagesToUpload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        uploadedImages.data.newImages.forEach((image: ImageType) => {
          self.images.push(image);
        });
      } catch (error) {
        popupNotice(`Error while uploading images.
           ${error}`);
      }
    });

    const deleteImage = flow(function* (imageId, imageHostingId) {
      try {
        const imageToDelete: ImageType = self.images.find(
          (image) => image._id === imageId
        )!;
        destroy(imageToDelete);
        yield axios.delete(`/images/${imageId}/${imageHostingId}`);
      } catch (error) {
        popupNotice(`Error while deleting image.
           ${error}`);
      }
    });

    const deleteMultipleImages = flow(function* () {
      try {
        yield axios.post("/images/deleteMultiple", {
          imagesIdToDelete: self.selectedImagesId,
        });
        popupNotice(`Images deleted!`);
      } catch (error) {
        popupNotice(`Error while deleting images.
           ${error}`);
      }
    });

    const groupSelectModeToggle = () => {
      self.groupSelectMode = !self.groupSelectMode;
    };

    const selectedListChange = (imageId: string) => {
      const indexInList = self.selectedImagesId.findIndex(
        (id) => id === imageId
      );
      if (indexInList === -1) {
        self.selectedImagesId.push(imageId);
      } else {
        self.selectedImagesId.forEach((id, index) => {
          if (id === imageId) self.selectedImagesId.splice(index, 1);
        });
      }
      console.log(getSnapshot(self.selectedImagesId));
    };

    const toggleSelectAllImages = () => {
      if (self.images.length === self.selectedImagesId.length) {
        self.images.forEach((image) => {
          image.isSelected = false;
        });
        applySnapshot(self.selectedImagesId, []);
        console.log(getSnapshot(self.selectedImagesId));
        return;
      }
      self.images.forEach((image) => {
        image.isSelected = true;
      });
      applySnapshot(
        self.selectedImagesId,
        self.images.map((image) => image._id)
      );
      console.log(getSnapshot(self.selectedImagesId));
    };

    const clearSelectedList = () => {
      applySnapshot(self.selectedImagesId, []);
      console.log(getSnapshot(self.selectedImagesId));
    };

    const purgeStorage = () => {
      applySnapshot(self, initialImageStoreSettings);
    };

    return {
      getImageById,
      editImageInfo,
      uploadImage,
      deleteImage,
      deleteMultipleImages,
      groupSelectModeToggle,
      selectedListChange,
      toggleSelectAllImages,
      clearSelectedList,
      purgeStorage,
    };
  });

export interface ImageInfoType extends Instance<typeof ImageInfo> {}
export interface ImageType extends Instance<typeof Image> {}
export interface ImagesStoreType extends Instance<typeof ImagesStore> {}
export default ImagesStore;
