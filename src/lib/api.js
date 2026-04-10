const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3001'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const payload = isJson ? await response.json() : null

  if (!response.ok) {
    const message = payload?.message ?? 'Request failed'
    throw new Error(message)
  }

  return payload
}

export function signUp(credentials) {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function signIn(credentials) {
  return request('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function getCurrentUser(token) {
  return request('/auth/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function getCharacters(token) {
  return request('/archipelago/characters', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function createCharacter(token, character) {
  return request('/archipelago/characters', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(character),
  })
}
