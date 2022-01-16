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

  useEffect(() => {
    fetchImageById(modalImageId).then((image) => {
      setCurrentModalImage(image);
      console.log("currentModalImage : ", currentModalImage);
    });
  }, [modalImageId, fetchImageById]);

  return currentModalImage ? (
    <div className={styles.modalImage}>
      <div className={styles.imagePart}>
        <img src={currentModalImage?.imageURL} alt="dddf" />
      </div>
      <div className={styles.nonImagePart}>
        <TagList
          tags={currentModalImage.imageInfo.tags}
          isTagDeletable={false}
        />
      </div>
    </div>
  ) : (
    <Spinner side={50} />
  );
};

export default ModalImage;
