import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
    Col,
    InputGroup,
    Form,
    FormGroup,
    Label,
    Input,
} from '../../../../app/components'
import GluuTypeAhead from '../../../../app/routes/Apps/Gluu/GluuTypeAhead'
import GluuFooter from '../../../../app/routes/Apps/Gluu/GluuFooter'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'

import GluuCommitFooter from '../../../../app/routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from '../../../../app/routes/Apps/Gluu/GluuCommitDialog'

function LdapForm({ item, handleSubmit }) {
    const [init, setInit] = useState(false)
    const [modal, setModal] = useState(false)

    function toogle() {
        if (!init) {
            setInit(true)
        }
    }
    function toggle() {
        setModal(!modal)
      }
    function submitForm() {
        toggle()
        document.getElementsByClassName('LdapUserActionSubmitButton')[0].click()
    }
    const formik = useFormik({
        initialValues: {
            configId: item.configId,
            bindDN: item.bindDN,
            bindPassword: item.bindPassword,
            servers: item.servers,
            maxConnections: item.maxConnections,
            useSSL: item.useSSL,
            baseDNs: item.baseDNs,
            primaryKey: item.primaryKey,
            localPrimaryKey: item.localPrimaryKey,
            enabled: item.enabled,

        },
        validationSchema: Yup.object({
            configId: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
            bindDN: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
            bindPassword: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
            servers: Yup.array().required('Required!'),
            maxConnections: Yup.number().required().positive().integer().required('Required!'),
            baseDNs: Yup.array().required('Required!'),
            primaryKey: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
            localPrimaryKey: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
        }),
        onSubmit: (values) => {
            values.servers = values.servers.map((ele) => !!ele.servers ? ele.servers : ele)
            values.baseDNs = values.baseDNs.map((ele) => !!ele.baseDNs ? ele.baseDNs : ele)

            const result = Object.assign(item, values)
            handleSubmit(JSON.stringify(result))
        },
    })
    return (
        <Form onSubmit={formik.handleSubmit}>
            {/* START Input */}
            <FormGroup row>
                <GluuLabel label="Name" required />
                <Col sm={9}>
                    {!!item.configId ?
                        <Input
                            valid={!formik.errors.configId && !formik.touched.configId && init}
                            placeholder="Enter the ldap Name"
                            id="configId"
                            name="configId"
                            defaultValue={item.configId}
                            disabled
                            onKeyUp={toogle}
                            onChange={formik.handleChange}
                        /> :
                        <Input
                            valid={!formik.errors.configId && !formik.touched.configId && init}
                            placeholder="Enter the ldap Name"
                            id="configId"
                            name="configId"
                            defaultValue={item.configId}
                            onKeyUp={toogle}
                            onChange={formik.handleChange}
                        />
                    }
                    {formik.errors.configId && formik.touched.configId ? (
                        <div style={{ color: 'red' }}>{formik.errors.configId}</div>
                    ) : null}
                </Col>
            </FormGroup>
            <FormGroup row>
                <GluuLabel label="Bind DN" required />
                <Col sm={9}>
                    <Input
                        placeholder="Enter the ldap Bind DN"
                        id="bindDN"
                        valid={!formik.errors.bindDN && !formik.touched.bindDN && init}
                        name="bindDN"
                        defaultValue={item.bindDN}
                        onKeyUp={toogle}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.bindDN && formik.touched.bindDN ? (
                        <div style={{ color: 'red' }}>{formik.errors.bindDN}</div>
                    ) : null}
                </Col>
            </FormGroup>
            <FormGroup row>
                <GluuLabel label="Bind Password" required />
                <Col sm={9}>
                    <InputGroup>
                        <Input
                            placeholder="Enter the ldap Bind Password"
                            valid={
                                !formik.errors.bindPassword &&
                                !formik.touched.bindPassword &&
                                init
                            }
                            onKeyUp={toogle}
                            id="bindPassword"
                            type="password"
                            defaultValue={item.bindPassword}
                            onChange={formik.handleChange}
                        />
                    </InputGroup>
                    {formik.errors.bindPassword && formik.touched.bindPassword ? (
                        <div style={{ color: 'red' }}>{formik.errors.bindPassword}</div>
                    ) : null}
                </Col>
            </FormGroup>
            <FormGroup row>
                <Col sm={9}>
                    <GluuTypeAhead
                        name="servers"
                        label="Servers"
                        formik={formik}
                        required={true}
                        options={['localhost:1636']}
                        value={item.servers}
                        valid={
                            !formik.errors.servers &&
                            !formik.touched.servers &&
                            init
                        }
                        onKeyUp={toogle}
                    ></GluuTypeAhead>

                    {formik.errors.servers && formik.touched.servers ? (
                        <div style={{ color: 'red' }}>{formik.errors.servers}</div>
                    ) : null}
                </Col>
            </FormGroup>
            <FormGroup row>
                <GluuLabel label="Max Connections" required />
                <Col sm={9}>
                    <InputGroup>
                        <Input
                            placeholder="Enter the ldap Bind Max Connections"
                            valid={
                                !formik.errors.maxConnections &&
                                !formik.touched.maxConnections &&
                                init
                            }
                            id="maxConnections"
                            onKeyUp={toogle}
                            defaultValue={item.maxConnections}
                            onChange={formik.handleChange}
                        />
                    </InputGroup>
                    {formik.errors.maxConnections && formik.touched.maxConnections ? (
                        <div style={{ color: 'red' }}>{formik.errors.maxConnections}</div>
                    ) : null}
                </Col>
            </FormGroup>
            <FormGroup row>
                <GluuLabel label="Use SSL" required />
                <Col sm={9}>
                    <InputGroup>
                        <Input
                            placeholder="Enable SSL communication between auth Server and LDAP server"
                            valid={
                                !formik.errors.useSSL &&
                                !formik.touched.useSSL &&
                                init
                            }
                            id="useSSL"
                            type="checkbox"
                            onKeyUp={toogle}
                            defaultChecked={item.useSSL}
                            onChange={formik.handleChange}
                        />
                    </InputGroup>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Col sm={9}>
                    <GluuTypeAhead
                        name="baseDNs"
                        label="Base DNs"
                        formik={formik}
                        options={[]}
                        required={true}
                        onKeyUp={toogle}
                        value={item.baseDNs}
                    ></GluuTypeAhead>
                    {formik.errors.baseDNs && formik.touched.baseDNs ? (
                        <div style={{ color: 'red' }}>{formik.errors.baseDNs}</div>
                    ) : null}
                </Col>
            </FormGroup>
            <FormGroup row>
                <GluuLabel label="Primary Key" required />
                <Col sm={9}>
                    <InputGroup>
                        <Input
                            placeholder="Enter the ldap Primary Key"
                            valid={
                                !formik.errors.primaryKey &&
                                !formik.touched.primaryKey &&
                                init
                            }
                            id="primaryKey"
                            onKeyUp={toogle}
                            defaultValue={item.primaryKey}
                            onChange={formik.handleChange}
                        />
                    </InputGroup>
                    {formik.errors.primaryKey && formik.touched.primaryKey ? (
                        <div style={{ color: 'red' }}>{formik.errors.primaryKey}</div>
                    ) : null}
                </Col>
            </FormGroup>
            <FormGroup row>
                <GluuLabel label="Local Primary Key" required />
                <Col sm={9}>
                    <InputGroup>
                        <Input
                            placeholder="Enter the ldap Primary Key"
                            valid={
                                !formik.errors.localPrimaryKey &&
                                !formik.touched.localPrimaryKey &&
                                init
                            }
                            id="localPrimaryKey"
                            onKeyUp={toogle}
                            defaultValue={item.localPrimaryKey}
                            onChange={formik.handleChange}
                        />
                    </InputGroup>
                    {formik.errors.localPrimaryKey && formik.touched.localPrimaryKey ? (
                        <div style={{ color: 'red' }}>{formik.errors.localPrimaryKey}</div>
                    ) : null}
                </Col>
            </FormGroup>
            <FormGroup row>
                <GluuLabel label="Activate" />
                <Col sm={9}>
                    <InputGroup>
                        <Input
                            placeholder="Activate ldap configuration"
                            valid={
                                !formik.errors.enabled &&
                                !formik.touched.enabled &&
                                init
                            }
                            type="checkbox"
                            id="enabled"
                            onKeyUp={toogle}
                            defaultChecked={item.enabled}
                            onChange={formik.handleChange}
                        />
                    </InputGroup>
                </Col>
            </FormGroup>
            <FormGroup row>
                {' '}
                <Input
                type="hidden"
                id="moduleProperties"
                defaultValue={item.moduleProperties}
                />
            </FormGroup>
            <FormGroup row></FormGroup>
            <GluuFooter saveHandler={toggle} />
            <GluuCommitDialog
                handler={toggle}
                modal={modal}
                onAccept={submitForm}
                formik={formik}
            />
        </Form>
    )
}

export default LdapForm
