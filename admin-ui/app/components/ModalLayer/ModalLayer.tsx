import { use, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import getThemeColor from '@/context/theme/config'
import { useStyles as useCommitDialogStyles } from '@/routes/Apps/Gluu/styles/GluuCommitDialog.style'
import type { ModalLayerProps } from './types'

const ModalLayer = ({ onClose, overlayClassName, children }: ModalLayerProps) => {
  const { t } = useTranslation()
  const theme = use(ThemeContext)
  const selectedTheme = theme?.state?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })

  const overlayClass = overlayClassName
    ? `${commitClasses.overlay} ${overlayClassName}`
    : commitClasses.overlay

  return (
    <>
      <button
        type="button"
        className={overlayClass}
        onClick={onClose}
        aria-label={t('actions.close')}
      />
      <div
        className={commitClasses.modalScroll}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        role="presentation"
      >
        {children}
      </div>
    </>
  )
}

export default ModalLayer
