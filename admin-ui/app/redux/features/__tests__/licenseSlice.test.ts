import reducer, {
  checkLicensePresent,
  checkUserLicenseKeyResponse,
  checkLicensePresentResponse,
  checkLicenseConfigValidResponse,
  uploadNewSsaToken,
  uploadNewSsaTokenResponse,
  generateTrialLicense,
  generateTrialLicenseResponse,
  retrieveLicenseKeyResponse,
  checkThresholdLimit,
  setValidatingFlow,
  setLicenseError,
} from '../licenseSlice'

const getInitial = () => reducer(undefined, { type: '@@INIT' })

describe('licenseSlice', () => {
  it('returns the initial state', () => {
    const state = getInitial()
    expect(state.isLicenseValid).toBe(false)
    expect(state.isUnderThresholdLimit).toBe(true)
    expect(state.error).toBe('')
  })

  it('checkLicensePresent resets the loaded flag', () => {
    const state = reducer(
      { ...getInitial(), islicenseCheckResultLoaded: true },
      checkLicensePresent(undefined),
    )
    expect(state.islicenseCheckResultLoaded).toBe(false)
  })

  it('checkUserLicenseKeyResponse sets validity on success and clears error', () => {
    const state = reducer(getInitial(), checkUserLicenseKeyResponse({ success: true }))
    expect(state.isLicenseValid).toBe(true)
    expect(state.error).toBe('')
  })

  it('checkUserLicenseKeyResponse stores responseMessage on failure', () => {
    const state = reducer(
      getInitial(),
      checkUserLicenseKeyResponse({ success: false, responseMessage: 'bad key' }),
    )
    expect(state.error).toBe('bad key')
  })

  it('checkLicensePresentResponse marks loaded in both branches', () => {
    expect(
      reducer(getInitial(), checkLicensePresentResponse({ isLicenseValid: true })).isLicenseValid,
    ).toBe(true)
    expect(
      reducer(getInitial(), checkLicensePresentResponse({ isLicenseValid: false }))
        .islicenseCheckResultLoaded,
    ).toBe(true)
  })

  it('checkLicenseConfigValidResponse coerces falsy payload to false', () => {
    expect(reducer(getInitial(), checkLicenseConfigValidResponse(true)).isConfigValid).toBe(true)
    expect(reducer(getInitial(), checkLicenseConfigValidResponse(undefined)).isConfigValid).toBe(
      false,
    )
  })

  it('uploadNewSsaToken sets loading and clears SSA error', () => {
    const state = reducer({ ...getInitial(), errorSSA: 'old' }, uploadNewSsaToken({}))
    expect(state.isLoading).toBe(true)
    expect(state.errorSSA).toBe('')
  })

  it('uploadNewSsaTokenResponse clears loading and stores the message', () => {
    const state = reducer({ ...getInitial(), isLoading: true }, uploadNewSsaTokenResponse('err'))
    expect(state.isLoading).toBe(false)
    expect(state.errorSSA).toBe('err')
  })

  it('generateTrialLicense / response toggle generatingTrialKey', () => {
    const generating = reducer(getInitial(), generateTrialLicense())
    expect(generating.generatingTrialKey).toBe(true)
    expect(reducer(generating, generateTrialLicenseResponse(null)).generatingTrialKey).toBe(false)
  })

  it('retrieveLicenseKeyResponse sets the no-key flag and clears loading', () => {
    const state = reducer(
      { ...getInitial(), isLoading: true },
      retrieveLicenseKeyResponse({ isNoValidLicenseKeyFound: true }),
    )
    expect(state.isNoValidLicenseKeyFound).toBe(true)
    expect(state.isLoading).toBe(false)
  })

  it('checkThresholdLimit sets the limit flag and clears loading', () => {
    const state = reducer(
      { ...getInitial(), isLoading: true },
      checkThresholdLimit({ isUnderThresholdLimit: false }),
    )
    expect(state.isUnderThresholdLimit).toBe(false)
    expect(state.isLoading).toBe(false)
  })

  it('setValidatingFlow and setLicenseError update their fields', () => {
    expect(
      reducer(getInitial(), setValidatingFlow({ isValidatingFlow: true })).isValidatingFlow,
    ).toBe(true)
    expect(reducer(getInitial(), setLicenseError('boom')).error).toBe('boom')
  })
})
