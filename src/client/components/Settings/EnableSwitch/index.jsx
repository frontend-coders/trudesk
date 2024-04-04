

import React, { createRef } from 'react'
import PropTypes from 'prop-types'
import { merge } from 'lodash'
import clsx from 'clsx'

class EnableSwitch extends React.Component {
  labelRef = createRef()

  onLevelClick (e) {
    e.preventDefault()
    if (this.labelRef.current) {
      this.labelRef.current.click()
    }
  }

  render () {
    const combinedStyle = merge({ margin: '17px 0 0 0' }, this.props.style)
    return (
      <div className='md-switch-wrapper md-switch md-green uk-float-right uk-clearfix' style={combinedStyle}>
        <label ref={this.labelRef} htmlFor={this.props.stateName} style={this.props.labelStyle || {}}>
          {this.props.label}
          {this.props.sublabel}
        </label>

        <input
          type='checkbox'
          id={this.props.stateName}
          name={this.props.stateName}
          onChange={this.props.onChange}
          checked={this.props.checked}
          disabled={this.props.disabled}
        />
        <span className={clsx('lever', this.props.leverClass)} onClick={e => this.onLevelClick(e)} />
      </div>
    )
  }
}

EnableSwitch.propTypes = {
  stateName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelStyle: PropTypes.object,
  sublabel: PropTypes.node,
  style: PropTypes.object,
  leverClass: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
}

export default EnableSwitch
