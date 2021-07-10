import React from 'react';

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