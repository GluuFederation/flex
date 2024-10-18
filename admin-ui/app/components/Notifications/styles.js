import { makeStyles } from "tss-react/mui"; 

const styles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
  },
  whiteColor: {
    color: '#FFFFFF',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  btnContainer: {
    position: 'relative',
    top: 8,
    textTransform: 'none',
    color: '#FFFFFF',
  },
  notificationBtn: {
    position: 'relative',
    textTransform: 'none',
    padding:"2px",
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    '&:active': {
      backgroundColor: "rgba(217, 217, 217, 0.43)", 
      transform: 'scale(0.95)',
    },
  },
  topElm: {
    zIndex: 9999
  }
}))

export default styles
