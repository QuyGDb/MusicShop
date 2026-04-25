import { useState } from 'react';
import { useGenres, useDeleteGenre } from './useGenres';
import { Genre } from '../types';

export function useGenreManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  
  const { data: genresData, isLoading, error } = useGenres();
  const deleteMutation = useDeleteGenre();

  const handleOpenCreate = () => {
    setEditingGenre(null);
    setShowForm(true);
  };

  const handleOpenEdit = (genre: Genre) => {
    setEditingGenre(genre);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGenre(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this genre?')) {
      deleteMutation.mutate(id);
    }
  };

  return {
    genres: genresData?.items ?? [],
    isLoading,
    error,
    isEmpty: !isLoading && (genresData?.items.length === 0),
    form: {
      isOpen: showForm,
      editingGenre,
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
