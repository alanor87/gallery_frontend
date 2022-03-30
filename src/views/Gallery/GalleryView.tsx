import { useState, useEffect, useCallback } from "react";
import { observer } from "mobx-react-lite";
import cn from "classnames";
import { useGetTotalImagesNumber } from "hooks";
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
    allFilteredImagesId,
    currentPage,
    imagesPerPage,
    setCurrentPage,
    isLoading,
  } = store.imagesStoreSettings;
  const { setModalComponentType, setModalOpen } = store.modalWindowsSettings;
  const totalImagesNumber = useGetTotalImagesNumber();

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

  // Mechanism for back/forth swipe touch navigation on touchscreen.
  let touchStartX = 0;
  const touchPageNav = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.type === "touchstart") touchStartX = e.changedTouches[0].clientX;
    if (e.type === "touchend") {
      const swipeLength = touchStartX - e.changedTouches[0].clientX;

      const pagesCount = allFilteredImagesId.length
        ? allFilteredImagesId.length / imagesPerPage
        : totalImagesNumber / imagesPerPage;

      if (Math.abs(swipeLength) < 200) return;
      switch (swipeLength > 0) {
        case true: {
          if (currentPage + 1 <= pagesCount) setCurrentPage(currentPage + 1);
          break;
        }
        case false: {
          if (currentPage - 1 >= 0) setCurrentPage(currentPage - 1);
          break;
        }
      }
    }
  };

  return isLoading ? (
    <Spinner side={100} />
  ) : (
    <section
      className={cn(styles.sectionGallery, {
        [styles.groupSelectMode]: groupSelectMode,
      })}
      onTouchStart={touchPageNav}
      onTouchEnd={touchPageNav}
    >
      {imgArray.length ? (
        <>
          <div
            className={cn(styles.groupImageMenuWrapper, {
              [styles.groupSelectMode]: groupSelectMode,
            })}
          >
            <ImageMenu
              isOpened={groupSelectMode}
              groupMenuMode={true}
              onSelect={groupModeHandler}
              onDelete={groupDeleteHandler}
              onShare={groupShareHandler}
            />
          </div>

          <div className={styles.galleryPage}>
            {imgArray.map((image) => {
              console.log("render cards");
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
        <div className={styles.noImages}>No images in this gallsery.</div>
      )}
      <Modal />
    </section>
  );
}

export default observer(GalleryView);
