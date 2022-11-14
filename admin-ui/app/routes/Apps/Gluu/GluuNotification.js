import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { Media } from 'Components'

function GluuNotification({ type, message, description, show }) {
  let typeIcon = 'fa-question'
  if (type === 'success') {
    typeIcon = 'fa-check'
  }
  if (type === 'error') {
    typeIcon = 'fa-close'
  }
  if (type === 'info') {
    typeIcon = 'fa-info'
  }
  if (type === 'info') {
    typeIcon = 'fa-exclamation'
  }
  const toastContent = (
    <Media>
      <Media middle left className="mr-3">
        <i className={getClassName(typeIcon)}></i>
      </Media>
      <Media body>
        <Media heading tag="h6">
          {message}
        </Media>
        <p>{description}</p>
      </Media>
    </Media>
  )

  function getClassName(theType) {
    return 'fa fa-fw fa-2x ' + theType
  }

  function showToast(aType) {
    switch (aType) {
      case 'info':
        toast.info(toastContent)
        break
      case 'success':
        toast.success(toastContent)
        break
      case 'warning':
        toast.warning(toastContent)
        break
      case 'error':
        toast.error(toastContent)
        break
      default:
        toast(toastContent)
        break
    }
  }

  return (
    <>
      {show && showToast(type)}
      <ToastContainer
        style={{ width: '98%' }}
        position="top-left"
        autoClose={100000}
        closeOnClick
        newestOnTop
        draggable={false}
        hideProgressBar={true}
      />
    </>
  )
}

export default GluuNotification
