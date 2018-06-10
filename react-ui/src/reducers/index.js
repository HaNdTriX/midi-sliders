
import { combineReducers } from 'redux'

import * as midiSliderReducer from './midi-sliders'
import * as midiAccessReducer from './midi-access'
import * as colorSettingsReducer from './color-settings'
import * as fileReducer from './save-and-load'

export default combineReducers({
  ...midiAccessReducer,
  ...midiSliderReducer,
  ...colorSettingsReducer,
  ...fileReducer
})
