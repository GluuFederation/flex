import React, { useContext, useMemo } from 'react'
import { ClickAwayListener } from '@mui/base/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { ThemeContext } from 'Context/theme/themeContext'
import notificationIcon from 'Images/svg/notification-icon.svg'
import styles from './styles'

export default function Lang() {
  const { classes } = styles()
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement | null>(null)
  const themeContext = useContext(ThemeContext)

  const currentTheme = useMemo(() => {
    return themeContext?.state?.theme || 'light'
  }, [themeContext?.state?.theme])

  const iconFilter = useMemo(() => {
    if (currentTheme === 'dark') {
      return 'brightness(0) invert(1)'
    }
    return 'brightness(0) saturate(100%) invert(26%) sepia(9%) saturate(1234%) hue-rotate(182deg) brightness(96%) contrast(89%)'
  }, [currentTheme])

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (
      anchorRef.current &&
      event.target instanceof Node &&
      anchorRef.current.contains(event.target)
    ) {
      return
    }

    setOpen(false)
  }

  const prevOpen = React.useRef(open)
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current?.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <div className={classes.root}>
      <div>
        <button ref={anchorRef} className={classes.notificationBtn} onClick={handleToggle}>
          <img
            src={notificationIcon}
            alt="Notifications"
            style={{
              width: '26px',
              height: '26px',
              display: 'block',
              filter: iconFilter,
            }}
          />
        </button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          className={classes.topElm}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <List component="nav" aria-label="notification">
                    <ListItem button>
                      <ListItemText primary="No new notifications" />
                    </ListItem>
                  </List>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  )
}
