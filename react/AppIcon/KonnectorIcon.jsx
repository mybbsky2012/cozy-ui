import React from 'react'
import PropTypes from 'prop-types'

import { withClient } from 'cozy-client'

import { AppDoctype } from '../proptypes'
import AppIcon from './AppIcon'

/**
 * Used because AppIcon does not work well on mobile.
 * Extracted from Banks.
 *
 * TODO find out why and merge the two
 */
class KonnectorIcon extends React.PureComponent {
  constructor(props) {
    super(props)
    this.fetchIcon = this.fetchIcon.bind(this)
  }

  fetchIcon() {
    const { client, slug, app } = this.props
    return client.stackClient.getIconURL({
      type: 'konnector',
      slug: slug || app.slug
    })
  }

  render() {
    const { className } = this.props

    return <AppIcon fetchIcon={this.fetchIcon} className={className} />
  }
}

KonnectorIcon.propTypes = {
  client: PropTypes.object.isRequired,
  slug: PropTypes.string.isRequired,
  app: AppDoctype
}

export default withClient(KonnectorIcon)
