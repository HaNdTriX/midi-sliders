import React, { Component } from 'react'
import VolumeSlider from './VolumeSlider'
import './App.css'

const CC_MIDI_START_VAL = 60

class App extends Component {
  state = {
    sliderEntries: [{
      val: 50,
      midiCC: CC_MIDI_START_VAL
    }],
    midiAccess: {},
    outputId: '',
    availableDrivers: [{outputId: '', name: ''}]
  }
  constructor(props) {
    super(props)
    this.detectChromeBrowser()

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({ sysex: true })
        .then(this.onMIDISuccess, this.onMIDIFailure)
    } else {
      console.log('WebMIDI is not supported in this browser.')
    }
  }
  componentWillMount() {

    const tmp = window.localStorage.getItem('slider-entries')
    if (!tmp) return
    const me = JSON.parse(tmp)

    const outputId =  JSON.parse(window.localStorage.getItem('selected-driver'))
    this.setState({ sliderEntries: me, outputId })
  }

  render() {
    return (
      <div className='App'>
        <h2>MIDI Sliders</h2>
        <select onChange={this.handleDriverSelectionChange} value={this.state.outputId}>
          {this.renderDriverSelection()}        
        </select>
        <button onClick={this.addSlider}>Add Slider</button>
        <div className='sliders'>
          {this.renderSliders()}
        </div>
      </div>
    )
  }

  renderDriverSelection = () => {
    return this.state.availableDrivers.map( (item, idx) => {
      return (
        <option key={`driver-${idx}`} value={item.outputId}>{item.name}</option>
      )
    } )
  }

  renderSliders = () => {
    const entries = this.state.sliderEntries
    return entries.map((sliderEntry, idx) => {
      return (
        <div key={`slider-${idx}`}  >
          <VolumeSlider value={entries[idx].val} onChange={val => this.handleSliderChange(val, idx)} />
          <p>{entries[idx].val}</p>
          <p>CC:</p>
          <input id="number" type="number" name={`slider-name-${idx}`} value={entries[idx].midiCC} onChange={this.handleCcChange} />
          <br />
          <button onClick={this.handleRemoveClick.bind(this, idx)}>remove</button>
        </div>
      )
    })
  }

  handleDriverSelectionChange = (e) => {
    this.setState({outputId: e.target.value}, () => this.saveToLocalStorage())
  }

  handleRemoveClick = (idx) => {
    let sliderEntries = this.state.sliderEntries
    if (idx > -1) {
      sliderEntries.splice(idx, 1)
    }
    this.setState({
      sliderEntries
    }, this.saveToLocalStorage())
  }
  handleCcChange = (e) => {
    let sliderEntries = this.state.sliderEntries
    const tmp = e.target.name.split('-')
    const idx = tmp[tmp.length - 1]
    sliderEntries[idx].midiCC = e.target.value
    this.setState({ sliderEntries }, this.saveToLocalStorage())
  }

  addSlider = () => {
    const sliderEntries = this.state.sliderEntries

    const entry = {
      val: 80,
      midiCC: parseInt(sliderEntries.length > 0 ? sliderEntries[sliderEntries.length - 1].midiCC : 59) + 1 //count up last entry
    }

    const newEntries = [...sliderEntries, entry]
    this.setState({
      sliderEntries: newEntries
    }, () => this.saveToLocalStorage())
  }

  handleSliderChange = (val, idx) => {
    let sliderEntries = this.state.sliderEntries
    sliderEntries[idx].val = val
    const midiCC = sliderEntries[idx].midiCC
    var ccMessage = [0xb0, midiCC, parseInt(val)];
    var output = this.state.midiAccess.outputs.get(this.state.outputId);
    output.send(ccMessage);  //omitting the timestamp means send immediately.
    this.setState({
      sliderEntries
    }, this.saveToLocalStorage())
  }

  saveToLocalStorage = () => {
    window.localStorage.setItem('slider-entries', JSON.stringify(this.state.sliderEntries))
    window.localStorage.setItem('selected-driver', JSON.stringify(this.state.outputId))
  }

  onMIDISuccess = (midiAccess) => {
    this.setState({ midiAccess })

    this.listInputsAndOutputs()

    var inputs = midiAccess.inputs
    var outputs = midiAccess.outputs

    var inputIterators = inputs.values()
    var firstInput = inputIterators.next().value
    if (firstInput) {
      firstInput.onmidimessage = this.handleMidiMessage
    }

  }

  onMIDIFailure = () => {
    console.log('Could not access your MIDI devices.')
  }

  handleMidiMessage = (message) => {
    var command = message.data[0]
    var note = message.data[1]
    var velocity = (message.data.length > 2) ? message.data[2] : 0 // a velocity value might not be included with a noteOff command

    switch (command) {
      case 144: // noteOn
        if (velocity > 0) {
          // noteOn(note, velocity);
        } else {
          // noteOff(note);
        }
        break
      case 128: // noteOff
        // noteOff(note);
        break
      // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
    }
  }

  listInputsAndOutputs = () => {
    const midiAccess = this.state.midiAccess
    for (var entry of midiAccess.inputs) {
      var input = entry[1]
      console.log("Input port [type:'" + input.type + "'] id:'" + input.id +
        "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
        "' version:'" + input.version + "'")
    }
    let availableDrivers = []
    for (var entry of midiAccess.outputs) {
      var output = entry[1]
      console.log("Output port [type:'" + output.type + "'] id:'" + output.id +
        "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
        "' version:'" + output.version + "'")

      availableDrivers.push({outputId: output.id, name: output.name})
    }
    this.setState({availableDrivers})
  }

  detectChromeBrowser = () => {
    // please note, 
    // that IE11 now returns undefined again for window.chrome
    // and new Opera 30 outputs true for window.chrome
    // and new IE Edge outputs to true now for window.chrome
    // and if not iOS Chrome check
    // so use the below updated condition
    var isChromium = window.chrome;
    var winNav = window.navigator;
    var vendorName = winNav.vendor;
    var isOpera = typeof window.opr !== "undefined";
    var isIEedge = winNav.userAgent.indexOf("Edge") > -1;
    var isIOSChrome = winNav.userAgent.match("CriOS");

    if (isIOSChrome) {
      console.log('is Google Chrome on IOS');
      alert('is Google Chrome on IOS');
    } else if (
      isChromium !== null &&
      typeof isChromium !== "undefined" &&
      vendorName === "Google Inc." &&
      isOpera === false &&
      isIEedge === false
    ) {
      console.log('is Google Chrome :-)');
    } else {
      console.log('not Google Chrome');
      alert('Sry. This App will only work with Google Chrome Browser.');
    }
  }
}

export default App