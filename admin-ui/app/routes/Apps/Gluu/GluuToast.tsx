import { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { updateToast } from 'Redux/features/toastSlice'
function GluuToast() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { showToast, message, type } = useSelector((state: any) => state.toastReducer)

  const ToastDesign = () => {
    return (
      <div style={{ textAlign: 'left' }}>
        <strong>{type == 'success' ? 'Success' : 'Error'}</strong>
        <br />
        {message == ''
          ? type == 'success'
            ? t('messages.success_in_saving')
            : t('messages.error_processing_request')
          : message}
      </div>
    )
  }
  const showTheToast = () => {
    if (type == 'success') {
      toast.success(<ToastDesign />)
    } else {
      toast.error(<ToastDesign />)
    }
  }

  useEffect(() => {
    if (showToast) {
      showTheToast()
      dispatch(updateToast(false, 'success', ''))
    }
  }, [showToast])

  return <ToastContainer autoClose={10000} closeOnClick newestOnTop draggable={false} />
}

export default GluuToast
