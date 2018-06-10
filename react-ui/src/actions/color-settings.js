
export const ActionTypeColorSettings = {
  SHOW_COLOR_SETTINGS: 'SHOW_COLOR_SETTINGS',
  CHANGE_COLOR_BACKGROUND_BODY: 'CHANGE_COLOR_BACKGROUND_BODY',
  CHANGE_COLOR_BACKGROUND_BUTTONS: 'CHANGE_COLOR_BACKGROUND_BUTTONS',
  CHANGE_COLOR_BACKGROUND_APPBAR: 'CHANGE_COLOR_BACKGROUND_APPBAR',
  CHANGE_COLOR_FONT_APPBAR: 'CHANGE_COLOR_FONT_APPBAR',
  CHANGE_COLOR_FONT_SLIDER: 'CHANGE_COLOR_FONT_SLIDER',
  CHANGE_COLOR_FONT_BUTTON: 'CHANGE_COLOR_FONT_BUTTON'
}

export function showColorSettings () {
  return {
    type: ActionTypeColorSettings.SHOW_COLOR_SETTINGS
  }
}

export function changeColorBackgroundAppbar (color) {
  return {
    type: ActionTypeColorSettings.CHANGE_COLOR_BACKGROUND_APPBAR,
    payload: color
  }
}

export function changeColorBackgroundBody (color) {
  return {
    type: ActionTypeColorSettings.CHANGE_COLOR_BACKGROUND_BODY,
    payload: color
  }
}

export function changeColorFontSlider (color) {
  return {
    type: ActionTypeColorSettings.CHANGE_COLOR_FONT_SLIDER,
    payload: color
  }
}

export function changeColorFontButton (color) {
  return {
    type: ActionTypeColorSettings.CHANGE_COLOR_FONT_BUTTON,
    payload: color
  }
}

export function changeColorFontAppbar (color) {
  return {
    type: ActionTypeColorSettings.CHANGE_COLOR_FONT_APPBAR,
    payload: color
  }
}

export function changeColorBackgroundButtons (color) {
  return {
    type: ActionTypeColorSettings.CHANGE_COLOR_BACKGROUND_BUTTONS,
    payload: color
  }
}
