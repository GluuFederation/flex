import React, { useState, useCallback, Suspense, lazy } from 'react'
import { Alert, Button } from 'reactstrap'
import ErrorIcon from '@mui/icons-material/Error'
import { useTranslation } from 'react-i18next'
import GluuSuspenseLoader from 'Routes/Apps/Gluu/GluuSuspenseLoader'
import type { ScriptErrorAlertProps } from '../../types/props'

// Lazy load the error modal for better code splitting
const GluuScriptErrorModal = lazy(() => import('Routes/Apps/Gluu/GluuScriptErrorModal'))

/**
 * Script error alert component
 */
export function ScriptErrorAlert({ error }: ScriptErrorAlertProps): JSX.Element | null {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showErrorModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const closeErrorModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  // Don't render if no error
  if (!error?.stackTrace) {
    return null
  }

  return (
    <>
      {isModalOpen && (
        <Suspense fallback={<GluuSuspenseLoader />}>
          <GluuScriptErrorModal
            isOpen={isModalOpen}
            error={error.stackTrace}
            handler={closeErrorModal}
          />
        </Suspense>
      )}

      <Alert
        className="d-flex align-items-center justify-content-between w-100 mb-3"
        color="danger"
      >
        <div className="d-flex align-items-center" style={{ gap: '4px' }}>
          <ErrorIcon color="error" />
          <h5 className="alert-heading m-0">{t('messages.error_in_script')}!</h5>
        </div>
        <Button color="danger" onClick={showErrorModal}>
          {t('actions.show_error')}
        </Button>
      </Alert>
    </>
  )
}

export default ScriptErrorAlert
