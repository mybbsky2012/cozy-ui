import React, { useState } from 'react'
import Styled from 'rsg-components/Styled'
import Heading from 'rsg-components/Heading'

// Import default implementation from react-styleguidist using the full path
import DefaultTableOfContentsRenderer from 'react-styleguidist/lib/client/rsg-components/TableOfContents/TableOfContentsRenderer'

const activateTheme = (theme, oldTheme) => {
  if (oldTheme) {
    document.body.classList.remove(`Theme--${oldTheme}`)
  }
  document.body.classList.add(`Theme--${theme}`)
}

export function TableOfContentsRenderer({ classes, children, ...props }) {
  const [theme, setTheme] = useState('normal')
  const handleChange = ev => {
    const newTheme = ev.target.value
    setTheme(newTheme)
    activateTheme(newTheme, theme)
  }
  return (
    <div>
      <DefaultTableOfContentsRenderer {...props}>
        {children}
      </DefaultTableOfContentsRenderer>
      <div className={'u-mh-1'}>
        Theme:{' '}
        <select value={theme} onChange={handleChange}>
          <option>normal</option>
          <option>dark</option>
        </select>
      </div>
    </div>
  )
}

export default TableOfContentsRenderer
