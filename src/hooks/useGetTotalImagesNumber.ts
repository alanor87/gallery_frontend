import store from "MST/store";

const useGetTotalImagesNumber = () => {
  const { galleryMode } = store.imagesStoreSettings;
  const { userOwnedImages, userOpenedToImages } = store.userSettings;
  const { publicImagesList } = store.publicSettings;

  let imagesNumber;
  switch (galleryMode) {
    case "userGallery": {
      imagesNumber = userOwnedImages.length;
      break;
    }
    case "sharedGallery": {
      imagesNumber = userOpenedToImages.length;
      break;
    }
    case "publicGallery": {
      imagesNumber = publicImagesList.length;
      break;
    }
  }
  return imagesNumber;
};

export default useGetTotalImagesNumber;
