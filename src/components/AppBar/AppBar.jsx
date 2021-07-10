import React from "react";
import { useDispatch } from "react-redux";
import { debounce } from 'debounce';
import {
  onChangeSortMethod,
  onChangeFilter,
} from "../../redux/gallery/gallery-actions";

export default function AppBar({ onChangeQuery }) {
  const dispatch = useDispatch();

  const onSortChange = (event) => {
    const sortMethod = event.target.value;
    dispatch(onChangeSortMethod(sortMethod));
  };

  const onFilterChange = (event) => {
    const filterValue = event.target.value;
    console.log(filterValue);
    dispatch(onChangeFilter(filterValue));
  };

  return (
    <header className="section-header">
      <input
        type="text"
        className="search-input"
        placeholder="Search"
        autoComplete="off"
        onKeyUp={debounce(onFilterChange, 300)}
      />
      <label htmlFor="pet-select">Sorting options:</label>

      <select onChange={onSortChange} name="sort" id="sort-options">
        <option value="">--Please choose an option--</option>
        <option value="mostLiked">Most liked first</option>
        <option value="mostCommented">Most commented first</option>
        <option value="leastLiked">Least liked first</option>
        <option value="leastCommented">Least commented first</option>
      </select>
    </header>
  );
}
