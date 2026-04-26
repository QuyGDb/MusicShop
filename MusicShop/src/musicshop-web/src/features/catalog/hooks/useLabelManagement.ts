import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLabels, useDeleteLabel } from './useLabels';
import { Label } from '../types';

export function useLabelManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  const [showForm, setShowForm] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync debounced search to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set('q', debouncedSearch);
    } else {
      params.delete('q');
    }
    params.set('page', '1');
    setSearchParams(params, { replace: true });
  }, [debouncedSearch]);
  
  const { data: labelsData, isLoading, error } = useLabels(page, 12, debouncedSearch || undefined);
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

  const setPage = (pageNum: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNum.toString());
    setSearchParams(params);
  };

  return {
    labels: labelsData?.items ?? [],
    isLoading,
    error,
    isEmpty: !isLoading && (labelsData?.items.length === 0),
    page,
    setPage,
    searchQuery,
    setSearchQuery,
    totalPages: labelsData?.meta ? Math.ceil(labelsData.meta.total / 12) : 1,
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
