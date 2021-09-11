import React from "react";
import { useSelector } from "react-redux";
import { getImgArray } from "../../redux/gallery/gallery-selectors";
import styles from "./ImageDetails.module.scss";

export default function ImageDetails({ match }) {
  const imgArray = useSelector(getImgArray);
  if (!imgArray.length) return <p>Oops! Something went terribly wrong!</p>;
  const imgId = Number(match.params.id);
  const imageDetails = imgArray.find((image) => image.id === imgId);

  const { largeImageURL, comments, downloads, id, user, tags, views } =
    imageDetails;

  return (
    <div className={styles.imageDetails}>
      <div className={styles.largeImageWrapper}>
        <img src={largeImageURL} alt="" className={styles.largeImage} />
      </div>
      <ul className={styles.largeImageInfo}>
        <li className="large-image-info-item">
          Image ID : <i>{id}</i>
        </li>
        <li className="large-image-info-item">
          Author : <i>{user}</i>
        </li>
        <li className="large-image-info-item">
          Tags : <i>{tags}</i>
        </li>
        <li className="large-image-info-item">
          Comments : <i>{comments}</i>
        </li>
        <li className="large-image-info-item">
          Downloads : <i>{downloads}</i>
        </li>
        <li className="large-image-info-item">
          Views : <i>{views}</i>
        </li>
      </ul>
    </div>
  );
}
