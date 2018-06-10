import createReducer from './createReducer'
import { ActionTypeColorSettings } from '../actions/color-settings'

// let defaultState = {
//   colorBackgroundBody: { 'hsl': { 'h': 249.99999999999994, 's': 0.48148148148148157, 'l': 0.21149999999999997, 'a': 1 }, 'hex': '#251c50', 'rgb': { 'r': 37, 'g': 28, 'b': 80, 'a': 1 }, 'hsv': { 'h': 249.99999999999994, 's': 0.65, 'v': 0.3133333333333333, 'a': 1 }, 'oldHue': 249.99999999999994, 'source': 'rgb' },
//   isColorSettingsShown: true
// }

export const colorSettings = createReducer([], {
  [ActionTypeColorSettings.CHANGE_COLOR_BACKGROUND_APPBAR] (state, action) {
    return {
      ...state,
      colorBackgroundAppbar: action.payload
    }
  },
  [ActionTypeColorSettings.CHANGE_COLOR_FONT_APPBAR] (state, action) {
    return {
      ...state,
      colorFontAppbar: action.payload
    }
  },
  [ActionTypeColorSettings.CHANGE_COLOR_BACKGROUND_BODY] (state, action) {
    return {
      ...state,
      colorBackgroundBody: action.payload
    }
  },
  [ActionTypeColorSettings.CHANGE_COLOR_FONT_SLIDER] (state, action) {
    return {
      ...state,
      colorFontSlider: action.payload
    }
  },
  [ActionTypeColorSettings.CHANGE_COLOR_FONT_BUTTON] (state, action) {
    return {
      ...state,
      colorFontButton: action.payload
    }
  },
  [ActionTypeColorSettings.CHANGE_COLOR_BACKGROUND_BUTTONS] (state, action) {
    return {
      ...state,
      colorBackgroundButtons: action.payload
    }
  },
  [ActionTypeColorSettings.SHOW_COLOR_SETTINGS] (state, action) {
    return {
      ...state,
      isColorSettingsShown: !state.isColorSettingsShown
    }
  }
})
