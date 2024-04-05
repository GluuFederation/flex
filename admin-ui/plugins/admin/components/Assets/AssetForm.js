import React, { useCallback, useState, useEffect, useContext } from 'react'
import { Col, Form, Row, FormGroup, Button } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import { useFormik } from 'formik'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { useFilePicker } from 'use-file-picker'
import {
    FileAmountLimitValidator,
    FileTypeValidator,
    FileSizeValidator,
} from 'use-file-picker/validators'
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
import { ThemeContext } from 'Context/theme/themeContext'

const AssetForm = () => {
    const { id } = useParams()
    const userAction = {}
    const { selectedAsset } = useSelector((state) => state.assetReducer)
    const { t } = useTranslation()
    const navigate = useNavigate()
    const theme = useContext(ThemeContext)
    const selectedTheme = theme.state.theme
    const { openFilePicker, filesContent, clear } = useFilePicker({
        accept: [".css", ".html", ".js", ".jar"],
        multiple: false,
        validators: [
            new FileAmountLimitValidator({ max: 1 }),
            new FileTypeValidator(['js', 'css', 'html', 'jar']),
            new FileSizeValidator({ maxFileSize: 20 * 1024 * 1024 /* 20 MB */ }),
        ],
        onFilesRejected: ({ errors }) => {
            console.log('Failed to import flow file:', errors)
        },
        onFilesSuccessfullySelected: () => {
            console.log('File imported successfully.')
        },
    })
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


    const formik = useFormik({
        initialValues: {
            creationDate: selectedAsset?.creationDate,
            document: selectedAsset?.document || '',
            displayName: selectedAsset?.displayName || '',
            jansEnabled: selectedAsset?.jansEnabled || false,
            description: selectedAsset?.description || '',
        },
        onSubmit: (values) => {
            const faulty = validatePayload(values)
            if (faulty) {
                return
            }
            toggle()
        },
        validationSchema: Yup.object().shape({
            document: Yup.string().required(t('messages.asset_document_error')),
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
        console.log('toggle')
        setModal(!modal)
    }

    function assetUpload() {
        formik.setFieldValue('displayName', filesContent[0].name)
        formik.setFieldValue('document', filesContent[0])
    }

    const submitForm = useCallback(
        (userMessage) => {
            toggle()
            const jansModuleProperties = formik.values.jansModuleProperty?.map((header) => {
                return {
                    key: header.key || header.source,
                    value: header.value || header.destination,
                }
            })

            const payload = {
                ...formik.values,
                jansModuleProperty: jansModuleProperties || [],
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

    useEffect(() => {
        if (filesContent.length >= 1) {
            assetUpload()
        }
    }, [filesContent])


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
                            label='fields.upload'
                            size={4}
                            doc_category={ASSET}
                            doc_entry='upload'
                        />
                        <Col sm={1}>
                            <Button
                                color={`primary-${selectedTheme}`}
                                type="button"
                                style={applicationStyle.buttonStyle}
                                onClick={() => {
                                    openFilePicker()
                                }}
                            >
                                Import
                            </Button>
                            {filesContent[0]?.name}
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
