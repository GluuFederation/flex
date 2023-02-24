import React from 'react'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
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
