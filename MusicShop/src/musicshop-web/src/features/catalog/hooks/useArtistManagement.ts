import { useState } from 'react';
import { useArtists, useDeleteArtist } from './useArtists';
import { Artist } from '../types';

export function useArtistManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [page, setPage] = useState(1);

  const { data: artistsData, isLoading, error } = useArtists(page, 12);
  const deleteArtistMutation = useDeleteArtist();

  const handleOpenCreate = () => {
    setEditingArtist(null);
    setShowForm(true);
  };

  const handleOpenEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingArtist(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this artist? This will remove them from the catalog.')) {
      deleteArtistMutation.mutate(id);
    }
  };

  return {
    artists: artistsData?.items ?? [],
    isLoading,
    error,
    isEmpty: !isLoading && (artistsData?.items.length === 0),
    page,
    setPage,
    form: {
      isOpen: showForm,
      editingArtist,
      openCreate: handleOpenCreate,
      openEdit: handleOpenEdit,
      close: handleCloseForm
    },
    actions: {
      delete: handleDelete,
      isDeleting: deleteArtistMutation.isPending,
      deletingId: deleteArtistMutation.variables
    }
  };
}
