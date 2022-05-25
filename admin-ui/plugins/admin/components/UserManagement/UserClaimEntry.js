import React from 'react'
import GluuInputRow from '../../../../app/routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from '../../../../app/routes/Apps/Gluu/GluuSelectRow'
function UserClaimEntry({ data, type, key, formik, handler }) {
  return (
    <div key={key}>
      {type === 'input' && (
        <GluuInputRow
          label={data.name}
          name={data.id}
          value={formik.values[data.id] || ''}
          formik={formik}
          lsize={3}
          rsize={9}
        />
      )}
      {type === 'select' && (
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
      )}

      <div
        style={{
          float: 'right',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: '5px',
          width: '25px',
          height: '25px',
          marginTop: '-60px',
          marginRight: '-25px',
        }}
        onClick={handler}
      >
        <i className={'fa fa-fw fa-close'}></i>
      </div>
    </div>
  )
}

export default UserClaimEntry
