import { API_URL } from "../config";

async function authWarmup() {
  fetch(`${API_URL}/auth-warmup`, { method: "GET" });
}

export { authWarmup };
