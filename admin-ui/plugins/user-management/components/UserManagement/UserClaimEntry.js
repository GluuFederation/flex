import React from 'react'
import GluuRemovableInputRow from 'Routes/Apps/Gluu/GluuRemovableInputRow'
import GluuRemovableSelectRow from 'Routes/Apps/Gluu/GluuRemovableSelectRow'
import GluuRemovableTypeAhead from 'Routes/Apps/Gluu/GluuRemovableTypeAhead'
import { countries } from 'Plugins/user-management/common/countries'
import { useSelector } from 'react-redux'

function UserClaimEntry({ data, type, entry, formik, handler }) {
  const doHandle = () => {
    handler(data.name)
  }
  const roles = useSelector((state) => state.apiRoleReducer.items)
  const rolesToBeShown = roles.map((data) => data.role)

  return (
    <div key={entry}>
      {data.oxMultiValuedAttribute && (
        <GluuRemovableTypeAhead
          label={data.displayName}
          name={data.name}
          allowNew={data.name != 'jansAdminUIRole'}
          value={formik.values[data.name] || []}
          formik={formik}
          isDirect={true}
          options={
            data.name == 'jansAdminUIRole'
              ? rolesToBeShown
              : formik.values[data.name] || []
          }
          handler={doHandle}
          doc_category={data.description}
          lsize={3}
          rsize={9}
        />
      )}
      {data.name != 'c' && !data.oxMultiValuedAttribute && (
        <GluuRemovableInputRow
          label={data.displayName}
          name={data.name}
          isDirect={true}
          value={formik.values[data.name] || ''}
          formik={formik}
          handler={doHandle}
          doc_category={data.description}
          lsize={3}
          rsize={9}
          isBoolean={data?.dataType?.toLowerCase() === 'boolean'}
        />
      )}
      {data.name == 'c' && !data.oxMultiValuedAttribute && (
        <GluuRemovableSelectRow
          label={data.displayName}
          name={data.name}
          doc_category={data.description}
          isDirect={true}
          value={formik.values[data.name] || ''}
          values={countries}
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
