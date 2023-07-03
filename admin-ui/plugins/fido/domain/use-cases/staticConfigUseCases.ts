import * as Yup from 'yup'

export const staticConfigInitValues = (staticConfiguration) => {
  return {
    authenticatorCertsFolder:
      staticConfiguration?.authenticatorCertsFolder || '',
    mdsAccessToken: staticConfiguration?.mdsAccessToken || '',
    mdsCertsFolder: staticConfiguration?.mdsCertsFolder || '',
    mdsTocsFolder: staticConfiguration?.mdsTocsFolder || '',
    checkU2fAttestations: staticConfiguration?.checkU2fAttestations || false,
    unfinishedRequestExpiration:
      staticConfiguration?.unfinishedRequestExpiration || '',
    authenticationHistoryExpiration:
      staticConfiguration?.authenticationHistoryExpiration || '',
    serverMetadataFolder: staticConfiguration?.serverMetadataFolder || '',
    userAutoEnrollment: staticConfiguration?.userAutoEnrollment,
    requestedCredentialTypes:
      staticConfiguration?.requestedCredentialTypes || [],
    requestedParties: staticConfiguration?.requestedParties || [],
  }
}

export const staticConfigValidationSchema = Yup.object({
  authenticatorCertsFolder: Yup.string().required(
    'Authenicator Certificates Folder is required.'
  ),
  mdsCertsFolder: Yup.string().required(
    'MDS TOC Certificates Folder is required.'
  ),
  mdsTocsFolder: Yup.string().required('MDS TOC Files Folder is required.'),
  checkU2fAttestations: Yup.boolean().required(
    'Check U2F Attestations is required.'
  ),
  unfinishedRequestExpiration: Yup.string().required(
    'Unfinished Request Expiration is required.'
  ),
  authenticationHistoryExpiration: Yup.string().required(
    'Authenication History Expiration  is required.'
  ),
  serverMetadataFolder: Yup.string().required('Server Metadata is required.'),
  userAutoEnrollment: Yup.boolean().required(
    'User Auto Enrollment is required.'
  ),
})
