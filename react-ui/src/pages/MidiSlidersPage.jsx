import { withStyles } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiAccessAction from '../actions/midi-access.js'
import * as ColorSettingsActions from '../actions/color-settings'
import ChannelStripList from '../components/channel-strip-list/ChannelStripList'
import { SketchPicker } from 'react-color'

class MidiSlidersPage extends React.Component {
  state = {
    kindOfColorToChange: 'colorBackgroundBody'
  }

  constructor (props) {
    super(props)
    this.detectChromeBrowser()

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({ sysex: true })
        .then(this.onMIDISuccess, this.onMIDIFailure)
    } else {
      window.alert('WebMIDI is not supported in this browser.')
    }
  }

  render () {
    const { classes, colorSettings } = this.props
    return (
      <div
        className={this.props.classes.root}
        style={this.getBackgroundStyle(colorSettings.colorBackgroundBody)}
      >
        {
          colorSettings.isColorSettingsShown ? (
            <div style={{
              textAlign: 'right',
              paddingTop: 8 }}
            >
              <FormControl className={classes.formControl}>
                <InputLabel
                  className={classes.label}
                  style={colorSettings.colorFontSlider ? {color: colorSettings.colorFontSlider.hex} : {}}
                  htmlFor='cc'>
                Color Settings
                </InputLabel>
                <Select
                  className={classes.select}
                  style={colorSettings.colorFontSlider ? {color: colorSettings.colorFontSlider.hex} : {}}
                  onChange={e => this.setState({ kindOfColorToChange: e.target.value })}
                  value={this.state.kindOfColorToChange}>
                  <MenuItem key={`color-background-appbar`} value='colorBackgroundAppbar'>AppBar Background Color</MenuItem>
                  <MenuItem key={`color-font-appbar`} value='colorFontAppbar'>AppBar Font Color</MenuItem>
                  <MenuItem key={`color-background-body`} value='colorBackgroundBody'>Body Background Color</MenuItem>
                  <MenuItem key={`color-font-slider`} value='colorFontSlider'>Slider Font Color</MenuItem>
                  <MenuItem key={`color-font-button`} value='colorFontButton'>Slider Button Color</MenuItem>
                  <MenuItem key={`color-background-button`} value='colorBackgroundButtons'>Button Background Color</MenuItem>
                </Select>
              </FormControl>
              <div style={{
                width: 200,
                margin: 'auto',
                position: 'absolute',
                zIndex: 999,
                right: 50
              }}>
                {
                  this.renderColorPickers()
                }
              </div>
            </div>
          ) : (
            ''
          )
        }
        <ChannelStripList />
      </div>
    )
  }

  renderColorPickers = () => {
    if (this.state.kindOfColorToChange === 'colorBackgroundBody') {
      const colorBody = this.props.colorSettings.colorBackgroundBody
      return this.renderColorPicker(colorBody, this.props.actionsColorSettings.changeColorBackgroundBody)
    } else if (this.state.kindOfColorToChange === 'colorBackgroundAppbar') {
      const color = this.props.colorSettings.colorBackgroundAppbar
      return this.renderColorPicker(color, this.props.actionsColorSettings.changeColorBackgroundAppbar)
    } else if (this.state.kindOfColorToChange === 'colorBackgroundButtons') {
      const color = this.props.colorSettings.colorBackgroundButtons
      return this.renderColorPicker(color, this.props.actionsColorSettings.changeColorBackgroundButtons)
    } else if (this.state.kindOfColorToChange === 'colorFontSlider') {
      const color = this.props.colorSettings.colorFontSlider
      return this.renderColorPicker(color, this.props.actionsColorSettings.changeColorFontSlider)
    } else if (this.state.kindOfColorToChange === 'colorFontButton') {
      const color = this.props.colorSettings.colorFontButton
      return this.renderColorPicker(color, this.props.actionsColorSettings.changeColorFontButton)
    } else if (this.state.kindOfColorToChange === 'colorFontAppbar') {
      const color = this.props.colorSettings.colorFontAppbar
      return this.renderColorPicker(color, this.props.actionsColorSettings.changeColorFontAppbar)
    } else {
      return (<div />)
    }
  }

  renderColorPicker = (color, cb) => {
    return (
      <SketchPicker
        color={color && color.hsl}
        onChange={val => cb(val)}
      />
    )
  }

  getBackgroundStyle = (colorBody) => (colorBody ? { backgroundColor: `rgba(${colorBody.rgb.r}, ${colorBody.rgb.g}, ${colorBody.rgb.b}, ${colorBody.rgb.a})` } : {})

  onMIDISuccess = (midiAccess) => {
    this.props.actions.initMidiAccess({ midiAccess })
  }

  onMIDIFailure = () => {
    window.alert('Could not access your MIDI devices.')
  }

  detectChromeBrowser = () => {
    var isChromium = window.chrome
    var winNav = window.navigator
    var vendorName = winNav.vendor
    var isOpera = typeof window.opr !== 'undefined'
    var isIEedge = winNav.userAgent.indexOf('Edge') > -1
    var isIOSChrome = winNav.userAgent.match('CriOS')

    if (isIOSChrome) {
      console.log('is Google Chrome on IOS')
      window.alert('sry, is Google Chrome on IOS')
    } else if (
      isChromium !== null &&
      typeof isChromium !== 'undefined' &&
      vendorName === 'Google Inc.' &&
      isOpera === false &&
      isIEedge === false
    ) {
      console.log('is Google Chrome :-)')
    } else {
      console.log('not Google Chrome')
      window.alert('Sry. This App will only work with Google Chrome Browser.')
    }
  }
}

const styles = theme => ({
  root: {
    textAlign: 'center',
    // background: theme.palette.primary.main,
    width: '100%'
  },
  heading: {
    marginTop: theme.spacing.unit * 2
  },
  formControl: {
    textAlign: 'right',
    marginRight: theme.spacing.unit * 5,
    maxWidth: 200,
    color: theme.palette.primary.light
  },
  label: {
    color: theme.palette.primary.contrastText
  }
})

function mapStateToProps (state) {
  return {
    colorSettings: state.colorSettings
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiAccessAction, dispatch),
    actionsColorSettings: bindActionCreators(ColorSettingsActions, dispatch)
  }
}

export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MidiSlidersPage)))
