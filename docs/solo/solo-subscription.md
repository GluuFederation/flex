---
tags:
  - solo
  - Gluu
  - Subscription
---


# Gluu Solo Subscription

Customers require active Gluu Solo subscription in order to avail Gluu Solo 
services. Customers can opt one of the Gluu Solo subscription plans according
to the business need. 

New customers can subscribe to Gluu Solo using the 
[Agama Lab](https://gluu.org/agama-lab/).

## Subscription process

1. Sign-in to the [Agama Lab](https://gluu.org/agama-lab/). Navigate to `Solo`.
2. On the Solo page, read the description provided about the Solo.
   To begin the subscription process, click the 'Subscription' button.
![](../assets/agama-lab/solo-agama-lab-main-page.png)

3. Choose a Subscription Plan:
     * After clicking the `Subscription` button, you will see a list of available plans. 
     * Select the plan that best suits your business needs and click `Continue`.
     ![](../assets/agama-lab/solo-subscription-plans.png)
4. Review Cost:
     * After clicking 'Continue', a pop-up will appear showing the `cost per request per locations` of the selected plan.
     * Proceed with the next steps to confirm your subscription.
     ![](../assets/agama-lab/solo-price-confirmation.png)

5. Add Required Information:
     * You will be prompted to add the necessary details, as shown in the image below.
     * You will have two options for selecting the type of domain: `Gluu.org Domain` and `Custom Domain`.
     ![](../assets/agama-lab/solo-subscription-form-default-domain.png)
     If you choose a Custom Domain, a note related to custom domains will appear (as shown in the image below).
     ![](../assets/agama-lab/solo-custom-domain.png)

6. Checkout Page:

     * After entering the required information, you will be directed to the checkout page.
     * This page will display details about the selected plan, Gluu components, and an instant preview.
     * You will also need to choose your billing plan: `Per Month` or `Per Year`.
     ![](../assets/agama-lab/solo-checkout-bill-plan.png)
     ![](../assets/agama-lab/solo-instance-preview.png)

7. Payment Process:
    * Once you proceed to payment, a pop-up will display the total amount of your order.
    * Click `Proceed to Checkout` to continue.
    ![](../assets/agama-lab/solo-checkout-confirmation.png)

8. Add Account Details:
    * You will be prompted to enter your account details.
    * After entering your details, click `Next` to continue.
    ![](../assets/agama-lab/solo-account-details.png)

9. Add Billing Address:
    * You will then need to add your billing address.
    * After filling in your address, click `Next` to continue.
    ![](../assets/agama-lab/solo-billing-details.png)

10. Add Payment Details:
    * Next, you will need to add your payment details.
    * Once the details are entered, click `Next` to proceed.
    ![](../assets/agama-lab/solo-payment-details.png)

11. Verify and Confirm Payment:
    * A pop-up will appear showing all the details you've entered.
    * Verify the information and, if everything is correct, proceed to Pay to subscribe to the plan.
  
     ![](../assets/agama-lab/solo-order-completion.png)

12. Subscription Confirmation:
    * After successfully subscribing to the plan, you will be directed to a Thank You page.
    ![](../assets/agama-lab/solo-payment-success-confirmation.png)
13. Access Your Domain:
    * After subscribing, you will be able to see the domain in your Solo space
    ![](../assets/agama-lab/solo-creating-new-instance.png)



Gluu Solo offers flexible subscription plans designed to cater to a variety of 
business needs. 

## Available Subscription Plans

Gluu Solo provides four subscription tiers to accommodate varying scales of identity management requirements:
### Comet Plan 
 
This plan have maximum 1 locations.

The Comet Plan is best suited for small businesses, startups, or organizations that are in the initial stages of adopting identity management solutions.


### Planet Plan
This plan have maximum 3 locations.

The Planet Plan is a robust choice for mid-sized businesses or organizations looking for improved performance and reliability. Key benefits include:

**Increased Capacity:** With support for up to 25K requests per month and up to three locations, this plan accommodates growing identity management needs.

**Enhanced Reliability:** The 99.9% SLA guarantees minimal downtime, ensuring uninterrupted access to your identity management system.

**Flexible Deployment:** Ideal for businesses operating in multiple locations or with a distributed workforce that requires secure, scalable access.




### Star Plan
 This plan have maximum 10 locations

The Star Plan is ideal for businesses with large-scale operations or those operating across multiple regions. It provides the capacity and flexibility to handle extensive identity management needs with reliability and efficiency.

#### Advantage

**High Capacity:** Supports up to 250K requests monthly, making it perfect for businesses with high transaction volumes.

**Multi-Location Support:** Up to 10 locations ensure smooth identity management for distributed teams or customer bases.

**Enhanced Performance:** The 99.9% SLA guarantees minimal downtime and consistent performance.


### Galaxy Plan
 This plan have maximum 15 locations.

 The Galaxy Plan is specifically designed for enterprise-level operations and large-scale identity management needs. Its unparalleled capacity, extensive geographic coverage, and reliability make it a premium choice for businesses requiring top-tier solutions.

#### Advantage

**Massive Scale:** Accommodates up to 2.5M requests per month, catering to enterprises with heavy transaction volumes and complex workflows.

**Broad Geographic Coverage:** Supports up to 15 locations, ideal for global operations or multinational businesses.

**Enterprise-Grade Reliability:** The 99.9% SLA ensures optimal uptime and seamless performance across all regions.

**Future-Ready Infrastructure:** Offers the flexibility to handle increasing demands and evolving business needs.

**todo** 
**image**


## Enroll in a Subscription Plan

1. Select a Plan:

 * Navigate to the Solo section within the Agama Lab platform.
 * Review the details of each subscription plan and select the one that best fits your needs.

2. Confirm Selection:

 * A dialog box will confirm your selected plan and the associated cost per request.
 * Example: Comet Plan costs $0.002 per request per location.


3. Activate

 * Click "Continue" to proceed with the subscription.


**TODO**
** IMAGE **

## Setting Up Environment

Once you have subscribed to a plan, follow these steps to configure your environment:

1. Enter Organization Details

 * Provide your organization name and support email.
 * Specify the environment type (e.g., Production).

2. Choose Your Domain

 * Option 1: Use the predefined gluu.org domain.
 * Option 2: Configure a custom domain (requires manual DNS setup).

3. Select Cloud Regions

Choose the primary region and service locations for your resources (e.g., us-central1).

4. Define CIDR Range

Specify allowed IP addresses or CIDR ranges to secure your endpoints.

5. Provide Address Details

Enter the country, state, and city for your setup.

6. Submit Configuration:

Click "Submit" to finalize the environment setup.

**Note:** Environment provisioning takes approximately 20-30 minutes.


## Monitoring and Scaling

Enhance your subscription with optional monitoring tools:
 * Free Options: Google Cloud monitoring.
 * Paid Tools: Datadog or Splunk for advanced insights (additional costs apply).

Automatic scaling ensures that your resources adjust dynamically based on demand, providing seamless performance regardless of traffic fluctuations.

