import React from 'react'

function GluuViewWrapper(props) {
  return props.canShow ? (
    <div data-testid="WRAPPER">{props.children}</div>
  ) : (
    <div data-testid="MISSING">Missing required permission</div>
  )
}

export default GluuViewWrapper
