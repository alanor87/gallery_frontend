import { observer } from "mobx-react-lite";
import ImageCard from "../../components/ImageCard";
import GroupMenu from "../../components/GroupMenu";
import SideMenu from "../../components/SideMenu/SideMenu";
import Modal from "../../components/Modals/Modal/Modal";
import ModalUpload from "../../components/Modals/ModalUpload";
import { Spinner } from "../../components/elements";
import store from "../../MST/store";
import styles from "./Gallery.module.scss";

function GalleryView() {
  const imgArray = store.imagesStoreSettings.getAllImages;
  const { uploadModalIsOpen, uploadModalToggle } = store.modalWindowsSettings;
  const { sidePanelIsOpen } = store.userSettings.userInterface;

  return (
    <section className={styles.sectionGallery}>
      {imgArray.length ? (
        <>
          <SideMenu galleryMenuImages={imgArray} isOpen={sidePanelIsOpen} />
          <GroupMenu />
          <div className={styles.galleryPage}>
            {imgArray.map((image) => (
              <ImageCard image={image} key={image._id} />
            ))}
          </div>
        </>
      ) : (
        <Spinner side={100} />
      )}
      <Modal
        component={ModalUpload}
        closeModalHandler={uploadModalToggle}
        style={uploadModalIsOpen ? { opacity: 1, pointerEvents: "all" } : {}}
      />
    </section>
  );
}

export default observer(GalleryView);
