import { useState } from 'react';

export function useFormFields() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return { 
    email, 
    setEmail, 
    password, 
    setPassword 
  };
}
