---
tags:
- administration
- admin-ui
- dashboard
---

# Dashboard

After successful authentication, the administrator is taken to the dashboard. The dashboard brings an organized presentation of crucial details at one place adding to the convenience of users in tracking and analysis of auth server and other details.

![image](../../assets/admin-ui/dashboard.png)

## Dashboard fields descriptions

- **OIDC Clients Count:** The count of OIDC clients created on auth server.
- **Active Users Count:** The count of `active` users on auth server.
- **Token Issued Count:** This figure is the sum of the access-tokens with grant-type `client credentials` and `authorization code` and id-token.
- **OAuth server status:** The health status of the auth server. For e.g. `Running` or `Down`.
- **Database status:** The health status of the persistence (e.g. PostgreSQL, MySQL, Google Spanner etc).

#### License Details

Admin UI uses [LicenseSpring](https://licensespring.com/) platform for customer license management.

- **Product Name:** The name of the product created on the LicenseSpring platform. The license issued for Admin UI activation is created under this product. Check LicenseSpring [docs](https://docs.licensespring.com/docs/getting-started#configureyourproductwithinthelicensespringplatform) for more details.
- **License Type:** The type of license issued. For e.g. Perpetual, Time Limited, Subscription and Consumption.
- **Customer Email:** To issue a license, we need to enter customer details like first name, last name, company, email and phone number in the LicenseSpring platform. This field displays the email of the customer of the license.
- **Company Name:** The company name of the registered product.
- **License Status:** The status of the license (e.g. active or inactive).

## Access Token Graph

The dashboard has a bar graph showing month-wise access-token with grant-type `client credentials`, `authorization code` and `id_token` generated from auth server.

![image](../../assets/admin-ui/access-token-graph.png)

## Localization and Theme selection

Admin UI supports localization. The default language is English. The other supported languages are French and Portuguese. A new preferred language can be selected from the top right corner of the dashboard which will convert the labels and tooltip to the selected language.

![image](../../assets/admin-ui/localization.png)

The administrator can also select from four website themes in Admin UI.

![image](../../assets/admin-ui/theme-selection.png)


