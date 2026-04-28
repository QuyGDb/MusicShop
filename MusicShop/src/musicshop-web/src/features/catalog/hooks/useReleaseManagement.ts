import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReleases, useDeleteRelease } from './useReleases';
import { Release } from '../types';

export function useReleaseManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  const [showForm, setShowForm] = useState(false);
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [managingVersionsFor, setManagingVersionsFor] = useState<Release | null>(null);

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

  const { data: releasesData, isLoading } = useReleases(page, 10, debouncedSearch || undefined);
  const deleteReleaseMutation = useDeleteRelease();

  const handleOpenCreate = () => {
    setEditingRelease(null);
    setShowForm(true);
  };

  const handleOpenEdit = (release: Release) => {
    setEditingRelease(release);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this release? This will remove all associated versions and tracks.')) {
      deleteReleaseMutation.mutate(id);
    }
  };

  const closeForm = () => setShowForm(false);
  const closeVersionsModal = () => setManagingVersionsFor(null);

  const setPage = (pageNum: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNum.toString());
    setSearchParams(params);
  };

  return {
    // State
    showForm,
    editingRelease,
    managingVersionsFor,
    releasesData,
    isLoading,
    page,
    totalPages: releasesData?.meta ? Math.ceil(releasesData.meta.total / 10) : 1,
    searchQuery,
    setSearchQuery,

    // Actions
    setPage,
    handleOpenCreate,
    handleOpenEdit,
    handleDelete,
    closeForm,
    setManagingVersionsFor,
    closeVersionsModal,
    isDeleting: deleteReleaseMutation.isPending,
    deletingId: deleteReleaseMutation.variables
  };
}
