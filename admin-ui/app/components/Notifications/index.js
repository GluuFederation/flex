import React from 'react'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import NotificationsIcon from '@material-ui/icons/Notifications'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  whiteColor: {
    color: '#FFFFFF',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  btnContainer: {
    position: 'relative',
    top: 8,
    textTransform: 'none',
    color: '#FFFFFF',
  },
  topElm: {
    zIndex: 9999
  }
}))

export default function Lang() {
  const classes = useStyles()
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
          <NotificationsIcon />
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