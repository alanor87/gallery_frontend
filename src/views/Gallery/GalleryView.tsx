import { observer } from "mobx-react-lite";
import ImageCard from "../../components/ImageCard";
import ImageMenu from "../../components/ImageMenu";
import SideMenu from "../../components/SideMenu/SideMenu";
import Modal from "../../components/Modals/Modal/Modal";
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
  const { sidePanelIsOpen } = store.userSettings.userInterface;
  const { setModalComponentType, setModalOpen } = store.modalWindowsSettings;

  const imgArray = getAllImages;

  const groupModeOffHandler = () => {
    clearSelectedList();
    groupSelectModeToggle();
  };

  const groupDeleteHandler = () => {
    setModalComponentType("delete");
    setModalOpen(true);
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
              onDelete={groupDeleteHandler}
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
      <Modal />
    </section>
  );
}

export default observer(GalleryView);
