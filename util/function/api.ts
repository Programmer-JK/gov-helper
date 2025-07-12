export const apiFetch = async (url:string, options:any = {}, token?:string | null) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.errorCode || `HTTP error! status: ${response.status}`)
  }

  return data
}
