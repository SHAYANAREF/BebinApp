const users = [];

export function registerUser(email, password) {
  const userExists = users.some(user => user.email === email);
  if (userExists) {
    throw new Error('User already exists');
  }
  users.push({ email, password });
  return { email };
}

export function loginUser(email, password) {
  const user = users.find(user => user.email === email && user.password === password);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  return { email };
}