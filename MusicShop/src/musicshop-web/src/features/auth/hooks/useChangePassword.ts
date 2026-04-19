import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { ChangePasswordRequest } from '../types';

export function useChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => {
      setSuccessMessage('Password changed successfully.');
      setValidationError(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    },
  });

  const validate = (): boolean => {
    setValidationError(null);
    if (!currentPassword) {
      setValidationError('Current password is required.');
      return false;
    }
    if (newPassword.length < 6) {
      setValidationError('New password must be at least 6 characters.');
      return false;
    }
    if (newPassword !== confirmNewPassword) {
      setValidationError('New passwords do not match.');
      return false;
    }
    return true;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSuccessMessage(null);

    if (!validate()) {
      return;
    }

    const payload: ChangePasswordRequest = {
      currentPassword,
      newPassword,
      confirmNewPassword,
    };

    mutation.mutate(payload);
  };

  // Combine mutation error and client-side validation error
  const isSubmitting = mutation.isPending;
  const serverError = validationError || (mutation.error instanceof Error ? mutation.error.message : null);

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    isSubmitting,
    serverError,
    successMessage,
    onSubmit,
  };
}
