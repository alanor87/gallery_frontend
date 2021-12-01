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
    isPublic: types.optional(types.boolean, false),
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
    selectedImages: types.optional(
      types.array(
        types.model({ selectedId: types.string, imageHostingId: types.string })
      ),
      []
    ),
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

    const uploadImages = flow(function* (imagesToUpload) {
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
        yield axios.delete(`/images/${imageId}/${imageHostingId}`);
        const imageToDelete: ImageType = self.images.find(
          (image) => image._id === imageId
        )!;
        destroy(imageToDelete);
      } catch (error) {
        popupNotice(`Error while deleting image.
           ${error}`);
      }
    });

    const deleteMultipleImages = flow(function* () {
      try {
        if (!self.selectedImages.length) return;
        const response = yield axios.post("/images/deleteMultiple", {
          imagesToDelete: self.selectedImages,
        });
        const filteredImages = self.images.filter((image) => {
          return response.data.newImagesList.includes(image._id);
        });
        applySnapshot(self.images, filteredImages);
        applySnapshot(self.selectedImages, []);
        popupNotice(`Images deleted!`);
      } catch (error) {
        popupNotice(`Error while deleting images.
           ${error}`);
      }
    });

    const groupSelectModeToggle = () => {
      self.groupSelectMode = !self.groupSelectMode;
    };

    const selectedListChange = (selectedId: string, imageHostingId: string) => {
      const indexInList = self.selectedImages.findIndex(
        (image) => image.selectedId === selectedId
      );
      if (indexInList === -1) {
        self.selectedImages.push({ selectedId, imageHostingId });
      } else {
        self.selectedImages.forEach((image, index) => {
          if (image.selectedId === selectedId)
            self.selectedImages.splice(index, 1);
        });
      }
      console.log(getSnapshot(self.selectedImages));
    };

    const toggleSelectAllImages = () => {
      if (self.images.length === self.selectedImages.length) {
        self.images.forEach((image) => {
          image.isSelected = false;
        });
        clearSelectedList();
        return;
      }
      self.images.forEach((image) => {
        image.isSelected = true;
      });
      applySnapshot(
        self.selectedImages,
        self.images.map((image) => ({
          selectedId: image._id,
          imageHostingId: image.imageHostingId,
        }))
      );
      console.log(getSnapshot(self.selectedImages));
    };

    const clearSelectedList = () => {
      applySnapshot(self.selectedImages, []);
      console.log(getSnapshot(self.selectedImages));
    };

    const purgeStorage = () => {
      applySnapshot(self, initialImageStoreSettings);
    };

    return {
      getImageById,
      editImageInfo,
      uploadImages,
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
