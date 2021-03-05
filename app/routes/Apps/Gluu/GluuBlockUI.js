import React from 'react'
import './gluublockui.css'
function GluuBlockUI(blocking) {
  if (blocking) {
    return (
      <div className="block-ui-container">
        <div className="block-ui-overlay" />
        <div className="block-ui-message-container">
          <div className="block-ui-message">
            <div className="loading-indicator">
              <svg id="indicator" viewBox="0 0 100 100">
                <circle id="circle" cx="50" cy="50" r="45" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return ''
  }
}

GluuBlockUI.defaultProps = {
  blocking: false,
}

export default GluuBlockUI
