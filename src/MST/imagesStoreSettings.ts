import axios from "axios";
import { types, flow, Instance, applySnapshot, destroy } from "mobx-state-tree";
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
  })
  .actions((self) => {
    const updateImageInfo = (newImageInfo: ImageInfoType) => {
      console.log("update Image info");
      self.imageInfo = newImageInfo;
    };

    return { updateImageInfo };
  });

const ImagesStore = types
  .model({
    images: types.array(Image),
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
        const updatedImage = {
          ...imageToEdit,
          imageInfo: { ...imageToEdit.imageInfo, ...newImageInfo },
        };
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

    const purgeStorage = () => {
      applySnapshot(self, initialImageStoreSettings);
    };

    return {
      getImageById,
      editImageInfo,
      uploadImage,
      deleteImage,
      purgeStorage,
    };
  });

export interface ImageInfoType extends Instance<typeof ImageInfo> {}
export interface ImageType extends Instance<typeof Image> {}
export interface ImagesStoreType extends Instance<typeof ImagesStore> {}
export default ImagesStore;
