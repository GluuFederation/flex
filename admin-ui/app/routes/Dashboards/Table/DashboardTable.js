import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Ava1 from '../../../images/avatars/ava1.png'
import Ava2 from '../../../images/avatars/ava2.png'
import Ava3 from '../../../images/avatars/ava3.png'

const useStyles = makeStyles({
  table: {
    minWidth: 600,
    borderCollapse: 'unset'
  },
  transparentBg: {
    background: 'transparent',
  },
  whiteText: {
    color: '#FFFFFF',
    borderBottom: 'none',
    padding: '10px 20px 10px 20px',
  },
  standardText: {
    color: '#303641',
    borderBottom: 'none',
    padding: '10px 20px 10px 20px',
  },
  trWhiteBg: {
    background: '#FFFFFF',
    color: '#303641',
  },
  roundedLeft: {
    borderBottomLeftRadius: 18,
    borderTopLeftRadius: 18,
  },
  roundedRight: {
    borderBottomRightRadius: 18,
    borderTopRightRadius: 18,
  },
  avatar: {
    width: 32,
    height: 32,
    marginRight: 40,
  },
  username: {
    position: 'relative',
    top: 6,
  }
})

function createData(name, city, lastLogin, status) {
  return { name, city, lastLogin, status }
}

const rows = [
  createData('First User', 'London', '10:34:23', 'Active'),
  createData('Second User', 'New York', '20:34:23', 'Active'),
  createData('Third User', 'Osaka', '17:34:23', 'Active'),
]

export default function BasicTable() {
  const classes = useStyles()
  const getAva = (key) => {
    const avaList = [Ava1, Ava2, Ava3]
    return avaList[key]
  }

  return (
    <TableContainer component={Paper} elevation={0} className={classes.transparentBg}>
      <Table className={`${classes.table} ${classes.transparentBg}`} aria-label="simple table">
        <TableBody>
          {rows.map((row, key) => (
            <TableRow key={row.name} className={key % 2 !== 0 ? classes.trWhiteBg:null}>
              <TableCell scope="row" className={key % 2 !== 0 ? `${classes.standardText} ${classes.roundedLeft}` : classes.whiteText}>
                <Box display="flex">
                  <img src={getAva(key)} alt="user" className={classes.avatar} />
                  <div className={classes.username}>{row.name}</div>
                </Box>
              </TableCell>
              <TableCell align="right" className={key % 2 !== 0 ? classes.standardText : classes.whiteText}>{row.city}</TableCell>
              <TableCell align="right" className={key % 2 !== 0 ? classes.standardText : classes.whiteText}>{row.lastLogin}</TableCell>
              <TableCell align="right" className={key % 2 !== 0 ? `${classes.standardText} ${classes.roundedRight}` : classes.whiteText}>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
