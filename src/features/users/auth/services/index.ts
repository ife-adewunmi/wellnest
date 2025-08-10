// Important: do NOT re-export server-only modules (auth.service) here.
// This barrel is imported by client code (e.g., userStore), so it must remain client-safe.
export * from './auth-api'
export * from './session-api'
