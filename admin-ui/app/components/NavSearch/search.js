import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1px 10px 1px 10px',
    display: 'flex',
    alignItems: 'center',
    width: 300,
    borderRadius: 30,
    marginRight: 20,
    height: 40,
    marginTop: 10,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  mobile: {
    width: '90%',
    marginTop: 20,
    padding: '0 10px 0 10px',
  }
}))

export default function Search({ isTabletOrMobile }) {
  const classes = useStyles()

  return (
    <Paper component="form" className={`${classes.root} ${isTabletOrMobile ? classes.mobile : ''}`}>
      <InputBase className={classes.input} />
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}
