import { observable } from 'mobx'

// レイアウトデータ
export default class Layout {
  @observable
  scrollOver = false

  @observable
  width = window.innerWidth

  @observable
  left = false

  get oneColumn () {
    return this.width < 700
  }

  get oneColumnClassName () {
    return this.width < 700 ? 'one-column' : 'two-column'
  }

  get leftClassName () {
    return this.left ? 'left' : 'right'
  }

  toMain () {
    this.left = false
  }

  toLeft () {
    this.left = true
  }

  setScrollOver (value) {
    if (value < 600) {
      if (this.scrollOver) {
        this.scrollOver = false
      }
    } else {
      if (!this.scrollOver) {
        this.scrollOver = true
      }
    }
  }

  constructor () {
    let queue = null
    window.addEventListener('resize', () => {
      clearTimeout(queue)
      queue = setTimeout(() => {
        this.width = window.innerWidth
      }, 100)
    }, false)
  }
}