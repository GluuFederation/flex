import React, { useCallback, useState, useEffect } from 'react'
import { Col, Form, Row, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import { useFormik } from 'formik'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuUploadFile from 'Routes/Apps/Gluu/GluuUploadFile'
import GluuArrayCompleter from 'Routes/Apps/Gluu/GluuArrayCompleter'
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

const AssetForm = () => {
    const { id } = useParams()
    const [assetFile, setAssetFile] = useState(null)
    const userAction = {}
    const { selectedAsset, fileTypes, services } = useSelector((state) => state.assetReducer)
    const allServices = ["jans-auth", "jans-casa", "jans-config-api"]
    const { t } = useTranslation()
    const navigate = useNavigate()
    const saveOperationFlag = useSelector(
        (state) => state.assetReducer.saveOperationFlag
    )
    const errorInSaveOperationFlag = useSelector(
        (state) => state.assetReducer.errorInSaveOperationFlag
    )
    const dispatch = useDispatch()
    const [modal, setModal] = useState(false)
    const validatePayload = (values) => {
        let faulty = false
        return faulty
    }

    const handleFileDrop = (files) => {
        const file = files[0]
        if (file) {
            setAssetFile(file)
            formik.setFieldValue('document', assetFile)
            formik.setFieldValue('displayName', file?.name || '')
        }
    }

    const handleClearFiles = () => {
        setAssetFile(null)
    }


    const formik = useFormik({
        initialValues: {
            creationDate: selectedAsset?.creationDate || '',
            document: selectedAsset?.document || null,
            displayName: selectedAsset?.displayName || '',
            jansEnabled: selectedAsset?.jansEnabled || false,
            description: selectedAsset?.description || '',
            jansService: selectedAsset?.jansService || []
        },
        onSubmit: (values) => {
            const faulty = validatePayload(values)
            if (faulty) {
                return
            }
            toggle()
        },
        validationSchema: Yup.object().shape({
            displayName: Yup.string()
                .required(t('messages.display_name_error'))
                .matches(
                    /^\S*$/,
                    `${t('fields.asset_name')} ${t('messages.no_spaces')}`
                ),
            description: Yup.string().required(t('messages.description_error')),
        }),
    })

    const toggle = () => {
        setModal(!modal)
    }

    const submitForm = useCallback(
        (userMessage) => {
            toggle()
            const payload = {
                ...formik.values,
            }
            if (id) {
                payload['inum'] = selectedAsset.inum
                payload['dn'] = selectedAsset.dn
                payload['baseDn'] = selectedAsset.baseDn
            }
            buildPayload(userAction, userMessage, payload)
            if (id) {
                dispatch(updateJansAsset({ action: userAction }))
            } else {
                dispatch(createJansAsset({ action: userAction }))
            }
        },
        [formik]
    )

    useEffect(() => {
        if (saveOperationFlag && !errorInSaveOperationFlag) navigate('/adm/assets')
        return function cleanup() {
            dispatch(resetFlags())
        }
    }, [saveOperationFlag, errorInSaveOperationFlag])


    return (
        <>
            <Form onSubmit={formik.handleSubmit}>
                <Col sm={12}>
                    {id ? (
                        <GluuInputRow
                            label='fields.inum'
                            formik={formik}
                            value={selectedAsset?.inum}
                            lsize={4}
                            doc_entry='asset_id'
                            rsize={8}
                            doc_category={ASSET}
                            name='assetId'
                            disabled={true}
                        />
                    ) : null}
                    <FormGroup row>
                        <GluuLabel
                            label={'fields.upload'}
                            size={4}
                        />
                        <Col sm={8}>
                            <GluuUploadFile
                                accept={{
                                    'text/xml': ['.jar'],
                                    'application/json': ['.json'],
                                }}
                                placeholder={`Drag 'n' drop .jar/.css/.html/.js file here, or click to select file`}
                                onDrop={handleFileDrop}
                                onClearFiles={handleClearFiles}
                                disabled={false}
                            />
                        </Col>
                    </FormGroup>
                    <GluuInputRow
                        label='fields.asset_name'
                        formik={formik}
                        value={formik.values?.displayName}
                        lsize={4}
                        doc_entry='asset_name'
                        rsize={8}
                        required
                        name='displayName'
                        doc_category={ASSET}
                        errorMessage={formik.errors.displayName}
                        showError={formik.errors.displayName && formik.touched.displayName}
                    />
                    <GluuInputRow
                        label='fields.description'
                        formik={formik}
                        value={formik.values?.description}
                        doc_category={ASSET}
                        doc_entry='description'
                        lsize={4}
                        rsize={8}
                        name='description'
                    />
                </Col>
                <GluuTypeAhead
                    name='jansService'
                    label={t('fields.jansService')}
                    formik={formik}
                    options={allServices}
                    lsize={4}
                    rsize={8}
                    required
                    value={selectedAsset.jansService || []}
                    doc_category={ASSET}
                />
                {false &&
                    <GluuArrayCompleter
                        formik={formik}
                        name='jansService'
                        rsize={8}
                        lsize={4}
                        doc_category={ASSET}
                        label='fields.jansService'
                        value={selectedAsset.jansService || []}
                        options={selectedAsset.jansService || []}   >
                    </GluuArrayCompleter>
                }
                <FormGroup row>
                    <GluuLabel
                        label='options.enabled'
                        size={4}
                        doc_category={ASSET}
                        doc_entry='enabled'
                    />
                    <Col sm={1}>
                        <Toggle
                            id='jansEnabled'
                            name='jansEnabled'
                            onChange={formik.handleChange}
                            defaultChecked={formik.values.jansEnabled}
                        />
                    </Col>
                </FormGroup>
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
            <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} />
        </>
    )
}

export default AssetForm
