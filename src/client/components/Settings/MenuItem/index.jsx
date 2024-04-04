

import React from 'react'
import PropTypes from 'prop-types'

class MenuItem extends React.Component {
  render () {
    const { title, content, active, onClick, draggable } = this.props
    const useContent = content !== undefined
    return (
      <li className={active ? ' active' : ''} onClick={onClick} data-key={this.props.dragKey}>
        <div className='setting-category'>
          {draggable && (
            <span className='drag-handle uk-display-inline-block uk-float-left mr-10'>
              <i className='material-icons'>drag_handle</i>
            </span>
          )}
          {useContent && content}
          {!useContent && <h3>{title}</h3>}
        </div>
      </li>
    )
  }
}

MenuItem.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.element,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  draggable: PropTypes.bool,
  dragKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default MenuItem
