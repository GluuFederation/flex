function GluuBlockUI(blocking: boolean = false) {
  if (blocking) {
    return (
      <div className="block-ui-container" style={{ minHeight: "100px" }}>
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
    );
  } else {
    return "";
  }
}
export default GluuBlockUI;
