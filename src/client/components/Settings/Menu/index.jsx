

import React from 'react'
import PropTypes from 'prop-types'

import $ from 'jquery'
import UIkit from 'uikit'

class Menu extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    if (this.props.draggable) {
      const menu = $(this.menu)
      this.menuSortable = UIkit.sortable(menu, {
        handleClass: 'drag-handle'
      })

      if (this.props.onMenuDrag) this.menuSortable.on('change.uk.sortable', this.props.onMenuDrag)
    }
  }

  componentDidUpdate () {
    if (this.props.draggable && !this.menuSortable) {
      const menu = $(this.menu)
      this.menuSortable = UIkit.sortable(menu, {
        handleClass: 'drag-handle'
      })

      if (this.props.onMenuDrag) this.menuSortable.on('change.uk.sortable', this.props.onMenuDrag)
    }
  }

  render () {
    const { hideBorders } = this.props
    return (
      <ul
        ref={i => (this.menu = i)}
        className={'settings-categories scrollable' + (hideBorders ? ' noborder ' : '')}
        style={{ overflow: 'hidden auto' }}
      >
        {this.props.children}
      </ul>
    )
  }
}

Menu.propTypes = {
  hideBorders: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  draggable: PropTypes.bool,
  onMenuDrag: PropTypes.func
}

Menu.defaultProps = {
  draggable: false
}

export default Menu
