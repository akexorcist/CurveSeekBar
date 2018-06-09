import React, { Component } from 'react'
import SeekBar from './components/SeekBar/SeekBar'
import './App.css'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0
    }
  }

  onMeterChanged = index => {
    this.setState({
      index: index
    })
  }
  getSelectedDescription = index => {
    return [
      "I'm very dissatisfied",
      "I'm dissatisfied",
      "I'm satisfied",
      "I'm very satisfied"
    ][index]
  }
  render() {
    return (
      <div className="App">
        <p>{this.getSelectedDescription(this.state.index)}</p>
        <SeekBar
          onMeterChanged={this.onMeterChanged}
          selectedIndex={this.state.index}
        />
      </div>
    )
  }
}
