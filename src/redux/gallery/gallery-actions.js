import { createAction } from "@reduxjs/toolkit";

export const fetchImagesSuccess = createAction('gallery/fetchImagesSuccess');
export const fetchImagesError = createAction('gallery/fetchImagesError');
export const getImageDetails = createAction('gallery/getImageDetails');
export const onChangeFilter = createAction('gallery/changeFilter');
export const onChangeSortMethod = createAction('gallery/changeSortMethod');
export const onTagsEdit = createAction('gallery/tagsEdit');

