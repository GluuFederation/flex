---
tags:
  - solo
  - Gluu
  - Subscription
---


# Gluu Solo Subscription Plans

## Overview

Gluu Solo offers flexible subscription plans designed to cater to a variety of business needs. These plans are hosted on Google's cloud, providing scalability, reliability, and cost-effective identity management solutions. Each plan allows you to manage requests efficiently while benefiting from dedicated resources in a closed namespace exclusively owned by your organization.

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

