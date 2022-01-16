import { useState, useEffect } from "react";
import TagList from "components/TagList";
import { Spinner } from "components/elements";
import store from "../../../MST/store";
import { ImageType } from "MST/imagesStoreSettings";
import styles from "./styles.module.scss";

const ModalImage = () => {
  const { fetchImageById } = store.imagesStoreSettings;
  const { modalImageId } = store.modalWindowsSettings;

  const [currentModalImage, setCurrentModalImage] = useState<ImageType>();
  const [imageIsLoaded, setImageIsLoaded] = useState(false);

  useEffect(() => {
    fetchImageById(modalImageId).then((image) => {
      setCurrentModalImage(image);
    });
  }, [modalImageId, fetchImageById]);

  const onImageLoad = (e: any) => {
    console.log("event : ", e);
    setImageIsLoaded(true);
  };

  return currentModalImage ? (
    <div className={styles.modalImage}>
      <div className={styles.imagePart}>
        {!imageIsLoaded && <Spinner side={50} />}
        <img
          src={currentModalImage?.imageURL}
          alt={"God save the queen!"}
          onLoad={onImageLoad}
          style={{ visibility: imageIsLoaded ? "visible" : "hidden" }}
        />
      </div>
      <div className={styles.nonImagePart}>
        <TagList
          tags={currentModalImage.imageInfo.tags}
          isTagDeletable={false}
        />
      </div>
    </div>
  ) : null;
};

export default ModalImage;
