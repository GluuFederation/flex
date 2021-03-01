import React from 'react'
import { Link } from 'react-router-dom'

import { EmptyLayout } from './../../../components'

import { HeaderAuth } from '../../components/Pages/HeaderAuth'
import { FooterAuth } from '../../components/Pages/FooterAuth'

function Gluu404Error() {
  return (
    <EmptyLayout>
      <EmptyLayout.Section center>
        <HeaderAuth
          title="Error 404"
          text="The requested resource doesn't exist on this server. Please contact the site administrator or the support team."
        />

        <div className="d-flex mb-5">
          <Link to="/">Back to Home</Link>
          <Link to="/" className="ml-auto text-decoration-none">
            Support
          </Link>
        </div>
        <FooterAuth />
      </EmptyLayout.Section>
    </EmptyLayout>
  )
}

export default Gluu404Error
