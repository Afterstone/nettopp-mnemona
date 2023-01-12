import { API_URL, AUTH_JWT_PUBLIC_KEY } from "../config";
import { jwtVerify, importSPKI } from "jose";

type LoginResponse = {
  success: boolean;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
};

type AuthAccessTokenContents = {
  username: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
};

async function login(email: string, password: string): Promise<LoginResponse> {
  const endpoint = `${API_URL}/login`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!String(res.status).startsWith("2")) {
    throw new Error(`Login failed with status code ${res.status}`);
  }

  const data = await res.json();
  const token = data.access_token.token;

  const key = await importSPKI(AUTH_JWT_PUBLIC_KEY, "ES512");
  const { payload } = await jwtVerify(token, key, {});

  const userData = payload as AuthAccessTokenContents;

  let response: LoginResponse = {
    success: true,
    // username: data.username,
    username: userData.username, // TODO: Fix this when it is implemented in the backend.
    email: userData.email,
    accessToken: data.access_token.token,
    refreshToken: data.refresh_token.token,
  };

  return response;
}

type RefreshResponse = {
  success: boolean;
  accessToken: string;
};

async function refresh(refreshToken: string): Promise<RefreshResponse> {
  const endpoint = `${API_URL}/refresh`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!String(res.status).startsWith("2")) {
    throw new Error(`Refresh failed with status code ${res.status}`);
  }
  const data = await res.json();

  const key = await importSPKI(AUTH_JWT_PUBLIC_KEY, "ES512");
  await jwtVerify(data.token, key, {});

  const response: RefreshResponse = {
    success: true,
    accessToken: data.token,
  };

  return response;
}

export { login, refresh };
