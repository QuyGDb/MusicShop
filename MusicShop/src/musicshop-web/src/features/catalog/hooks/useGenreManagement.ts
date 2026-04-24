import { useState } from 'react';
import { useGenres, useCreateGenre, useUpdateGenre, useDeleteGenre } from './useGenres';
import { Genre } from '../types';

export function useGenreManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [genreName, setGenreName] = useState('');

  const { data: genresData, isLoading } = useGenres();
  const createMutation = useCreateGenre();
  const updateMutation = useUpdateGenre();
  const deleteMutation = useDeleteGenre();

  const handleOpenCreate = () => {
    setEditingGenre(null);
    setGenreName('');
    setShowForm(true);
  };

  const handleOpenEdit = (genre: Genre) => {
    setEditingGenre(genre);
    setGenreName(genre.name);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGenre(null);
    setGenreName('');
  };

  const handleSubmit = () => {
    if (!genreName) return;

    if (editingGenre) {
      updateMutation.mutate(
        { id: editingGenre.id, data: { name: genreName } },
        { onSuccess: handleCloseForm }
      );
    } else {
      createMutation.mutate(
        { name: genreName }, 
        { onSuccess: handleCloseForm }
      );
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this genre? This might affect artists and products associated with it.')) {
      deleteMutation.mutate(id);
    }
  };

  return {
    genres: genresData?.items ?? [],
    isLoading,
    isEmpty: !isLoading && (genresData?.items.length === 0),
    form: {
      isOpen: showForm,
      editingGenre,
      genreName,
      setName: setGenreName,
      openCreate: handleOpenCreate,
      openEdit: handleOpenEdit,
      close: handleCloseForm,
      submit: handleSubmit,
      isPending: createMutation.isPending || updateMutation.isPending,
    },
    actions: {
      delete: handleDelete,
      isDeleting: deleteMutation.isPending,
      deletingId: deleteMutation.variables,
    }
  };
}
