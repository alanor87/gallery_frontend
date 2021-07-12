import React from 'react';
import PropTypes from "prop-types";

export default function Tag({ tagValue, edit, deleteTag }) {

    return (
      <li className="gallery-page-img-tag">
        <span>{tagValue}</span>
        {edit && (
          <button
            className="tag-delete-btn"
            onClick={() => deleteTag(tagValue)}
          ></button>
        )}
      </li>
    );
}

Tag.propTypes = {
    tagValue: PropTypes.string,
    edit: PropTypes.bool,
    deleteTag: PropTypes.func, 
}