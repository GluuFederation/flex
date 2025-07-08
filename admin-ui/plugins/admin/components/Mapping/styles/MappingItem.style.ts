export const mappingItemStyles = {
  // Permission Row Styles
  permissionRow: {
    alignItems: 'center',
    padding: '2px 0',
  },

  permissionText: {
    fontSize: '14px',
    fontWeight: '500',
  },

  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },

  // Action Button Styles
  removeButton: {
    backgroundColor: '#b3424a',
    borderColor: '#b3424a',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    minWidth: '80px',
    justifyContent: 'center',
    color: '#fff',
  },

  addButton: {
    backgroundColor: '#00b875',
    borderColor: '#00b875',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    minWidth: '80px',
    justifyContent: 'center',
    color: '#fff',
  },

  // Section Divider
  sectionDivider: {
    margin: '40px 0',
    borderTop: '1px solid #323c47',
    paddingTop: '40px',
  },

  // Essential Permissions Section
  essentialSectionHeader: {
    marginBottom: '7px',
  },

  essentialTitle: {
    color: '#495057',
    fontWeight: '600',
    fontSize: '16px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginTop: '30px',
  },

  essentialSubtitle: {
    color: '#6c757d',
    fontSize: '12px',
    margin: '0',
    fontStyle: 'italic' as const,
  },

  essentialPermissionRow: {
    alignItems: 'center',
    padding: '2px 0',
  },

  essentialPermissionText: {
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
  },

  essentialIcon: {
    marginRight: '8px',
    fontSize: '12px',
  },

  // Column Styles
  permissionColumn: {
    display: 'flex',
    alignItems: 'center',
  },

  // Hover Effects
  removeButtonHover: {
    backgroundColor: '#9a3a41',
    borderColor: '#9a3a41',
  },

  addButtonHover: {
    backgroundColor: '#009865',
    borderColor: '#009865',
  },
  essentialSection: {
    marginBottom: '20px',
  },
}

export default mappingItemStyles
