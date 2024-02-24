import * as React from 'react'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { List, ListItemButton, ListItemText } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { HelpOutline } from '@mui/icons-material'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import PropTypes from 'prop-types'

const Icon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='1.5'
    stroke='currentColor'
    style={{ width: '18px' }}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5'
    />
  </svg>
)

export default function ShortcodePopover({
  codes,
  buttonWrapperStyles,
  handleSelectShortcode,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const wrapperStyles = {
    position: 'absolute',
    right: 0,
    marginRight: '0.5rem',
    top: '50%',
    transform: 'translateY(-70%)',
    ...buttonWrapperStyles,
  }

  return (
    <div style={wrapperStyles}>
      <Button
        aria-describedby={id}
        variant='text'
        sx={{ border: 0 }}
        onClick={handleClick}
      >
        <Icon />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box
          display='flex'
          flexDirection='column'
          // gap={1}
          sx={{
            maxHeight: '300px',
            overflowY: 'auto',
            minWidth: '320px',
          }}
        >
          {codes?.length ? (
            <List>
              {codes?.map((code, index) => {
                return (
                  <React.Fragment key={code.key}>
                    <ListItemButton
                      onClick={() => handleSelectShortcode(code.key)}
                      component='button'
                      sx={{ width: '100%' }}
                    >
                      <ListItemText
                        primary={
                          <Label
                            doc_category={code.description}
                            doc_entry={code.key + code.label}
                            label={code.label}
                          />
                        }
                      />
                    </ListItemButton>
                    {index + 1 !== codes?.length && <Divider />}
                  </React.Fragment>
                )
              })}
            </List>
          ) : (
            <Typography sx={{ p: 2 }}>No shortcodes found!</Typography>
          )}
        </Box>
      </Popover>
    </div>
  )
}

const Label = ({ doc_category, doc_entry, label }) => {
  const { t, i18n } = useTranslation()

  return (
    <Box display='flex' gap={0.5}>
      <Typography color='black'>{t(label)}</Typography>
      {doc_category && i18n.exists(doc_category) && (
        <>
          <ReactTooltip
            tabIndex='-1'
            id={doc_entry}
            place='right'
            role='tooltip'
            style={{ zIndex: 101, maxWidth: '45vw' }}
          >
            {t(doc_category)}
          </ReactTooltip>
          <HelpOutline
            tabIndex='-1'
            style={{ width: 18, height: 18, marginLeft: 6, marginRight: 6 }}
            data-tooltip-id={doc_entry}
            data-for={doc_entry}
          />
        </>
      )}
    </Box>
  )
}

// Adding prop validation
Label.propTypes = {
  doc_category: PropTypes.string,
  doc_entry: PropTypes.string,
  label: PropTypes.string,
}

ShortcodePopover.propTypes = {
  codes: PropTypes.array,
  buttonWrapperStyles: PropTypes.any,
  handleSelectShortcode: PropTypes.func,
}