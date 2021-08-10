import React from 'react'

function GluuViewWrapper(props) {
  if (props.canShow) {
    return <div>{props.children}</div>
  } else {
    return <div>Missing required permission</div>
  }
}

export default GluuViewWrapper
