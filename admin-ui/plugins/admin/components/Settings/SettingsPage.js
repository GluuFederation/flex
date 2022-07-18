import React, { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import { SETTINGS } from 'Utils/ApiResources'
import {
  Card,
  CardBody,
  FormGroup,
  Col,
  Label,
  Badge,
  InputGroup,
  CustomInput,
} from 'Components'
import GluuDarkModeToggle from 'Routes/Apps/Gluu/GluuDarkModeToggle'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'

function SettingsPage() {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const [paggingSize, setPaggingSize] = useState(
    localStorage.getItem('paggingSize') || 10,
  )
  const levels = [1, 5, 10, 20]
  SetTitle(t('titles.application_settings'))

  return (
    <React.Fragment>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuTooltip doc_category={SETTINGS} doc_entry="pageSize">
            <FormGroup row>
              <GluuLabel label="List paging size" size={4} />
              <Col sm={8}>
                <InputGroup>
                  <CustomInput
                    type="select"
                    id="pagingSize"
                    name="pagingSize"
                    defaultValue={
                      levels[
                        levels.findIndex((element) => {
                          return element == paggingSize
                        })
                      ]
                    }
                    onChange={(value) => {
                      const size = levels[value.target.options.selectedIndex]
                      setPaggingSize(size)
                      localStorage.setItem('paggingSize', size)
                    }}
                  >
                    {levels.map((item, key) => (
                      <option value={item} key={key}>
                        {item}
                      </option>
                    ))}
                  </CustomInput>
                </InputGroup>
              </Col>
            </FormGroup>
          </GluuTooltip>
          <GluuTooltip doc_category={SETTINGS} doc_entry="darkMode">
            <FormGroup row style={{ justifyContent: 'space-between' }}>
              <GluuLabel label="Dark Mode" />
              <div
                className="toggle-container"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '0px 15px 0px 15px',
                }}
              >
                <GluuDarkModeToggle />
              </div>
            </FormGroup>
          </GluuTooltip>
          <GluuTooltip doc_category={SETTINGS} doc_entry="configApiUrl">
            <FormGroup row style={{ justifyContent: 'space-between' }}>
              <GluuLabel label="Config API URL" />
              <Label
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  paddingLeft: '15px',
                  paddingRight: '15px',
                }}
              >
                <h3>
                  <Badge color={`primary-${selectedTheme}`}>
                    {process.env.CONFIG_API_BASE_URL}
                  </Badge>
                </h3>
              </Label>
            </FormGroup>
          </GluuTooltip>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

export default SettingsPage
