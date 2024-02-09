export const webhookOutputObject = (
  enabledFeatureWebhooks,
  createdFeatureValue
) => {
  const outputArray = enabledFeatureWebhooks?.map((webhook) => {
    const inputString = webhook.url

    // Create a regular expression to match shortcodes within curly braces
    const regex = /\{([^}]+)\}/g

    // Find matches in the input string
    const matches = []
    let match
    while ((match = regex.exec(inputString)) !== null) {
      matches.push(match[1]) // Extract the content inside curly braces
    }

    // Create the shortcodeValueMap for the current webhook
    const shortcodeValueMap = {}
    for (const shortcode of matches) {
      shortcodeValueMap[shortcode] = createdFeatureValue[shortcode]
    }

    // Create the output object for the current webhook
    const outputObject = {
      webhookId: webhook.webhookId,
      shortcodeValueMap: shortcodeValueMap,
    }

    return outputObject
  })

  return outputArray
}
