import { useSearchParams } from 'react-router-dom';

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Current filter values from URL
  const selectedFormat = searchParams.get('format');
  const selectedGenre = searchParams.get('genre');
  const page = searchParams.get('page') || '1';
  const searchQuery = searchParams.get('q') || '';

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Always reset to page 1 on filter change
    params.set('page', '1');
    setSearchParams(params, { replace: true });
  };

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
  };

  const setPage = (pageNum: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNum.toString());
    setSearchParams(params);
  };

  return {
    selectedFormat,
    selectedGenre,
    page: parseInt(page),
    searchQuery,
    searchParams,
    updateFilters,
    clearFilters,
    setPage
  };
}
