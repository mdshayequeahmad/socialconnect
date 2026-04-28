export async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    credentials: 'include',
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    console.error('API ERROR:', data) 
    throw new Error(data?.error || 'API error')
  }

  return data
}