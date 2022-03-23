import React, { useState, useEffect, useCallback, useRef } from "react";
import { debounce } from "debounce";
import cn from "classnames";
import { Spinner, Button } from "components/elements";
import TagList from "components/TagList";
import ImageMenu from "components/ImageMenu";
import ShareOverlay from "components/Overlays/ShareOverlay";
import DeleteOverlay from "components/Overlays/DeleteOverlay";
import TagEditor from "components/TagEditor";
import store from "../../../MST/store";
import { ImageType } from "MST/imagesStoreSettings";
import styles from "./ModalImage.module.scss";

const ModalImage = () => {
  console.log("modal image render");
  const { publicImagesList } = store.publicSettings;
  const {
    images,
    fetchImageById,
    editImagesInfo,
    getCurrentGalleryMode,
    allFilteredImagesId,
    imagesPerPage,
    currentPage,
    setCurrentPage,
  } = store.imagesStoreSettings;
  const {
    modalImageId,
    setModalImageId,
    setModalOpen,
    setModalComponentType,
    imageIsExpanded,
    setImageIsExpanded,
  } = store.modalWindowsSettings;
  const { userIsAuthenticated, userName, userOwnedImages, userOpenedToImages } =
    store.userSettings;

  const [currentImagesIdList, setCurrentImagesIdList] = useState<string[]>([]);
  const [currentModalImage, setCurrentModalImage] = useState<
    ImageType | undefined
  >(undefined);
  const [currentImageIndex, setCurrentImageIndex] = useState<Number>();
  const [imgInfoIsLoading, setimgInfoIsLoading] = useState(false);
  const [imageIsLoading, setImageIsLoading] = useState(true);
  const [imageExpand, setImageExpand] = useState(imageIsExpanded);
  const [imageControlsVisible, setImageControlsVisible] = useState(false);
  const [modalImageLikes, setModalImageLikes] = useState<string[]>([]);
  const [tagEditorIsOpen, setTagEditorIsOpen] = useState(false);
  const [shareOverlayIsOpen, setShareOverlayIsOpen] = useState(false);
  const [deleteOverlayIsOpen, setDeleteOverlayIsOpen] = useState(false);
  const modalImageRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  const imagesListInit = () => {
    // Defining the list of all image IDs that are available for the modal image browsing.
    // If there are no filtered images - then we take the imagesID list
    // from the appropriate list - depending on the gallery mode.
    if (!allFilteredImagesId.length) {
      switch (getCurrentGalleryMode) {
        case "userGallery": {
          setCurrentImagesIdList(userOwnedImages);
          break;
        }
        case "sharedGallery": {
          setCurrentImagesIdList(userOpenedToImages);
          break;
        }
        case "publicGallery": {
          setCurrentImagesIdList(publicImagesList);
          break;
        }
      }
    }
    // If the images we are dealing with are filtered - we refer to the allFilteredImagesId -
    // array that we get from the backend with the IDs of filtered images, regardless of the gallery we
    // deal with.
    else {
      setCurrentImagesIdList(allFilteredImagesId);
    }
  };

  const loadModalImage = useCallback(async () => {
    setImageIsLoading(true);
    setimgInfoIsLoading(true);
    const newModalImage: any = await fetchImageById(modalImageId);
    setCurrentModalImage(newModalImage);
    setModalImageLikes(newModalImage.imageInfo.likes);
    setimgInfoIsLoading(false);
  }, [modalImageId, fetchImageById]);

  useEffect(() => {
    // Initializing the list of imagesID for modal browsing.
    imagesListInit();
  }, []);

  useEffect(() => {
    // Loading current modal image.
    loadModalImage();
    // Defining index of the current image in the list of imagesID.
    setCurrentImageIndex(currentImagesIdList.indexOf(modalImageId));
  }, [modalImageId, loadModalImage, currentImagesIdList]);

  useEffect(() => {
    // Focusing on the modalImage div, so the arrow navigation through keyDown event
    // would be available. In case of the image being expanded - switching focus to the
    // imageWrapper - so the down-up arrow scroll would be available as well.
    modalImageRef.current?.focus();
    if (imageExpand) imageWrapperRef.current?.focus();
  }, [imageExpand, currentImageIndex]);

  const onImageLoad = () => {
    // Waiting for the load of whole image - only then showing it.
    setImageIsLoading(false);
  };

  const getPagesNumber = () => {
    // Getting number fo pages.
    if (allFilteredImagesId.length)
      return Math.ceil(allFilteredImagesId.length / imagesPerPage);
    return Math.ceil(currentImagesIdList.length / imagesPerPage);
  };

  // Accepts the direction - if the previous or next image btn was clicked, and defines if
  // the current image is still among those that are on the current page - therefore -
  // in the current images array in imagesStoreSettings. If it is not - the new page request
  // is initiated - either previous one or the next one, if the current page is NOT first one
  // or last one, respectively.
  const pageShiftCheck = (direction: string, id: string) => {
    const isModalImageOnCurrentPage = images.find((image) => image._id === id);
    switch (direction) {
      case "prev": {
        if (!isModalImageOnCurrentPage && currentPage !== 0)
          setCurrentPage(currentPage - 1);
        return;
      }
      case "next": {
        if (!isModalImageOnCurrentPage && currentPage < getPagesNumber() - 1)
          setCurrentPage(currentPage + 1);
        return;
      }
    }
  };

  // Unified function for navigating back and forth between modal images. Is being invoked
  // by the prev/next image buttons with "prev" or "next" arguments respectively (or left/right
  // keyboard arrows). Depending on this direction mark - the index of the next image is being
  // defined in the currentImagesIdList, being set as currentImageIndex - and the pageShiftCheck
  // is invoked to check if the previous or next page should be loaded in case,
  // if image is beyond the currently loaded images set in gallery.
  const adjacentImageLoad = (direction: string) => () => {
    const currentImageIndex = currentImagesIdList.findIndex(
      (imageId) => imageId === modalImageId
    );
    let adjacentImageIndex;
    switch (direction) {
      case "prev": {
        adjacentImageIndex = currentImageIndex - 1;
        break;
      }
      case "next": {
        adjacentImageIndex = currentImageIndex + 1;
        break;
      }
      default:
        adjacentImageIndex = 0;
    }
    setCurrentImageIndex(adjacentImageIndex);
    pageShiftCheck(direction, currentImagesIdList[adjacentImageIndex]);
    setModalImageId(currentImagesIdList[adjacentImageIndex]);
  };

  const keyboardImageNav = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.code) {
      case "ArrowLeft": {
        if (currentImageIndex === 0) break;
        adjacentImageLoad("prev")();
        break;
      }
      case "ArrowRight": {
        if (currentImageIndex === currentImagesIdList.length - 1) break;
        adjacentImageLoad("next")();
        break;
      }
      case "Space": {
        console.log("");
        setImageIsExpanded(!imageExpand);
        setImageExpand(!imageExpand);
        break;
      }
    }
  };

  const imageControlsToggle = (value: boolean) => {
    setImageControlsVisible(value);
  };

  const imageControlsVisibilityHandler = debounce(
    () => {
      setImageControlsVisible(true);
      setTimeout(() => imageControlsToggle(false), 2000);
    },
    3000,
    true
  );

  const toggleLikeHandler = async () => {
    // Likes are stored in separate state in the modalimage component itself -
    // to avoid re-rendering all the component when the like button is clicked.
    const { _id } = currentModalImage!;
    let newLikesList: string[] = [];
    if (!modalImageLikes.includes(userName)) {
      newLikesList = [...modalImageLikes, userName];
    } else {
      newLikesList = modalImageLikes.filter((name) => name !== userName);
    }
    await editImagesInfo([{ _id, imageInfo: { likes: newLikesList } }]);
    setModalImageLikes(newLikesList);
  };

  const imageExpandHandler = () => {
    // Setting flag both locally - and in store.
    // Thing thats better than wrap whole thing into observer
    // just for one flag.
    setImageIsExpanded(!imageExpand);
    setImageExpand(!imageExpand);
  };

  const tagEditOpenHandler = () => {
    setTagEditorIsOpen(true);
  };
  const shareOverlayOpenHandler = () => {
    setShareOverlayIsOpen(true);
  };
  const deleteOverlayOpenHandler = () => {
    setDeleteOverlayIsOpen(true);
  };

  const shareOverlayCloseHandler = () => {
    loadModalImage();
    setShareOverlayIsOpen(false);
  };
  const onTagEditCloseHandler = () => setTagEditorIsOpen(false);
  const deleteOverlayCloseHandler = () => setDeleteOverlayIsOpen(false);
  const deleteOverlayConfirmHandler = () => {
    setModalImageId("");
    setModalComponentType("none");
    setModalOpen(false);
  };

  const tagDelHandler = (tagToDelete: string) => {
    const newTags = currentModalImage!.imageInfo.tags.filter(
      (tag) => tag !== tagToDelete
    );
    tagsUpdateHandler(newTags);
  };
  const tagAddHandler = (tagsToAdd: string) => {
    const parsedTags = tagsToAdd.split(/,/).map((tag) => tag.trim());
    tagsUpdateHandler([...currentModalImage!.imageInfo.tags, ...parsedTags]);
  };
  const tagsUpdateHandler = async (newTags: string[]) => {
    const { _id } = currentModalImage!;
    setimgInfoIsLoading(true);
    await editImagesInfo([{ _id, imageInfo: { tags: newTags } }]);
    loadModalImage();
    setimgInfoIsLoading(false);
  };

  const modalImageCloseHandle = () => {
    setModalOpen(false);
    setModalComponentType("none");
    setImageIsExpanded(false);
  };

  const isFirstImage = currentImageIndex === 0;
  const isLastImage = currentImageIndex === currentImagesIdList.length - 1;

  const isUserMode = getCurrentGalleryMode === "userGallery";
  return currentModalImage ? (
    <div
      className={styles.modalImage}
      onKeyDown={keyboardImageNav}
      tabIndex={0}
      ref={modalImageRef}
    >
      <div
        className={cn({
          [styles.imagePart]: true,
          [styles.expanded]: imageExpand,
        })}
        onMouseMove={imageControlsVisibilityHandler}
      >
        <div
          className={cn({
            [styles.imageControls]: true,
            [styles.visible]: imageControlsVisible,
          })}
        >
          <Button
            icon="icon_fullscreen"
            title="Expand/shrink image (Space)"
            iconSize={20}
            onClick={imageExpandHandler}
          />
          {userIsAuthenticated && isUserMode && (
            <ImageMenu
              modalImageMode={true}
              onShare={shareOverlayOpenHandler}
              onDelete={deleteOverlayOpenHandler}
            />
          )}
        </div>
        {!isFirstImage && (
          <Button
            className={cn({
              [styles.navButtonPrev]: true,
              [styles.visible]: imageControlsVisible,
            })}
            type="button"
            title="Previous image (Arrow left)"
            icon="icon_arrow_left"
            iconSize={30}
            onClick={adjacentImageLoad("prev")}
          />
        )}
        {!isLastImage && (
          <Button
            className={cn({
              [styles.navButtonNext]: true,
              [styles.visible]: imageControlsVisible,
            })}
            type="button"
            title="Next image (Arrow right)"
            icon="icon_arrow_right"
            iconSize={30}
            onClick={adjacentImageLoad("next")}
          />
        )}
        {imageIsLoading && <Spinner side={50} />}
        {!imgInfoIsLoading && (
          <div
            className={cn({
              [styles.imageWrapper]: true,
              [styles.visible]: imageControlsVisible,
              [styles.expanded]: imageExpand,
            })}
            ref={imageWrapperRef}
            onLoad={() => {
              imageWrapperRef.current?.focus();
            }}
            tabIndex={0}
          >
            {" "}
            <img
              src={currentModalImage?.imageURL}
              alt={"God save the queen!"}
              onLoad={onImageLoad}
              style={{ visibility: !imageIsLoading ? "visible" : "hidden" }}
            />
          </div>
        )}
      </div>

      <div className={styles.nonImagePart}>
        <div className={styles.modalImageHeader}>
          <div className={styles.imageTitleWrapper}>
            <Button
              type="button"
              icon="icon_like"
              onClick={toggleLikeHandler}
              className={styles.modalImageLikeBtn}
              text={modalImageLikes.length}
              disabled={!userIsAuthenticated}
              title="Like / Dislike"
            />
            <h2>{currentModalImage.imageInfo.title || "No title"}</h2>
            <Button
              type="button"
              title="Close modal image"
              className={"closeBtn " + styles.mobile}
              icon="icon_close"
              iconSize={30}
              onClick={modalImageCloseHandle}
            />
          </div>
          <div className={styles.modalControlsWrapper}>
            <Button
              className={styles.navButton}
              type="button"
              title="Previous image"
              icon="icon_arrow_left"
              iconSize={30}
              onClick={adjacentImageLoad("prev")}
              disabled={currentImageIndex === 0}
            />
            {userIsAuthenticated && isUserMode && (
              <ImageMenu
                modalImageMode={true}
                onShare={shareOverlayOpenHandler}
                onDelete={deleteOverlayOpenHandler}
              />
            )}
            <Button
              className={styles.navButton}
              type="button"
              title="Next image"
              icon="icon_arrow_right"
              iconSize={30}
              onClick={adjacentImageLoad("next")}
              disabled={currentImageIndex === currentImagesIdList.length - 1}
            />
          </div>
        </div>

        <div className={styles.description}>
          <div className={styles.tagListWrapper}>
            {currentModalImage.imageInfo.tags.length > 0 && (
              <TagList
                tags={currentModalImage.imageInfo.tags}
                isEditable={isUserMode}
                onDoubleClick={tagEditOpenHandler}
              />
            )}
          </div>
          <p>
            {currentModalImage.imageInfo.description ||
              "Consequat id veniam labore dolor ut. Veniam adipisicing ullamco do sunt. Duis minim officia do do fugiat laboris aliquip mollit velit aliqua dolor. Magna nostrud anim exercitation do excepteur proident officia laborum ad. Id ex sint dolore dolore adipisicing ea occaecat culpa ad cillum enim. Est adipisicing duis dolore minim laborum aute veniam officia dolor mollit magna cupidatat. Consequat id veniam labore dolor ut. Veniam adipisicing ullamco do sunt. Duis minim officia do do fugiat laboris aliquip mollit velit aliqua dolor. Magna nostrud anim exercitation do excepteur proident officia laborum ad. Id ex sint dolore dolore adipisicing ea occaecat culpa ad cillum enim. Est adipisicing duis dolore minim laborum aute veniam officia dolor mollit magna cupidatat.Consequat id veniam labore dolor ut. Veniam adipisicing ullamco do sunt. Duis minim officia do do fugiat laboris aliquip mollit velit aliqua dolor. Magna nostrud anim exercitation do excepteur proident officia laborum ad. Id ex sint dolore dolore adipisicing ea occaecat culpa ad cillum enim. Est adipisicing duis dolore minim laborum aute veniam officia dolor mollit magna cupidatat.Consequat id veniam labore dolor ut. Veniam adipisicing ullamco do sunt. Duis minim officia do do fugiat laboris aliquip mollit velit aliqua dolor. Magna nostrud anim exercitation do excepteur proident officia laborum ad. Id ex sint dolore dolore adipisicing ea occaecat culpa ad cillum enim. Est adipisicing duis dolore minim laborum aute veniam officia dolor mollit magna cupidatat.Consequat id veniam labore dolor ut. Veniam adipisicing ullamco do sunt. Duis minim officia do do fugiat laboris aliquip mollit velit aliqua dolor. Magna nostrud anim exercitation do excepteur proident officia laborum ad. Id ex sint dolore dolore adipisicing ea occaecat culpa ad cillum enim. Est adipisicing duis dolore minim laborum aute veniam officia dolor mollit magna cupidatat.Consequat id veniam labore dolor ut. Veniam adipisicing ullamco do sunt. Duis minim officia do do fugiat laboris aliquip mollit velit aliqua dolor. Magna nostrud anim exercitation do excepteur proident officia laborum ad. Id ex sint dolore dolore adipisicing ea occaecat culpa ad cillum enim. Est adipisicing duis dolore minim laborum aute veniam officia dolor mollit magna cupidatat."}
          </p>
        </div>
      </div>
      <Button
        type="button"
        title="Close modal image"
        className={cn({
          [`closeBtn ${styles.desktop}`]: true,
          [styles.expanded]: imageExpand,
          [styles.visible]: imageControlsVisible,
        })}
        icon="icon_close"
        iconSize={30}
        onClick={modalImageCloseHandle}
      />

      {shareOverlayIsOpen && (
        <ShareOverlay
          _id={currentModalImage._id}
          isPublic={currentModalImage.imageInfo.isPublic}
          openedTo={currentModalImage.imageInfo.openedTo}
          sharedByLink={currentModalImage.imageInfo.sharedByLink}
          imageURL={currentModalImage.imageURL}
          setIsLoading={setimgInfoIsLoading}
          onCloseShareOverlay={shareOverlayCloseHandler}
        />
      )}
      {deleteOverlayIsOpen && (
        <DeleteOverlay
          _id={currentModalImage._id}
          onCloseDeleteOverlay={deleteOverlayCloseHandler}
          onConfirmDeleteOverlay={deleteOverlayConfirmHandler}
        />
      )}
      {tagEditorIsOpen && (
        <TagEditor
          tags={currentModalImage.imageInfo.tags}
          onAddTags={tagAddHandler}
          onTagDelete={tagDelHandler}
          closeHandle={onTagEditCloseHandler}
        />
      )}
    </div>
  ) : (
    <Spinner side={50} />
  );
};

export default ModalImage;
