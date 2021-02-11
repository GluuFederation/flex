function err(msg) {
	alert("error: " + msg)
}

function attachHeaders(xhr, headers) {

	for (var i = 0; i < headers.length; i++) {
		xhr.setRequestHeader(headers[i].name, headers[i].value)
	}

}

function attachEvents(xhr, res, rej) {

	xhr.onload = () => {
		if (xhr.status < 300) {
			return res(xhr.responseText)
		} else {
			return rej(xhr.responseText)
		}
	}
    xhr.onerror = () => rej(xhr.statusText)

}

function genericGET(url, headers) {

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", url)
	if (headers) {
		attachHeaders(xhr, headers)
	}
    attachEvents(xhr, resolve, reject)
    xhr.send()
  })

}

function genericPOST(url, payload, headers) {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest()
		xhr.open("POST", url)
		if (headers) {
			attachHeaders(xhr, headers)
		}
		attachEvents(xhr, resolve, reject)
		xhr.send(payload)
	})
}

function getTokenUrl(openidUrl) {
	return genericGET(openidUrl)
				.then(result => JSON.parse(result).token_endpoint)
}

function getToken(url, clientId, clientSecret) {

	if (token) {
		return new Promise((resolve, reject) => { resolve(token) })
	}
	var auth = "Basic " + window.btoa(clientId + ":" + clientSecret)
	var headers = [
			{name : "Authorization", value : auth},
			{name : "Content-Type", value : "application/x-www-form-urlencoded"}
	]
	var payload = "grant_type=client_credentials"
	payload += "&scope=casa.enroll%20casa.2fa"
	return genericPOST(url, payload, headers)
				.then(result => JSON.parse(result).access_token)

}
