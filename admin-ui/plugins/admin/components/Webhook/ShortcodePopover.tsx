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
import applicationstyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import ShortCodesIcon from '../../../../app/components/SVG/menu/ShortCodesIcon'

interface Shortcode {
  key: string
  label: string
  description?: string
}

interface ShortcodePopoverProps {
  codes?: Shortcode[]
  buttonWrapperStyles?: React.CSSProperties
  handleSelectShortcode: (shortcode: string) => void
}

interface LabelProps {
  doc_category?: string
  doc_entry: string
  label: string
}

export default function ShortcodePopover({
  codes,
  buttonWrapperStyles = {},
  handleSelectShortcode,
}: ShortcodePopoverProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <div
      style={
        {
          ...applicationstyle.shortCodesWrapperStyles,
          ...buttonWrapperStyles,
        } as React.CSSProperties
      }
    >
      <Button aria-describedby={id} variant="text" sx={{ border: 0 }} onClick={handleClick}>
        <ShortCodesIcon className="" style={{}} />
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
          display="flex"
          flexDirection="column"
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
                      component="button"
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

const Label: React.FC<LabelProps> = ({ doc_category, doc_entry, label }) => {
  const { t, i18n } = useTranslation()

  return (
    <Box display="flex" gap={0.5}>
      <Typography color="black">{t(label)}</Typography>
      {doc_category && i18n.exists(doc_category) && (
        <>
          <ReactTooltip
            id={doc_entry}
            place="right"
            role="tooltip"
            style={{ zIndex: 101, maxWidth: '45vw' }}
          >
            {t(doc_category)}
          </ReactTooltip>
          <HelpOutline
            tabIndex={-1}
            style={{ width: 18, height: 18, marginLeft: 6, marginRight: 6 }}
            data-tooltip-id={doc_entry}
            data-for={doc_entry}
          />
        </>
      )}
    </Box>
  )
}
