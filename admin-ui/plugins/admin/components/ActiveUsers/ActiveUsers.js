import React from 'react'
import 'react-date-range/dist/styles.css'
import { format, formatDistance, formatRelative, addMonths, subMonths } from 'date-fns'
import 'react-date-range/dist/theme/default.css'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
import GluuRibbon from '../../../../app/routes/Apps/Gluu/GluuRibbon'
import { DateRangePicker, DateRange} from 'react-date-range'
import {
  Button,
  Card,
  CardFooter,
  CardBody,
  FormGroup,
  Label,
  Input,
  Badge,
} from '../../../../app/components'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'

function ActiveUsers() {
  const { t } = useTranslation()
  const selectionRange = {
    startDate:  subMonths(new Date(),2),
    endDate: addMonths(new Date(),3),
    key: 'selection',
  }
  function handleSelect(ranges) {
    console.log(ranges)
  }
  return (
    <Card>
      <GluuRibbon title={t('titles.active_users')} fromLeft />
      <FormGroup row />
      <FormGroup row />
      <CardBody
        className="d-flex flex-column justify-content-center align-items-center pt-5"
        style={{ minHeight: '400px' }}
      >
        <DateRangePicker
          ranges={[selectionRange]}
          showSelectionPreview={false}
          showMonthAndYearPickers={false}
          showMonthAndYearPickers={false}
          onChange={handleSelect}
        />
      </CardBody>
      <CardFooter className="p-4 bt-0"></CardFooter>
    </Card>
  )
}

export default ActiveUsers
