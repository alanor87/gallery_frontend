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

  const getPagesNumbers = () => {
    let pagesNumber;
    switch (galleryMode) {
      case "userGallery": {
        pagesNumber = Math.ceil(userOwnedImages.length / imagesPerPage);
        break;
      }
      case "sharedGallery": {
        pagesNumber = Math.ceil(userOpenedToImages.length / imagesPerPage);
        break;
      }
      case "publicGallery": {
        pagesNumber = Math.ceil(publicImagesList.length / imagesPerPage);
        break;
      }
    }
    const pageNumbersButtonsArray = [];

    for (let i = 0; i < pagesNumber; i += 1) {
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
      <div className={styles.selectWrapper}>
        <p>Number of images per page</p>
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

      <ul className={styles.pagesList}>{getPagesNumbers()}</ul>
    </div>
  );
};

export default observer(Pagination);
