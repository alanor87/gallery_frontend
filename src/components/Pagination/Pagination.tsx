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
    filteredImagesNumber,
  } = store.imagesStoreSettings;
  const { userOwnedImages, userOpenedToImages } = store.userSettings;
  const { publicImagesList } = store.publicSettings;

  const getTotalGalleryImagesNumber = () => {
    let imagesNumber;
    switch (galleryMode) {
      case "userGallery": {
        imagesNumber = userOwnedImages.length;
        break;
      }
      case "sharedGallery": {
        imagesNumber = userOpenedToImages.length;
        break;
      }
      case "publicGallery": {
        imagesNumber = publicImagesList.length;
        break;
      }
    }
    return imagesNumber;
  };

  const getPagesNumber = () => {
    if (filteredImagesNumber)
      return Math.ceil(filteredImagesNumber / imagesPerPage);
    return Math.ceil(getTotalGalleryImagesNumber() / imagesPerPage);
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
      <p className={styles.totalImagesCount}>
        Total images in gallery section :{" "}
        <span>{getTotalGalleryImagesNumber()}</span>
      </p>
      <p className={styles.totalImagesCount}>
        Total filtered images : <span>{filteredImagesNumber}</span>
      </p>
      <p>Number of images per page</p>
      <div className={styles.selectWrapper}>
        <select
          className={styles.imagesPerPageSelect}
          name="imagesPerPage"
          onChange={onSelectChange}
          value={imagesPerPage}
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
