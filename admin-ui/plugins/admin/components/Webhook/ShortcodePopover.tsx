import React, { useState, useRef, useMemo, memo } from 'react'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { HelpOutline } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import applicationstyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ShortCodesIcon } from '@/components/SVG'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuButton } from '@/components/GluuButton'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { useStyles } from './styles/ShortcodePopover.style'
import type { ShortcodePopoverProps, ShortcodeLabelProps } from './types'

const Label: React.FC<ShortcodeLabelProps> = ({ doc_category, doc_entry, label, classes }) => {
  const { t, i18n } = useTranslation()

  return (
    <Box display="flex" gap={0.5}>
      <GluuText variant="span" disableThemeColor className={classes.labelText}>
        {t(label)}
      </GluuText>
      {doc_category && i18n.exists(doc_category) && (
        <>
          <GluuTooltip
            tooltipOnly
            doc_entry={doc_entry}
            content={t(doc_category)}
            place="right"
            zIndex={1400}
            positionStrategy="fixed"
          />
          <HelpOutline
            className={classes.helpIcon}
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
  buttonWrapperClassName,
  handleSelectShortcode,
}) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const { classes } = useStyles({ themeColors })
  const anchorRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen((prev) => !prev)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const id = open ? 'shortcode-popover' : undefined

  const baseStyles = applicationstyle.shortCodesWrapperStyles as React.CSSProperties
  const wrapperStyles = buttonWrapperClassName
    ? buttonWrapperStyles
    : { ...baseStyles, ...buttonWrapperStyles }

  return (
    <div
      ref={anchorRef}
      className={buttonWrapperClassName}
      style={wrapperStyles}
      data-tooltip-id="shortcode-icon-tooltip"
    >
      <GluuTooltip
        tooltipOnly
        doc_entry="shortcode-icon-tooltip"
        content={t('tooltips.insert_shortcode')}
        place="top"
        zIndex={1400}
        positionStrategy="fixed"
      />
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
        PaperProps={{ className: classes.paper }}
      >
        <Box display="flex" flexDirection="column" className={classes.content}>
          {codes?.length ? (
            <List className={classes.list}>
              {codes.map((code, index) => (
                <React.Fragment key={code.key}>
                  <ListItemButton
                    onClick={() => handleSelectShortcode(code.key)}
                    component="button"
                    className={classes.listItemButton}
                  >
                    <ListItemText
                      primary={
                        <Label
                          doc_category={code.description}
                          doc_entry={code.key + code.label}
                          label={code.label}
                          classes={classes}
                        />
                      }
                      className={classes.listItemText}
                    />
                  </ListItemButton>
                  {index + 1 !== codes.length && <Divider className={classes.divider} />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <GluuText variant="p" disableThemeColor className={classes.emptyMessage}>
              {t('messages.no_shortcodes_found')}
            </GluuText>
          )}
        </Box>
      </Popover>
    </div>
  )
}

export default memo(ShortcodePopover)
