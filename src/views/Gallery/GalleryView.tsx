import { observer } from "mobx-react-lite";
import ImageCard from "../../components/ImageCard";
import SideMenu from "../../components/SideMenu/SideMenu";
import { Spinner } from "../../components/elements";
import store from "../../MST/store";
import styles from "./Gallery.module.scss";

function GalleryView() {
  const imgArray = store.imagesStoreSettings.getAllImages;
  const sideMenuOn = store.interfaceSettings.sidePanelIsOpen;

  return (
    <section className={styles.sectionGallery}>
      {imgArray.length ? (
        <>
          <SideMenu galleryMenuImages={imgArray} isOpen={sideMenuOn} />
          <div className={styles.galleryPage}>
            {imgArray.map((image) => (
              <ImageCard image={image} key={image._id} />
            ))}
          </div>
        </>
      ) : (
        <Spinner side={100} />
      )}
    </section>
  );
}

export default observer(GalleryView);
