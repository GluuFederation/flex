import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface GluuViewWrapperProps {
  canShow?: boolean | null
  children: ReactNode
}

const GluuViewWrapper = ({ canShow, children }: GluuViewWrapperProps) => {
  const { t } = useTranslation()

  if (canShow === true) {
    return <div data-testid="WRAPPER">{children}</div>
  }

  return (
    <div data-testid="MISSING" className="alert alert-warning" role="alert">
      {t('messages.missing_required_permission')}
    </div>
  )
}

export default GluuViewWrapper
