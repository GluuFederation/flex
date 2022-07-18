import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { useSelector } from 'react-redux'
import styles from './styles'

export default function BasicTable() {
  const users = useSelector((state) => state.userReducer.items)
  const classes = styles()

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      className={classes.transparentBg}
    >
      <Table
        className={`${classes.table} ${classes.transparentBg}`}
        aria-label="simple table"
      >
        <TableBody>
          {users.length > 0 &&
            users.slice(0, 3).map((row, key) => (
              <TableRow
                key={'user' + key}
                className={key % 2 !== 0 ? classes.trWhiteBg : null}
              >
                <TableCell
                  align="left"
                  className={
                    key % 2 !== 0
                      ? `${classes.standardText} ${classes.roundedLeft}`
                      : classes.whiteText
                  }
                >
                  {row?.displayName || ''}
                </TableCell>
                <TableCell
                  align="left"
                  className={
                    key % 2 !== 0 ? classes.standardText : classes.whiteText
                  }
                >
                  {row?.userId || ''}
                </TableCell>
                <TableCell
                  align="left"
                  className={
                    key % 2 !== 0 ? classes.standardText : classes.whiteText
                  }
                >
                  {row?.mail || ''}
                </TableCell>
                <TableCell
                  align="left"
                  className={
                    key % 2 !== 0
                      ? `${classes.standardText} ${classes.roundedRight}`
                      : classes.whiteText
                  }
                >
                  {row?.jansStatus || ''}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
