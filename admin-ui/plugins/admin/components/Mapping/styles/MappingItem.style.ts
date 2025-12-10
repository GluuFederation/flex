import customColors from '@/customColors'

export const mappingItemStyles = {
  accordion: {
    marginBottom: 12,
    border: '1px solid',
    borderColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },

  accordionSummary: {
    borderRadius: 8,
  },

  permissionChip: {
    fontSize: '0.75rem',
    height: 28,
  },

  countChip: {
    fontWeight: 500,
    fontSize: '0.75rem',
  },

  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
  },

  removeButton: {
    backgroundColor: customColors.accentRed,
    borderColor: customColors.accentRed,
    borderRadius: 4,
    padding: '6px 12px',
    fontSize: '12px',
    color: customColors.white,
  },

  addButton: {
    backgroundColor: customColors.logo,
    borderColor: customColors.logo,
    borderRadius: 4,
    padding: '6px 12px',
    fontSize: '12px',
    color: customColors.white,
  },
}

export default mappingItemStyles
