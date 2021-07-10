import { useSelector } from "react-redux";
import ImageCard from "../../components/ImageCard";

import { sortAndFilterImages } from "../../redux/gallery/gallery-selectors";

export default function GalleryPage() {
  const imgArray = useSelector(sortAndFilterImages);

  return (
    <section className="gallery-page-wrap">
      <div className="gallery-page">
        {imgArray.map((image) => (
          <ImageCard image={image} key={image.id} />
        ))}
      </div>
    </section>
  );
}
