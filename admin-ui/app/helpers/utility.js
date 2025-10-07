// Helper to get only changed fields (excluding undefined)
function getChangedFields(original, updated) {
  const changed = {}
  Object.keys(updated).forEach((key) => {
    if (updated[key] !== original[key] && updated[key] !== undefined) {
      changed[key] = updated[key]
    }
  })
  return changed
}

// Helper to merge form values with redux values
function getMergedValues(original, updated) {
  return {
    loggingLevel: updated.loggingLevel !== undefined ? updated.loggingLevel : original.loggingLevel,
    loggingLayout:
      updated.loggingLayout !== undefined ? updated.loggingLayout : original.loggingLayout,
    httpLoggingEnabled:
      updated.httpLoggingEnabled !== undefined
        ? updated.httpLoggingEnabled
        : original.httpLoggingEnabled,
    disableJdkLogger:
      updated.disableJdkLogger !== undefined ? updated.disableJdkLogger : original.disableJdkLogger,
    enabledOAuthAuditLogging:
      updated.enabledOAuthAuditLogging !== undefined
        ? updated.enabledOAuthAuditLogging
        : original.enabledOAuthAuditLogging,
  }
}

export { getChangedFields, getMergedValues }
