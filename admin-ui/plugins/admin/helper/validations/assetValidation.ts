import * as Yup from 'yup'
import type { TFunction } from 'i18next'

export const getAssetValidationSchema = (t: TFunction) =>
  Yup.object().shape({
    fileName: Yup.string()
      .required(t('messages.display_name_error'))
      .matches(/^\S*$/, `${t('fields.asset_name')} ${t('messages.no_spaces')}`),
    service: Yup.array()
      .of(Yup.string().required(t('messages.service_required')))
      .min(1, t('messages.service_required')),
  })
