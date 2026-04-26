import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGenres, useDeleteGenre } from './useGenres';
import { Genre } from '../types';

export function useGenreManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  const [showForm, setShowForm] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);

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
  
  const { data: genresData, isLoading, error } = useGenres(page, 20, debouncedSearch || undefined);
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

  const setPage = (pageNum: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNum.toString());
    setSearchParams(params);
  };

  return {
    genres: genresData?.items ?? [],
    isLoading,
    error,
    isEmpty: !isLoading && (genresData?.items.length === 0),
    page,
    setPage,
    searchQuery,
    setSearchQuery,
    totalPages: genresData?.meta ? Math.ceil(genresData.meta.total / 20) : 1,
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
