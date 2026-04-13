import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import GluuText from './GluuText'
import { useStyles } from './GluuViewWrapper.style'

interface GluuViewWrapperProps {
  canShow?: boolean | null
  children: ReactNode
}

const GluuViewWrapper = ({ canShow, children }: GluuViewWrapperProps) => {
  const { t } = useTranslation()
  const { classes } = useStyles()

  if (canShow === true) {
    return <div data-testid="WRAPPER">{children}</div>
  }

  return (
    <div data-testid="MISSING" role="alert" className={classes.missingRoot}>
      <GluuText variant="p">{t('messages.missing_required_permission')}</GluuText>
    </div>
  )
}

export default GluuViewWrapper
