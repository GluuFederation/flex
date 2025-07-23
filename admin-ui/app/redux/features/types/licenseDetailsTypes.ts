export interface LicenseDetailsItem {
  companyName?: string
  customerEmail?: string
  customerFirstName?: string
  customerLastName?: string
  licenseActive?: boolean
  licenseEnable?: boolean
  licenseEnabled?: boolean
  licenseKey?: string
  licenseType?: string
  maxActivations?: number
  productCode?: string
  productName?: string
  validityPeriod?: string
  licenseExpired?: boolean
}

export interface LicenseDetailsState {
  item: LicenseDetailsItem
  loading: boolean
}
