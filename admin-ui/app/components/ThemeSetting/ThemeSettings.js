import React, { useContext } from 'react'
import clsx from 'clsx'
import { useMediaQuery } from 'react-responsive'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import PaletteIcon from '@material-ui/icons/Palette'
import SettingsIcon from '@material-ui/icons/Settings'
import { ThemeContext } from "Context/theme/themeContext"

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  whiteColor: {
    color: '#FFFFFF',
    position: 'relative',
  },
})

export function ThemeSettings() {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const theme = useContext(ThemeContext)
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  const onChangeTheme = (value) => {
    theme.dispatch({ type: value })
  }

  const themeList = [
    { value: 'darkBlack', text: 'Dark Black' }, 
    { value: 'darkBlue', text: 'Dark Blue' }, 
    { value: 'lightBlue', text: 'Light Blue' }, 
    { value: 'lightGreen', text: 'Light Green' },
  ]

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setOpen(open)
  }

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {themeList.map((text, index) => (
          <ListItem button onClick={() => onChangeTheme(text.value)} key={text.value}>
            <ListItemIcon>
              <PaletteIcon />
            </ListItemIcon>
            <ListItemText primary={text.text} />
          </ListItem>
        ))}
      </List>
    </div>
  )

  return (
    <React.Fragment>
      <Button onClick={toggleDrawer(true)} className={classes.whiteColor} style={!isTabletOrMobile ? { top: -7 } : {}}>
        <SettingsIcon />
      </Button>
      <Drawer anchor={'right'} open={open} onClose={toggleDrawer(false)}>
        {list('right')}
      </Drawer>
    </React.Fragment>
  )
}
