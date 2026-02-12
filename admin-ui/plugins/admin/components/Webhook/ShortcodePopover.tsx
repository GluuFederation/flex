import React, { useState, useRef, useMemo, memo } from 'react'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { HelpOutline } from '@mui/icons-material'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useTranslation } from 'react-i18next'
import applicationstyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ShortCodesIcon } from '@/components/SVG'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuButton } from '@/components/GluuButton'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import type { ShortcodePopoverProps, ShortcodeLabelProps } from './types'

const Label: React.FC<ShortcodeLabelProps> = ({ doc_category, doc_entry, label }) => {
  const { t, i18n } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])

  return (
    <Box display="flex" gap={0.5}>
      <GluuText variant="span" disableThemeColor style={{ color: themeColors.fontColor }}>
        {t(label)}
      </GluuText>
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
            style={{ width: 18, height: 18, marginLeft: 6, marginRight: 6 }}
            data-tooltip-id={doc_entry}
            data-for={doc_entry}
          />
        </>
      )}
    </Box>
  )
}

const ShortcodePopover: React.FC<ShortcodePopoverProps> = ({
  codes,
  buttonWrapperStyles = {},
  handleSelectShortcode,
}) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const anchorRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen((prev) => !prev)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const id = open ? 'shortcode-popover' : undefined

  return (
    <div
      ref={anchorRef}
      style={{
        ...(applicationstyle.shortCodesWrapperStyles as React.CSSProperties),
        ...buttonWrapperStyles,
      }}
    >
      <GluuButton
        type="button"
        aria-describedby={id}
        onClick={handleClick}
        backgroundColor="transparent"
        borderColor="transparent"
        disableHoverStyles
      >
        <ShortCodesIcon />
      </GluuButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            backgroundColor: themeColors.settings?.cardBackground ?? themeColors.card?.background,
            border: `1px solid ${themeColors.borderColor}`,
          },
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            maxHeight: '300px',
            overflowY: 'auto',
            minWidth: '320px',
          }}
        >
          {codes?.length ? (
            <List>
              {codes.map((code, index) => (
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
                  {index + 1 !== codes.length && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <GluuText
              variant="p"
              disableThemeColor
              style={{ padding: 16, color: themeColors.fontColor }}
            >
              {t('messages.no_shortcodes_found')}
            </GluuText>
          )}
        </Box>
      </Popover>
    </div>
  )
}

export default memo(ShortcodePopover)
