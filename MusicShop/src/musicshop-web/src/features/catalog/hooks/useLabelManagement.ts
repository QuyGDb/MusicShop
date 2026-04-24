import { useState } from 'react';
import { useLabels, useCreateLabel, useUpdateLabel, useDeleteLabel } from './useLabels';
import { Label } from '../types';

export function useLabelManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    website: '',
    foundedYear: ''
  });

  const { data: labelsData, isLoading } = useLabels();
  const createMutation = useCreateLabel();
  const updateMutation = useUpdateLabel();
  const deleteMutation = useDeleteLabel();

  const handleOpenCreate = () => {
    setEditingLabel(null);
    setFormData({ name: '', country: '', website: '', foundedYear: '' });
    setShowForm(true);
  };

  const handleOpenEdit = (label: Label) => {
    setEditingLabel(label);
    setFormData({ 
      name: label.name, 
      country: label.country, 
      website: label.website || '',
      foundedYear: label.foundedYear?.toString() || ''
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLabel(null);
  };

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.country) return;

    const payload = {
      ...formData,
      foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : undefined
    };

    if (editingLabel) {
      updateMutation.mutate(
        { 
          id: editingLabel.id, 
          data: { ...payload, slug: editingLabel.slug } 
        },
        { onSuccess: handleCloseForm }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: handleCloseForm
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this label?')) {
      deleteMutation.mutate(id);
    }
  };

  return {
    labels: labelsData?.items ?? [],
    isLoading,
    isEmpty: !isLoading && (labelsData?.items.length === 0),
    form: {
      isOpen: showForm,
      editingLabel,
      formData,
      updateField: updateFormField,
      openCreate: handleOpenCreate,
      openEdit: handleOpenEdit,
      close: handleCloseForm,
      submit: handleSubmit,
      isPending: createMutation.isPending || updateMutation.isPending,
      isValid: !!formData.name && !!formData.country
    },
    actions: {
      delete: handleDelete,
      isDeleting: deleteMutation.isPending,
      deletingId: deleteMutation.variables
    }
  };
}
