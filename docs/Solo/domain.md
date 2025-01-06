---
tags:
  - solo
  - gluu
  - domain
---

User have two type of domain option for the gluu-solo  

1. gluu.org Domain
2. Custom domain

# Gluu.org Domain

This option involves using a predefined domain provided by the Gluu platform. 
This is often the quickest and simplest option, particularly for users who want 
a functional domain without going through additional configuration steps.

## Advantages of Using Gluu.org Domain

1. Quick Setup:

    * Minimal configuration is required since the domain is preconfigured by the Gluu platform.
    * Ideal for users who want to get started immediately without diving into DNS management.

2. Managed by Gluu:

    * The platform takes care of the domain's DNS management and SSL/TLS certificate provisioning.
    * Automatic updates for security and compatibility.

3. No Additional Costs:

    * Users avoid expenses associated with purchasing or renewing custom domain names.


4. Standardized Format:

    * Ensures a consistent domain structure, such as yourname.gluu.org.
    * Useful in environments where uniformity in domain names is desirable.


## Configuration Steps for Gluu.org Domain

1. Select the Option:

    * Navigate to the domain configuration section in your Gluu platform dashboard.
    * Choose "Gluu.org Domain.

2. Input Subdomain Name:

    * Enter a desired subdomain (e.g., myapp.gluu.org).
    * Ensure the subdomain is unique and available.

3. Verify & Save:

    * Review the subdomain configuration and save changes.
    * Once saved, the domain is immediately operational with no additional setup.


# Custom Domain

This option allows users to use their own domain (e.g., mycustomdomain.com). It offers more flexibility 
and branding opportunities but requires additional configuration steps.

## Advantages of Using a Custom Domain

1. Branding
    * A custom domain reflects your brand identity, making your application or service appear more professional and credible.

2. Flexibility
    * Full control over DNS configurations, subdomains, and redirections.

3. Integration
    * Easier to integrate with existing systems or services already tied to your domain.

 
 ## Configuration Steps for Custom Domain

1. Obtain a Domain Name:
    * Purchase a domain name from a registrar like GoDaddy, Namecheap, or Google Domains.
2. Point DNS Records:
    * Access your domain's DNS management console.
    * Add the following DNS records based on the requirements:
    * A Record: Points the domain to the server's IP address.
    * CNAME Record: Used for subdomains to alias the main domain.
    * TXT Record: For domain verification or custom purposes like SPF, DKIM, or DMARC.

3. SSL/TLS Certificate:

    * Configure an SSL/TLS certificate for secure HTTPS access.
    * Options include:
    * Free certificates (e.g., Let's Encrypt).
    * Paid certificates for additional features and support.

4. Configure in the Platform:

    * Go to the Gluu platform's domain settings.
    * Choose "Custom Domain" and provide your domain name.
    * Verify ownership using methods like adding a specific DNS TXT record or uploading a verification file.

5. Test & Validate:

    * Confirm that your custom domain is properly set up by accessing it via a browser.
    * Ensure the domain resolves correctly and serves the application securely over HTTPS.

