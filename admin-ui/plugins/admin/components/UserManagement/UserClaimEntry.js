import React from 'react'
import GluuRemovableInputRow from '../../../../app/routes/Apps/Gluu/GluuRemovableInputRow'
import GluuRemovableSelectRow from '../../../../app/routes/Apps/Gluu/GluuRemovableSelectRow'
function UserClaimEntry({ data, type, entry, formik, handler }) {

  const doHandle = () => {
   handler(data.id)
  }
  return (
    <div key={entry}>
      {type === 'input' && (
        <GluuRemovableInputRow
          label={data.name}
          name={data.id}
          value={formik.values[data.id] || ''}
          formik={formik}
          handler={doHandle}
          lsize={3}
          rsize={9}
        />
      )}
      {type === 'select' && (
        <GluuRemovableSelectRow
          label={data.name}
          name={data.id}
          value={formik.values[data.id] || ''}
          values={data.attributes.values}
          formik={formik}
          required
          handler={doHandle}
          lsize={3}
          rsize={9}
        />
      )}
    </div>
  )
}

export default UserClaimEntry
