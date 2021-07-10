import { createReducer, combineReducers } from "@reduxjs/toolkit";
import {
   fetchImagesSuccess,
   fetchImagesError,
   onChangeSortMethod,
   onChangeFilter,
   onTagsEdit
} from './gallery-actions';

const images = createReducer([], {
   [fetchImagesSuccess.type]: (_, { payload }) => payload,
   [onTagsEdit.type]: (state, { payload }) => {
      const { id, imageTags } = payload;
      state.forEach(image => {
         if (image.id === id) {
            image.tags = imageTags.join(', ');
         };
      })
   }
})

const error = createReducer(false, {
   [fetchImagesError.type]: (_, { payload }) => payload,
})

const sortMethod = createReducer('', {
   [onChangeSortMethod.type]: (_, { payload }) => payload,
})

const filter = createReducer('', {
   [onChangeFilter.type]: (_, { payload }) => payload
})

export default combineReducers({
   images,
   error,
   sortMethod,
   filter,
})