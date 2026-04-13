import { useEffect, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { useTranslation } from 'react-i18next'
import { updateToast } from 'Redux/features/toastSlice'

const GluuToast = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { showToast, message, type, onCloseRedirectUrl } = useAppSelector(
    (state) => state.toastReducer,
  )
  const redirectUrlRef = useRef('')

  const ToastDesign = () => {
    const normalizedMessage =
      typeof message === 'string' ? message : ((message as { message?: string }).message ?? '')

    return (
      <div style={{ textAlign: 'left' }}>
        <strong>{type === 'success' ? t('messages.success') : t('messages.error')}</strong>
        <br />
        {normalizedMessage === ''
          ? type === 'success'
            ? t('messages.success_in_saving')
            : t('messages.error_processing_request')
          : normalizedMessage}
      </div>
    )
  }

  const handleToastClose = () => {
    if (redirectUrlRef.current) {
      window.location.href = redirectUrlRef.current
    }
  }

  const showTheToast = () => {
    const options = onCloseRedirectUrl ? { onClose: handleToastClose } : {}
    if (type === 'success') {
      toast.success(<ToastDesign />, options)
    } else {
      toast.error(<ToastDesign />, options)
    }
  }

  useEffect(() => {
    if (showToast) {
      redirectUrlRef.current = onCloseRedirectUrl || ''
      showTheToast()
      dispatch(updateToast(false, 'success', ''))
    }
  }, [showToast])

  return <ToastContainer autoClose={10000} closeOnClick newestOnTop draggable={false} />
}

export default GluuToast
