import { observer } from "mobx-react-lite";
import ImageCard from "../../components/ImageCard";
import SideMenu from "../../components/SideMenu/SideMenu";
import store from "../../MST/store";
import styles from "./Gallery.module.scss";

function GalleryPage() {
  const imgArray = store.imagesStoreSettings.getAllImages;
  const sideMenuOn = store.interfaceSettings.sidePanelIsOpen;

  return (
    <section className={styles.sectionGallery}>
      <SideMenu galleryMenuImages={imgArray} isOpen={sideMenuOn} />
      <div className={styles.galleryPage}>
        {imgArray.map((image) => (
          <ImageCard image={image} key={image.id} />
        ))}
      </div>
    </section>
  );
}

export default observer(GalleryPage);
