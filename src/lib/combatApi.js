import { request } from './api'
export function combatRequest(token, suffix, command) {
  return request(`/archipelago/encounters${suffix}`, {
    method: command === undefined ? 'GET' : 'POST',
    headers: { Authorization: `Bearer ${token}` },
    ...(command === undefined ? {} : { body: JSON.stringify(command) }),
  })
}
