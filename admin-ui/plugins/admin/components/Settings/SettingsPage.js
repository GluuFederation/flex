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
          
            <FormGroup row>
              <GluuLabel label={t('fields.list_paging_size')} size={4} doc_category={SETTINGS} doc_entry="pageSize"/>
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
            <FormGroup row style={{ justifyContent: 'space-between' }}>
              <GluuLabel label={t('fields.dark_mode')} doc_category={SETTINGS} doc_entry="darkMode"/>
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
          
            <FormGroup row style={{ justifyContent: 'space-between' }}>
              <GluuLabel label={t('fields.config_api_url')} doc_category={SETTINGS} doc_entry="configApiUrl" />
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
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

export default SettingsPage
