import React from 'react'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Tooltip from '@material-ui/core/Tooltip'
import MusicIcon from '@material-ui/icons/MusicNote'
import DeleteIcon from '@material-ui/icons/Delete'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Slider from '@material-ui/lab/Slider'

import { withStyles } from '@material-ui/core/styles'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../actions/midi-sliders.js'

const ChannelStrip = (props) => {
  const { sliderEntry, idx } = props.data
  const { classes } = props
  return (
    <div
      className={classes.sliderContainer}
    >
      {
        sliderEntry.isExpanded ? (
          <Input
            classes={{ input: classes.inputInput }}
            style={{
              ...getForegroundStyle(props.colorSettings.colorFontSlider)
            }}
            className={classes.input}
            type='text'
            onChange={e => props.actions.changeSliderLabel({
              idx,
              val: e.target.value
            })}
            value={sliderEntry.label}
          />
        ) : (
          <Typography
            className={classes.labelTop}
            style={{
              ...getForegroundStyle(props.colorSettings.colorFontSlider)
            }}
          >
            {sliderEntry.label}
          </Typography>
        )
      }

      <Slider
        classes={{
          root: classes.sliderRoot,
          vertical: classes.vertical,
          track: classes.track,
          trackAfter: classes.trackAfter,
          thumb: classes.thumb
        }}
        style={
          {
            height: !sliderEntry.isExpanded ? 'calc(100vh - 54px - 100px)' : 'calc(100vh - 34px - 452px)',
            transition: 'height 1s ease'
          }
        }
        vertical
        reverse
        value={sliderEntry.val}
        onChange={(e, val) => props.actions.handleSliderChange({ idx, val })}
        max={127}
        min={0}
        step={1}
      />
      <Typography
        className={classes.caption}
        style={{
          ...getForegroundStyle(props.colorSettings.colorFontSlider)
        }}
      >
        {sliderEntry.val}
      </Typography>

      {
        sliderEntry.isExpanded && renderExpandedStuff(props)
      }
      <div onClick={props.actions.expandSlider.bind(this, idx)}>
        {
          !sliderEntry.isExpanded ? (
            <ExpandLessIcon
              className={classes.iconColor}
              style={{
                ...getForegroundStyle(props.colorSettings.colorFontSlider)
              }}
            />
          ) : (
            <ExpandMoreIcon
              className={classes.iconColor}
              style={{
                ...getForegroundStyle(props.colorSettings.colorFontSlider)
              }} />
          )
        }
      </div>
    </div>
  )
}

const getBackgroundStyle = (clr) => (clr ? { backgroundColor: `rgba(${clr.rgb.r}, ${clr.rgb.g}, ${clr.rgb.b}, ${clr.rgb.a})` } : {})
const getForegroundStyle = (clr) => (clr ? { color: `rgba(${clr.rgb.r}, ${clr.rgb.g}, ${clr.rgb.b}, ${clr.rgb.a})` } : {})

const renderExpandedStuff = (props) => {
  const { sliderEntry, idx, availableDrivers } = props.data
  const { classes, colorSettings } = props
  return (
    <React.Fragment>

      <Tooltip
        placement='right'
        title='Trigger sending MIDI Note'
      >
        <Button
          className={classes.button}
          style={{
            ...getBackgroundStyle(colorSettings.colorBackgroundButtons)
          }}
          variant='raised'
          onClick={props.actions.triggerNote.bind(this, idx)}>
          <MusicIcon
            className={classes.iconColor}
            style={{
              ...getForegroundStyle(colorSettings.colorFontButton)
            }}
          />
        </Button>
      </Tooltip>

      <Tooltip
        placement='right'
        title='Toggle sending Note On/Off'
      >
        <Button
          className={classes.button}
          style={{
            ...getBackgroundStyle(colorSettings.colorBackgroundButtons)
          }}
          variant='raised'
          onClick={props.actions.toggleNote.bind(this, idx)}>
          <MusicIcon
            className={classes.iconColor}
            style={{
              ...getForegroundStyle(colorSettings.colorFontButton)
            }}
          />
          <Typography
            variant='caption'
            style={{
              ...getForegroundStyle(colorSettings.colorFontButton)
            }}
          >
            {sliderEntry.isNoteOn ? 'Off ' : 'On'}
          </Typography>

        </Button>
      </Tooltip>
      <Tooltip
        placement='right'
        title='You can set a CC Value or Note Message here.'
      >
        <FormControl className={classes.formControl}>
          <InputLabel
            className={classes.label}
            style={{
              ...getForegroundStyle(colorSettings.colorFontSlider)
            }}
            htmlFor='cc'
          >
            CC / Note
          </InputLabel>
          <Input
            className={classes.input}
            style={{
              ...getForegroundStyle(colorSettings.colorFontSlider)
            }}
            id='number'
            type='number'
            name={`input-cc-name-${idx}`}
            value={sliderEntry.midiCC}
            onChange={e => props.actions.selectCC({ idx, val: e.target.value })} />

        </FormControl>
      </Tooltip>
      <br />
      <Tooltip
        placement='right'
        title={getSelectedDriverName(availableDrivers, sliderEntry.outputId)}>
        <FormControl
          className={classes.formControl}
          style={{
            ...getForegroundStyle(colorSettings.colorFontSlider)
          }}
        >
          <InputLabel
            className={classes.label}
            style={{
              ...getForegroundStyle(colorSettings.colorFontSlider)
            }}
            htmlFor='cc'>Driver </InputLabel>
          <Select
            className={classes.select}
            style={{
              ...getForegroundStyle(colorSettings.colorFontSlider)
            }}
            onChange={e => props.actions.selectSliderMidiDriver({
              idx,
              val: e.target.value
            })}
            value={sliderEntry.outputId}>
            {renderDriverSelection(availableDrivers)}
          </Select>
        </FormControl>
      </Tooltip>

      <Tooltip
        placement='right'
        title='You can set the MIDI Channel here.'
      >
        <FormControl className={classes.formControl}>
          <InputLabel
            className={classes.label}
            style={{
              ...getForegroundStyle(colorSettings.colorFontSlider)
            }}
            htmlFor='cc'>Channel </InputLabel>

          <Input
            className={classes.input}
            style={{
              ...getForegroundStyle(colorSettings.colorFontSlider)
            }}
            id='number'
            type='number'
            name={`input-channel-name-${idx}`}
            value={sliderEntry.midiChannel}
            onChange={e => props.actions.selectMidiChannel({ idx, val: e.target.value })} />
        </FormControl>
      </Tooltip>
      <br />
      <Tooltip
        placement='right'
        title='Remove MIDI Channel Strip'
      >
        <Button
          className={classes.button}
          style={getBackgroundStyle(colorSettings.colorBackgroundButtons)}
          variant='raised'
          onClick={props.actions.deleteSlider.bind(this, idx)}>
          <DeleteIcon
            className={classes.iconColor}
            style={{
              ...getForegroundStyle(colorSettings.colorFontButton)
            }} />
        </Button>
      </Tooltip>
    </React.Fragment>
  )
}

const getSelectedDriverName = (drivers, outputId) => {
  let name = ''
  drivers.forEach(t => {
    if (t.outputId === outputId) {
      name = t.name
    }
  })
  return name
}

const renderDriverSelection = (availableDrivers) => {
  return availableDrivers.map((item, idx) => {
    return (
      <MenuItem key={`driver-${idx}`} value={item.outputId}>{item.name}</MenuItem>
    )
  })
}

const styles = theme => ({

  sliderContainer: {
    width: 100
  },
  vertical: {
  },
  track: {
    '&$vertical': {
      width: 5,
      border: 'solid 1px rgba(0,0,0,0.1)',
      borderRadius: 2
    }
  },
  trackAfter: {
    background: theme.palette.primary.light
  },
  thumb: {
    width: 30,
    height: 8,
    borderRadius: 2,
    border: 'solid 1px rgba(0,0,0,0.2)'
  },
  sliderRoot: {
    cursor: 'default',

    '&$vertical': {
      margin: 0,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  button: {
    margin: theme.spacing.unit,
    background: theme.palette.secondary.light
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer'
  },
  labelReadOnly: {
    padding: '6px 0 7px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  input: {
    width: 80,
    margin: theme.spacing.unit,
    color: theme.palette.primary.contrastText, // 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  },
  inputInput: {
    padding: 0
  },
  formControl: {
    // marginRight: 40,
    maxWidth: 200
  },
  labelTop: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    color: theme.palette.primary.contrastText,
    margin: theme.spacing.unit,
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  },
  label: {
    color: theme.palette.primary.contrastText
  },
  select: {
    width: 80,
    color: theme.palette.primary.contrastText,
    lineHeight: '1.375em'
  },
  caption: {
    marginTop: theme.spacing.unit,
    color: theme.palette.primary.contrastText,
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  }
})

function mapStateToProps (state) {
  return {
    colorSettings: state.storeBlob.colorSettings ||  state.colorSettings
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}

export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChannelStrip)))
