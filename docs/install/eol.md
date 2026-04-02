---
tags:
  - EOL
  - Supported versions
  - Version lifecycle
---

# Version EOL Policy

## 1. Lifecycle Overview

Our End of Life (EOL) policy is designed to provide a predictable schedule for support and upgrades. The lifecycle of any major version is calculated based on its original **General Availability (GA)** date.

### Key Milestones

The table below shows general cadense of the key release milestones. Applicable from version `6.0.0` onwards.

| Milestone                     | Calculation       | Description                                                         |
|-------------------------------|-------------------|---------------------------------------------------------------------|
| **General Availability (GA)** | $T_0$             | The date the version was publicly released.                         |
| **End of Maintenance (EOM)**  | $T_0 + 12$ Months | Final date for bug fixes and security patches.                      |
| **End of Life (EOL)**         | $T_0 + 24$ Months | Support is no longer provided; documentation moved to archives.     |

---

## 2. Version Status

Use the table below to determine the current status of your installed version.

| Version    | Release Date (GA) | End of Maintenance | End of Life (Support) | Status                |
|------------|-------------------|--------------------|-----------------------|-----------------------|
| **v5.x.x** | 2024-03-15        | 2025-03-15         | 2026-11-01(Projected)            | **Active**            |
| **v5.0.x** | 2022-03-15        | 2023-03-15         | 2024-09-15            | **EOL**               |

---

## 3. Support Scope During Transition

As a version approaches its EOL date, the level of support shifts:

* **Full Support:** Covers "How-to" questions, bug fixes, and security vulnerabilities.
* **Maintenance Support:** No new features. Only critical security patches and high-severity bug fixes are provided.

---

## 4. Upgrade & Migration Guidance

To maintain system integrity and security, we recommend upgrading to the latest Stable Release at least **six months prior** to your current version's EOL date.

### Migration Resources:

* **Breaking Changes Log:** Review our [Changelog](https://github.com/GluuFederation/flex/releases) for API or configuration changes.
* **Compatibility Matrix:** Ensure your OS and hardware meet the system requirements for your deployment platform for the new version. Refer to the [installation](./README.md) section for more details.
* **Automated Upgrade Scripts:** Available for the last three releases to simplify upgrades.
  For example, upgrading from 5.14.0 to 6.0.0 should follow: 5.14.0 → 5.15.0 → 5.16.0 → 6.0.0.

> **Warning:** Running software past its EOL date may result in compatibility issues with newer OS updates and increased exposure to security threats.

---

## 5. Documentation Archiving

Once a version reaches its EOL date:

1. Online documentation will be moved to the **Legacy Archive**.
2. Knowledge Base articles will remain searchable but will no longer be updated.
3. Community forums for that version will be set to **Read-Only**.

---
