import * as Yup from 'yup'
import { TCustomAttributes, TDefaultUserInputs } from 'Plugins/user-management/domain/entities/TUserInputs'
import moment from 'moment'

export const createCustomAttributes = (values: TDefaultUserInputs, personAttributes: any): Array<TCustomAttributes> => {
  let customAttributes = []
  if (values) {
    for (let key in values) {
      let customAttribute = personAttributes.filter((e) => e.name == key)
      if (personAttributes.some((e) => e.name == key)) {
        let obj = {}
        if (!customAttribute[0]?.oxMultiValuedAttribute) {
          let val = []
          let value = values[key]
          if (key != 'birthdate') {
            val.push(values[key])
          } else {
            val.push(moment(values[key], 'YYYY-MM-DD').format('YYYY-MM-DD'))
            value = moment(values[key], 'YYYY-MM-DD').format('YYYY-MM-DD')
          }
          obj = {
            name: key,
            multiValued: false,
            values: val,
          }
        } else {
          let valE = []
          if (values[key]) {
            for (let i in values[key]) {
              if (typeof values[key][i] == 'object') {
                valE.push(values[key][i][key])
              } else {
                valE.push(values[key][i])
              }
            }
          }
          obj = {
            name: key,
            multiValued: true,
            values: valE,
          }
        }
        customAttributes.push(obj)
      }
    }
    return customAttributes
  }
}

export const getCustomAttributeById = (id, personAttributes) => {
  let claimData = null
  for (let i in personAttributes) {
    if (personAttributes[i].name == id) {
      claimData = personAttributes[i]
    }
  }
  return claimData
}

export const validateInputs = Yup.object(
  {
    displayName: Yup.string().required('Display name is required.'),
    givenName: Yup.string().required('First name is required.'),
    sn: Yup.string().required('Last name is required.'),
    userId: Yup.string().required('User name is required.'),
    mail: Yup.string().required('Email is required.'),
  }
)
