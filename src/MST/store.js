import { types } from "mobx-state-tree";
import interfaceSettings from './interfaceSettings'

const store = types.model({
    interfaceSettings: types.optional(interfaceSettings, {})
})

export default store.create();