import { makeStyles } from '@material-ui/core/styles'
import red from "@material-ui/core/colors/red"

const styles = makeStyles(() => ({
  dialog: {
    borderRadius: 0
  },
  button: {
    borderRadius: 0,
    textTransform: "none",
    padding: 5
  },
  logout: {
    color: "#fff",
    backgroundColor: "#03A96D",
    "&:hover": {
      backgroundColor: red[700]
    }
  },
  countdown: {
    color: "red[700]"
  }
}))

export default styles
