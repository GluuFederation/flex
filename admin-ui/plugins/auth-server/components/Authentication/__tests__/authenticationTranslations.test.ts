import en from '@/locales/en/translation.json'
import es from '@/locales/es/translation.json'
import fr from '@/locales/fr/translation.json'
import pt from '@/locales/pt/translation.json'

const locales = { en, es, fr, pt }

describe.each(Object.entries(locales))('%s authentication labels', (_locale, translation) => {
  it('labels the Agama tab as projects, not flows', () => {
    expect(translation.menus.agama_projects).toEqual(expect.any(String))
    expect(translation.menus).not.toHaveProperty('agama_flows')
  })

  it('labels the Agama Project column of the ACRs table', () => {
    expect(translation.fields.agama_project).toEqual(expect.any(String))
  })
})
