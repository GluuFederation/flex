import customColors from '@/customColors'

export const getDatePickerTextFieldSlotProps = (isDark: boolean) => ({
  size: 'small' as const,
  InputLabelProps: { shrink: true },
  sx: {
    '& .MuiInputBase-root': {
      borderRadius: 1.5,
      backgroundColor: isDark ? customColors.darkInputBg : customColors.lightInputBg,
      color: isDark ? customColors.white : undefined,
    },
    '& .MuiInputBase-input': {
      color: isDark ? customColors.white : undefined,
    },
    '& .MuiInputLabel-root': {
      'color': isDark ? customColors.white : undefined,
      '&.Mui-focused': {
        color: isDark ? customColors.white : undefined,
      },
    },
    '& .MuiIconButton-root': {
      'color': isDark ? customColors.white : undefined,
      '& .MuiSvgIcon-root': {
        color: isDark ? customColors.white : undefined,
      },
    },
  },
})
