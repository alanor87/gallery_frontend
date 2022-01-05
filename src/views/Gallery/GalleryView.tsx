import { useState, useEffect, useCallback } from "react";
import { observer } from "mobx-react-lite";
import ImageCard from "../../components/ImageCard";
import ImageMenu from "../../components/ImageMenu";
import Modal from "../../components/Modals/Modal/Modal";
import { Spinner } from "../../components/elements";
import store from "../../MST/store";
import { GalleryType } from "types/images";
import { ImageType } from "MST/imagesStoreSettings";
import styles from "./Gallery.module.scss";

interface Props {
  label: GalleryType;
}

function GalleryView({ label }: Props) {
  const [imgArray, setImgArray] = useState<ImageType[]>([]);
  const {
    setGalleryMode,
    imageStoreInit,
    getUserImages,
    groupSelectMode,
    groupSelectModeToggle,
    clearSelectedList,
    isLoading,
  } = store.imagesStoreSettings;
  const { setModalComponentType, setModalOpen } = store.modalWindowsSettings;

  useEffect(() => {
    imageStoreInit(label).then(() => setImgArray(getUserImages));
  }, [imageStoreInit, setGalleryMode, getUserImages, label]);

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

  return isLoading ? (
    <Spinner side={100} />
  ) : (
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
