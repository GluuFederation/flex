import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import { fontFamily, fontWeights, fontSizes } from '@/styles/fonts'

const useStyles = makeStyles<{ isDark: boolean }>()((_, { isDark }) => ({
  card: {
    backgroundColor: isDark ? customColors.darkInputBg : customColors.white,
    borderRadius: 16,
    width: '100%',
    maxWidth: '548px',
    height: 135,
    padding: 0,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    border: `1px solid ${isDark ? customColors.darkBorder : customColors.lightBorder}`,
  },
  content: {
    padding: 0,
    position: 'relative',
    height: '100%',
    boxSizing: 'border-box',
  },
  textContainer: {
    position: 'absolute',
    left: '24px',
    top: '24px',
    width: '205px',
    height: '59px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  serviceName: {
    fontFamily,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.lg,
    lineHeight: '32px',
    color: isDark ? customColors.white : customColors.primaryDark,
    margin: 0,
    padding: 0,
    height: 'auto',
  },
  serviceMessage: {
    fontFamily,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.md,
    lineHeight: '32px',
    color: isDark ? customColors.white : customColors.primaryDark,
    margin: 0,
    padding: 0,
    height: 'auto',
  },
  statusBadge: {
    position: 'absolute',
    right: '24px',
    top: '24px',
    zIndex: 1,
  },
}))

export { useStyles }
