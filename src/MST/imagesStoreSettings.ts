import axios from "axios";
import { types, flow, Instance, applySnapshot } from "mobx-state-tree";
import { ImageOpenedToUserEntry } from "types/common";
import { popupNotice } from "../utils/popupNotice";

export interface NewImageInfo {
  _id: string;
  imageInfo: any;
}

type GalleryType = "userGallery" | "sharedGallery" | "publicGallery";
interface InitialImageStoreSettings {
  galleryType: GalleryType;
  images: ImageType[];
  imagesPerPage: number;
}

const initialImageStoreSettings: InitialImageStoreSettings = {
  galleryType: "userGallery",
  images: [],
  imagesPerPage: 10,
};

const ImageInfo = types
  .model({
    tags: types.optional(types.array(types.string), []),
    likes: types.optional(types.array(types.string), []),
    isLoading: types.optional(types.boolean, false),
    isSelected: types.optional(types.boolean, false),
    isPublic: types.optional(types.boolean, false),
    belongsTo: types.optional(types.string, ""),
    openedTo: types.optional(types.array(types.string), []),
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
    galleryType: types.optional(
      types.enumeration(["userGallery", "sharedGallery", "publicGallery"]),
      "userGallery"
    ),
    images: types.array(Image),
    groupSelectMode: types.optional(types.boolean, false),
    selectedImages: types.optional(
      types.array(
        types.model({
          selectedId: types.string,
          imageHostingId: types.string,
          isPublic: types.optional(types.boolean, false),
        })
      ),
      []
    ),
  })
  .views((self) => ({
    get getUserImages(): ImageType[] {
      return self.images;
    },
    get getFilteredImages(): ImageType[] {
      return self.images.filter((image) => image.imageInfo.tags.includes(""));
    },
  }))
  .actions((self) => {
    const getImageById = (id: string) =>
      self.images.find((image) => image._id === id);

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

    const editImagesInfo = flow(function* (updatedImagesInfo: NewImageInfo[]) {
      try {
        const updatedImagesToSend = updatedImagesInfo.map(
          (updatedImage: NewImageInfo) => {
            const imageToEdit: ImageType = getImageById(updatedImage._id)!;
            const updatedImageInfo: NewImageInfo = {
              _id: updatedImage._id,
              imageInfo: {
                ...imageToEdit.imageInfo,
                ...updatedImage.imageInfo,
              },
            };
            return updatedImageInfo;
          }
        );
        const updatedImagesFromServer: NewImageInfo[] = yield axios
          .put(`/images/updateImages`, { imagesToUpdate: updatedImagesToSend })
          .then((res) => res.data.body.updatedImages);
        updatedImagesFromServer.forEach((updatedImage) => {
          const imageToEdit: ImageType = getImageById(updatedImage._id)!;
          imageToEdit.updateImageInfo(updatedImage.imageInfo);
        });
      } catch (error: any) {
        popupNotice(`Error while updating image info.
        ${error}`);
      }
    });

    const deleteImages = flow(function* () {
      try {
        if (!self.selectedImages.length) return;
        const response = yield axios.post("/images/deleteImages", {
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

    const imagesMultiuserShare = flow(function* (
      imagesIdList: string[],
      usersList: ImageOpenedToUserEntry[]
    ) {
      try {
        yield axios.post("images/multiuserShare", {
          imagesIdList,
          usersList,
        });
      } catch (error) {
        popupNotice(`Error while sharing image group.
        ${error}`);
      }
    });

    const groupSelectModeToggle = () => {
      self.groupSelectMode = !self.groupSelectMode;
    };

    const selectedListChange = (
      selectedId: string,
      imageHostingId = "",
      isPublic = false
    ) => {
      const indexInList = self.selectedImages.findIndex(
        (image) => image.selectedId === selectedId
      );
      if (indexInList === -1) {
        self.selectedImages.push({ selectedId, imageHostingId, isPublic });
      } else {
        self.selectedImages.forEach((image, index) => {
          if (image.selectedId === selectedId)
            self.selectedImages.splice(index, 1);
        });
      }
    };

    const toggleSelectAllImages = () => {
      if (self.images.length === self.selectedImages.length) {
        deselectAllImages();
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
          isPublic: image.imageInfo.isPublic,
        }))
      );
    };

    const deselectAllImages = () => {
      self.images.forEach((image) => {
        image.isSelected = false;
      });
      clearSelectedList();
    };

    const clearSelectedList = () => {
      applySnapshot(self.selectedImages, []);
    };

    const purgeStorage = () => {
      applySnapshot(self, initialImageStoreSettings);
    };

    return {
      getImageById,
      editImagesInfo,
      uploadImages,
      deleteImages,
      groupSelectModeToggle,
      imagesMultiuserShare,
      selectedListChange,
      deselectAllImages,
      toggleSelectAllImages,
      clearSelectedList,
      purgeStorage,
    };
  });

export interface ImageInfoType extends Instance<typeof ImageInfo> {}
export interface ImageType extends Instance<typeof Image> {}
export interface ImagesStoreType extends Instance<typeof ImagesStore> {}
export default ImagesStore;
