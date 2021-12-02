import React from 'react'
import mystyle from './ribbon'
import { useTranslation } from 'react-i18next'

function GluuRibbon({ title, fromLeft, doTranslate }) {
  const { t } = useTranslation()
  return (
    <div style={fromLeft ? mystyle.ribbon_left : mystyle.ribbon_right}>
      {doTranslate ? t(title) : title}
    </div>
  )
}

export default GluuRibbon
