import { useState } from 'react';

export function useSubmitState() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  return { 
    isSubmitting, 
    setIsSubmitting, 
    serverError, 
    setServerError 
  };
}
