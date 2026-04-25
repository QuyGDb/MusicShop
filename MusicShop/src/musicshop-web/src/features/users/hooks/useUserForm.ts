import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

import { Control, FieldErrors } from 'react-hook-form';

interface UseUserFormReturn {
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  control: Control<UserFormValues>;
  errors: FieldErrors<UserFormValues>;
  isSubmitting: boolean;
  toggleStatus: () => void;
  setRole: (role: 'Customer' | 'Admin') => void;
}


export function useUserForm({ initialValues, onSuccess }: UseUserFormProps): UseUserFormReturn {

  const {
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting }
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema) as any,
    defaultValues: initialValues,
  });

  const onSubmit = async (value: UserFormValues) => {
    // Simulate API call
    console.log('Saving user updates:', value);
    await new Promise((resolve) => setTimeout(resolve, 800));
    onSuccess();
  };

  const toggleStatus = () => {
    const currentStatus = getValues('status');
    setValue('status', currentStatus === 'Active' ? 'Locked' : 'Active', { shouldValidate: true });
  };

  const setRole = (role: 'Customer' | 'Admin') => {
    setValue('role', role, { shouldValidate: true });
  };

  return {
    handleSubmit: handleSubmit(onSubmit) as any,

    control,
    errors,
    isSubmitting,
    toggleStatus,
    setRole,
  };
}

