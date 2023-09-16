const BASE_URL = 'https://frontend-take-home-service.fetch.com';

export const loginUser = async (name: string, email: string) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email }),
    credentials: 'include', // This is needed to handle cookies.
  });

  if (!response.ok) {
    throw new Error('Login failed.');
  }
  return response.json();
};
