import { useState, useEffect, useCallback } from "react";
import { Spinner, Button, Icon } from "components/elements";
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
  const { modalImageId, setModalImageId, setModalOpen, setModalComponentType } =
    store.modalWindowsSettings;
  const { userIsAuthenticated, userName, userOwnedImages, userOpenedToImages } =
    store.userSettings;

  const [currentImagesIdList, setCurrentImagesIdList] = useState<string[]>([]);
  const [currentModalImage, setCurrentModalImage] = useState<
    ImageType | undefined
  >(undefined);
  const [currentImageIndex, setCurrentImageIndex] = useState<Number>();
  const [imgInfoIsLoading, setimgInfoIsLoading] = useState(false);
  const [imageIsLoading, setImageIsLoading] = useState(true);
  const [imageExpand, setimageExpand] = useState(false);
  const [modalImageLikes, setModalImageLikes] = useState<string[]>([]);
  const [tagEditorIsOpen, setTagEditorIsOpen] = useState(false);
  const [shareOverlayIsOpen, setShareOverlayIsOpen] = useState(false);
  const [deleteOverlayIsOpen, setDeleteOverlayIsOpen] = useState(false);

  const loadModalImage = useCallback(async () => {
    setImageIsLoading(true);
    setimgInfoIsLoading(true);
    const newModalImage: any = await fetchImageById(modalImageId);
    setModalImageLikes(newModalImage.imageInfo.likes);
    setCurrentModalImage(newModalImage);
    setimgInfoIsLoading(false);
  }, [modalImageId, fetchImageById]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    loadModalImage();
    setCurrentImageIndex(currentImagesIdList.indexOf(modalImageId));
  }, [modalImageId, loadModalImage, currentImagesIdList]);

  const onImageLoad = () => {
    setImageIsLoading(false);
  };

  const getPagesNumber = () => {
    if (allFilteredImagesId.length)
      return Math.ceil(allFilteredImagesId.length / imagesPerPage);
    return Math.ceil(currentImagesIdList.length / imagesPerPage);
  };

  // Accepts the direction - if the previous or next image btn was clicked, and defines if
  // the current image is still among those that are on the current page - therefere -
  // in the current images object in imagesStoreSettings. If it is not - the new page request
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
  // by the prev/next image buttons with "prev" or "next" arguments respectively.
  // Depending on this direction mark - the index of the next image is being defined in the
  // currentImagesIdList, being set as currentImageIndex - and the pageShiftCheck is invoked
  // to check if the previous or next page should be loaded in case,
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

  const toggleLikeHandler = async () => {
    const { _id } = currentModalImage!;
    let newLikesList: string[] = [];
    if (!modalImageLikes.includes(userName)) {
      newLikesList = [...modalImageLikes, userName];
    } else {
      newLikesList = modalImageLikes.filter((name) => name !== userName);
    }
    // Likes are stored in separate state in the modalimage component itself -
    // to avoid rerendering all the component when the like button is clicked.
    await editImagesInfo([{ _id, imageInfo: { likes: newLikesList } }]);
    setModalImageLikes(newLikesList);
  };

  const nonImagePartToggleHandler = () => {
    setimageExpand(!imageExpand);
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
  };

  const isUserMode = getCurrentGalleryMode === "userGallery";
  return currentModalImage ? (
    <div className={styles.modalImage}>
      <div
        className={
          imageExpand
            ? styles.imagePart + " " + styles.expanded
            : styles.imagePart
        }
      >
        <div className={styles.imageControls}>
          <Button
            icon="icon_fullscreen"
            title="Expand/shrink image"
            iconSize={20}
            onClick={nonImagePartToggleHandler}
          />
          {userIsAuthenticated && isUserMode && (
            <ImageMenu
              modalImageMode={true}
              onShare={shareOverlayOpenHandler}
              onDelete={deleteOverlayOpenHandler}
            />
          )}
        </div>
        <div className={styles.imageNav}>
          <Button
            className={styles.navButton}
            type="button"
            title="Previous image"
            icon="icon_arrow_left"
            iconSize={30}
            onClick={adjacentImageLoad("prev")}
            disabled={currentImageIndex === 0}
          />
          <Button
            className={styles.navButton}
            type="button"
            title="Previous image"
            icon="icon_arrow_right"
            iconSize={30}
            onClick={adjacentImageLoad("next")}
            disabled={currentImageIndex === currentImagesIdList.length - 1}
          />
        </div>
        {imageIsLoading && <Spinner side={50} />}
        {!imgInfoIsLoading && (
          <div className={styles.imageWrapper}>
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
        <>
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
              <h2>Image title</h2>
              <Button
                type="button"
                title="Close tag editor"
                className="closeBtn"
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
              Description of the image. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Rerum accusamus hic distinctio nesciunt
              temporibus accusantium aliquam quisquam eligendi eveniet enim
              facilis nisi ad officiis qui, iusto blanditiis labore
              exercitationem. Voluptatem consectetur molestiae nemo debitis
              maiores ab tenetur, natus excepturi. Maiores ex hic assumenda
              molestias rem minima laborum labore natus animi eum. Explicabo
              ipsam temporibus molestias assumenda numquam officiis sint amet
              placeat. Eos minus aliquam ratione illo dicta, distinctio a
              adipisci, rerum hic ex pariatur corrupti odit sit nesciunt
              accusamus! Minus sunt error sint? Est veritatis possimus nobis
              placeat. Vel nostrum facilis soluta adipisci explicabo ratione
              aliquam mollitia reprehenderit delectus neque.
            </p>
            <p>
              Description of the image. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Rerum accusamus hic distinctio nesciunt
              temporibus accusantium aliquam quisquam eligendi eveniet enim
              facilis nisi ad officiis qui, iusto blanditiis labore
              exercitationem. Voluptatem consectetur molestiae nemo debitis
              maiores ab tenetur, natus excepturi. Maiores ex hic assumenda
              molestias rem minima laborum labore natus animi eum. Explicabo
              ipsam temporibus molestias assumenda numquam officiis sint amet
              placeat. Eos minus aliquam ratione illo dicta, distinctio a
              adipisci, rerum hic ex pariatur corrupti odit sit nesciunt
              accusamus! Minus sunt error sint? Est veritatis possimus nobis
              placeat. Vel nostrum facilis soluta adipisci explicabo ratione
              aliquam mollitia reprehenderit delectus neque.
            </p>
            <p>
              Description of the image. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Rerum accusamus hic distinctio nesciunt
              temporibus accusantium aliquam quisquam eligendi eveniet enim
              facilis nisi ad officiis qui, iusto blanditiis labore
              exercitationem. Voluptatem consectetur molestiae nemo debitis
              maiores ab tenetur, natus excepturi. Maiores ex hic assumenda
              molestias rem minima laborum labore natus animi eum. Explicabo
              ipsam temporibus molestias assumenda numquam officiis sint amet
              placeat. Eos minus aliquam ratione illo dicta, distinctio a
              adipisci, rerum hic ex pariatur corrupti odit sit nesciunt
              accusamus! Minus sunt error sint? Est veritatis possimus nobis
              placeat. Vel nostrum facilis soluta adipisci explicabo ratione
              aliquam mollitia reprehenderit delectus neque.
            </p>
            <p>
              Description of the image. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Rerum accusamus hic distinctio nesciunt
              temporibus accusantium aliquam quisquam eligendi eveniet enim
              facilis nisi ad officiis qui, iusto blanditiis labore
              exercitationem. Voluptatem consectetur molestiae nemo debitis
              maiores ab tenetur, natus excepturi. Maiores ex hic assumenda
              molestias rem minima laborum labore natus animi eum. Explicabo
              ipsam temporibus molestias assumenda numquam officiis sint amet
              placeat. Eos minus aliquam ratione illo dicta, distinctio a
              adipisci, rerum hic ex pariatur corrupti odit sit nesciunt
              accusamus! Minus sunt error sint? Est veritatis possimus nobis
              placeat. Vel nostrum facilis soluta adipisci explicabo ratione
              aliquam mollitia reprehenderit delectus neque.
            </p>
          </div>
        </>
      </div>

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
