const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost/tripple-kay-api";
const serverBase = import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:5000";

export const API_BASE_URL = trimTrailingSlash(apiBase);
export const SERVER_BASE_URL = trimTrailingSlash(serverBase);
