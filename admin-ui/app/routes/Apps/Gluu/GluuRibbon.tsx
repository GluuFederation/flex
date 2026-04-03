import React from 'react'
import { useStyles } from './styles/GluuRibbon.style'
import { useTranslation } from 'react-i18next'

type GluuRibbonProps = {
  title: string
  fromLeft?: boolean
  doTranslate?: boolean
}

const GluuRibbon = ({ title, fromLeft, doTranslate }: GluuRibbonProps) => {
  const { t } = useTranslation()
  const { classes } = useStyles()
  return (
    <div className={fromLeft ? classes.ribbonLeft : classes.ribbonRight}>
      {doTranslate ? t(title) : title}
    </div>
  )
}

export default GluuRibbon
