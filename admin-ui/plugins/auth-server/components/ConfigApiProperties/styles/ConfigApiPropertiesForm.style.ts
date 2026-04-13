import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import {
  createPropertiesPageStyles,
  type PropertiesStyleProps,
} from 'Plugins/auth-server/common/propertiesPageStyles'

export const useStyles = makeStyles<PropertiesStyleProps>()((theme: Theme, props) =>
  createPropertiesPageStyles(theme, props),
)
