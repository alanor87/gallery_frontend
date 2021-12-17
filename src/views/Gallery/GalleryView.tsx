import { useEffect, useCallback } from "react";
import { observer } from "mobx-react-lite";
import ImageCard from "../../components/ImageCard";
import ImageMenu from "../../components/ImageMenu";
import Modal from "../../components/Modals/Modal/Modal";
import { Spinner } from "../../components/elements";
import store from "../../MST/store";
import { GalleryType } from "types/images";
import styles from "./Gallery.module.scss";

interface Props {
  label: GalleryType;
}

function GalleryView({ label }: Props) {
  const {
    setGalleryMode,
    imageStoreInit,
    getUserImages,
    groupSelectMode,
    groupSelectModeToggle,
    clearSelectedList,
  } = store.imagesStoreSettings;
  const { setModalComponentType, setModalOpen } = store.modalWindowsSettings;

  setGalleryMode(label);
  const imgArray = getUserImages;

  useEffect(() => {
    imageStoreInit();
  }, [imageStoreInit, label]);

  const groupModeHandler = useCallback(() => {
    clearSelectedList();
    groupSelectModeToggle();
  }, [clearSelectedList, groupSelectModeToggle]);

  const groupDeleteHandler = useCallback(() => {
    setModalComponentType("delete");
    setModalOpen(true);
  }, [setModalComponentType, setModalOpen]);

  const groupShareHandler = useCallback(() => {
    setModalComponentType("share");
    setModalOpen(true);
  }, [setModalComponentType, setModalOpen]);

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
          <div
            className={
              groupSelectMode
                ? styles.groupImageMenuWrapper + " " + styles.groupSelectMode
                : styles.groupImageMenuWrapper
            }
          >
            <ImageMenu
              groupMenuMode={true}
              onSelect={groupModeHandler}
              onDelete={groupDeleteHandler}
              onShare={groupShareHandler}
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
