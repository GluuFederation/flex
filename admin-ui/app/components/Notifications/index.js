import React from 'react'
import Button from '@mui/material/Button'
import ClickAwayListener from '@mui/base/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import NotificationsIcon from '@mui/icons-material/Notifications'
import styles from './styles'

export default function Lang() {
  const classes = styles()
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open)
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <div className={classes.root}>
      <div>
        <Button
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          className={classes.btnContainer}
          onClick={handleToggle}
        >
          <NotificationsIcon style={{color: "white"}}/>
        </Button>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal className={classes.topElm}>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <List component="nav" aria-label="notification">
                    <ListItem button>
                      <ListItemText 
                        primary="User data has been updated"
                        secondary="User data has been updated text detail description"
                      />
                    </ListItem>
                    <ListItem button>
                      <ListItemText 
                        primary="License successfully added"
                        secondary="License successfully added text detail description"
                      />
                    </ListItem>
                    <ListItem button>
                      <ListItemText 
                        primary="Service Cache successfully removed"
                        secondary="Service Cache successfully removed text detail description"
                      />
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