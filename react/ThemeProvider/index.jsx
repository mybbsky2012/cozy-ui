import React from 'react'
import get from 'lodash/get'
import set from 'lodash/set'

/* Problèmes:
- il faut garder un mapping avec toutes les variables (convention de nomage + import stylus ?)
- comment setter une variable sur une autre variable ?
- on injecte un div en plus (voir comme,nt fait MuiThemeProvider)
- besoin d'un import du theme.stylus qqpart (pas trop genant)
- bcp de variables a maintenir
*/

const themeVariablesMap = {
  '--button-fontSize-default': 'button.fontSize.default'
}

const ThemeContext = React.createContext({})

const ThemeProvider = ({ theme, children }) => {
  const style = {}
  const contextValue = {}

  for (const [varName, path] of Object.entries(themeVariablesMap)) {
    const themeValue = get(theme, path)
    if (themeValue) {
      style[varName] = themeValue
      set(contextValue, path, themeValue)
    }
  }

  return (
    <div style={style}>
      <ThemeContext.Provider>{children}</ThemeContext.Provider>
    </div>
  )
}

export default ThemeProvider
