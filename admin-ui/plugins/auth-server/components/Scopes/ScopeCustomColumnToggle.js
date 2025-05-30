import { ViewColumn } from '@mui/icons-material'
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'
import React from 'react'

function CustomColumnsToggle({
  tableColumns,
  visibleColumns,
  iconStyle,
  setVisibleColumns,
  t
}) {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleOpen = event => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const toggleColumn = field => {
    setVisibleColumns(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    )
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        size="small"
        title={t('titles.addOrRemoveColumns')}
        sx={{
          ...iconStyle
        }}
      >
        <ViewColumn />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: { padding: '8px' }
          }
        }}
      >
        {tableColumns.map(col => (
          <MenuItem key={col.field}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={visibleColumns.includes(col.field)}
                  onChange={() => toggleColumn(col.field)}
                />
              }
              label={col.title}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default CustomColumnsToggle
