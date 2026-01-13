import React, { useContext, ReactElement } from 'react'
import { Container, Badge, Row, Col, FormGroup, Label } from 'Components'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import customColors from '@/customColors'
import type { LdapDetailPageProps } from './types'

function LdapDetailPage({ row, testLdapConnection }: LdapDetailPageProps): ReactElement {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'light'

  function getBadgeTheme(status: boolean | undefined): string {
    if (status) {
      return `primary-${selectedTheme}`
    } else {
      return 'warning'
    }
  }

  function checkLdapConnection(): void {
    testLdapConnection(row)
  }

  return (
    <Container style={{ backgroundColor: customColors.whiteSmoke }}>
      <FormGroup row> </FormGroup>
      <Row>
        <Col sm={6}>
          <FormGroup row>
            <Label for="input" sm={6}>
              {t('fields.configuration_id')}:
            </Label>
            <Label for="input" sm={6}>
              {row.configId}
            </Label>
          </FormGroup>
        </Col>
        <Col sm={6}>
          <FormGroup row>
            <Label for="input" sm={6}>
              {t('fields.bind_dn')}:
            </Label>
            <Label for="input" sm={6}>
              {row.bindDN}
            </Label>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <FormGroup row>
            <Label sm={6}>{t('fields.status')}:</Label>
            <Label sm={6}>
              <Badge color={getBadgeTheme(row.enabled)}>
                {row.enabled ? t('options.enabled') : t('options.disable')}
              </Badge>
            </Label>
          </FormGroup>
        </Col>
        <Col sm={6}>
          <FormGroup row>
            <Label sm={6}>{t('fields.servers')}:</Label>
            <Label sm={6}>
              {row.servers &&
                row.servers.map((server, index) => (
                  <Badge key={index} color={`primary-${selectedTheme}`}>
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
            <Label sm={6}>{t('fields.max_connections')}:</Label>
            <Label sm={6}>{row.maxConnections}</Label>
          </FormGroup>
        </Col>
        <Col sm={4}>
          <FormGroup row>
            <Label sm={6}>{t('fields.use_ssl')}:</Label>
            <Label sm={6}>
              <Badge color={getBadgeTheme(row.useSSL)}>
                {row.useSSL ? t('options.true') : t('options.false')}
              </Badge>
            </Label>
          </FormGroup>
        </Col>
        <Col sm={4}>
          <FormGroup row>
            <Label sm={6}>{t('fields.base_dns')}:</Label>
            <Label sm={6}>
              {row.baseDNs &&
                row.baseDNs.map((baseDN) => (
                  <Badge key={baseDN} color={`primary-${selectedTheme}`}>
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
            <Label sm={6}>{t('fields.primary_key')}:</Label>
            <Label sm={6}>{row.primaryKey}</Label>
          </FormGroup>
        </Col>
        <Col sm={4}>
          <FormGroup row>
            <Label sm={6}>{t('fields.local_primary_key')}:</Label>
            <Label sm={6}>{row.localPrimaryKey}</Label>
          </FormGroup>
        </Col>
        <Col sm={4}>
          <FormGroup row>
            <Label sm={6}>{t('fields.use_anonymous_bind')}:</Label>
            <Label sm={6}>
              <Badge color={getBadgeTheme(row.useAnonymousBind)}>
                {row.useAnonymousBind ? t('options.true') : t('options.false')}
              </Badge>
            </Label>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm={4}>
          <button
            onClick={checkLdapConnection}
            type="button"
            className={`btn btn-primary-${selectedTheme} text-center`}
          >
            {t('fields.test_connection')}
          </button>
        </Col>
      </Row>
      <FormGroup row> </FormGroup>
    </Container>
  )
}

export default LdapDetailPage
