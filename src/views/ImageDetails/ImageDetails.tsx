import React from "react";
import { RouteComponentProps } from "react-router";
import store from "../../MST/store";
import styles from "./ImageDetails.module.scss";

type TParams = { id: string };

export default function ImageDetails({ match }: RouteComponentProps<TParams>) {
  const imageId = match.params.id;
  const imageToDisplay = store.imagesStoreSettings.getImageById(imageId);

  const imageURL = imageToDisplay?.imageURL;
  const imageInfo = imageToDisplay?.imageInfo;

  return (
    <div className={styles.imageDetails}>
      <div className={styles.largeImageWrapper}>
        <img src={imageURL} alt="" className={styles.largeImage} />
      </div>
      <ul className={styles.largeImageInfo}>
        <li className="large-image-info-item">
          Image ID : <i>{imageId}</i>
        </li>
        <li className="large-image-info-item">
          Tags : <i>{imageInfo}</i>
        </li>
      </ul>
    </div>
  );
}
