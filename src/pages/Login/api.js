// api.js

// Simulated user data
const users = [
    { username: 'amd', password: 'amd$$1234' },
    { username: 'sayali', password: 'sayali123' }
  ];
  
  export const login = async (credentials) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
  
    const user = users.find(u => 
      u.username === credentials.username && u.password === credentials.password
    );
  
    if (user) {
      const token = btoa(user.username + ':' + Math.random()); // Simple token generation
      return { token };
    } else {
      throw new Error('Invalid credentials');
    }
  };
  
  export const logout = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, you might invalidate the token on the server here
  };
  
  export const refreshToken = async (token) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, you'd validate the token and issue a new one
    // Here, we'll just return the same token
    return token;
  };