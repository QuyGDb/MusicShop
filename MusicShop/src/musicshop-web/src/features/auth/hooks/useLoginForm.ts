import { useCallback } from 'react';
import { CredentialResponse } from '@react-oauth/google';
import { useFormFields } from './useFormFields';
import { useLoginValidation } from './useLoginValidation';
import { useLoginSubmit } from './useLoginSubmit';

export function useLoginForm() {
  const { email, setEmail, password, setPassword } = useFormFields();
  const { errors, validate } = useLoginValidation(email, password);
  const { 
    isSubmitting, 
    serverError, 
    setServerError, 
    submitLogin, 
    submitGoogleLogin 
  } = useLoginSubmit();

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    
    if (!validate()) {
      return;
    }

    await submitLogin(email, password);
  }, [email, password, validate, setServerError, submitLogin]);

  const handleGoogleSuccess = useCallback(async (credentialResponse: CredentialResponse) => {
    setServerError(null);
    const idToken = credentialResponse.credential;
    
    if (!idToken) {
      return;
    }

    await submitGoogleLogin(idToken);
  }, [setServerError, submitGoogleLogin]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    serverError,
    errors,
    onSubmit,
    handleGoogleSuccess,
    setServerError
  };
}
