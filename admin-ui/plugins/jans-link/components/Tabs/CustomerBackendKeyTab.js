import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { Row, Col, Form, FormGroup } from 'Components'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import * as Yup from 'yup'
import { t } from 'i18next'
import { isEmpty } from 'lodash'
import { putCacheRefreshConfiguration } from 'Plugins/jans-link/redux/features/CacheRefreshSlice'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { buildPayload } from 'Utils/PermChecker'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'

const isStringsArray = (arr) => arr.every((i) => typeof i === 'string')
const convertToStringArray = (arr) => {
  return arr.map((item) => item.value)
}

const CustomerBackendKeyTab = () => {
  const dispatch = useDispatch()
  const cacheRefreshConfiguration = useSelector(
    (state) => state.cacheRefreshReducer.configuration
  )
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }

  const {
    keyAttributes = [],
    keyObjectClasses = [],
    sourceAttributes = [],
    customLdapFilter = '',
  } = useSelector((state) => state.cacheRefreshReducer.configuration)
  const initialValues = {
    keyAttributes,
    keyObjectClasses,
    sourceAttributes,
    customLdapFilter,
  }
  const userAction = {}
  const formik = useFormik({
    initialValues: initialValues,
    setFieldValue: (field) => {
      delete values[field]
    },
    validationSchema: Yup.object({
      keyAttributes: Yup.array().min(
        1,
        `${t('fields.key_attribute')} ${t('messages.is_required')}`
      ),
      keyObjectClasses: Yup.array().min(
        1,
        `${t('fields.object_class')} ${t('messages.is_required')}`
      ),
      sourceAttributes: Yup.array().min(
        1,
        `${t('fields.source_attribute')} ${t('messages.is_required')}`
      ),
    }),
    onSubmit: (data) => {
      if (isEmpty(formik.errors)) {
        toggle()
      } 
    },
  })

  const submitForm = (userMessage) => { 
    toggle()

    buildPayload(userAction, userMessage, {
      appConfiguration2: {
        ...cacheRefreshConfiguration,
        ...formik.values,
        sourceAttributes: isStringsArray(formik.values?.sourceAttributes || [])
          ? formik.values.sourceAttributes
          : convertToStringArray(formik.values?.sourceAttributes || []),
        keyObjectClasses: isStringsArray(formik.values.keyObjectClasses || [])
          ? formik.values.keyObjectClasses
          : convertToStringArray(formik.values?.keyObjectClasses || []),
        keyAttributes: isStringsArray(formik.values.keyAttributes || [])
          ? formik.values.keyAttributes
          : convertToStringArray(formik.values?.keyAttributes || []),
      },
    })
    dispatch(
      putCacheRefreshConfiguration({ action: userAction })
    )
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        formik.handleSubmit()
      }}
      className='mt-4'
    >
      <FormGroup row>
        <Col sm={12}>
          <Row>
            <GluuLabel required label='fields.key_attribute' size={3} />
            <Col sm={9}>
              <GluuProperties
                compName='keyAttributes'
                isInputLables={true}
                formik={formik}
                options={
                  formik.values.keyAttributes
                    ? formik.values.keyAttributes.map((item) => ({
                        key: '',
                        value: item,
                      }))
                    : []
                }
                isKeys={false}
                buttonText='actions.add_key_attribute'
                showError={
                  formik.errors.keyAttributes && formik.touched.keyAttributes
                }
                errorMessage={formik.errors.keyAttributes}
              />
            </Col>
          </Row>
        </Col>
        <Col sm={12}>
          <Row className='mt-4'>
            <GluuLabel required label='fields.object_class' size={3} />
            <Col sm={9}>
              <GluuProperties
                compName='keyObjectClasses'
                isInputLables={true}
                formik={formik}
                options={
                  formik.values.keyObjectClasses
                    ? formik.values.keyObjectClasses.map((item) => ({
                        key: '',
                        value: item,
                      }))
                    : []
                }
                isKeys={false}
                buttonText='actions.add_object_class'
                showError={
                  formik.errors.keyObjectClasses &&
                  formik.touched.keyObjectClasses
                }
                errorMessage={formik.errors.keyObjectClasses}
              />
            </Col>
          </Row>
        </Col>
        <Col sm={12}>
          <Row className='mt-4'>
            <GluuLabel required label='fields.source_attribute' size={3} />
            <Col sm={9}>
              <GluuProperties
                compName='sourceAttributes'
                isInputLables={true}
                formik={formik}
                options={
                  formik.values.sourceAttributes
                    ? formik.values.sourceAttributes.map((item) => ({
                        key: '',
                        value: item,
                      }))
                    : []
                }
                isKeys={false}
                buttonText='actions.add_source_attribute'
                showError={
                  formik.errors.sourceAttributes &&
                  formik.touched.sourceAttributes
                }
                errorMessage={formik.errors.sourceAttributes}
              />
            </Col>
          </Row>
        </Col>
        <Col sm={12} className='mt-4'>
          <GluuInputRow
            label='fields.custom_ldap_filter'
            name='customLdapFilter'
            value={formik.values.customLdapFilter || ''}
            formik={formik}
            lsize={3}
            rsize={9}
          />
        </Col>
      </FormGroup>
      <Row>
        <Col>
          <GluuCommitFooter
            hideButtons={{ save: true, back: false }}
            type='submit'
            saveHandler={toggle}
          />
        </Col>
      </Row>
      <GluuCommitDialog
        handler={toggle}
        modal={modal}
        onAccept={submitForm}
        formik={formik}
        feature={adminUiFeatures.jans_link_write}
      />
    </Form>
  )
}

export default CustomerBackendKeyTab
