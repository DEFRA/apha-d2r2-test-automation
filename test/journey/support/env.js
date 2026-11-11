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
 * Sign-in credentials from `.env` or secret pipeline variables. Both empty means the
 * current Windows SSO session is used. Never log the return value.
 * @returns {{ username: string, password: string }}
 */
export function credentials() {
  return {
    username: read('USER_NAME', { required: false }),
    password: read('USER_PASSWORD', { required: false })
  }
}
