// src/lib/api.js — drop-in API client for BizGenie frontend
// Replace the localStorage leaderboard calls in useGameStore.js with these

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

let accessToken = null

// ── Token management ──────────────────────────────────────────────────────────
export function setToken(t) { accessToken = t }
export function getToken()  { return accessToken }

async function refreshAccessToken() {
  const res = await fetch(`${BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',  // sends httpOnly refreshToken cookie
  })
  if (!res.ok) { accessToken = null; throw new Error('Session expired') }
  const { accessToken: newToken } = await res.json()
  accessToken = newToken
  return newToken
}

// ── Core fetch wrapper with auto-refresh ──────────────────────────────────────
async function apiFetch(path, options = {}, retry = true) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 401 && retry) {
    const data = await res.json().catch(() => ({}))
    if (data.code === 'TOKEN_EXPIRED') {
      await refreshAccessToken()
      return apiFetch(path, options, false)
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw Object.assign(new Error(err.error || 'API error'), { status: res.status })
  }

  return res.json()
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function register(name, email, password) {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
  setToken(data.accessToken)
  return data
}

export async function login(email, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setToken(data.accessToken)
  return data
}

export async function logout() {
  await apiFetch('/auth/logout', { method: 'POST' }).catch(() => {})
  setToken(null)
}

// ── Game ──────────────────────────────────────────────────────────────────────
export async function saveGameSession(sessionData) {
  return apiFetch('/game/sessions', {
    method: 'POST',
    body: JSON.stringify(sessionData),
  })
}

export async function getMyHistory() {
  return apiFetch('/game/sessions')
}

// ── Leaderboard ───────────────────────────────────────────────────────────────
export async function fetchLeaderboard() {
  return apiFetch('/leaderboard')
}

// ── WebSocket for live leaderboard updates ────────────────────────────────────
export function subscribeLeaderboard(onUpdate) {
  const WS_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000')
    .replace(/^http/, 'ws') + '/ws'

  const ws = new WebSocket(WS_URL)

  ws.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data)
      if (msg.type === 'leaderboard:refresh') onUpdate(msg.data)
    } catch {}
  }

  ws.onerror = () => {}

  return () => ws.close()  // call returned fn to unsubscribe
}
