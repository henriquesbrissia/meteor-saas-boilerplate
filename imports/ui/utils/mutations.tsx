export const signIn = async ({ email, password }) => {
  const response = await server.post('/api/user/sign-in', {
    email,
    password,
  });
  return response.data;
};

export const signUp = async ({ email, password }) => {
  const response = await server.post('/api/user/sign-up', {
    email,
    password,
  });
  return response.data;
};
