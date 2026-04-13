import * as Yup from 'yup'
import { REGEX_NO_WHITESPACE } from '@/utils/regex'
import type { TFunction } from 'i18next'
import { T_KEYS } from '../../components/Assets/constants'

export const getAssetValidationSchema = (t: TFunction, isEdit = false) =>
  Yup.object().shape({
    fileName: Yup.string()
      .nullable()
      .required(t(T_KEYS.MSG_DISPLAY_NAME_ERROR))
      .matches(REGEX_NO_WHITESPACE, `${t(T_KEYS.FIELD_ASSET_NAME)} ${t(T_KEYS.MSG_NO_SPACES)}`),
    service: Yup.array()
      .nullable()
      .of(Yup.string().required(t(T_KEYS.MSG_SERVICE_REQUIRED)))
      .min(1, t(T_KEYS.MSG_SERVICE_REQUIRED)),
    document: Yup.mixed()
      .nullable()
      .required(t(T_KEYS.MSG_ASSET_DOCUMENT_ERROR))
      .test('is-file', t(T_KEYS.MSG_ASSET_DOCUMENT_ERROR), (value) =>
        isEdit ? true : value instanceof File,
      ),
  })
