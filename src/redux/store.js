import { configureStore, combineReducers } from '@reduxjs/toolkit';
import galleryReducer from './gallery/gallery-reducer';
import userReducer from './user/user-reducer';

const rootReducer = combineReducers({
    galleryReducer,
    userReducer
})

const store = configureStore({ reducer: rootReducer });

export default store;