export function handleResponse(error, reject, resolve, data) {
  if (error) {
    reject(error)
  } else {
    resolve(data)
  }
}
