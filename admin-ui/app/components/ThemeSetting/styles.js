import { makeStyles } from "tss-react/mui";

const styles = makeStyles()({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  whiteColor: {
    color: '#FFFFFF',
    position: 'relative',
  },
  settingsToggeleBtn: {
    position: 'relative',
    textTransform: 'none',
    padding:"2px",
    cursor: 'pointer',
    '&:active': {
      backgroundColor: "rgba(217, 217, 217, 0.43)", 
      transform: 'scale(0.95)',
    },
  },
  selectInfo: {
    textAlign: 'left',
    marginLeft: 30,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  selectContainer: {
    textAlign: 'center',
    marginTop: '25%'
  },
  selectItem: {
    marginBottom: 20,
    cursor: 'pointer',
    paddingTop: 16,
  },
  selectedItem: {
    background: '#eaeaea',
  },
  selectImage: {
    width: '75%',
  },
  selectTitle: {
    fontSize: 16,
    fontWeight: '600'
  }
})

export default styles
