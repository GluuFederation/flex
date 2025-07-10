import customColors from '@/customColors'

export default {
  ribbon_right: {
    position: 'absolute',
    top: '11px',
    right: '-5px',
    padding: '0.5rem',
    fontWeight: 'bold',
    minWidth: '12rem',
    background: customColors.logo,
    zIndex: 3,
    color: customColors.white,
    borderRadius: '50px 0px 0px 50px',
    textAlign: 'center',
    boxShadow: '4px 4px 15px rgba(26, 35, 126, 0.2)',
  },
  ribbon_left: {
    position: 'absolute',
    top: '11px',
    left: '-5px',
    padding: '0.5rem',
    minWidth: '12rem',
    background: customColors.logo,
    zIndex: 3,
    color: customColors.white,
    borderRadius: '0px 50px 50px 0px',
    textAlign: 'center',
    boxShadow: '4px 4px 15px rgba(26, 35, 126, 0.2)',
  },
}
