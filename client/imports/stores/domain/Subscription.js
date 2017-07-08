import { Meteor } from 'meteor/meteor'
import { destroy, types } from 'mobx-state-tree'
import { Mongo } from 'meteor/mongo'

const MethodModel = types.model('MethodModel', {
  name: 'root',
  publish: types.string
}, {
  cursor: null,
  selector: null,
  options: null,
  collections: null
}, {
  setFetchState (state) {
    this.fetchState = state
  },
  setIndex (models) {
    if (Array.isArray(models)) {
      this.index = models
    } else {
      this.index = [models]
    }
  },
  pushIndex (models) {
    if (Array.isArray(models)) {
      models.forEach(model => {
        this.index.unshift(model)
      })
    } else {
      this.index.push(models)
    }
  },
  replaceIndex (model) {
    const index = this.index.findIndex(item => item._id === model._id)
    if (index !== -1) {
      try {
        this.index[index] = model
      } catch (err) {
        console.info('Subscription.' + this.publish + '.replaceIndex', err, model)
      }
    }
  },
  spliceIndex (model) {
    const index = this.index.findIndex(item => item._id === model._id)
    this.index.splice(index, 1)
  },
  setOne (model) {
    try {
      this.one = model
    } catch (err) {
      console.info('Subscription.setOne', err)
    }
  },
  unsetOne (model) {
    destroy(this.one)
  },
  setCursor (cursor) {
    this.cursor = cursor
  },
  subscribe (selector = {}, options = {}) {
    if (this.cursor) {
      const diff = [
        JSON.stringify(this.selector) === JSON.stringify(selector),
        JSON.stringify(this.options) === JSON.stringify(options)
      ]
      if (diff[0] && diff[1]) return
    }
    this.selector = selector
    this.options = options
    this.unsubscribe()
    const collectionName = this.publish + '.' + this.name
    if (!this.collections) { this.collections = new Map() }
    if (!this.collections.has(collectionName)) {
      this.collections.set(collectionName, new Mongo.Collection(collectionName))
    }
    return new Promise((resolve, reject) => {
      this.subscription = Meteor.subscribe(this.publish, selector, options, this.name, {
        onReady: () => {
          console.info(this.publish + '.subscribe')
          let models = []
          let ref = null
          resolve()
          const cursor = this.collections.get(collectionName).find({}).observe({
            added: (model) => {
              models.push(model)
              if (ref !== null) clearTimeout(ref)
              ref = setTimeout(() => {
                models = models.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                this.pushIndex(models)
                models = []
                ref = null
              }, 10)
            },
            changed: (model) => {
              this.replaceIndex(model)
            },
            removed: (model) => {
              this.spliceIndex(model)
            }
          })
          this.setCursor(cursor)
        }
      })
      if (!this.index.length) {
        setTimeout(() => {
          if (!this.one) {
            const error = new Error('not-found')
            reject(error)
          }
        }, 2000)
      }
    })
  },
  subscribeAll () {
    const selector = {}
    const options = {limit: 100}
    this.subscribe(selector, options)
  },
  subscribeFromOwnerId (_id, selector = {}, options = {}) {
    selector.ownerId = _id
    this.subscribe(selector, options)
  },
  unsubscribe () {
    if (this.cursor) {
      this.cursor.stop()
      this.cursor = null
      this.index = []
    }
    if (this.subscription) {
      this.subscription.stop()
      console.info(this.publish + '.unsubscribe')
    }
  },
  subscribeOne (selector = {}, options = {}) {
    /*
     if (this.cursor) {
     if (this.selector && this.selector.toString() === selector.toString()) return
     if (this.options && this.options.toString() === options.toString()) return
     }
     this.selector = selector
     this.options = options
     this.unsubscribe()
     */
    options.limit = 1
    return new Promise((resolve, reject) => {
      if (this.one) {
        resolve(this.one)
        return
      }
      const collectionName = this.publish + '.' + this.name
      if (!this.collections) { this.collections = new Map() }
      if (!this.collections.has(collectionName)) {
        this.collections.set(collectionName, new Mongo.Collection(collectionName))
      }
      this.subscription = Meteor.subscribe(this.publish, selector, options, 'one', {
        onReady: () => {
          console.info(this.publish + '.subscribeOne')
          const cursor = this.collections.get(collectionName).find({}).observe({
            added: (model) => {
              this.setOne(model)
              resolve(model)
            },
            changed: (model) => {
              this.setOne(model)
            },
            removed: (model) => {
              this.unsetOne(model)
            }
          })
          this.setCursor(cursor)
        }
      })
      setTimeout(() => {
        if (!this.one) {
          const error = new Error('not-found')
          reject(error)
        }
      }, 2000)
    })
  },
  findOne (selector = {}, options = {}) {
    return new Promise((resolve, reject) => {
      Meteor.call(this.publish + '.findOne', selector, options, (err, model) => {
        if (err) { reject(err) } else {
          this.setOne(model)
          resolve(model)
        }
      })
    })
  },
  find (selector = {}, options = {}) {
    return new Promise((resolve, reject) => {
      Meteor.call(this.publish + '.find', selector, options, (err, models) => {
        if (err) { reject(err) } else {
          this.setIndex(models)
          resolve(models)
        }
      })
    })
  },
  findOneFromId (modelId) {
    return this.findOne({_id: modelId})
  },
  insert (req) {
    return new Promise((resolve, reject) => {
      Meteor.call(this.publish + '.insert', req, (err, res) => {
        if (err) { reject(err) } else { resolve(res) }
      })
    })
  },
  remove (modelId) {
    return new Promise((resolve, reject) => {
      Meteor.call(this.publish + '.remove', {_id: modelId}, (err, res) => {
        if (err) { reject(err) } else { resolve(res) }
      })
    })
  }
})

const IndexModel = types.compose('IndexModel', MethodModel, {
  name: types.identifier(types.optional(types.string, 'root'))
})

const Model = types.compose('Model', MethodModel, {}, {
  afterCreate () {
    this.map = {}
  },
  define (name) {
    if (!name) return
    if (this.map.get(name)) return
    const node = {
      name,
      publish: this.publish
    }
    this.map.set(name, node)
    this[name] = this.map.get(name)
    console.info(this.publish + '.define', name)
  },
  undefine (name) {
    this.map.delete(name)
    delete this[name]
  }
})

export { IndexModel, Model }
