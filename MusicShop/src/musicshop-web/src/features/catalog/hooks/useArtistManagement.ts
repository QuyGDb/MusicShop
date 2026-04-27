import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useArtists, useDeleteArtist } from './useArtists';
import { Artist } from '../types';

export function useArtistManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  const [showForm, setShowForm] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);

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

  const { data: artistsData, isLoading, error } = useArtists(page, 12, debouncedSearch);
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

  const setPage = (pageNum: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNum.toString());
    setSearchParams(params);
  };

  return {
    artists: artistsData?.items ?? [],
    isLoading,
    error,
    isEmpty: !isLoading && (artistsData?.items.length === 0),
    page,
    setPage,
    searchQuery,
    setSearchQuery,
    totalPages: artistsData?.meta ? Math.ceil(artistsData.meta.total / 12) : 1,
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
