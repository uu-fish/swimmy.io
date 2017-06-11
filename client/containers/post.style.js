import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('Post', theme => {
  return {
    container: {
      overflow: 'hidden'
    },
    content: {
      color: 'rgba(0, 0, 0, 0.8)'
    },
    more: {
      position: 'absolute',
      bottom: '10px',
      right: '10px'
    },
    photoImage: {
      display: 'block',
      height: 'auto',
      maxHeight: '400px',
      maxWidth: '500px',
      borderRadius: '2px',
      overflow: 'hidden',
      cursor: 'pointer',
      transitionDuration: '150ms'
    },
    photoImageOpen: {
      maxHeight: '100%'
    },
    oEmbed: {
      maxWidth: '500px'
    },
    oEmbedIframe: {
      paddingBottom: '100%',
      width: '100%',
      position: 'relative',
      iframe: {
        width: '100%',
        height: '100%',
        border: 0,
        margin: 0,
        padding: 0,
        position: 'absolute',
        top: 0,
        left: 0
      }
    }
  }
})