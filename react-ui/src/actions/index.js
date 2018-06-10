import * as MidiSliderActions from './midi-sliders'
import * as MidiAccessActions from './midi-access'
import * as ColorSettingActions from './color-settings'

export const ActionCreators = Object.assign({}, MidiAccessActions, MidiSliderActions, ColorSettingActions)
