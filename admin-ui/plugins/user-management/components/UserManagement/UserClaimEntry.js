import React from 'react'
import GluuRemovableInputRow from '../../../../app/routes/Apps/Gluu/GluuRemovableInputRow'
import GluuRemovableSelectRow from '../../../../app/routes/Apps/Gluu/GluuRemovableSelectRow'
import GluuRemovableTypeAhead from '../../../../app/routes/Apps/Gluu/GluuRemovableTypeAhead'
import { countries } from '../../common/countries'
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
