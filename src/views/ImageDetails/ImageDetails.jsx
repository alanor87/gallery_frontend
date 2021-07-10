import React from "react";
import { useSelector } from "react-redux";
import { getImgArray } from "../../redux/gallery/gallery-selectors";

export default function ImageDetails({ match }) {
  const imgArray = useSelector(getImgArray);
  if (!imgArray.length) return <p>Oops! Something went terribly wrong!</p>;
  const imgId = Number(match.params.id);
  const imageDetails = imgArray.find((image) => image.id === imgId);
  const { largeImageURL, comments, downloads, id, user, tags, views } =
    imageDetails;

  return (
    <div className="image-details">
      <div className="large-image-wrapper">
        <img src={largeImageURL} alt="" className="large-image" />
      </div>
      <ul className="large-image-info">
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
