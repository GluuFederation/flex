import React, { useEffect, useState } from 'react'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { CardBody, Card, Form, Col, Row, Input } from 'Components'
import { useFormik } from 'formik'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import { useTranslation } from 'react-i18next'
import GluuCheckBoxRow from 'Routes/Apps/Gluu/GluuCheckBoxRow'
import * as Yup from 'yup'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { Box } from '@mui/material'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useDispatch, useSelector } from 'react-redux'
import { createSsa, toggleSaveConfig } from '../../redux/features/SsaSlice'
import { buildPayload } from 'Utils/PermChecker'
import { useNavigate } from 'react-router'

const SsaAddPage = () => {
  const userAction = {}
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { savedConfig } = useSelector((state) => state.ssaReducer)
  const [neverExpire, setNeverExpire] = useState(false)
  const [expirationDate, setExpirationDate] = useState(null)
  SetTitle(t('titles.ssa_management'))
  const [modal, setModal] = useState(false)
  const dispatch = useDispatch()

  const toggle = () => {
    setModal(!modal)
  }

  const formik = useFormik({
    initialValues: {
      software_id: null,
      one_time_use: false,
      org_id: null,
      description: null,
      software_roles: null,
      rotate_ssa: false,
      grant_types: null,
    },
    validationSchema: Yup.object({
      software_id: Yup.mixed().required('Software ID is required'),
      software_roles: Yup.array().required('Software Roles are mandatory.'),
      description: Yup.mixed().required('Description is required'),
      org_id: Yup.mixed().required('Organization is required'),
      grant_types: Yup.array().required('Please add a grant type.'),
    }),
    onSubmit: (values) => {
      toggle()
    },
  })

  const grantTypes = [
    { value: 'authorization_code', label: 'authorization_code' },
    { value: 'refresh_token', label: 'refresh_token' },
    { value: 'uma-ticket', label: 'uma_ticket' },
    { value: 'client_credentials', label: 'client_credentials' },
    { value: 'password', label: 'password' },
    { value: 'implicit', label: 'implicit' },
  ]

  const submitForm = (userMessage) => {
    toggle()

    const {
      description,
      software_id,
      software_roles,
      grant_types,
      one_time_use,
      rotate_ssa,
      org_id,
    } = formik.values

    const date = expirationDate ? new Date(expirationDate).getTime() : null

    buildPayload(userAction, userMessage, {
      description,
      software_id,
      software_roles: software_roles?.map((role) => role.software_roles),
      grant_types,
      expiration: neverExpire ? neverExpire : date,
      one_time_use,
      rotate_ssa,
      org_id,
    })

    dispatch(createSsa({ action: userAction }))
  }

  useEffect(() => {
    if(savedConfig) {
      navigate('/auth-server/config/ssa')
    }

    return () => dispatch(toggleSaveConfig(false))
  }, [savedConfig])

  useEffect(() => {
    if (neverExpire) {
      setExpirationDate(null)
    }
  }, [neverExpire])

  useEffect(() => {
    if (expirationDate) {
      setNeverExpire(false)
    }
  }, [expirationDate])

  return (
    <>
      <Card className='mb-3' style={applicationStyle.mainCard}>
        <CardBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              formik.handleSubmit()
            }}
          >
            <GluuInputRow
              label='fields.software_id'
              name='software_id'
              formik={formik}
              required
              errorMessage={formik.errors.software_id}
              showError={
                formik.errors.software_id && formik.touched.software_id
              }
              value={formik.values.software_id}
            />
            <GluuInputRow
              label='fields.organization'
              name='org_id'
              formik={formik}
              required
              errorMessage={formik.errors.org_id}
              showError={formik.errors.org_id && formik.touched.org_id}
              value={formik.values.org_id}
            />
            <GluuInputRow
              label='fields.description'
              name='description'
              formik={formik}
              required
              errorMessage={formik.errors.description}
              showError={
                formik.errors.description && formik.touched.description
              }
              value={formik.values.description}
            />
            <GluuTypeAhead
              name='software_roles'
              label={t('fields.software_roles')}
              formik={formik}
              options={[]}
              lsize={3}
              rsize={7}
              required
              value={[]}
              showError={
                formik.errors.software_roles && formik.touched.software_roles
              }
              errorMessage={formik.errors.software_roles}
            />
            <Box display='flex' flexDirection={'row'} gap={0}>
              <GluuLabel
                required
                label={t('fields.grant_types_ssa')}
                size={3}
              />
              <Box
                display='flex'
                flexDirection={'column'}
                gap={0}
                px={'5px'}
                width={'100%'}
              >
                {grantTypes.map(({ value, label }) => {
                  return (
                    <Box
                      key={value}
                      display='flex'
                      flexDirection={'row'}
                      gap={2}
                      alignItems={'center'}
                      width={'100%'}
                    >
                      <Input
                        id={'grant_types'}
                        type='checkbox'
                        value={value}
                        name={'grant_types'}
                        data-testid={value}
                        onChange={formik.handleChange}
                        size={2}
                      />
                      {/* <Label className='d-flex' sm={10}>
                        <h5 style={{ margin: 0 }}>{t(`fields.${label}`)}</h5>
                      </Label> */}
                      <GluuLabel
                        noColon
                        size={10}
                        label={t(`fields.${label}`)}
                      />
                    </Box>
                  )
                })}
                {formik.errors.grant_types && formik.touched.grant_types ? (
                  <div style={{ color: 'red' }}>
                    {formik.errors.grant_types}
                  </div>
                ) : null}
              </Box>
            </Box>
            <GluuCheckBoxRow
              label='fields.one_time_use'
              name='one_time_use'
              handleOnChange={(e) => {
                formik.setFieldValue('one_time_use', e.target.checked)
              }}
              lsize={3}
              rsize={7}
            />
            <GluuCheckBoxRow
              label='fields.rotate_ssa'
              name='rotate_ssa'
              handleOnChange={(e) => {
                formik.setFieldValue('rotate_ssa', e.target.checked)
              }}
              lsize={3}
              rsize={7}
            />
            <Box display='flex' flexDirection={'row'} gap={0}>
              <GluuLabel label={t('fields.expiration')} size={3} />
              <Box
                display='flex'
                flexDirection={'column'}
                gap={0}
                px={'10.5px'}
              >
                <Box
                  display='flex'
                  flexDirection={'row'}
                  gap={2}
                  alignItems={'center'}
                >
                  <Box
                    display='flex'
                    flexDirection={'row'}
                    gap={2}
                    alignItems={'center'}
                    width={'50%'}
                  >
                    <Input
                      id={'expiration'}
                      type='checkbox'
                      checked={neverExpire}
                      name={'expiration'}
                      data-testid={'never'}
                      onChange={(e) => {
                        setNeverExpire(e.target.checked)
                      }}
                      size={2}
                    />
                    <GluuLabel noColon size={6} label={t(`fields.never`)} />
                  </Box>
                  <Box textAlign='center'>OR</Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      format='MM/DD/YYYY'
                      id='date-picker-inline'
                      value={expirationDate}
                      onChange={(date) => setExpirationDate(date)}
                    />
                  </LocalizationProvider>
                </Box>
              </Box>
            </Box>
            <Row>
              <Col>
                <GluuCommitFooter
                  saveHandler={toggle}
                  hideButtons={{ save: true, back: false }}
                  type='submit'
                />
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
      <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} />
    </>
  )
}

export default SsaAddPage
