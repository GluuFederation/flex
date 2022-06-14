import React from 'react'
import GluuRemovableInputRow from '../../../../app/routes/Apps/Gluu/GluuRemovableInputRow'
import GluuRemovableSelectRow from '../../../../app/routes/Apps/Gluu/GluuRemovableSelectRow'
import GluuRemovableTypeAhead from '../../../../app/routes/Apps/Gluu/GluuRemovableTypeAhead'
function UserClaimEntry({ data, type, entry, formik, handler }) {
  const doHandle = () => {
    handler(data.name)
  }
  console.log(data.name, formik.values[data.name])
  return (
    <div key={entry}>
      {data.oxMultiValuedAttribute && (
        <GluuRemovableTypeAhead
          label={data.displayName}
          name={data.name}
          value={[]}
          formik={formik}
          options={data.options || []}
          handler={doHandle}
          doc_category={data.description}
          lsize={3}
          rsize={9}
        />
      )}
      {type === 'input' && !data.oxMultiValuedAttribute && (
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
      {type === 'select' && !data.oxMultiValuedAttribute && (
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
