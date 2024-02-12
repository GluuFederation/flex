import cloneDeep from "lodash/cloneDeep";

export const webhookOutputObject = (enabledFeatureWebhooks, createdFeatureValue) => {
  return enabledFeatureWebhooks.map((originalWebhook) => {
    const webhook = cloneDeep(originalWebhook); // Create a deep copy of the webhook
    let url = webhook.url;
    const shortcodeValueMap = {};

    // Replace placeholders in the URL
    url.match(/\{([^}]+)\}/g)?.forEach((placeholder) => {
      const key = placeholder.slice(1, -1);
      let value = createdFeatureValue[key];

      if (value === undefined) {
        const moduleProperty = createdFeatureValue.moduleProperties.find(prop => prop.value1 === key);
        value = moduleProperty ? moduleProperty.value2 : undefined;
      }

      if (value !== undefined) {
        shortcodeValueMap[key] = value;
        webhook.url = webhook.url.replace(new RegExp(`\\{${key}\\}`, 'g'), value); // Modify the clone
      }
    });

    // Process httpRequestBody if it exists
    if (webhook.httpRequestBody) {
      Object.entries(webhook.httpRequestBody).forEach(([key, templateValue]) => {
        if (typeof templateValue === 'string' && templateValue.includes("{")) {
          templateValue.match(/\{([^}]+)\}/g)?.forEach((placeholder) => {
            const placeholderKey = placeholder.slice(1, -1);
            let value = createdFeatureValue[placeholderKey];

            if (value === undefined) {
              const moduleProperty = createdFeatureValue.moduleProperties.find(prop => prop.value1 === placeholderKey);
              value = moduleProperty ? moduleProperty.value2 : undefined;
            }

            if (value !== undefined) {
              webhook.httpRequestBody[key] = templateValue.replace(new RegExp(`\\{${placeholderKey}\\}`, 'g'), value);
              shortcodeValueMap[placeholderKey] = value;
            }
          });
        }
      });
    }

    return {
      webhookId: webhook.webhookId,
      shortcodeValueMap,
    };
  });
};