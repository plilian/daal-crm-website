export const CRM_URL = (import.meta.env["VITE_CRM_URL"]?.trim() || "http://localhost:3000").replace(
  /\/$/,
  "",
);
