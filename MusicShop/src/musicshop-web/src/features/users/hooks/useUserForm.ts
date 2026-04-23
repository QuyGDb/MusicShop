import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

const userSchema = z.object({
  role: z.enum(['Customer', 'Admin']),
  status: z.enum(['Active', 'Locked']),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UseUserFormProps {
  initialValues: UserFormValues;
  onSuccess: () => void;
}

export function useUserForm({ initialValues, onSuccess }: UseUserFormProps) {
  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      // Simulate API call
      console.log('Saving user updates:', value);
      await new Promise((resolve) => setTimeout(resolve, 800));
      onSuccess();
    },
  });

  const toggleStatus = () => {
    const currentStatus = form.getFieldValue('status');
    form.setFieldValue('status', currentStatus === 'Active' ? 'Locked' : 'Active');
  };

  const setRole = (role: 'Customer' | 'Admin') => {
    form.setFieldValue('role', role);
  };

  return {
    form,
    toggleStatus,
    setRole,
  };
}
