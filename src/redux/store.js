import { configureStore } from '@reduxjs/toolkit';
import galleryReducer from './gallery/gallery-reducer';

const store = configureStore({ reducer: galleryReducer });

export default store;