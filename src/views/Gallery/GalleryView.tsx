import { observer } from "mobx-react-lite";
import ImageCard from "../../components/ImageCard";
import ImageMenu from "../../components/ImageMenu";
import SideMenu from "../../components/SideMenu/SideMenu";
import Modal from "../../components/Modals/Modal/Modal";
import ModalUpload from "../../components/Modals/ModalUpload";
import ModalDelete from "../../components/Modals/ModalDelete";
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
  } = store.imagesStoreSettings;
  const { uploadModalIsOpen, setUploadModalOpen } = store.modalWindowsSettings;
  const { deleteModalIsOpen, setDeleteModalOpen } = store.modalWindowsSettings;
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
              onDelete={() => setDeleteModalOpen(true)}
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
        closeModalHandler={() => setUploadModalOpen(false)}
        style={uploadModalIsOpen ? { opacity: 1, pointerEvents: "all" } : {}}
      />
      <Modal
        component={ModalDelete}
        closeModalHandler={() => setDeleteModalOpen(false)}
        style={deleteModalIsOpen ? { opacity: 1, pointerEvents: "all" } : {}}
      />
    </section>
  );
}

export default observer(GalleryView);
