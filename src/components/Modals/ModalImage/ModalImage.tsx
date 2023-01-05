import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { debounce } from "debounce";
import { DescriptionTextAnchorsLayer } from "./DescriptionTextAnchorsLayer";
import cn from "classnames";
import { Spinner, Button } from "components/elements";
import TagList from "components/TagList";
import ImageMenu from "components/ImageMenu";
import { ShareOverlay, DeleteOverlay, EditOverlay } from "components/Overlays";

import store from "MST/store";
import { ImageType } from "MST/imagesStoreSettings";
import { DescriptionAnchorType } from "types/images";

import {pixels2percentage as p2p} from 'utils/pixels2percentage';
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

  const [currentModalImage, setCurrentModalImage] = useState<ImageType>();
  const [currentImageIndex, setCurrentImageIndex] = useState<Number>();
  // Loading of image object from backend.
  const [imgInfoIsLoading, setimgInfoIsLoading] = useState(false);
  // Loading of the image picture itself.
  const [imageIsLoading, setImageIsLoading] = useState(true);
  // The expand flag is duplicated in store - to keep the expanded state while switching between pages.
  const [imageExpand, setImageExpand] = useState(imageIsExpanded);
  const [imageControlsVisible, setImageControlsVisible] = useState(false);
  const [modalImageLikes, setModalImageLikes] = useState<string[]>([]);
  const [shareOverlayIsOpen, setShareOverlayIsOpen] = useState(false);
  const [editOverlayIsOpen, setEditOverlayIsOpen] = useState(false);
  const [deleteOverlayIsOpen, setDeleteOverlayIsOpen] = useState(false);
  const [anchorBtnVisible, setAnchorBtnVisible] = useState(false);
  const [anchorBtnCoords, setAnchorBtnCoords] = useState([0, 0]);
  const [anchorText, setAnchorText] = useState("");
  const [anchorTextStartPos, setAnchorTextStartPos] = useState(0);
  const [anchorFrameCoords, setAnchorFrameCoords] = useState([0, 0]);
  const [anchorFrameSize, setAnchorFrameSize] = useState([0, 0]);
  const [anchorFrameCreated, setAnchorFrameCreated] = useState(false);
  const [anchorSelectionImageMode, setAnchorSelectionImageMode] =
    useState(false);

  const modalImageRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const descriptionTextRef = useRef<HTMLDivElement>(null);
  const anchorImgFrameRef = useRef<HTMLDivElement>(null);
  const newAnchorImgFrameRef = useRef<HTMLDivElement>(null);

  const imagesList = useMemo(() => {
    // Defining the list of all image IDs that are available for the modal image browsing.
    // If there are no filtered images - then we take the imagesID list
    // from the appropriate list - depending on the gallery mode.
    if (!allFilteredImagesId.length) {
      switch (getCurrentGalleryMode) {
        case "userGallery": {
          return userOwnedImages;
        }
        case "sharedGallery": {
          return userOpenedToImages;
        }
        case "publicGallery": {
          return publicImagesList;
        }
      }
    }
    // If the images we are dealing with are filtered - we refer to the allFilteredImagesId -
    // array that we get from the backend with the IDs of filtered images, regardless of the gallery we
    // deal with.
    else {
      return allFilteredImagesId;
    }
  }, []);

  const loadModalImage = useCallback(async () => {
    setImageIsLoading(true);
    setimgInfoIsLoading(true);
    const newModalImage: any = await fetchImageById(modalImageId);
    setCurrentModalImage(newModalImage);
    setModalImageLikes(newModalImage.imageInfo.likes);
    setimgInfoIsLoading(false);
  }, [modalImageId, fetchImageById]);

  const onImageLoad = () => {
    // Waiting for the load of whole image - only then showing it.
    setImageIsLoading(false);
  };

  /*############# useEffect hooks #############*/

  useEffect(() => {
    // Loading current modal image.
    loadModalImage();
    // Defining index of the current image in the list of imagesID.
    setCurrentImageIndex(imagesList.indexOf(modalImageId));
    // Resetting anchor editing mode  - so the nav elements would be seen.
    setAnchorSelectionImageMode(false);
    anchorBtnHideHandler();
  }, [modalImageId, loadModalImage, imagesList]);

  useEffect(() => {
    // Focusing on the modalImage div, so the arrow navigation through keyDown event
    // would be available. In case of the image being expanded - switching focus to the
    // imageWrapper - so the down-up arrow scroll would be available as well.
    modalImageRef.current?.focus();
    if (imageExpand) imageWrapperRef.current?.focus();
    // Resetting anchor editing mode  - so the nav elements would be seen.
    setAnchorSelectionImageMode(false);
    anchorBtnHideHandler();
  }, [imageExpand, currentModalImage]);

  /*############# Variables without re-render persistant state #############*/

  const isFirstImage = currentImageIndex === 0;
  const isLastImage = currentImageIndex === imagesList.length - 1;
  const isUserMode = getCurrentGalleryMode === "userGallery";
  let touchStartX = 0;
  // Coordinates and dimensions for the image anchor frame.
  // Not using useState here to prevent constant rerendering of the component while drawing the div.
  let frameWidth = 0;
  let frameHeight = 0;
  let finalFrameCoordX = 0;
  let finalFrameCoordY = 0;

  /*############# Text-image anchoring logics #############*/

  const selectAnchorText = (e: React.MouseEvent<HTMLDivElement>) => {
    const selectedText = window.getSelection()!.toString();
    if (getCurrentGalleryMode !== "userGallery" || !e.altKey || !selectedText)
      return;

    const { left } = descriptionTextRef.current!.getBoundingClientRect();
    const selectionOffset = window.getSelection()!.anchorOffset;

    setAnchorText(selectedText);
    setAnchorTextStartPos(selectionOffset);

    setAnchorBtnCoords([e.clientX - left, e.clientY]);
    setAnchorBtnVisible(true);
  };
  const selectAnchorImgFrame = (e: React.MouseEvent) => {
    if (!anchorSelectionImageMode || anchorFrameCreated) return;
    switch (e.type) {
      // Getting the coordinates of starting point of the frame rectangle drawing.
      case "mousedown": {
        e.preventDefault();
        newAnchorImgFrameRef.current!.setAttribute("style", "");
        setAnchorFrameCoords([e.nativeEvent.offsetX, e.nativeEvent.offsetY]);
        break;
      }
      case "mousemove": {
        // Defining if the left mouse button is pressed during mouse move over image.
        if (e.buttons !== 1) return;
        // Calculating and setting dimensions of the frame div.
        frameWidth = Math.abs(e.nativeEvent.offsetX - anchorFrameCoords[0]);
        frameHeight = Math.abs(e.nativeEvent.offsetY - anchorFrameCoords[1]);
        // Determining the coords of the upper left corner of the frame div
        // for correct positioning, since user can draw rectangle in any direction.
        finalFrameCoordX =
          anchorFrameCoords[0] < e.nativeEvent.offsetX
            ? anchorFrameCoords[0]
            : e.nativeEvent.offsetX;
        finalFrameCoordY =
          anchorFrameCoords[1] < e.nativeEvent.offsetY
            ? anchorFrameCoords[1]
            : e.nativeEvent.offsetY;
        newAnchorImgFrameRef.current!.setAttribute(
          "style",
          `top: ${finalFrameCoordY}px; left: ${finalFrameCoordX}px ; width: ${frameWidth}px; height: ${frameHeight}px; opacity: 1; pointer-events: none;`
        );
        break;
      }
      case "mouseup": {
        // For different screen resolutions compatibility image anchor frame dimensions
        // are being converted from pixels to percent from the wrapping div.
        const {clientWidth, clientHeight} = newAnchorImgFrameRef.current!.parentElement!;
        setAnchorFrameSize([p2p(clientWidth, frameWidth), p2p(clientHeight, frameHeight)]);
        setAnchorFrameCoords([p2p(clientWidth ,finalFrameCoordX), p2p(clientHeight, finalFrameCoordY)]);
        newAnchorImgFrameRef.current!.style.pointerEvents = "all";
        setAnchorFrameCreated(true);
        break;
      }
    }
  };
  const anchorBtnHideHandler = () => {
    setAnchorBtnVisible(false);
  };
  const anchorBtnConfirmHandler = () => {
    setAnchorFrameCreated(false);
    setAnchorSelectionImageMode(true);
  };
  const anchorCreationCancelHandler = () => {
    newAnchorImgFrameRef.current!.setAttribute("style", "");
    setAnchorSelectionImageMode(false);
    setAnchorFrameCreated(false);
    anchorBtnHideHandler();
  };
  const createAnchor = async (e: React.MouseEvent) => {
    anchorBtnHideHandler();
    setimgInfoIsLoading(true);
    const { _id, imageInfo } = currentModalImage!;
    const newAnchor: DescriptionAnchorType = {
      anchorText,
      anchorTextStartPos,
      anchorFrameCoords,
      anchorFrameSize,
    };
    const newAnchorsArray = [...imageInfo.description.anchors, newAnchor];
    const description = {
      text: imageInfo.description.text,
      anchors: newAnchorsArray,
    };
    await editImagesInfo([{ _id, imageInfo: { description } }]);
    await loadModalImage();
    setAnchorSelectionImageMode(false);
    setAnchorFrameCreated(false);
  };
  const showAnchorImgFrame = (currentAnchorId: string) => {
    const currentAnchor = currentModalImage!.imageInfo.description.anchors.find(
      (anchor) => anchor._id === currentAnchorId
    );
    const { anchorFrameCoords, anchorFrameSize, anchorText } = currentAnchor!;
    anchorImgFrameRef.current!.setAttribute(
      "style",
      `top: ${anchorFrameCoords[1]}%; 
      left: ${anchorFrameCoords[0]}%;
      width: ${anchorFrameSize[0]}%; 
      height: ${anchorFrameSize[1]}%;
      opacity: 1; pointer-events: none;`
    );
    anchorImgFrameRef.current!.innerText = anchorText;
  };
  const hideAnchorImgFrame = () => {
    anchorImgFrameRef.current!.setAttribute("style", ``);
    anchorImgFrameRef.current!.innerText = "";
  };

  /*############# Image navigation handlers #############*/

  const keyboardImageNav = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.code) {
      case "ArrowLeft": {
        if (currentImageIndex === 0) break;
        adjacentImageLoad("prev")();
        break;
      }
      case "ArrowRight": {
        if (currentImageIndex === imagesList.length - 1) break;
        adjacentImageLoad("next")();
        break;
      }
      case "Space": {
        // Skipping the Space button click effect, if one of the overlays is opened -
        // when there is a need to type something in those overlays - and space is needed
        // as the keyboard character.
        if (editOverlayIsOpen || shareOverlayIsOpen) return;
        hideAnchorImgFrame();
        setImageExpand(!imageExpand);
        setImageIsExpanded(!imageExpand);
        break;
      }
    }
  };
  /** Mechanism for back/forth swipe touch navigation on touchscreen. */
  const touchImageNav = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.type === "touchstart") touchStartX = e.changedTouches[0].clientX;
    if (e.type === "touchend") {
      const swipeLength = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(swipeLength) > 200) {
        swipeLength > 0
          ? adjacentImageLoad("next")()
          : adjacentImageLoad("prev")();
        return;
      }
    }
  };
  const getPagesNumber = () => {
    // Getting number fo pages.
    if (allFilteredImagesId.length)
      return Math.ceil(allFilteredImagesId.length / imagesPerPage);
    return Math.ceil(imagesList.length / imagesPerPage);
  };
  /** Accepts the direction - if the previous or next image btn was clicked, and defines if
   the current image is still among those that are on the current page - therefore -
   in the current images array in imagesStoreSettings. If it is not - the new page request
   is initiated - either previous one or the next one, if the current page is NOT first one
   or last one, respectively. */
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

  /** Unified function for navigating back and forth between modal images. Is being invoked
   by the prev/next image buttons with "prev" or "next" arguments respectively (or left/right
   keyboard arrows). Depending on this direction mark - the index of the next image is being
   defined in the currentImagesIdList, being set as currentImageIndex - and the pageShiftCheck
   is invoked to check if the previous or next page should be loaded in case,
   if image is beyond the currently loaded images set in gallery. */
  const adjacentImageLoad = (direction: string) => () => {
    const currentImageIndex = imagesList.findIndex(
      (imageId) => imageId === modalImageId
    );
    let adjacentImageIndex;
    switch (direction) {
      case "prev": {
        if (isFirstImage) return;
        adjacentImageIndex = currentImageIndex - 1;
        break;
      }
      case "next": {
        if (isLastImage) return;
        adjacentImageIndex = currentImageIndex + 1;
        break;
      }
      default:
        adjacentImageIndex = 0;
    }
    setCurrentImageIndex(adjacentImageIndex);
    pageShiftCheck(direction, imagesList[adjacentImageIndex]);
    setModalImageId(imagesList[adjacentImageIndex]);
  };

  /*############# misc. handles #############*/

  const imageControlsVisibilityHandler = debounce(
    () => {
      if (anchorSelectionImageMode) return;
      setImageControlsVisible(true);
      setTimeout(() => setImageControlsVisible(false), 2000);
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
    // Think thats better than wrap whole thing into observer
    // just for one flag.
    setImageExpand(!imageExpand);
    setImageIsExpanded(!imageExpand);
  };

  /*############# Overlays open handlers #############*/

  const shareOverlayOpenHandler = () => {
    setShareOverlayIsOpen(true);
  };
  const editOverlayOpenHandler = () => {
    setEditOverlayIsOpen(true);
  };
  const deleteOverlayOpenHandler = () => {
    setDeleteOverlayIsOpen(true);
  };

  /*############# Overlays close handlers #############*/

  const shareOverlayCloseHandler = () => {
    loadModalImage();
    setShareOverlayIsOpen(false);
  };
  const editOverlayCloseHandler = () => {
    setEditOverlayIsOpen(false);
  };
  const deleteOverlayCloseHandler = () => setDeleteOverlayIsOpen(false);

  /*############# Overlays confirm click handlers #############*/

  const editOverlayConfirmHandler = async (
    title: string,
    descriptionText: string,
    descriptionIsChanged: boolean
  ): Promise<void> => {
    const { _id, imageInfo } = currentModalImage!;
    // When the description text changes - anchors are reset to empty array.
    const newAnchors = descriptionIsChanged
      ? []
      : imageInfo.description?.anchors;
    const description = { text: descriptionText.trim(), anchors: newAnchors };
    await editImagesInfo([{ _id, imageInfo: { title, description } }]);
    await loadModalImage();
    editOverlayCloseHandler();
  };
  const deleteOverlayConfirmHandler = () => {
    setModalImageId("");
    setModalComponentType("none");
    setModalOpen(false);
  };

  /*############# Tags operations handlers #############*/

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
    await editImagesInfo([{ _id, imageInfo: { tags: newTags } }]);
    await loadModalImage();
  };
  const modalImageCloseHandle = () => {
    setModalOpen(false);
    setModalComponentType("none");
    setImageExpand(false);
    setImageIsExpanded(false);
  };

  return currentModalImage ? (
    <div
      className={styles.modalImage}
      onKeyDown={keyboardImageNav}
      tabIndex={0}
      ref={modalImageRef}
      onTouchStart={touchImageNav}
      onTouchEnd={touchImageNav}
    >
      <div
        className={styles.modalImageBackdrop}
        style={{ backgroundImage: `url(${currentModalImage.imageURL})` }}
      ></div>

      <div
        className={cn(styles.imagePart, {
          [styles.expanded]: imageExpand,
        })}
        onMouseMove={imageControlsVisibilityHandler}
      >
        <div
          className={cn(styles.imageControls, {
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
              onEdit={editOverlayOpenHandler}
              onDelete={deleteOverlayOpenHandler}
            />
          )}
        </div>

        {!isFirstImage && (
          <Button
            className={cn(styles.navButtonPrev, {
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
            className={cn(styles.navButtonNext, {
              [styles.visible]: imageControlsVisible,
            })}
            type="button"
            title="Next image (Arrow right)"
            icon="icon_arrow_right"
            iconSize={30}
            onClick={adjacentImageLoad("next")}
          />
        )}

        {!imgInfoIsLoading && (
          <div
            className={cn(styles.imageWrapper, {
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
            <div
              className={styles.imageHighlightContainer}
              onMouseDown={selectAnchorImgFrame}
              onMouseMove={selectAnchorImgFrame}
              onMouseUp={selectAnchorImgFrame}
            >
              <div
                ref={newAnchorImgFrameRef}
                className={styles.newAnchorImgFrame}
                onClick={createAnchor}
              >
                {anchorText}
                <span>Click to create anchor.</span>
              </div>
              <div
                ref={anchorImgFrameRef}
                className={styles.anchorImgFrame}
              ></div>
              <img
                src={currentModalImage.imageURL}
                alt={currentModalImage.title}
                onLoad={onImageLoad}
              />
            </div>
          </div>
        )}

        {imageIsLoading && <Spinner side={50} />}
      </div>

      <div className={styles.nonImagePart}>
        {!imageIsLoading && (
          <>
            {" "}
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
              {userIsAuthenticated && isUserMode && (
                <div className={styles.modalControlsWrapper}>
                  <ImageMenu
                    modalImageMode={true}
                    onShare={shareOverlayOpenHandler}
                    onEdit={editOverlayOpenHandler}
                    onDelete={deleteOverlayOpenHandler}
                  />
                </div>
              )}
            </div>
            <div className={styles.tagListWrapper}>
              {currentModalImage.imageInfo.tags.length > 0 && (
                <TagList
                  tags={currentModalImage.imageInfo.tags}
                  isEditable={isUserMode}
                />
              )}
            </div>
            <div
              className={styles.descriptionWrapper}
              onMouseLeave={
                anchorSelectionImageMode ? () => null : anchorBtnHideHandler
              }
            >
              {" "}
              <div
                className={styles.anchoringModeButton}
                style={{
                  display: anchorBtnVisible ? "block" : "none",
                  top: anchorBtnCoords[1],
                  left: anchorBtnCoords[0],
                }}
              >
                <Button
                  text={anchorSelectionImageMode ? "Cancel" : "Create anchor"}
                  onClick={
                    anchorSelectionImageMode
                      ? anchorCreationCancelHandler
                      : anchorBtnConfirmHandler
                  }
                />
              </div>
              {currentModalImage.imageInfo?.description && (
                <div
                  ref={descriptionTextRef}
                  className={styles.descriptionText}
                  onMouseUp={selectAnchorText}
                >
                  <div>{currentModalImage.imageInfo.description.text}</div>
                  <DescriptionTextAnchorsLayer
                    imageDescription={currentModalImage.imageInfo.description}
                    showAnchorImgFrame={showAnchorImgFrame}
                    hideAnchorImgFrame={hideAnchorImgFrame}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Button
        type="button"
        title="Close modal image"
        className={cn(`closeBtn ${styles.desktop}`, {
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
      {editOverlayIsOpen && (
        <EditOverlay
          title={currentModalImage.imageInfo.title}
          descriptionText={currentModalImage.imageInfo.description?.text || ""}
          tags={currentModalImage.imageInfo.tags}
          tagAddHandler={tagAddHandler}
          tagDelHandler={tagDelHandler}
          onAccept={editOverlayConfirmHandler}
          onCancel={editOverlayCloseHandler}
        />
      )}
    </div>
  ) : (
    <Spinner side={50} />
  );
};

export default ModalImage;
