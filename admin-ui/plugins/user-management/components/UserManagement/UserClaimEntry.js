import React from 'react'
import GluuRemovableInputRow from '../../../../app/routes/Apps/Gluu/GluuRemovableInputRow'
import GluuRemovableSelectRow from '../../../../app/routes/Apps/Gluu/GluuRemovableSelectRow'
function UserClaimEntry({ data, type, entry, formik, handler }) {
  const doHandle = () => {
    handler(data.name)
  }
  return (
    <div key={entry}>
      {type === 'input' && (
        <GluuRemovableInputRow
          label={data.displayName}
          name={data.name}
          value={formik.values[data.name] || ''}
          formik={formik}
          handler={doHandle}
          doc_category={data.description}
          lsize={3}
          rsize={9}
        />
      )}
      {type === 'select' && (
        <GluuRemovableSelectRow
          label={data.displayName}
          name={data.name}
          value={formik.values[data.name] || ''}
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
