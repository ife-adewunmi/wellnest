import { useMutation } from '@tanstack/react-query';
import { SignupCredentials, AuthResponse } from '../types';

const useSignup = () => {
  return useMutation<AuthResponse, Error, SignupCredentials>({
    mutationFn: async (credentials: SignupCredentials) => {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('data', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      return data;
    },
  });
};

export default useSignup;
