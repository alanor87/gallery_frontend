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
  const {
    getAllImages,
    groupSelectMode,
    groupSelectModeToggle,
    clearSelectedList,
    deleteMultipleImages,
  } = store.imagesStoreSettings;
  const { uploadModalIsOpen, uploadModalToggle } = store.modalWindowsSettings;
  const { sidePanelIsOpen } = store.userSettings.userInterface;

  const imgArray = getAllImages;

  const groupModeOffHandler = () => {
    clearSelectedList();
    groupSelectModeToggle();
  };

  return (
    <section
      className={
        groupSelectMode
          ? styles.sectionGallery + " " + styles.groupSelectMode
          : styles.sectionGallery
      }
    >
      {imgArray.length ? (
        <>
          <SideMenu galleryMenuImages={imgArray} isOpen={sidePanelIsOpen} />

          <div
            className={
              groupSelectMode
                ? styles.groupImageMenuWrapper + " " + styles.groupSelectMode
                : styles.groupImageMenuWrapper
            }
          >
            <ImageMenu
              groupMenuMode={true}
              onSelect={groupModeOffHandler}
              onDelete={deleteMultipleImages}
            />
          </div>

          <div className={styles.galleryPage}>
            {imgArray.map((image) => {
              return (
                <ImageCard
                  image={image}
                  key={image._id}
                  isSelected={image.isSelected}
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
