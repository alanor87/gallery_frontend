import { useSelector } from "react-redux";
import ImageCard from "../../components/ImageCard";

import {
  sortAndFilterImages,
  getError,
} from "../../redux/gallery/gallery-selectors";

export default function GalleryPage() {
  const imgArray = useSelector(sortAndFilterImages);
  const error = useSelector(getError);

  return (
    <section className="gallery-page-wrap">
      {!error && <div className="gallery-page">
        {imgArray.map((image) => (
          <ImageCard image={image} key={image.id} />
        ))}
      </div>}
      {error && <div className="error">Something went terribly wrong!</div>}
    </section>
  );
}
