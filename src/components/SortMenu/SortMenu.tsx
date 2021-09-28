import { useDispatch } from "react-redux";
import { onChangeSortMethod } from "../../redux/gallery/gallery-actions";
import styles from "./SortMenu.module.scss";

console.log(styles);

const SortMenu = () => {
  const dispatch = useDispatch();
  const onSortChange = (event) => {
    const sortMethod = event.target.value;
    dispatch(onChangeSortMethod(sortMethod));
  };

  return (
    <div className={styles.sortMenu}>
      <span>Sorting options:</span>
      <select onChange={onSortChange} className={styles.sortOptions}>
        <option value="">--Please choose an option--</option>
        <option value="mostLiked">Most liked first</option>
        <option value="mostCommented">Most commented first</option>
        <option value="leastLiked">Least liked first</option>
        <option value="leastCommented">Least commented first</option>
      </select>
    </div>
  );
};

export default SortMenu;
