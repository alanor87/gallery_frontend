import { types } from "mobx-state-tree";
import axios from "axios";
import interfaceSettings from './interfaceSettings'
import ImagesStore from './imagesStoreSettings'

axios.defaults.baseURL = 'http://localhost:3001';

const store = types.model({
    interfaceSettings: types.optional(interfaceSettings, {}),
    imagesStoreSettings: types.optional(ImagesStore, {})
})

export default store.create();