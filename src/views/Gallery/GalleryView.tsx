import { observer } from "mobx-react-lite";
import ImageCard from "../../components/ImageCard";
import ImageMenu from "../../components/ImageMenu";
import SideMenu from "../../components/SideMenu/SideMenu";
import Modal from "../../components/Modals/Modal/Modal";
import ModalUpload from "../../components/Modals/ModalUpload";
import { Spinner } from "../../components/elements";
import store from "../../MST/store";
import styles from "./Gallery.module.scss";

function GalleryView() {
  console.log("GalleryView render");
  const { getAllImages, groupSelectMode, groupSelectModeToggle } =
    store.imagesStoreSettings;
  const { uploadModalIsOpen, uploadModalToggle } = store.modalWindowsSettings;
  const { sidePanelIsOpen } = store.userSettings.userInterface;

  const imgArray = getAllImages;

  return (
    <section className={styles.sectionGallery}>
      {imgArray.length ? (
        <>
          <SideMenu galleryMenuImages={imgArray} isOpen={sidePanelIsOpen} />

          {groupSelectMode && (
            <div style={{ marginTop: "10px" }}>
              <ImageMenu
                isOpened={true}
                groupMenuMode={true}
                onSelect={groupSelectModeToggle}
              />
            </div>
          )}

          <div className={styles.galleryPage}>
            {imgArray.map((image) => {
              console.log("render images");
              console.log("groupSelectMode : ", groupSelectMode);
              return (
                <ImageCard
                  image={image}
                  key={image._id}
                  groupSelectMode={groupSelectMode}
                />
              );
            })}
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
