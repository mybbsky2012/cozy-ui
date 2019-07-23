import { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { isMobileApp } from 'cozy-device-helper'

/**
 * Customized function to get dimensions and position for a centered
 * popup window
 * @param  {string|number} w
 * @param  {string|number} h
 * @return {{w, h, top, left}}       Popup window
 */
// source https://stackoverflow.com/a/16861050
export function popupCenter(w, h) {
  /* global screen */
  // Fixes dual-screen position
  //                      Most browsers      Firefox
  var dualScreenLeft = window.screenLeft || screen.left
  var dualScreenTop = window.screenTop || screen.top

  var width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width
  var height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height

  var left = width / 2 - w / 2 + dualScreenLeft
  var top = height / 2 - h / 2 + dualScreenTop
  return {
    w,
    h,
    top,
    left
  }
}

/**
 * Renders a popup and listen to popup events
 */
export class Popup extends PureComponent {
  constructor(props, context) {
    super(props, context)

    // url is not expected to change
    const { initialUrl } = props
    this.state = {
      url: initialUrl
    }

    this.handleClose = this.handleClose.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
    this.handleLoadStart = this.handleLoadStart.bind(this)
  }

  componentDidMount() {
    this.showPopup()
  }

  componentWillUnmount() {
    this.killPopup()
  }

  addListeners(popup) {
    // Listen here for message FROM popup
    window.addEventListener('message', this.handleMessage)

    // rest of instructions only on mobile app
    if (!isMobileApp()) return
    popup.addEventListener('loadstart', this.handleLoadStart)
    popup.addEventListener('exit', this.handleClose)
  }

  removeListeners() {
    const { popup } = this.state
    window.removeEventListener('message', this.handleMessage)

    // rest of instructions only if popup is still opened
    if (popup.closed) return

    // rest of instructions only on mobile app
    if (!isMobileApp()) return
    popup.removeEventListener('loadstart', this.handleLoadStart)
    popup.removeEventListener('exit', this.handleClose)
  }

  handleMessage(messageEvent) {
    const { popup } = this.state
    const { onMessage } = this.props
    const isFromPopup = popup === messageEvent.source
    if (isFromPopup && typeof onMessage === 'function') onMessage(messageEvent)
  }

  handleClose() {
    const { popup } = this.state

    this.killPopup()

    const { onClose } = this.props
    if (typeof onClose === 'function') onClose(popup)
  }

  showPopup() {
    const { height, width, title } = this.props
    const { url } = this.state
    const { w, h, top, left } = popupCenter(width, height)
    /**
     * ATM we also use window.open on Native App in order to open
     * InAppBrowser. But some provider (Google for instance) will
     * block us. We need to use a SafariViewController or Chrome Custom Tab.
     * So
     */
    const popup = window.open(
      url,
      title,
      `scrollbars=yes, width=${w}, height=${h}, top=${top}, left=${left}`
    )
    // Puts focus on the newWindow
    if (popup.focus) {
      popup.focus()
    }

    this.addListeners(popup)
    this.startMonitoringClosing(popup)
    this.setState({ popup })
  }

  killPopup() {
    const { popup } = this.state
    this.removeListeners()
    this.stopMonitoringClosing()
    if (!popup.closed) popup.close()
  }

  monitorClosing(popup) {
    if (popup.closed) {
      this.stopMonitoringClosing()
      return this.handleClose()
    }
  }

  /**
   * Check if window is closing every 500ms
   * @param  {Window} window
   */
  startMonitoringClosing(popup) {
    this.checkClosedInterval = setInterval(
      () => this.monitorClosing(popup),
      500
    )
  }

  stopMonitoringClosing() {
    clearInterval(this.checkClosedInterval)
  }

  handleLoadStart(event) {
    const { url } = event
    const { onMobileUrlChange } = this.props
    if (typeof onMobileUrlChange === 'function') onMobileUrlChange(new URL(url))
  }

  render() {
    return null
  }
}

Popup.propTypes = {
  // Dimensions
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string,
  initialUrl: PropTypes.string.isRequired,
  // Callbacks
  /**
   * Close handler. Called after popup closing.
   */
  onClose: PropTypes.func,
  /**
   * Handler called when a message is received from `postMessage` interface.
   * @param {MessageEvent} messageEvent Received MessageEvent object.
   */
  onMessage: PropTypes.func,
  /**
   * Handler used on mobile device to detect url changes
   * @param {URL} url URL object.
   */
  onMobileUrlChange: PropTypes.func
}

Popup.defaultProps = {
  title: ''
}

export default Popup
