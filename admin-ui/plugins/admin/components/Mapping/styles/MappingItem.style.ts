import customColors from '@/customColors'

export const mappingItemStyles = {
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

  removeButton: {
    backgroundColor: customColors.accentRed,
    borderColor: customColors.accentRed,
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    minWidth: '80px',
    justifyContent: 'center',
    color: customColors.white,
  },

  addButton: {
    backgroundColor: customColors.logo,
    borderColor: customColors.logo,
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    minWidth: '80px',
    justifyContent: 'center',
    color: customColors.white,
  },

  sectionDivider: {
    margin: '40px 0',
    borderTop: `1px solid ${customColors.darkGray}`,
    paddingTop: '40px',
  },

  essentialSectionHeader: {
    marginBottom: '7px',
  },

  essentialTitle: {
    fontWeight: '600',
    fontSize: '16px',
    color: customColors.accentRed,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginTop: '30px',
    display: 'flex',
    alignItems: 'center',
  },

  tooltipIcon: {
    width: '18px',
    height: '18px',
    marginLeft: '8px',
    color: customColors.darkGray,
    cursor: 'pointer',
  },

  essentialSubtitle: {
    color: customColors.darkGray,
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

  permissionColumn: {
    display: 'flex',
    alignItems: 'center',
  },

  removeButtonHover: {
    backgroundColor: customColors.accentRed,
    borderColor: customColors.accentRed,
  },

  addButtonHover: {
    backgroundColor: customColors.logo,
    borderColor: customColors.logo,
  },
  essentialSection: {
    marginBottom: '20px',
  },
}

export default mappingItemStyles
