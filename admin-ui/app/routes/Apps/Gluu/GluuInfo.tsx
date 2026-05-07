import { useMemo } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import { useTranslation } from 'react-i18next'
import { CheckCircleOutline, HighlightOffOutlined, Close } from '@/components/icons'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import GluuText from './GluuText'
import { GluuButton } from '@/components'
import { useStyles } from './styles/GluuInfo.style'

interface GluuInfoItem {
  openModal: boolean
  testStatus: boolean
}

interface GluuInfoProps {
  item: GluuInfoItem
  handler: () => void
}

const GluuInfo = ({ item, handler }: GluuInfoProps) => {
  const { state: themeState } = useTheme()
  const isDark = themeState.theme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const { t } = useTranslation()
  const { classes } = useStyles({ isDark, themeColors })

  return (
    <Dialog
      open={item.openModal}
      onClose={handler}
      PaperProps={{ className: 'modal-outline-primary' }}
    >
      <DialogTitle className={classes.modalHeader} sx={{ pr: 6 }}>
        <GluuText variant="span" className={classes.title}>
          {t('titles.smtp_test_result')}
        </GluuText>
        <IconButton
          aria-label="close"
          onClick={handler}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'inherit' }}
          size="small"
        >
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.modalBody}>
        <div className={classes.statusRow}>
          {item.testStatus ? (
            <CheckCircleOutline
              fontSize="large"
              style={{ color: themeColors.badges.statusActive }}
            />
          ) : (
            <HighlightOffOutlined
              fontSize="large"
              style={{ color: themeColors.settings.removeButton.bg }}
            />
          )}
          <GluuText variant="p" className={classes.statusMessage}>
            {item.testStatus ? t('actions.server_success_smtp') : t('actions.server_fails_smtp')}
          </GluuText>
        </div>
        {!item.testStatus && (
          <GluuText variant="p" className={classes.detailText}>
            {t('actions.server_response')}: {t('actions.server_fails_smtp')}
          </GluuText>
        )}
      </DialogContent>
      <DialogActions className={classes.modalFooter}>
        <GluuButton
          onClick={handler}
          backgroundColor={themeColors.formFooter.back.backgroundColor}
          textColor={themeColors.formFooter.back.textColor}
          borderColor="transparent"
          padding="8px 28px"
          minHeight="40"
          useOpacityOnHover
        >
          {t('actions.ok')}
        </GluuButton>
      </DialogActions>
    </Dialog>
  )
}

export default GluuInfo
