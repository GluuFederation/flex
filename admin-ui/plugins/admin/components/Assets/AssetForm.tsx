import React, { useCallback, useState, useEffect } from 'react'
import { Col, Form, Row, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import { useFormik } from 'formik'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuUploadFile from 'Routes/Apps/Gluu/GluuUploadFile'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import {
  createJansAsset,
  updateJansAsset,
  resetFlags,
} from 'Plugins/admin/redux/features/AssetSlice'
import { buildPayload } from 'Utils/PermChecker'
import { useNavigate, useParams } from 'react-router'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import Toggle from 'react-toggle'
import { ASSET } from 'Utils/ApiResources'
import {
  AssetFormValues,
  AssetSubmissionPayload,
  AcceptFileTypes,
  RootStateForAssetForm,
  RouteParams,
  UserAction,
  FileDropHandler,
  FileClearHandler,
  ValidationFunction,
  ToggleHandler,
  SubmitFormCallback,
} from './types/FormTypes'

const AssetForm: React.FC = () => {
  const { id } = useParams<RouteParams>()
  const userAction: UserAction = {}
  const { selectedAsset, services } = useSelector((state: RootStateForAssetForm) => state.assetReducer)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const saveOperationFlag = useSelector((state: RootStateForAssetForm) => state.assetReducer.saveOperationFlag)
  const errorInSaveOperationFlag = useSelector(
    (state: RootStateForAssetForm) => state.assetReducer.errorInSaveOperationFlag,
  )
  const dispatch = useDispatch()
  const [modal, setModal] = useState<boolean>(false)
  
  const validatePayload: ValidationFunction = (): boolean => {
    return false
  }

  const buildAcceptFileTypes = (): AcceptFileTypes => {
    return {
      'text/plain': ['.properties'],
      'text/css': ['.css'],
      'text/javascript': ['.js'],
      'application/java-archive': ['.jar'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'application/xhtml+xml': ['.xhtml'],
    }
  }

  const handleFileDrop: FileDropHandler = (files: File[]): void => {
    const file = files[0]
    if (file) {
      formik.setFieldValue('document', file)
      formik.setFieldValue('fileName', file?.name || '')
    }
  }

  const handleClearFiles: FileClearHandler = (): void => {
    formik.setFieldValue('document', null)
    formik.setFieldValue('fileName', '')
  }

  const formik = useFormik<AssetFormValues>({
    initialValues: {
      creationDate: selectedAsset?.creationDate || '',
      document: selectedAsset?.document || null,
      fileName: selectedAsset?.fileName || '',
      enabled: selectedAsset?.enabled || false,
      description: selectedAsset?.description || '',
      service: selectedAsset?.service ? [selectedAsset?.service] : [],
    },
    onSubmit: (values: AssetFormValues) => {
      const faulty = validatePayload(values)
      if (faulty) {
        return
      }
      toggle()
    },
    validationSchema: Yup.object().shape({
      fileName: Yup.string()
        .required(t('messages.display_name_error'))
        .matches(/^\S*$/, `${t('fields.asset_name')} ${t('messages.no_spaces')}`),
    }),
  })

  const toggle: ToggleHandler = (): void => {
    setModal(!modal)
  }

  const submitForm: SubmitFormCallback = useCallback(
    (userMessage: string): void => {
      toggle()
      const payload: AssetSubmissionPayload = {
        ...formik.values,
        service: formik.values.service[0],
      }
      if (id) {
        payload['inum'] = selectedAsset.inum
        payload['dn'] = selectedAsset.dn
        payload['baseDn'] = selectedAsset.baseDn
        buildPayload(userAction, userMessage, payload)
        dispatch(updateJansAsset({ action: userAction }))
      } else {
        buildPayload(userAction, userMessage, payload)
        dispatch(createJansAsset({ action: userAction }))
      }
    },
    [formik, id, selectedAsset, userAction, dispatch],
  )

  useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag) navigate('/adm/assets')
    return function cleanup() {
      dispatch(resetFlags())
    }
  }, [saveOperationFlag, errorInSaveOperationFlag, navigate, dispatch])

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <Col sm={12}>
          {id ? (
            <GluuInputRow
              label="fields.inum"
              formik={formik}
              value={selectedAsset?.inum}
              lsize={4}
              doc_entry="asset_id"
              rsize={8}
              doc_category={ASSET}
              name="assetId"
              disabled={true}
            />
          ) : null}
          <FormGroup row>
            <GluuLabel label={'fields.upload'} size={4} />
            <Col sm={8}>
              <GluuUploadFile
                accept={buildAcceptFileTypes()}
                placeholder={`Drag 'n' drop .jar/.css/.xhtml/.js/.png/.jpeg/.jpg/.gif/.properties file here, or click to select file`}
                onDrop={handleFileDrop}
                onClearFiles={handleClearFiles}
                disabled={false}
              />
            </Col>
          </FormGroup>
          <GluuInputRow
            label="fields.asset_name"
            formik={formik}
            value={formik.values?.fileName || ''}
            lsize={4}
            doc_entry="asset_name"
            rsize={8}
            required
            name="fileName"
            doc_category={ASSET}
            errorMessage={formik.errors.fileName}
            showError={formik.errors.fileName && formik.touched.fileName}
          />
          <GluuInputRow
            label="fields.description"
            formik={formik}
            value={formik.values?.description || ''}
            doc_category={ASSET}
            doc_entry="description"
            lsize={4}
            rsize={8}
            name="description"
          />
        </Col>
        <GluuTypeAhead
          name="service"
          multiple={false}
          allowNew={false}
          label={t('fields.jansService')}
          formik={formik}
          options={services}
          lsize={4}
          rsize={8}
          required
          value={formik.values.service}
          doc_category={ASSET}
        />
        <FormGroup row>
          <GluuLabel label="options.enabled" size={4} doc_category={ASSET} doc_entry="enabled" />
          <Col sm={1}>
            <Toggle
              id="enabled"
              name="enabled"
              onChange={formik.handleChange}
              defaultChecked={formik.values.enabled}
            />
          </Col>
        </FormGroup>
        <Row>
          <Col>
            <GluuCommitFooter
              saveHandler={toggle}
              hideButtons={{ save: true, back: false }}
              type="submit"
            />
          </Col>
        </Row>
      </Form>
      <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} />
    </>
  )
}

export default AssetForm
