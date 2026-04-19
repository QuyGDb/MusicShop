import { useState } from 'react';
import { authService } from '../services/authService';
import { ChangePasswordRequest } from '../types';
import { useSubmitState } from '@/shared/hooks/useSubmitState';

export function useChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { isSubmitting, setIsSubmitting, serverError, setServerError } = useSubmitState();

  const validate = (): boolean => {
    if (!currentPassword) {
      setServerError('Current password is required.');
      return false;
    }
    if (newPassword.length < 6) {
      setServerError('New password must be at least 6 characters.');
      return false;
    }
    if (newPassword !== confirmNewPassword) {
      setServerError('New passwords do not match.');
      return false;
    }
    return true;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const payload: ChangePasswordRequest = {
      currentPassword,
      newPassword,
      confirmNewPassword,
    };

    const result = await authService.changePassword(payload);

    if (result.success) {
      setSuccessMessage('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      setServerError(result.error.message);
    }

    setIsSubmitting(false);
  };

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
