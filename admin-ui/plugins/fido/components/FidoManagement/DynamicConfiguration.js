import React, { useState, useContext } from 'react'
import { Button, Row, Col, Form, FormGroup } from '../../../../app/components'
import GluuInputRow from '../../../../app/routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from '../../../../app/routes/Apps/Gluu/GluuSelectRow'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import { ThemeContext } from 'Context/theme/themeContext'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

function DynamicConfiguration({ item, handleSubmit }) {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const theme = useContext(ThemeContext)
    const selectedTheme = theme.state.theme
    const [modal, setModal] = useState(false)
    const toggle = () => {
        setModal(!modal)
    }
    const initialValues = {}
    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => {
            toggle()
        },
        validationSchema: Yup.object({}),
        setFieldValue: (field) => {
            delete values[field]
        },
    })

    const submitForm = () => {
        toggle()
        handleSubmit(formik.values)
    }

    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault()
                formik.handleSubmit()
            }}
            className="mt-3"
        >
            <FormGroup row>
                <Col sm={8}>
                    <GluuInputRow
                        label="fields.authenticator_certificates_folder"
                        name="host"
                        value={formik.values.host || ''}
                        formik={formik}
                        lsize={4}
                        rsize={8}
                        showError={formik.errors.host && formik.touched.host}
                        errorMessage={formik.errors.host}
                    />
                </Col>
                <Col sm={8}>
                    <GluuInputRow
                        label="fields.mds_access_token"
                        name="host"
                        value={formik.values.host || ''}
                        formik={formik}
                        lsize={4}
                        rsize={8}
                        showError={formik.errors.host && formik.touched.host}
                        errorMessage={formik.errors.host}
                    />
                </Col>
                <Col sm={8}>
                    <GluuInputRow
                        label="fields.mds_toc_certificates_folder"
                        name="host"
                        value={formik.values.host || ''}
                        formik={formik}
                        lsize={4}
                        rsize={8}
                        showError={formik.errors.host && formik.touched.host}
                        errorMessage={formik.errors.host}
                    />
                </Col>
                <Col sm={8}>
                    <GluuInputRow
                        label="fields.mds_toc_files_folder"
                        name="host"
                        value={formik.values.host || ''}
                        formik={formik}
                        lsize={4}
                        rsize={8}
                        showError={formik.errors.host && formik.touched.host}
                        errorMessage={formik.errors.host}
                    />
                </Col>

                <Col sm={8}>
                    <GluuSelectRow
                        label="fields.check_u2f_attestations"
                        name="connect_protection"
                        value={formik.values.connect_protection || ''}
                        defaultValue={formik.values.connect_protection || ''}
                        values={["true", "false"]}
                        formik={formik}
                        lsize={4}
                        rsize={8}
                        showError={formik.errors.connect_protection && formik.touched.connect_protection}
                        errorMessage={formik.errors.connect_protection}
                    />
                </Col>

                <Col sm={8}>
                    <GluuInputRow
                        label="fields.unfinished_request_expiration"
                        name="host"
                        value={formik.values.host || ''}
                        formik={formik}
                        lsize={4}
                        rsize={8}
                        showError={formik.errors.host && formik.touched.host}
                        errorMessage={formik.errors.host}
                    />
                </Col>

                <Col sm={8}>
                    <GluuInputRow
                        label="fields.authentication_history_expiration"
                        name="host"
                        value={formik.values.host || ''}
                        formik={formik}
                        lsize={4}
                        rsize={8}
                        showError={formik.errors.host && formik.touched.host}
                        errorMessage={formik.errors.host}
                    />
                </Col>

                <Col sm={8}>
                    <GluuInputRow
                        label="fields.server_metadata_folder"
                        name="host"
                        value={formik.values.host || ''}
                        formik={formik}
                        lsize={4}
                        rsize={8}
                        showError={formik.errors.host && formik.touched.host}
                        errorMessage={formik.errors.host}
                    />
                </Col>

                <Col sm={8}>
                    <GluuSelectRow
                        label="fields.user_auto_enrollment"
                        name="connect_protection"
                        value={formik.values.connect_protection || ''}
                        defaultValue={formik.values.connect_protection || ''}
                        values={["true", "false"]}
                        formik={formik}
                        lsize={4}
                        rsize={8}
                        showError={formik.errors.connect_protection && formik.touched.connect_protection}
                        errorMessage={formik.errors.connect_protection}
                    />
                </Col>

                <Col sm={8}>
                    <GluuSelectRow
                        label="fields.requested_credential_types"
                        name="connect_protection"
                        value={formik.values.connect_protection || ''}
                        defaultValue={formik.values.connect_protection || ''}
                        values={["RS256", "ES256"]}
                        formik={formik}
                        lsize={4}
                        rsize={8}
                        showError={formik.errors.connect_protection && formik.touched.connect_protection}
                        errorMessage={formik.errors.connect_protection}
                    />
                </Col>



            </FormGroup>
            <Row>
                <Col> <GluuCommitFooter saveHandler={toggle} hideButtons={{ save: true, back: false }} type="submit" />
                </Col>
            </Row>
            <GluuCommitDialog
                handler={toggle}
                modal={modal}
                onAccept={submitForm}
                formik={formik}
            />
        </Form>
    )
}
export default DynamicConfiguration