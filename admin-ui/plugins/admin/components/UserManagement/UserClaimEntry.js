import React from 'react'
import { Col, FormGroup } from '../../../../app/components'
import GluuInputRow from '../../../../app/routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from '../../../../app/routes/Apps/Gluu/GluuSelectRow'
function UserClaimEntry({ data, isInput, key, formik }) {
  return (
    <div key={key}>
      {isInput && (
        <Col sm={10}>
          <GluuInputRow
            label={data.name}
            name={data.id}
            value={formik.values[data.id] || ''}
            formik={formik}
            lsize={4}
            rsize={8}
          />
        </Col>
      )}
      {!isInput && (
        <Col sm={10}>
          <GluuSelectRow
            label={data.name}
            name={data.id}
            value={formik.values[data.id] || ''}
            values={data.attributes.values}
            formik={formik}
            required
            lsize={3}
            rsize={9}
          />
        </Col>
      )}

      <Col
        sm={1}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => removeSelectedClaimsFromState(key)}
      >
        <i className={'fa fa-fw fa-close'}></i>
      </Col>
    </div>
  )
}

export default UserClaimEntry
