import cloneDeep from "lodash/cloneDeep";

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const webhookOutputObject = (enabledFeatureWebhooks, createdFeatureValue) => {
  return enabledFeatureWebhooks.map((originalWebhook) => {
    const webhook = cloneDeep(originalWebhook); // Create a deep copy of the webhook
    let url = webhook.url;
    const shortcodeValueMap = {};

    // Replace placeholders in the URL
    url.match(/\{([^}]+)\}/g)?.forEach((placeholder) => {
      const key = placeholder.slice(1, -1);
      let value = key?.includes('.') ? getNestedProperty(createdFeatureValue, key) : createdFeatureValue[key];

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
            const value = placeholderKey.includes('.') ? getNestedValue(createdFeatureValue, placeholderKey) : createdFeatureValue[placeholderKey];
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
      url: webhook.url,
    };
  });
};

function getNestedProperty(obj, path) {
  const keys = path.split('.');
  let current = obj;

  for (let key of keys) {
      if (current[key] === undefined) {
          return undefined;
      }
      current = current[key];
  }

  return current;
}