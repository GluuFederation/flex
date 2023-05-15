---
tags:
- administration
- installation
---

# Software Statement Assertions

In order to install Flex, you will need a Software Statement Assertion (SSA). An SSA is a signed JSON Web Token (JWT) that is required by the Flex install script to validate your license.

## Obtaining an SSA

Gluu issues SSAs through the Agama Lab web interface. You can obtain an SSA for use with Flex by following these steps:

- Visit [Agama Lab](https://cloud.gluu.org/agama-lab)
- Click on `Login with GitHub` and authorize Agama Lab to access your GitHub profile.
- Select a repository for use with Agama Lab. The repository must have at least 1 commit on the main branch. We recommend creating a fresh repository and pushing a commit for use with Agama Lab.
![agama-home](../../assets/agama-lab/agama-home.png)
- On the left navigation bar, select `SCAN`
- Sign up for a free SCAN subscription, which will give you 500 SCAN credits. Flex does not cost any SCAN credits, so you will not be charged for SCAN.
- Navigate to the tab named `SSA`.
![ssa-management](../../assets/agama-lab/ssa-management.png)
- Click on `Create New SSA`
    - On `Software Name`, fill in a unique identifier for this SSA
    - `Description` is optional
    - Under `Software Roles`, tick `license`
    - Under `Expiration Date`, select an appropriate date. Your SSA will not be useable after that date.
    - Deselect `One time use` and `Rotate SSA`
    - Click `Create`

    ![ssa-creation](../../assets/agama-lab/ssa-creation.png)
- Click on `Detail` of the newly issued SSA, then click on `Show Base64 token`
![ssa-details](../../assets/agama-lab/ssa-details.png)
- You will be shown a long string of characters. Copy this and save it to a file.
- You may now use this file during Flex installation.