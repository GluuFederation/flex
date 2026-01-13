import { atom } from 'jotai'
import type { GluuLdapConfiguration } from 'JansConfigApi'

export const currentLdapItemAtom = atom<GluuLdapConfiguration | null>(null)
