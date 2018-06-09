import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import './SeekBar.css'

import PinIcon from '../../assets/images/pin.svg'
import Level1 from '../../assets/images/level_1.svg'
import Level2 from '../../assets/images/level_2.svg'
import Level3 from '../../assets/images/level_3.svg'
import Level4 from '../../assets/images/level_4.svg'

const METER_TOTAL_ANGLE = 128
const SLOT_COUNT = 4
const SLOT_ANGLE = METER_TOTAL_ANGLE / SLOT_COUNT
const PIVOT_X = 0.5
const PIVOT_Y = 0.836
const REFERENCE_PIVOT_X = 0.5
const REFERENCE_PIVOT_Y = 0.95

export default class SeekBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      angle: 0,
      selectedIndex: props.selectedIndex || 0
    }
  }

  componentDidMount() {
    const index = this.state.selectedIndex
    this.updateMeterAngle(this.getMeterAngleByIndex(index), index)
    this.preloadMeterImage()
  }

  onTouchEvent = event => {
    const touch = event.touches[0]
    this.applyMeterAngle(touch.clientX, touch.clientY)
    event.preventDefault()
  }

  onMouseEvent = event => {
    this.applyMeterAngle(event.clientX, event.clientY)
    event.preventDefault()
  }

  applyMeterAngle = (x, y) => {
    const rawAngle = this.calculateMeterAngle(x, y, this.state.angle)
    const { angle, index } = this.getSelectedSlot(rawAngle)
    this.updateMeterAngle(angle, index)
  }

  getMeterAngleByIndex = index => {
    return index < SLOT_COUNT
      ? SLOT_ANGLE / 2 - METER_TOTAL_ANGLE / 2 + SLOT_ANGLE * index
      : 0
  }

  updateMeterAngle = (angle, index) => {
    this.setState({
      angle: angle,
      selectedIndex: index
    })
    if (this.props.onMeterChanged) {
      this.props.onMeterChanged(index)
    }
  }

  calculateMeterAngle = (x, y, defaultValue) => {
    const rect = document.getElementById('gauge').getBoundingClientRect()
    const pinCenterX = rect.left + rect.width * REFERENCE_PIVOT_X
    const pinCenterY = rect.top + rect.height * REFERENCE_PIVOT_Y
    return this.getPointAngle(x, y, pinCenterX, pinCenterY, defaultValue)
  }

  getPointAngle = (x, y, centerX, centerY, currentAngle) => {
    const distanceX = Math.abs(x - centerX)
    const distanceY = Math.abs(y - centerY)
    // noinspection JSSuspiciousNameCombination
    let angle = Math.atan2(distanceX, distanceY) * 180 / Math.PI
    if(x < centerX) {
      angle *= -1
    }
    if (Math.abs(angle) < METER_TOTAL_ANGLE / 2 && y < centerY) {
      return angle
    }
    return currentAngle
  }

  getSelectedSlot = angle => {
    let lastAngle = 0
    let lastDiffAngle = 360
    let lastSelectedIndex = 0
    let index = 0
    for (
      let compareAngle = SLOT_ANGLE / 2;
      compareAngle < METER_TOTAL_ANGLE;
      compareAngle += SLOT_ANGLE
    ) {
      const newDiffAngle = Math.abs(
        compareAngle - METER_TOTAL_ANGLE / 2 - angle
      )
      if (newDiffAngle < lastDiffAngle) {
        lastDiffAngle = newDiffAngle
        lastAngle = compareAngle - METER_TOTAL_ANGLE / 2
        lastSelectedIndex = index
      }
      index++
    }
    return { angle: lastAngle, index: lastSelectedIndex }
  }

  getMeterImage = index => {
    return [Level1, Level2, Level3, Level4][index]
  }

  preloadMeterImage = () => {
    [Level1, Level2, Level3, Level4].map(item => {
      const img = new Image()
      img.src = item
    })
  }

  render() {
    return (
      <Fragment>
        <div>
          <img
            id="gauge"
            src={this.getMeterImage(this.state.selectedIndex)}
            className="curve-seek-bar-level"
            alt="It's seek bar level"
            role="button"
            onTouchStart={this.onTouchEvent}
            onTouchMove={this.onTouchEvent}
            onClick={this.onMouseEvent}
          />
        </div>
        <img
          id="pin"
          src={PinIcon}
          style={{
            transform: `rotate(${this.state.angle}deg)`,
            transition: 'transform 100ms ease-in',
            transformOrigin: `${PIVOT_X * 100}% ${PIVOT_Y * 100}%`
          }}
          className="curve-seek-bar-pin"
          alt="It's pin"
        />
      </Fragment>
    )
  }
}

SeekBar.propTypes = {
  onMeterChanged: PropTypes.func,
  selectedIndex: PropTypes.number
}
