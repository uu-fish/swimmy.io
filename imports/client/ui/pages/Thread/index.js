import { inject, observer } from 'mobx-react'
import compose from 'ramda/src/compose'
import React, { Component } from 'react'

import Layout from '/imports/client/ui/components/Layout'
import NowLoading from '/imports/client/ui/components/NowLoading'
import ChannelInfo from '/imports/client/ui/containers/ChannelInfo'
import PostRes from '/imports/client/ui/containers/CardRes/index'
import withPosts from '/imports/client/ui/hocs/withThreadPosts'
import withRouter from '/imports/client/ui/hocs/withRouter'
import withScrollTop from '/imports/client/ui/hocs/withScrollTop'

class Thread extends Component {
  render () {
    return (
      <Layout dense>
        {this.props.info.channel && <ChannelInfo />}
        {this.forPosts}
      </Layout>
    )
  }

  get forPosts () {
    if (this.props.posts.data.length === 0) {
      return this.props.posts.loading && <NowLoading />
    }
    return this.props.posts.data.map(item => <PostRes key={item._id} {...item} />)
  }
}

export default compose(
  withRouter,
  withPosts({}, {}, 'thread'),
  withScrollTop,
  inject(stores => ({info: stores.info})),
  observer
)(Thread)
