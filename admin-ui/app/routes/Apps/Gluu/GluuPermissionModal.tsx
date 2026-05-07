import customColors from '@/customColors'
import { useTranslation } from 'react-i18next'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MuiButton from '@mui/material/Button'
import type { GluuPermissionModalProps } from './types/GluuPermissionModal.types'
import { useStyles } from './styles/GluuPermissionModal.style'

const GluuPermissionModal = ({ handler, isOpen }: GluuPermissionModalProps) => {
  const { t } = useTranslation()
  const { classes } = useStyles()

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handler}
        disableEscapeKeyDown
        PaperProps={{
          className: 'modal-outline-primary',
          style: { minWidth: '45vw', background: customColors.black },
        }}
      >
        <DialogTitle>
          <i className="bi bi-shield-lock" /> {t('dashboard.access_denied')}
        </DialogTitle>
        <DialogContent className={classes.modalBody}>
          <p className={classes.mutedText}>
            🚫 <strong>{t('dashboard.access_denied_message')}</strong>
          </p>
          <p>{t('dashboard.access_contact_admin')}</p>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handler} variant="contained">
            {t('menus.signout')}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default GluuPermissionModal
