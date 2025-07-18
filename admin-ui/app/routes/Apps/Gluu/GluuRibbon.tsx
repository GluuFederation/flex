import React from 'react'
import mystyle from './styles/ribbon'
import { useTranslation } from 'react-i18next'

function GluuRibbon({ title, fromLeft, doTranslate }: any) {
  const { t } = useTranslation()
  return (
    <div style={fromLeft ? mystyle.ribbon_left : (mystyle.ribbon_right as any)}>
      {doTranslate ? t(title) : title}
    </div>
  )
}

export default GluuRibbon
