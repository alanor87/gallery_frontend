import axios from "axios";
import { types, flow, Instance } from "mobx-state-tree";

const ImageInfo = types
  .model({
    tags: types.optional(types.array(types.string), []),
    likes: types.optional(types.number, 0),
    isLoading: types.optional(types.boolean, false),
    error: types.optional(types.boolean, false),
  })
  .actions((self) => {
    const setIsLoading = (value: boolean) => {
      self.isLoading = value;
    };
    return { setIsLoading };
  });

const Image = types
  .model({
    id: types.string,
    imageURL: types.optional(types.string, ""),
    imageInfo: types.optional(ImageInfo, {}),
  })
  .actions((self) => {
    const updateImageInfo = (newImageInfo: ImageInfoType) => {
      self.imageInfo = newImageInfo;
    };
    return { updateImageInfo };
  });

const ImagesStore = types
  .model({
    images: types.array(Image),
    imagesPerPage: types.optional(types.number, 10),
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
    const fetchImages = flow(function* () {
      const response = yield axios.get("/images");
      self.images = response.data;
    });

    const editTags = flow(function* (imageId: string, newTagList: string[]) {
      const imageToEdit: any = self.images.find(
        (image: ImageType) => image.id === imageId
      );
      try {
        const newImageInfo = {
          ...imageToEdit.imageInfo,
          tags: newTagList,
        };
        const updatedImageInfo: ImageInfoType = yield axios
          .put(`/images/${imageId}`, {
            ...imageToEdit,
            imageInfo: newImageInfo,
          })
          .then((res) => res.data.imageInfo);
        imageToEdit.updateImageInfo(updatedImageInfo);
        imageToEdit.imageInfo.setIsLoading(false);
      } catch (error) {
        imageToEdit.imageInfo.error = true;
      }
    });
    return { fetchImages, editTags };
  });

export interface ImageInfoType extends Instance<typeof ImageInfo> {}
export interface ImageType extends Instance<typeof Image> {}
export interface ImagesStoreType extends Instance<typeof ImagesStore> {}
export default ImagesStore;
