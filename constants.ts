export const _BASE_URL = process.env.API_URL ?? "http://localhost:8000/api/v1"

export const _CAMPAIGNS_URL = `${_BASE_URL}/campaigns`
export const _COMPANIES_URL = `${_BASE_URL}/companies`
export const _DOCUMENTS_URL = `${_BASE_URL}/documents`
export const _INBOUND_URL = `${_BASE_URL}/inbound`
export const _DRAFTS_URL = `${_BASE_URL}/drafts`
export const _INTEGRATIONS_URL = `${_BASE_URL}/integrations`

export const _MAX_UPLOAD_MB = 25
export const _DOCUMENT_TYPES = ".pdf,.ppt,.pptx,.key"
