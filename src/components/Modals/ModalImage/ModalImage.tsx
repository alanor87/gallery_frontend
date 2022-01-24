import { useState, useEffect } from "react";
import TagList from "components/TagList";
import { Spinner } from "components/elements";
import { Button } from "components/elements";
import ImageMenu from "components/ImageMenu";
import { ReactComponent as CloseIcon } from "../../../img/icon_close.svg";
import { ReactComponent as IconLike } from "../../../img/icon_like.svg";
import store from "../../../MST/store";
import { ImageType } from "MST/imagesStoreSettings";
import styles from "./styles.module.scss";

const ModalImage = () => {
  const { fetchImageById, editImagesInfo } = store.imagesStoreSettings;
  const { modalImageId, setModalOpen, setModalComponentType } =
    store.modalWindowsSettings;
  const { userIsAuthenticated, userName } = store.userSettings;

  const [currentModalImage, setCurrentModalImage] = useState<ImageType>();
  const [imageIsLoaded, setImageIsLoaded] = useState(false);

  useEffect(() => {
    fetchImageById(modalImageId).then((image) => {
      setCurrentModalImage(image);
    });
  }, [modalImageId, fetchImageById]);

  const onImageLoad = (e: any) => {
    setImageIsLoaded(true);
  };

  const toggleLikeHandler = async () => {
    // setimgInfoIsLoading(true);

    const { _id } = currentModalImage!;
    const { likes } = currentModalImage!.imageInfo;
    if (!likes.includes(userName)) {
      const newLikesList = [...likes, userName];
      await editImagesInfo([{ _id, imageInfo: { likes: newLikesList } }]);
    } else {
      const newLikesList = likes.filter((name) => name !== userName);
      await editImagesInfo([{ _id, imageInfo: { likes: newLikesList } }]);
    }
    // setimgInfoIsLoading(false);
  };

  const modalImageCloseHandle = () => {
    setModalOpen(false);
    setModalComponentType("none");
  };

  return currentModalImage ? (
    <div className={styles.modalImage}>
      <div className={styles.imagePart}>
        {!imageIsLoaded && <Spinner side={50} />}
        <img
          src={currentModalImage?.imageURL}
          alt={"God save the queen!"}
          onLoad={onImageLoad}
          style={{ visibility: imageIsLoaded ? "visible" : "hidden" }}
        />
      </div>
      <div className={styles.nonImagePart}>
        <div className={styles.modalImageHeader}>
          {" "}
          <h2>Image title</h2>
          <Button
            type="button"
            title="Close tag editor"
            className={styles.modalImageCloseBtn}
            icon={CloseIcon}
            onClick={modalImageCloseHandle}
          />
          <div className={styles.imageControlsWrapper}>
            <Button
              type="button"
              icon={IconLike}
              onClick={toggleLikeHandler}
              className={styles.menuButton}
              text={currentModalImage.imageInfo.likes.length}
              disabled={!userIsAuthenticated}
              title="Like / Dislike"
            />
          </div>
        </div>

        <div className={styles.description}>
          {" "}
          <div className={styles.tagListWrapper}>
            {currentModalImage.imageInfo.tags.length > 0 && (
              <TagList
                tags={currentModalImage.imageInfo.tags}
                isTagDeletable={false}
              />
            )}
          </div>
          <p>
            Description of the image. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Rerum accusamus hic distinctio nesciunt temporibus
            accusantium aliquam quisquam eligendi eveniet enim facilis nisi ad
            officiis qui, iusto blanditiis labore exercitationem. Voluptatem
            consectetur molestiae nemo debitis maiores ab tenetur, natus
            excepturi. Maiores ex hic assumenda molestias rem minima laborum
            labore natus animi eum. Explicabo ipsam temporibus molestias
            assumenda numquam officiis sint amet placeat. Eos minus aliquam
            ratione illo dicta, distinctio a adipisci, rerum hic ex pariatur
            corrupti odit sit nesciunt accusamus! Minus sunt error sint? Est
            veritatis possimus nobis placeat. Vel nostrum facilis soluta
            adipisci explicabo ratione aliquam mollitia reprehenderit delectus
            neque.
          </p>
          <p>
            Description of the image. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Rerum accusamus hic distinctio nesciunt temporibus
            accusantium aliquam quisquam eligendi eveniet enim facilis nisi ad
            officiis qui, iusto blanditiis labore exercitationem. Voluptatem
            consectetur molestiae nemo debitis maiores ab tenetur, natus
            excepturi. Maiores ex hic assumenda molestias rem minima laborum
            labore natus animi eum. Explicabo ipsam temporibus molestias
            assumenda numquam officiis sint amet placeat. Eos minus aliquam
            ratione illo dicta, distinctio a adipisci, rerum hic ex pariatur
            corrupti odit sit nesciunt accusamus! Minus sunt error sint? Est
            veritatis possimus nobis placeat. Vel nostrum facilis soluta
            adipisci explicabo ratione aliquam mollitia reprehenderit delectus
            neque.
          </p>
          <p>
            Description of the image. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Rerum accusamus hic distinctio nesciunt temporibus
            accusantium aliquam quisquam eligendi eveniet enim facilis nisi ad
            officiis qui, iusto blanditiis labore exercitationem. Voluptatem
            consectetur molestiae nemo debitis maiores ab tenetur, natus
            excepturi. Maiores ex hic assumenda molestias rem minima laborum
            labore natus animi eum. Explicabo ipsam temporibus molestias
            assumenda numquam officiis sint amet placeat. Eos minus aliquam
            ratione illo dicta, distinctio a adipisci, rerum hic ex pariatur
            corrupti odit sit nesciunt accusamus! Minus sunt error sint? Est
            veritatis possimus nobis placeat. Vel nostrum facilis soluta
            adipisci explicabo ratione aliquam mollitia reprehenderit delectus
            neque.
          </p>
          <p>
            Description of the image. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Rerum accusamus hic distinctio nesciunt temporibus
            accusantium aliquam quisquam eligendi eveniet enim facilis nisi ad
            officiis qui, iusto blanditiis labore exercitationem. Voluptatem
            consectetur molestiae nemo debitis maiores ab tenetur, natus
            excepturi. Maiores ex hic assumenda molestias rem minima laborum
            labore natus animi eum. Explicabo ipsam temporibus molestias
            assumenda numquam officiis sint amet placeat. Eos minus aliquam
            ratione illo dicta, distinctio a adipisci, rerum hic ex pariatur
            corrupti odit sit nesciunt accusamus! Minus sunt error sint? Est
            veritatis possimus nobis placeat. Vel nostrum facilis soluta
            adipisci explicabo ratione aliquam mollitia reprehenderit delectus
            neque.
          </p>
        </div>
      </div>
    </div>
  ) : (
    <Spinner side={50} />
  );
};

export default ModalImage;
