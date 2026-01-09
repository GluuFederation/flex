import { atom } from 'jotai'
import type { GluuLdapConfiguration } from 'JansConfigApi'
import type { SqlConfiguration } from '../sqlApiMocks'

export const currentLdapItemAtom = atom<GluuLdapConfiguration | null>(null)

export const currentSqlItemAtom = atom<SqlConfiguration | null>(null)
