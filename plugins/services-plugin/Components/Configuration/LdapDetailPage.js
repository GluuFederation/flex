import React from 'react'
import {
    Container,
    Badge,
    Row,
    Col,
    FormGroup,
    Label,
} from '../../../../app/components'

const LdapDetailPage = ({ row, testLdapConnection }) => {
    
    function getBadgeTheme(status) {
        if (status) {
            return 'primary'
        } else {
            return 'warning'
        }
    }

    function checkLdapConnection() {
        testLdapConnection(row);
    }

    return (
        <React.Fragment>
            {/* START Content */}
            <Container style={{ backgroundColor: '#F5F5F5' }}>
                <Row>
                    <Col sm={6}>
                        <FormGroup row>
                            <Label for="input" sm={6}>Configuration Id:</Label>
                            <Label for="input" sm={6}>{row.configId}</Label>
                        </FormGroup>
                    </Col>
                    <Col sm={6}>
                        <FormGroup row>
                            <Label for="input" sm={6}>Bind DN:</Label>
                            <Label for="input" sm={6}>{row.bindDN}</Label>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <FormGroup row>
                            <Label sm={6}>Status:</Label>
                            <Label sm={6}>
                                <Badge color={getBadgeTheme(row.enabled)}>
                                    {row.enabled ? "enabled" : "disable"}
                                </Badge>
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col sm={6}>
                        <FormGroup row>
                            <Label sm={6}>Servers:</Label>
                            <Label sm={6}>
                                {row.servers && row.servers.map((server, index) => (
                                    <Badge key={index} color="primary">
                                        {server}
                                    </Badge>
                                ))}
                            </Label>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <FormGroup row>
                            <Label sm={6}>Max Connections:</Label>
                            <Label sm={6}>{row.maxConnections}</Label>
                        </FormGroup>
                    </Col>
                    <Col sm={4}>
                        <FormGroup row>
                            <Label sm={6}>Use SSL:</Label>
                            <Label sm={6}>
                                {row.useSSL}
                                <Badge color={getBadgeTheme(row.useSSL)}>
                                    {row.useSSL ? "True" : "False"}
                                </Badge>
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col sm={4}>
                        <FormGroup row>
                            <Label sm={6}>Base DNs:</Label>
                            <Label sm={6}>
                                {row.baseDNs && row.baseDNs.map((baseDN, index) => (
                                    <Badge key={baseDN} color="primary">
                                        {baseDN}
                                    </Badge>
                                ))}
                            </Label>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <FormGroup row>
                            <Label sm={6}>Primary Key:</Label>
                            <Label sm={6}>{row.primaryKey}</Label>
                        </FormGroup>
                    </Col>
                    <Col sm={4}>
                        <FormGroup row>
                            <Label sm={6}>Local Primary Key:</Label>
                            <Label sm={6}>{row.localPrimaryKey}</Label>
                        </FormGroup>
                    </Col>
                    <Col sm={4}>
                        <FormGroup row>
                            <Label sm={6}>Use Anonymous Bind:</Label>
                            <Label sm={6}>{row.useAnonymousBind}</Label>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                    <button onClick={checkLdapConnection} type="button" className="btn btn-primary text-center">Test Connection</button>
                    </Col>
                </Row>
                {/* END Content */}
            </Container>
        </React.Fragment>
    )
}
export default LdapDetailPage
