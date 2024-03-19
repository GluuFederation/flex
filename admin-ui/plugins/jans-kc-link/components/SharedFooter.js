import React from 'react'
import { Row, Col } from 'Components'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import PropTypes from 'prop-types'

const SharedFooter = ({ disabled, toggle, modal, submitForm, formik, feature }) => {
  return (
    <>
      {!disabled && (
        <Row>
          <Col>
            <GluuCommitFooter
              hideButtons={{ save: true, back: false }}
              type='submit'
              saveHandler={toggle}
            />
          </Col>
        </Row>
      )}
      <GluuCommitDialog
        handler={toggle}
        modal={modal}
        onAccept={submitForm}
        formik={formik}
        feature={feature}
      />
    </>
  )
}

export default SharedFooter
SharedFooter.propTypes = {
  disabled: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  submitForm: PropTypes.func.isRequired,
  formik: PropTypes.object.isRequired,
  feature: PropTypes.string
}