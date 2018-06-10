import * as MidiSliderActions from './midi-sliders'
import * as MidiAccessActions from './midi-access'
import * as FileActions from './save-and-load'
import * as ColorSettingActions from './color-settings'

export const ActionCreators = Object.assign({}, MidiAccessActions, MidiSliderActions, FileActions, ColorSettingActions)
