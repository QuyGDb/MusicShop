import { useState } from 'react';
import { useReleases, useDeleteRelease } from './useReleases';
import { Release } from '../types';

export function useReleaseManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [managingVersionsFor, setManagingVersionsFor] = useState<Release | null>(null);
  const [page, setPage] = useState(1);

  const { data: releasesData, isLoading } = useReleases(page, 10);
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

  return {
    // State
    showForm,
    editingRelease,
    managingVersionsFor,
    releasesData,
    isLoading,
    page,
    
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
