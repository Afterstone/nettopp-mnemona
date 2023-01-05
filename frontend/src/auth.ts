import { API_URL } from './config';

async function login(email: string, password: string) {
    const endpoint = `${API_URL}/login`;
    console.log(endpoint);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    const data = await res.json();
    console.log(data);

    const { access_token, refresh_token } = data;
    console.log(access_token, refresh_token);
  }

export { login };
