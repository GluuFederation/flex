import React, { useContext, useMemo, ReactElement } from 'react'
import { Container, Badge, Row, Col, FormGroup, Label } from 'Components'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import customColors from '@/customColors'
import type { LdapDetailPageProps } from './types'
import { DEFAULT_THEME } from '@/context/theme/constants'

function LdapDetailPage({ row, testLdapConnection }: LdapDetailPageProps): ReactElement {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = useMemo(() => theme?.state?.theme || DEFAULT_THEME, [theme?.state?.theme])
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const labelStyle = useMemo(
    () => ({
      fontWeight: 'bold' as const,
      color: customColors.black,
    }),
    [],
  )

  const valueStyle = useMemo(
    () => ({
      color: customColors.black,
    }),
    [],
  )

  const badgeStyle = useMemo(
    () => ({
      backgroundColor: themeColors.background,
      color: customColors.white,
      marginRight: '4px',
      marginBottom: '4px',
    }),
    [themeColors.background],
  )

  function checkLdapConnection(): void {
    testLdapConnection(row)
  }

  return (
    <Container style={{ backgroundColor: customColors.whiteSmoke }}>
      <FormGroup row> </FormGroup>
      <Row>
        <Col sm={6}>
          <FormGroup row>
            <Label for="input" sm={6} style={labelStyle}>
              {t('fields.configuration_id')}:
            </Label>
            <Label for="input" sm={6} style={valueStyle}>
              {row.configId}
            </Label>
          </FormGroup>
        </Col>
        <Col sm={6}>
          <FormGroup row>
            <Label for="input" sm={6} style={labelStyle}>
              {t('fields.bind_dn')}:
            </Label>
            <Label for="input" sm={6} style={valueStyle}>
              {row.bindDN}
            </Label>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <FormGroup row>
            <Label sm={6} style={labelStyle}>
              {t('fields.status')}:
            </Label>
            <Label sm={6} style={valueStyle}>
              <Badge style={badgeStyle}>
                {row.enabled ? t('options.enabled') : t('options.disable')}
              </Badge>
            </Label>
          </FormGroup>
        </Col>
        <Col sm={6}>
          <FormGroup row>
            <Label sm={6} style={labelStyle}>
              {t('fields.servers')}:
            </Label>
            <Label sm={6} style={valueStyle}>
              {row.servers &&
                row.servers.map((server, index) => (
                  <Badge key={index} style={badgeStyle}>
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
            <Label sm={6} style={labelStyle}>
              {t('fields.max_connections')}:
            </Label>
            <Label sm={6} style={valueStyle}>
              {row.maxConnections}
            </Label>
          </FormGroup>
        </Col>
        <Col sm={4}>
          <FormGroup row>
            <Label sm={6} style={labelStyle}>
              {t('fields.use_ssl')}:
            </Label>
            <Label sm={6} style={valueStyle}>
              <Badge style={badgeStyle}>
                {row.useSSL ? t('options.true') : t('options.false')}
              </Badge>
            </Label>
          </FormGroup>
        </Col>
        <Col sm={4}>
          <FormGroup row>
            <Label sm={6} style={labelStyle}>
              {t('fields.base_dns')}:
            </Label>
            <Label sm={6} style={valueStyle}>
              {row.baseDNs &&
                row.baseDNs.map((baseDN) => (
                  <Badge key={baseDN} style={badgeStyle}>
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
            <Label sm={6} style={labelStyle}>
              {t('fields.primary_key')}:
            </Label>
            <Label sm={6} style={valueStyle}>
              {row.primaryKey}
            </Label>
          </FormGroup>
        </Col>
        <Col sm={4}>
          <FormGroup row>
            <Label sm={6} style={labelStyle}>
              {t('fields.local_primary_key')}:
            </Label>
            <Label sm={6} style={valueStyle}>
              {row.localPrimaryKey}
            </Label>
          </FormGroup>
        </Col>
        <Col sm={4}>
          <FormGroup row>
            <Label sm={6} style={labelStyle}>
              {t('fields.use_anonymous_bind')}:
            </Label>
            <Label sm={6} style={valueStyle}>
              <Badge style={badgeStyle}>
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
            style={{
              backgroundColor: themeColors.background,
              color: themeColors.fontColor,
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
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
