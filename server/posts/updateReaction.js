import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import collections from '/lib/collections'

Meteor.methods({
  'posts.updateReaction' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized', 'ログインが必要です')

    check(req.postId, String)
    check(req.name, String)

    if (req.name === '') return

    const post = collections.posts.findOne(req.postId)

    const index = post.reactions.findIndex(item => item.name === req.name)
    const reaction = index !== -1 ? post.reactions[index] : null

    if (!reaction) {
      collections.posts.update(req.postId, {
        $push: {
          reactions: {
            name: req.name,
            ownerIds: [this.userId]
          }
        }
      })
    }

    if (reaction && reaction.ownerIds.length <= 1) {
      const hasOwner = reaction.ownerIds.find(item => item === this.userId)
      if (!hasOwner) {
        collections.posts.update(req.postId, {
          $push: {
            ['reactions.' + index + '.ownerIds']: this.userId
          }
        })
      }
      if (hasOwner) {
        collections.posts.update(req.postId, {
          $pull: {
            reactions: {name: req.name}
          }
        })
      }
    }

    if (reaction && reaction.ownerIds.length > 1) {
      const hasOwner = reaction.ownerIds.find(item => item === this.userId)
      if (!hasOwner) {
        collections.posts.update(req.postId, {
          $push: {
            ['reactions.' + index + '.ownerIds']: this.userId
          }
        })
      }
      if (hasOwner) {
        collections.posts.update(req.postId, {
          $pull: {
            ['reactions.' + index + '.ownerIds']: this.userId
          }
        })
      }
    }

    const next = collections.posts.findOne(req.postId, {
      fields: {
        ownerId: 0
      }
    })
    if (next.replyId) {
      const reply = collections.posts.findOne(post.replyId, {
        fields: {
          _id: 1,
          content: 1
        }
      })
      if (reply) {
        next.reply = reply
      } else {
        next.reply = {
          _id: next.replyId,
          content: 'この投稿は既に削除されています'
        }
      }
    }
  }
})
