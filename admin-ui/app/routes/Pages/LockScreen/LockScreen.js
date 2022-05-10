import React from 'react'
import { Link } from 'react-router-dom'

import {
  Form,
  FormGroup,
  Input,
  Button,
  Label,
  EmptyLayout,
  ThemeConsumer
} from 'Components'

import { HeaderAuth } from "Routes/components/Pages/HeaderAuth"
import { FooterAuth } from "Routes/components/Pages/FooterAuth"
import { useTranslation } from 'react-i18next'

const LockScreen = () => {
  const { t } = useTranslation()
  return (
    <EmptyLayout>
      <EmptyLayout.Section center>
        { /* START Header */}
        <HeaderAuth 
          title={t("Your Session is Blocked")}
        />
        { /* END Header */}
        { /* START Form */}
        <Form className="mb-3">
          <FormGroup>
            <Label for="password">
              {t("Password")}
            </Label>
            <Input type="password" name="password" id="password" placeholder={t("Enter the password to continue...")} className="bg-white" />
          </FormGroup>
          <ThemeConsumer>
            {
              ({ color }) => (
                <Button color={ color } block tag={ Link } to="/">
                  {t("Unlock")}
                </Button>
              )
            }
          </ThemeConsumer>
        </Form>
        { /* END Form */}
        { /* START Bottom Links */}
        <div className="d-flex mb-5">
          <Link to="/pages/login" className="text-decoration-none">
            {t("Sign as Diffrent User")}
          </Link>
          <Link to="/" className="ml-auto text-decoration-none">
            <i className="fa fa-angle-left mr-2"></i> {t("Back to Home")}
          </Link>
        </div>
        { /* END Bottom Links */}
        { /* START Footer */}
        <FooterAuth />
        { /* END Footer */}
      </EmptyLayout.Section>
    </EmptyLayout>
  )
}

export default LockScreen
