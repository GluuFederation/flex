import customColors from '@/customColors'

export const chartGlobalStyles = {
  '.recharts-legend-wrapper': {
    display: 'none',
  },
  'table > thead > tr > th .Mui-active': {
    color: `var(--theme-text-color, ${customColors.white})`,
  },
  'table > thead > tr > th .Mui-active > svg': {
    color: `var(--theme-text-color, ${customColors.white})`,
  },
}
