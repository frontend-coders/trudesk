

import React from 'react'
import PropTypes from 'prop-types'

class SettingSubItem extends React.Component {
  render () {
    const { parentClass, title, titleCss, subtitle, component, tooltip } = this.props
    const headCss = titleCss ? titleCss : { fontWeight: 'normal' }
    return (
      <div className={parentClass}>
        <div className='uk-float-left uk-width-1-2'>
          <h5 style={headCss}>
            {title}
            {tooltip && (
              <i
                className='material-icons'
                style={{ color: '#888', fontSize: '14px', cursor: 'pointer', lineHeight: '3px', marginLeft: '4px' }}
                data-uk-tooltip
                title={tooltip}
              >
                error
              </i>
            )}
          </h5>
          <div className='p uk-text-muted'>{subtitle}</div>
        </div>
        <div className='uk-float-right uk-width-1-2 uk-clearfix' style={{ position: 'relative', marginTop: '5px' }}>
          <div className='uk-width-1-1 uk-float-right'>{component}</div>
        </div>
      </div>
    )
  }
}

SettingSubItem.propTypes = {
  parentClass: PropTypes.string,
  title: PropTypes.string.isRequired,
  titleCss: PropTypes.object,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]),
  tooltip: PropTypes.string,
  component: PropTypes.element
}

SettingSubItem.defaultProps = {
  parentClass: ''
}

export default SettingSubItem
