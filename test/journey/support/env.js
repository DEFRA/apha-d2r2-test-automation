/**
 * The only place that reads configuration. Values are read lazily so that `bddgen`, lint and
 * codegen work without a full environment; a missing value fails when it is used, with a
 * message that says which variable to set.
 */

const read = (name, { fallback, required = true } = {}) => {
  const value = process.env[name] ?? fallback
  if (!value && required) {
    throw new Error(`Missing environment variable ${name}. Copy .env.example to .env and fill it in, or set it in the pipeline.`)
  }
  return value ?? ''
}

/** Application under test. Normalizes the configured page URL back to the app root so
 * navigation works even when the .env value points to a concrete page like
 * /SurveillanceProfiles/Home.aspx.
 * @returns {string} */
export const uiBaseUrl = () =>
  read('UI_BASE_URL')
    .replace(/\/$/, '')
    .replace(/\/(?:Home|Search)\.aspx$/, '')

/** REST API under test. Defaults to the UI origin plus /api. @returns {string} */
export const apiBaseUrl = () => read('API_BASE_URL', { fallback: `${uiBaseUrl()}/api` }).replace(/\/$/, '')

/** `legacy` or `gds`. Kept here so one place documents the profiles. @returns {'legacy'|'gds'} */
export const uiProfile = () => (process.env.UI_PROFILE ?? 'legacy').toLowerCase()

/**
 * Credentials for one role, from `.env` or secret pipeline variables.
 * Never log the return value.
 * @param {string} role
 * @returns {{ username: string, password: string }}
 */
export function credentials(role) {
  const key = role.toUpperCase().replace(/[^A-Z0-9]/g, '_')
  const username = read(`E2E_${key}_USER`, { required: false })
  const password = read(`E2E_${key}_PASSWORD`, { required: false })
  return {
    username: username ?? '',
    password: password ?? ''
  }
}

/** Roles that have credentials, for the auth setup. @returns {string[]} */
export const roles = () =>
  (process.env.E2E_ROLES ?? 'sso')
    .split(',')
    .map((role) => role.trim())
    .filter(Boolean)
