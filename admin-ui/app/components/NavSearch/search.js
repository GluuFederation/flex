import React from 'react'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import styles from './styles'

export default function Search({ isTabletOrMobile }) {
  const classes = styles()

  return (
    <Paper component="form" className={`${classes.root} ${isTabletOrMobile ? classes.mobile : ''}`}>
      <InputBase className={classes.input} />
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}
