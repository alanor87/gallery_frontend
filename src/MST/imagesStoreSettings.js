import axios from "axios";
import { types, flow } from "mobx-state-tree";

const ImageInfo = types.model({
    tags: types.optional(types.array(types.string), ['']),
    likes: types.optional(types.number, 0)
})

const Image = types.model({
    id: types.string,
    imageURL: types.optional(types.string, ''),
    imageInfo: types.optional(ImageInfo, {}),
})

const ImagesStore = types.model({
    images: types.array(Image),
    imagesPerPage: types.optional(types.number, 10),
})
    .views(self => ({
        get getAllImages() {
            return self.images;
        }
    }))
    .actions(self => {
        const fetchImages = flow(function* () {
            const response = yield axios.get('/images')
            self.images = response.data;
        });

        const editTags = flow(function* (imageId, newTagList) {
            const imageToEdit = self.images.find(image => image.id === imageId);
            const newImageInfo = { ...imageToEdit.imageInfo, tags: newTagList }
            yield axios.put(`/images/${imageId}`, { ...imageToEdit, imageInfo: newImageInfo });
            // fetchImages();
        })
        return { fetchImages, editTags }
    })
export default ImagesStore;