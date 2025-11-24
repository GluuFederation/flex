import React, { useCallback, useState, useMemo } from 'react'
import { Col, Form, Row, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import { useFormik } from 'formik'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuUploadFile from 'Routes/Apps/Gluu/GluuUploadFile'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  createJansAsset,
  updateJansAsset,
  resetFlags,
} from 'Plugins/admin/redux/features/AssetSlice'
import { buildPayload } from 'Utils/PermChecker'
import { useParams } from 'react-router'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import Toggle from 'react-toggle'
import { ASSET } from 'Utils/ApiResources'
import {
  AssetFormValues,
  AcceptFileTypes,
  RootStateForAssetForm,
  RouteParams,
  FileDropHandler,
  FileClearHandler,
  ToggleHandler,
  SubmitFormCallback,
} from './types/FormTypes'
import { AssetFormData } from './types/AssetApiTypes'
import {
  CreateAssetActionPayload,
  UpdateAssetActionPayload,
} from '../../redux/features/types/asset'
import { getAssetValidationSchema } from 'Plugins/admin/helper/validations/assetValidation'
import { buildAssetInitialValues } from 'Plugins/admin/helper/assets'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'

const AssetForm: React.FC = () => {
  const { id } = useParams<RouteParams>()
  interface AssetUserAction {
    action_message?: string
    action_data?: AssetFormData
    [key: string]: AssetFormData | string | undefined
  }
  const userAction: AssetUserAction = {}
  const { selectedAsset, services, saveOperationFlag, errorInSaveOperationFlag } = useSelector(
    (state: RootStateForAssetForm) => state.assetReducer,
  )
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { navigateBack } = useAppNavigation()
  const [showCommitDialog, setShowCommitDialog] = useState<boolean>(false)

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

  const initialValues = useMemo(() => buildAssetInitialValues(selectedAsset), [selectedAsset])

  const formik = useFormik<AssetFormValues>({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values: AssetFormValues) => {
      if (values.fileName) {
        openCommitDialog()
      }
    },
    validationSchema: getAssetValidationSchema(t),
  })

  const openCommitDialog: ToggleHandler = useCallback(() => {
    setShowCommitDialog(true)
  }, [])

  const closeCommitDialog: ToggleHandler = useCallback(() => {
    setShowCommitDialog(false)
  }, [])

  const submitForm: SubmitFormCallback = useCallback(
    (userMessage: string): void => {
      closeCommitDialog()
      const payload: AssetFormData = {
        ...formik.values,
        service: formik.values.service[0],
        document: formik.values.document || '',
      }
      if (id) {
        payload['inum'] = selectedAsset.inum
        payload['dn'] = selectedAsset.dn
        payload['baseDn'] = selectedAsset.baseDn
        buildPayload(userAction, userMessage, payload)
        dispatch(updateJansAsset({ action: userAction } as UpdateAssetActionPayload))
      } else {
        buildPayload(userAction, userMessage, payload)
        dispatch(createJansAsset({ action: userAction } as CreateAssetActionPayload))
      }
    },
    [closeCommitDialog, formik, id, selectedAsset, userAction, dispatch],
  )

  if (saveOperationFlag && !errorInSaveOperationFlag) {
    navigateBack(ROUTES.USER_MANAGEMENT)
    dispatch(resetFlags())
  }

  const handleCancel = useCallback(() => {
    formik.resetForm({ values: initialValues })
  }, [formik, initialValues])

  const isFormChanged = formik.dirty
  const handleBack = useCallback(() => {
    navigateBack(ROUTES.USER_MANAGEMENT)
  }, [navigateBack])

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
              checked={formik.values.enabled}
            />
          </Col>
        </FormGroup>
        <Row>
          <Col>
            <GluuFormFooter
              showBack={true}
              onBack={handleBack}
              showCancel={true}
              onCancel={handleCancel}
              disableCancel={!isFormChanged}
              showApply={true}
              onApply={formik.handleSubmit}
              disableApply={!isFormChanged || !formik.isValid}
              applyButtonType="button"
            />
          </Col>
        </Row>
      </Form>
      <GluuCommitDialog
        handler={closeCommitDialog}
        modal={showCommitDialog}
        onAccept={submitForm}
      />
    </>
  )
}

export default AssetForm
