import { useState } from 'react';
import { useLabels, useDeleteLabel } from './useLabels';
import { Label } from '../types';

export function useLabelManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  
  const { data: labelsData, isLoading, error } = useLabels();
  const deleteMutation = useDeleteLabel();

  const handleOpenCreate = () => {
    setEditingLabel(null);
    setShowForm(true);
  };

  const handleOpenEdit = (label: Label) => {
    setEditingLabel(label);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLabel(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this label?')) {
      deleteMutation.mutate(id);
    }
  };

  return {
    labels: labelsData?.items ?? [],
    isLoading,
    error,
    isEmpty: !isLoading && (labelsData?.items.length === 0),
    form: {
      isOpen: showForm,
      editingLabel,
      openCreate: handleOpenCreate,
      openEdit: handleOpenEdit,
      close: handleCloseForm,
    },
    actions: {
      delete: handleDelete,
      isDeleting: deleteMutation.isPending,
      deletingId: deleteMutation.variables
    }
  };
}
