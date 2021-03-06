import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import { Buckets } from '/imports/collection'

Meteor.methods({
  insertBucket (req) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized')
    }

    const data = {
      extension: {
        name: req.extension.name,
        note: req.extension.note
      },
      content: [],
      ownerId: this.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    Buckets.insert(data)

    return {reason: 'バケットを追加しました'}
  }
})
