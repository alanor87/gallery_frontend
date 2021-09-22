import { useSelector } from "react-redux";
import { observer } from "mobx-react-lite";
import { getError } from "../../redux/gallery/gallery-selectors";
import ImageCard from "../../components/ImageCard";
import SideMenu from "../../components/SideMenu/SideMenu";
import store from "../../MST/store";
import styles from "./Gallery.module.scss";

function GalleryPage() {
  const imgArray = store.imagesStoreSettings.getAllImages;
  const error = useSelector(getError);
  const sideMenuOn = store.interfaceSettings.sidePanelIsOpen;

  return (
    <section className={styles.sectionGallery}>
      <SideMenu galleryMenuImages={imgArray} isOpen={sideMenuOn} />
      {!error && (
        <div className={styles.galleryPage}>
          {imgArray.map((image) => (
            <ImageCard image={image} key={image.id} />
          ))}
        </div>
      )}
      {error && <div className="error">Something went terribly wrong!</div>}
    </section>
  );
}

export default observer(GalleryPage);
