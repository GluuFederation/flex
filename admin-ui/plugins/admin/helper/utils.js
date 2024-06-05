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
    url.match(/\{([^{}]+?)\}/g)?.forEach((placeholder) => {
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
          templateValue.match(/\{([^{}]+?)\}/g)?.forEach((placeholder) => {
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
      webhookId: webhook.inum,
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

export const adminUiFeatures = {
  custom_script_write: 'custom_script_write',
  custom_script_delete: 'custom_script_delete',
  oidc_clients_delete: 'oidc_clients_delete',
  oidc_clients_write: 'oidc_clients_write',
  scopes_write: 'scopes_write',
  scopes_delete: 'scopes_delete',
  fido_configuration_write: 'fido_configuration_write',
  jans_keycloak_link_write: 'jans_keycloak_link_write',
  jans_link_write: 'jans_link_write',
  saml_configuration_write: 'saml_configuration_write',
  saml_idp_write: 'saml_idp_write',
  attributes_write: 'attributes_write',
  attributes_delete: 'attributes_delete',
  scim_configuration_edit: 'scim_configuration_edit',
  smtp_configuration_edit: 'smtp_configuration_edit',
  users_edit: 'users_edit',
  users_delete: 'users_delete',
}