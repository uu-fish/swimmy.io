import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import IconButton from 'material-ui/IconButton'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import classNames from 'classnames'

export const styles = theme => {
  return {
    expand: {
      transform: 'rotate(0deg)',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: 'rotate(180deg)'
    }
  }
}

@withStyles(styles)
export default class IconButtonMoreExpand extends Component {
  render () {
    const {isExpand, classes, ...other} = this.props
    return (
      <IconButton
        {...other}
        className={classNames(
          classes.expand,
          {[classes.expandOpen]: isExpand}
        )}
        onClick={this.props.onClick}>
        <ExpandMoreIcon />
      </IconButton>
    )
  }
}
