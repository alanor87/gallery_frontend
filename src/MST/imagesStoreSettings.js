import axios from "axios";
import { types, flow } from "mobx-state-tree";

const ImageInfo = types.model({
  tags: types.optional(types.array(types.string), [""]),
  likes: types.optional(types.number, 0),
});

const Image = types
  .model({
    id: types.string,
    imageURL: types.optional(types.string, ""),
    imageInfo: types.optional(ImageInfo, {}),
  })
  .actions((self) => {
    const updateImageInfo = (newImageInfo) => {
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
    get getAllImages() {
      return self.images;
    },
    get getFilteredImages() {
      return self.images.filter((image) => image.imageInfo.tags.includes());
    },
  }))
  .actions((self) => {
    const fetchImages = flow(function* () {
      const response = yield axios.get("/images");
      self.images = response.data;
    });

    const editTags = flow(function* (imageId, newTagList) {
      const imageToEdit = self.images.find((image) => image.id === imageId);
      try {
        const newImageInfo = { ...imageToEdit.imageInfo, tags: newTagList };
        const updatedImageInfo = yield axios
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
export default ImagesStore;
