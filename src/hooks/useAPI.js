import { useState, useEffect } from 'react';
import { api } from '../services/api';

/**
 * Custom hook for fetching projects from the API
 * @returns {Object} { projects, loading, error }
 */
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
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
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
}

/**
 * Custom hook for fetching a single run by ID
 * @param {string} runId - The run ID to fetch
 * @returns {Object} { run, loading, error }
 */
export function useRun(runId) {
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!runId) return;

    const fetchRun = async () => {
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
    };

    fetchRun();
  }, [runId]);

  return { run, loading, error };
}

/**
 * Custom hook for fetching multiple runs by IDs
 * @param {Array<string>} runIds - Array of run IDs to fetch
 * @returns {Object} { runs, loading, error }
 */
export function useRuns(runIds) {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!runIds || runIds.length === 0) {
      setRuns([]);
      return;
    }

    const fetchRuns = async () => {
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
    };

    fetchRuns();
  }, [runIds.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  return { runs, loading, error };
}
