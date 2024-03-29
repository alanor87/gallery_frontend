import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useGetTotalImagesNumber } from "hooks";
import { Icon } from "components/elements";
import store from "MST/store";
import styles from "./Pagination.module.scss";

const Pagination = () => {
  const { currentWindowWidth } = store;
  const {
    setImagesPerPage,
    setCurrentPage,
    groupSelectModeToggle,
    clearSelectedList,
    currentPage,
    imagesPerPage,
    allFilteredImagesId,
  } = store.imagesStoreSettings;
  const totalImagesNumber = useGetTotalImagesNumber();

  const [isOpened, setIsOpened] = useState(false);

  const togglePaginationOpen = () => {
    setIsOpened(!isOpened);
  };

  const getPagesNumber = () => {
    if (allFilteredImagesId.length)
      return Math.ceil(allFilteredImagesId.length / imagesPerPage);
    return Math.ceil(totalImagesNumber / imagesPerPage);
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
    groupSelectModeToggle(false);
    setImagesPerPage(Number(e.target.value));
  };

  const onCurrentPageChange = (value: number) => () => {
    groupSelectModeToggle(false);
    clearSelectedList();
    setCurrentPage(value);
  };

  return (
    <div
      className={
        styles.paginationContainer + (isOpened ? " " + styles.isOpened : "")
      }
    >
      <div className={styles.footerOpenArrow} onClick={togglePaginationOpen}>
        <span
          className={styles.flipper + (isOpened ? " " + styles.isOpened : "")}
        >
          <Icon iconName="icon_arrow_up" side={30} />
        </span>
      </div>
      {currentWindowWidth <= 900 ? (
        <>
          <ul className={styles.pagesList}>{getPagesList()}</ul>
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
        </>
      ) : (
        <>
          <p>Number of images per page</p>
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
          <ul className={styles.pagesList}>{getPagesList()}</ul>{" "}
          <p className={styles.totalImagesCount}>
            Total images in gallery section : <span>{totalImagesNumber}</span>
          </p>
          <p className={styles.totalImagesCount}>
            Total filtered images : <span>{allFilteredImagesId.length}</span>
          </p>
        </>
      )}
    </div>
  );
};

export default observer(Pagination);
