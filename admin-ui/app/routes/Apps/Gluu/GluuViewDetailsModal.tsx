import { useTranslation } from 'react-i18next'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MuiButton from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Close } from '@/components/icons'
import type { GluuViewDetailModalProps } from './types'

const GluuViewDetailModal = ({
  children,
  isOpen,
  handleClose,
  hideFooter = false,
  title,
  contentClassName = '',
  contentStyle,
  headerClassName = '',
  headerStyle,
  modalClassName = '',
  modalStyle,
  customHeader,
}: GluuViewDetailModalProps) => {
  const { t } = useTranslation()
  const displayTitle = title ?? t('messages.details')
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        className: `modal-outline-primary ${modalClassName}`.trim(),
        style: { minWidth: '70vw', ...modalStyle },
      }}
    >
      {customHeader ?? (
        <DialogTitle className={headerClassName} style={headerStyle} sx={{ pr: 6 }}>
          {displayTitle}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'inherit' }}
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent
        className={contentClassName}
        style={{ overflowX: 'auto', maxHeight: '60vh', ...contentStyle }}
      >
        {children}
      </DialogContent>
      {!hideFooter && (
        <DialogActions>
          <MuiButton onClick={handleClose} variant="contained">
            {t('actions.close')}
          </MuiButton>
        </DialogActions>
      )}
    </Dialog>
  )
}
export default GluuViewDetailModal
