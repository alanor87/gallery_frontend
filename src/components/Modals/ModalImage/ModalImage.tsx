import { useState, useEffect, useCallback } from "react";
import { Spinner, Button } from "components/elements";
import TagList from "components/TagList";
import ImageMenu from "components/ImageMenu";
import ShareOverlay from "components/Overlays/ShareOverlay";
import DeleteOverlay from "components/Overlays/DeleteOverlay";
import TagEditor from "../../TagEditor";
import store from "../../../MST/store";
import { ImageType } from "MST/imagesStoreSettings";
import styles from "./styles.module.scss";

const ModalImage = () => {
  const { fetchImageById, editImagesInfo, getCurrentGalleryMode } =
    store.imagesStoreSettings;
  const { modalImageId, setModalImageId, setModalOpen, setModalComponentType } =
    store.modalWindowsSettings;
  const { userIsAuthenticated, userName } = store.userSettings;

  const [currentModalImage, setCurrentModalImage] = useState<ImageType>();
  const [imgInfoIsLoading, setimgInfoIsLoading] = useState(false);
  const [imageIsLoading, setImageIsLoading] = useState(true);
  const [tagEditorIsOpen, setTagEditorIsOpen] = useState(false);
  const [shareOverlayIsOpen, setShareOverlayIsOpen] = useState(false);
  const [deleteOverlayIsOpen, setDeleteOverlayIsOpen] = useState(false);

  const loadModalImage = useCallback(
    () =>
      fetchImageById(modalImageId).then((image) => {
        setCurrentModalImage(image);
      }),
    []
  );

  useEffect(() => {
    loadModalImage();
  }, [modalImageId, fetchImageById, loadModalImage]);

  const onImageLoad = () => {
    setImageIsLoading(false);
  };

  const toggleLikeHandler = async () => {
    const { _id } = currentModalImage!;
    const { likes } = currentModalImage!.imageInfo;

    setimgInfoIsLoading(true);
    let newLikesList = [];
    if (!likes.includes(userName)) {
      newLikesList = [...likes, userName];
    } else {
      newLikesList = likes.filter((name) => name !== userName);
    }
    await editImagesInfo([{ _id, imageInfo: { likes: newLikesList } }]);
    loadModalImage();
    setimgInfoIsLoading(false);
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
      <div className={styles.imagePart}>
        {imageIsLoading && <Spinner side={50} />}
        <img
          src={currentModalImage?.imageURL}
          alt={"God save the queen!"}
          onLoad={onImageLoad}
          style={{ visibility: !imageIsLoading ? "visible" : "hidden" }}
        />
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
                text={currentModalImage.imageInfo.likes.length}
                disabled={!userIsAuthenticated}
                title="Like / Dislike"
              />
              <h2>Image title</h2>
              <Button
                type="button"
                title="Close tag editor"
                className={styles.modalImageCloseBtn}
                icon="icon_close"
                onClick={modalImageCloseHandle}
              />
            </div>

            {userIsAuthenticated && isUserMode && (
              <ImageMenu
                className={styles.modalImageMenu}
                modalImageMode={true}
                onShare={shareOverlayOpenHandler}
                onDelete={deleteOverlayOpenHandler}
              />
            )}
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
        {imgInfoIsLoading && <Spinner side={50} />}
      </div>

      {shareOverlayIsOpen && (
        <ShareOverlay
          _id={currentModalImage._id}
          isPublic={currentModalImage.imageInfo.isPublic}
          openedTo={currentModalImage.imageInfo.openedTo}
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
  ) : null;
};

export default ModalImage;
