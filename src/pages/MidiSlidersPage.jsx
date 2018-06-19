import { withStyles, Typography } from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiAccessAction from '../actions/midi-access.js'
import ChannelStripList from '../components/channel-strip-list/ChannelStripList'

class MidiSlidersPage extends React.Component {
  state = {
    open: false,
    hasMidi: true
  };

  constructor (props) {
    super(props)
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({ sysex: true })
        .then(this.onMIDISuccess, this.onMIDIFailure)
    } else {
      window.alert('WebMIDI is not supported in this browser.')
    }
  }

  render () {
    if (this.state.hasMidi) {
      return (
        <div className={this.props.classes.root}>
          <ChannelStripList />
        </div>
      )
    } else {
      return (
        <Typography variant='display1' className={this.props.classes.noMidiTypography}>
          Cannot find any available MIDI-Drivers to connect for.
          <br />
          We suggest to create at first a virtual midi driver or
          <br />
          plug in your favourite MIDI Device.
          <br />
          <br />
          After that, please reload the browser page to see the application in action like this:
          <br />
          <br />
          <img width='50%' src='midi-sliders-screenshot.png' />
        </Typography>
      )
    }
  }

  onMIDISuccess = (midiAccess) => {
    if (midiAccess.outputs.size > 0) {
      this.props.actions.initMidiAccess({midiAccess})
    } else {
      this.setState({hasMidi: false})
      console.log('There are not midi-drivers available. Tip: Please create a virtual midi driver at first and then restart the application.')
    }
  }

  onMIDIFailure = () => {
    window.alert('Could not access your MIDI devices.')
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
  noMidiTypography: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 4
  }
})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiAccessAction, dispatch)
  }
}

export default (withStyles(styles)(connect(null, mapDispatchToProps)(MidiSlidersPage)))
