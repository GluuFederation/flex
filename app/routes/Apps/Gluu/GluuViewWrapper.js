import React from 'react'

function GluuViewWrapper(props) {
  return props.canShow ? (
    <div>{props.children}</div>
  ) : (
    <div>Missing required permission</div>
  )
}

export default GluuViewWrapper
