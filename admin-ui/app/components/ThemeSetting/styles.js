import { makeStyles } from '@material-ui/core/styles'

const styles = makeStyles({
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
