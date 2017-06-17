import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import IconTouchApp from 'material-ui-icons/TouchApp'

@inject('layout', 'navigation', 'router', 'users')
@observer
export default class NavigationSwipe extends Component {
  render () {
    if (!this.props.navigation.swipe) return null
    if (!this.props.layout.oneColumn) return null
    if (this.props.router.page === null) return null
    if (this.props.users.isLoggingIn) return null
    return <div onTouchTap={this.onSwipe.bind(this)}>
      <div>swipe</div>
      <div><IconTouchApp {...this.iconStyle}/></div>
    </div>
  }

  get iconStyle () {
    return {
      style: {
        width: 30,
        height: 30
      },
      color: 'white'
    }
  }

  onSwipe () {
    this.props.layout.toLeft()
  }
}
