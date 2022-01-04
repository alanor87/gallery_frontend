import { observer } from "mobx-react-lite";
import store from "MST/store";
import styles from "./Pagination.module.scss";

const Pagination = () => {
  const {
    setImagesPerPage,
    setCurrentPage,
    currentPage,
    imagesPerPage,
    galleryMode,
  } = store.imagesStoreSettings;
  const { userOwnedImages, userOpenedToImages } = store.userSettings;
  const { publicImagesList } = store.publicSettings;

  const getGalleryImagesNumber = () => {
    switch (galleryMode) {
      case "userGallery": {
        return userOwnedImages.length;
      }
      case "sharedGallery": {
        return userOpenedToImages.length;
      }
      case "publicGallery": {
        return publicImagesList.length;
      }
    }
  };

  const getPagesNumber = () => {
    return Math.ceil(getGalleryImagesNumber() / imagesPerPage);
  };

  const getPagesList = () => {
    const pageNumbersButtonsArray = [];

    for (let i = 0; i < getPagesNumber(); i += 1) {
      pageNumbersButtonsArray.push(
        <li
          key={i}
          className={currentPage === i ? styles.currentPageNumber : undefined}
          onClick={onCurrentPageChange(i)}
        >
          {i + 1}
        </li>
      );
    }
    return pageNumbersButtonsArray;
  };

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setImagesPerPage(Number(e.target.value));
  };

  const onCurrentPageChange = (value: number) => () => {
    setCurrentPage(value);
  };

  return (
    <div className={styles.paginationContainer}>
      <p>Total images in gallery section : {getGalleryImagesNumber()}</p>
      <p>Number of images per page</p>
      <div className={styles.selectWrapper}>
        <select
          className={styles.imagesPerPageSelect}
          name="imagesPerPage"
          onChange={onSelectChange}
          defaultValue={imagesPerPage}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>

      <ul className={styles.pagesList}>{getPagesList()}</ul>
    </div>
  );
};

export default observer(Pagination);
