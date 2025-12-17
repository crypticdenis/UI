import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

/**
 * Custom hook for fetching projects from the API
 * @returns {Object} { projects, loading, error, retry }
 */
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects, retryCount]);

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  return { projects, loading, error, retry };
}

/**
 * Custom hook for fetching a single run by ID
 * @param {string} runId - The run ID to fetch
 * @returns {Object} { run, loading, error, retry }
 */
export function useRun(runId) {
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchRun = useCallback(async () => {
    if (!runId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await api.getRun(runId);
      setRun(data);
    } catch (err) {
      console.error('Error fetching run:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [runId]);

  useEffect(() => {
    fetchRun();
  }, [fetchRun, retryCount]);

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  return { run, loading, error, retry };
}

/**
 * Custom hook for fetching multiple runs by IDs
 * @param {Array<string>} runIds - Array of run IDs to fetch
 * @returns {Object} { runs, loading, error, retry }
 */
export function useRuns(runIds) {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchRuns = useCallback(async () => {
    if (!runIds || runIds.length === 0) {
      setRuns([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.getRunsByIds(runIds);
      setRuns(data);
    } catch (err) {
      console.error('Error fetching runs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [runIds.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns, retryCount]);

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  return { runs, loading, error, retry };
}
