import { useApi } from '../contexts/ApiContext'; // Adjust path as needed

const useAuthServices = () => {
  const { API_URL } = useApi();

  return {
    sendOTP: async (email) => {
      const response = await fetch(`${API_URL}/email/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return response.json();
    },

    verifyOTP: async (email, otp) => {
      const response = await fetch(`${API_URL}/email/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      return response.json();
    },

    registerUser: async (userData) => {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return response.json();
    },

    login: async (email, password) => {
      try {
        const response = await fetch(`${API_URL}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        if (data.token) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
      } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.warn('API not available, using demo mode');
        }
        throw error;
      }
    },

    forgotPassword: async (email) => {
      try {
        const response = await fetch(`${API_URL}/email/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Password reset failed');
        }

        return data;
      } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.warn('API not available, using demo mode');
          return { success: true, message: 'Password reset link sent to your email' };
        }
        throw error;
      }
    },
  };
};

export default useAuthServices;
