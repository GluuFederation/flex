import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  createTrustRelationship,
  toggleSavedFormFlag,
  updateTrustRelationship,
} from 'Plugins/saml/redux/features/SamlSlice'
import { useDispatch, useSelector } from 'react-redux'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { Card, CardBody, Form, FormGroup, Col, Row, Button } from 'Components'
import { useFormik } from 'formik'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuToggleRow from 'Routes/Apps/Gluu/GluuToggleRow'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import * as Yup from 'yup'
import { ThemeContext } from 'Context/theme/themeContext'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { Box } from '@mui/material'
import { getClientScopeByInum } from 'Utils/Util'
import { PER_PAGE_SCOPES } from 'Plugins/auth-server/common/Constants'
import PropTypes from 'prop-types'
import {
  getClientScopes,
  getScopes,
  setClientSelectedScopes,
} from 'Plugins/auth-server/redux/features/scopeSlice'
import GluuTypeAheadForDn from 'Routes/Apps/Gluu/GluuTypeAheadForDn'
import _debounce from 'lodash/debounce'
import { useNavigate } from 'react-router'

const TrustRelationForm = ({ configs, viewOnly }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const loading = useSelector((state) => state.idpSamlReducer.loading)
  const dispatch = useDispatch()
  const userScopeAction = {
    limit: PER_PAGE_SCOPES,
    pattern: '',
    startIndex: 0,
  }
  const savedForm = useSelector((state) => state.idpSamlReducer.savedForm)
  const [metaDataFile, setMetaDataFile] = useState(null)
  const [fileError, setFileError] = useState(false)
  const [modal, setModal] = useState(false)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const inputFile = useRef(null)
  const isLoading = useSelector(
    (state) => state.scopeReducer.loadingClientScopes
  )
  const totalItems = useSelector((state) => state.scopeReducer.totalItems)
  const scopeLoading = useSelector((state) => state.scopeReducer.loading)
  const clientScopes = useSelector(
    (state) => state.scopeReducer.clientScopes
  )?.map((item) => ({ dn: item?.dn, name: item?.id }))

  const scopes = useSelector((state) => state.scopeReducer.items)
  const clientScopeOptions = scopes
    ?.map((item) => ({ dn: item?.dn, name: item?.id }))
    ?.filter((o1) => !clientScopes?.some((o2) => o1.dn === o2.dn))
  const defaultScopeValue = configs?.releasedAttributes?.length
    ? clientScopes
    : []
  const selectedClientScopes = useSelector(
    (state) => state.scopeReducer.selectedClientScopes
  )
  const scopeFieldValue = selectedClientScopes?.length
    ? selectedClientScopes
    : defaultScopeValue
  const scopeOptions = clientScopeOptions

  const validationSchema = Yup.object().shape({
    displayName: Yup.string().required(
      `${t('fields.displayName')} is Required!`
    ),
    description: Yup.string().required(
      `${t('fields.description')} is Required!`
    ),
    spMetaDataSourceType: Yup.string().required(
      `${t('fields.metadata_location')} is Required!`
    ),
    spMetaDataFN: Yup.string().when('spMetaDataSourceType', {
      is: (value) => {
        return value === 'uri'
      },
      then: () =>
        Yup.string().required(`${t('fields.metadata_url')} is Required!`),
    }),
  })

  const toggle = () => {
    setModal(!modal)
  }

  const getDefault = (value, defaultValue) =>
    value !== undefined ? value : defaultValue

  const initialValues = {
    ...(configs || {}),
    enabled: getDefault(configs?.enabled, false),
    displayName: getDefault(configs?.displayName, ''),
    description: getDefault(configs?.description, ''),
    spMetaDataSourceType: getConfiguredType(configs),
    spMetaDataFN: getDefault(configs?.spMetaDataFN, ''),
    releasedAttributes: getDefault(configs?.releasedAttributes, []),
  }

  function getConfiguredType(configs) {
    if (configs?.spMetaDataSourceType) {
      return configs.spMetaDataSourceType
    } else if (configs?.inum) {
      return ''
    } else {
      return 'file'
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {
      toggle()
    },
  })

  const submitForm = (messages) => {
    toggle()
    handleSubmit(formik.values, messages)
  }

  function handleSubmit(values, user_message) {
    let formdata = new FormData()

    let payload = {
      trustRelationship: { ...values },
    }

    if (metaDataFile) {
      payload.metaDataFile = metaDataFile

      const blob = new Blob([payload.metaDataFile], {
        type: 'application/octet-stream',
      })
      formdata.append('metaDataFile', blob)
    }

    const blob = new Blob(
      [
        JSON.stringify({
          ...payload.trustRelationship,
        }),
      ],
      {
        type: 'application/json',
      }
    )

    formdata.append('trustRelationship', blob)

    if (!configs) {
      dispatch(
        createTrustRelationship({
          action: { action_message: user_message, action_data: formdata },
        })
      )
    } else {
      dispatch(
        updateTrustRelationship({
          action: { action_message: user_message, action_data: formdata },
        })
      )
    }
  }

  const onHandleFileSelection = () => {
    setFileError(false)
    inputFile.current.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) setMetaDataFile(file)
  }

  const debounceFn = useCallback(
    _debounce((query) => {
      query && handleDebounceFn(query)
    }, 500),
    []
  )

  function handleDebounceFn(inputValue) {
    userScopeAction['pattern'] = inputValue
    delete userScopeAction.startIndex
    dispatch(getScopes({ action: userScopeAction }))
  }

  const saveSelectedScopes = (scopes) => {
    dispatch(setClientSelectedScopes(scopes))
  }

  const handlePagination = (event, shownResults) => {
    userScopeAction['limit'] = PER_PAGE_SCOPES
    userScopeAction['startIndex'] = (userScopeAction['startIndex'] ?? 0) + 10
    if (!userScopeAction.pattern) {
      delete userScopeAction.pattern
    }
    if (!userScopeAction.startIndex) {
      delete userScopeAction.startIndex
    }
    if (totalItems + PER_PAGE_SCOPES > userScopeAction.limit) {
      dispatch(getScopes({ action: userScopeAction }))
    }
  }

  useEffect(() => {
    if (savedForm) {
      navigate('/saml/service-providers')
    }

    return () => {
      dispatch(toggleSavedFormFlag(false))
      dispatch(setClientSelectedScopes([]))
    }
  }, [savedForm])

  useEffect(() => {
    if (configs?.inum) {
      const scopeInums = []
      let userAction = {}
      if (configs?.releasedAttributes?.length) {
        for (const scope of configs.releasedAttributes) {
          scopeInums.push(getClientScopeByInum(scope))
        }
      }
      userAction['pattern'] = scopeInums.join(',')
      userAction['limit'] = PER_PAGE_SCOPES
      dispatch(getClientScopes({ action: userAction }))
    }
  }, [])

  return (
    <GluuLoader blocking={loading}>
      <Card>
        <CardBody>
          <Form
            onSubmit={(event) => {
              event.preventDefault()
              if (
                !metaDataFile &&
                formik.values.spMetaDataSourceType?.toLowerCase() === 'file' &&
                !configs
              ) {
                setFileError(true)
                return
              }
              setFileError(false)
              formik.handleSubmit(event)
            }}
            className='mt-4'
          >
            <FormGroup row>
              <Col sm={10}>
                <GluuInputRow
                  label='fields.displayName'
                  name='displayName'
                  value={formik.values.displayName || ''}
                  formik={formik}
                  lsize={4}
                  rsize={8}
                  showError={
                    formik.errors.displayName && formik.touched.displayName
                  }
                  errorMessage={formik.errors.displayName}
                  disabled={viewOnly}
                  required
                />
              </Col>
              <Col sm={10}>
                <GluuToggleRow label={'fields.enabled'} name='enabled' viewOnly={viewOnly} formik={formik} />
              </Col>
              <Col sm={10}>
                <GluuInputRow
                  label='fields.description'
                  name='description'
                  value={formik.values.description || ''}
                  formik={formik}
                  lsize={4}
                  rsize={8}
                  showError={
                    formik.errors.description && formik.touched.description
                  }
                  errorMessage={formik.errors.description}
                  disabled={viewOnly}
                  required
                />
              </Col>
              <Col sm={10}>
                <GluuSelectRow
                  label='fields.metadata_location'
                  formik={formik}
                  value={formik.values.spMetaDataSourceType}
                  values={[
                    { value: 'file', label: 'File' },
                    { value: 'uri', label: 'URL' },
                  ]}
                  lsize={4}
                  rsize={8}
                  name='spMetaDataSourceType'
                  disabled={viewOnly}
                  defaultValue={formik.values.spMetaDataSourceType}
                  showError={
                    formik.errors.spMetaDataSourceType &&
                    formik.touched.spMetaDataSourceType
                  }
                  errorMessage={formik.errors.spMetaDataSourceType}
                  required
                />
              </Col>
              <Col sm={10}>
                {formik.values.spMetaDataSourceType?.toLowerCase() ===
                'file' ? (
                  <FormGroup row>
                    <GluuLabel label={'fields.metadata_file'} size={4} />
                    <Col sm={8}>
                      <Box
                        display='flex'
                        flexWrap='wrap'
                        gap={1}
                        alignItems='center'
                      >
                        <Button
                          disabled={viewOnly}
                          color={`primary-${selectedTheme}`}
                          style={{
                            ...applicationStyle.buttonStyle,
                            ...applicationStyle.buttonFlexIconStyles,
                          }}
                          onClick={onHandleFileSelection}
                        >
                          {t('fields.import_file')}
                        </Button>
                        {metaDataFile ? (
                          <>
                            <span className='d-inline'>
                              {metaDataFile?.name}
                            </span>
                            <p className='mb-0'>
                              ({((metaDataFile?.size || 0) / 1000).toFixed(0)}K)
                            </p>
                          </>
                        ) : null}
                      </Box>
                      {fileError && (
                        <div style={{ color: 'red' }}>
                          {t('messages.import_metadata_file')}
                        </div>
                      )}
                    </Col>
                  </FormGroup>
                ) : (
                  <GluuInputRow
                    label='fields.metadata_url'
                    name='spMetaDataFN'
                    value={formik.values.spMetaDataFN}
                    formik={formik}
                    lsize={4}
                    rsize={8}
                    showError={
                      formik.errors.spMetaDataFN && formik.touched.spMetaDataFN
                    }
                    errorMessage={formik.errors.spMetaDataFN}
                    disabled={viewOnly}
                    required
                  />
                )}
              </Col>
              <Col sm={10}>
                {isLoading ? (
                  'Fetching attributes...'
                ) : (
                  <GluuTypeAheadForDn
                    name='releasedAttributes'
                    label='fields.released_attributes'
                    formik={formik}
                    value={scopeFieldValue}
                    options={scopeOptions}
                    lsize={4}
                    rsize={8}
                    disabled={viewOnly}
                    onChange={saveSelectedScopes}
                    paginate={true}
                    onSearch={debounceFn}
                    onPaginate={handlePagination}
                    maxResults={
                      scopeOptions?.length ? scopeOptions.length - 1 : undefined
                    }
                    isLoading={scopeLoading}
                    placeholder='Search for an attribute...'
                  />
                )}
              </Col>
              <input
                type='file'
                accept='text/xml,application/json'
                onChange={handleFileChange}
                id='metdaDateFile'
                ref={inputFile}
                style={{ display: 'none' }}
              />
            </FormGroup>
            {!viewOnly && (
              <Row>
                <Col>
                  <GluuCommitFooter
                    saveHandler={toggle}
                    hideButtons={{ save: true, back: false }}
                    type='submit'
                  />
                </Col>
              </Row>
            )}
            <GluuCommitDialog
              handler={toggle}
              modal={modal}
              onAccept={submitForm}
              formik={formik}
            />
          </Form>
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default TrustRelationForm
TrustRelationForm.propTypes = {
  configs: PropTypes.any,
  viewOnly: PropTypes.bool,
}