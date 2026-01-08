import { atom } from 'jotai'
import type { GluuLdapConfiguration, SqlConfiguration } from 'JansConfigApi'

export const currentLdapItemAtom = atom<GluuLdapConfiguration | null>(null)

export const currentSqlItemAtom = atom<SqlConfiguration | null>(null)
