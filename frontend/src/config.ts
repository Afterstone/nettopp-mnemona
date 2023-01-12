
const AUTH_COOKIE_NAME = "NettoppMnemona_AuthState";

const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8000";

if (typeof import.meta.env.VITE_APP_AUTH_JWT_PUBLIC_KEY !== "string") {
  throw new Error("REACT_APP_API_URL is not defined.");
}
const AUTH_JWT_PUBLIC_KEY =
  import.meta.env.VITE_APP_AUTH_JWT_PUBLIC_KEY.replace(/\\n/g, "\n");

export { API_URL, AUTH_JWT_PUBLIC_KEY, AUTH_COOKIE_NAME };
