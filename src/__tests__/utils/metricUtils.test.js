import { describe, it, expect } from 'vitest';
import {
  isNumericScore,
  isScoreField,
  isReasonField,
  extractMetrics,
  formatFieldName,
  getScoreColor,
  calculateAggregateScores,
  getUniqueScoreFields,
  formatNumber
} from '../../utils/metricUtils';

describe('metricUtils', () => {
  describe('isNumericScore', () => {
    it('should return true for valid numbers', () => {
      expect(isNumericScore(0)).toBe(true);
      expect(isNumericScore(0.5)).toBe(true);
      expect(isNumericScore(1)).toBe(true);
      expect(isNumericScore(10)).toBe(true);
      expect(isNumericScore(-1)).toBe(true);
    });

    it('should return false for non-numbers', () => {
      expect(isNumericScore('0.5')).toBe(false);
      expect(isNumericScore(null)).toBe(false);
      expect(isNumericScore(undefined)).toBe(false);
      expect(isNumericScore(NaN)).toBe(false);
      expect(isNumericScore({})).toBe(false);
      expect(isNumericScore([])).toBe(false);
    });
  });

  describe('isScoreField', () => {
    it('should identify score-related field names', () => {
      expect(isScoreField('outputScore')).toBe(true);
      expect(isScoreField('ragRelevancyScore')).toBe(true);
      expect(isScoreField('hallucinationRate')).toBe(true);
      expect(isScoreField('accuracyRating')).toBe(true);
      expect(isScoreField('precisionMetric')).toBe(true);
      expect(isScoreField('f1Score')).toBe(true);
      expect(isScoreField('recallAccuracy')).toBe(true);
    });

    it('should not identify non-score fields', () => {
      expect(isScoreField('input')).toBe(false);
      expect(isScoreField('output')).toBe(false);
      expect(isScoreField('timestamp')).toBe(false);
      expect(isScoreField('id')).toBe(false);
    });

    it('should be case-insensitive', () => {
      expect(isScoreField('OUTPUTSCORE')).toBe(true);
      expect(isScoreField('OutputScore')).toBe(true);
      expect(isScoreField('output_score')).toBe(true);
    });
  });

  describe('isReasonField', () => {
    it('should identify reason-related field names', () => {
      expect(isReasonField('outputScoreReason')).toBe(true);
      expect(isReasonField('explanation')).toBe(true);
      expect(isReasonField('justification')).toBe(true);
      expect(isReasonField('rationale')).toBe(true);
    });

    it('should not identify non-reason fields', () => {
      expect(isReasonField('score')).toBe(false);
      expect(isReasonField('value')).toBe(false);
      expect(isReasonField('input')).toBe(false);
    });
  });

  describe('extractMetrics', () => {
    it('should extract metrics from execution data', () => {
      const execution = {
        id: '123',
        input: 'Test question',
        output: 'Test answer',
        output_score: { value: 0.95, reason: 'Excellent' },
        relevancy_score: { value: 0.88, reason: 'Good' }
      };

      const result = extractMetrics(execution);

      expect(result.scores).toHaveLength(2);
      expect(result.scores[0]).toEqual({
        key: 'output_score',
        value: 0.95,
        label: 'Output Score',
        reason: 'Excellent'
      });
      expect(result.scores[1]).toEqual({
        key: 'relevancy_score',
        value: 0.88,
        label: 'Relevancy Score',
        reason: 'Good'
      });
    });

    it('should skip core fields', () => {
      const execution = {
        id: '123',
        runId: 456,
        workflowId: 'test',
        input: 'Test',
        output: 'Test',
        duration: 1.5,
        totalTokens: 100,
        score: { value: 0.9, reason: 'Good' }
      };

      const result = extractMetrics(execution);
      expect(result.scores).toHaveLength(1);
      expect(result.scores[0].key).toBe('score');
    });

    it('should handle empty or invalid input', () => {
      expect(extractMetrics(null)).toEqual({ scores: [], reasons: [], textFields: [] });
      expect(extractMetrics(undefined)).toEqual({ scores: [], reasons: [], textFields: [] });
      expect(extractMetrics('not an object')).toEqual({ scores: [], reasons: [], textFields: [] });
      expect(extractMetrics({})).toEqual({ scores: [], reasons: [], textFields: [] });
    });
  });

  describe('formatFieldName', () => {
    it('should convert camelCase to Title Case', () => {
      expect(formatFieldName('outputScore')).toBe('Output Score');
      expect(formatFieldName('ragRelevancyScore')).toBe('RAG Relevancy Score');
      expect(formatFieldName('hallucinationRate')).toBe('Hallucination Rate');
    });

    it('should convert snake_case to Title Case', () => {
      expect(formatFieldName('output_score')).toBe('Output Score');
      expect(formatFieldName('rag_relevancy_score')).toBe('RAG Relevancy Score');
    });

    it('should handle abbreviations correctly', () => {
      expect(formatFieldName('ragScore')).toBe('RAG Score');
      expect(formatFieldName('llmAccuracy')).toBe('LLM Accuracy');
      expect(formatFieldName('apiResponse')).toBe('API Response');
      expect(formatFieldName('jsonData')).toBe('JSON Data');
    });

    it('should handle single words', () => {
      expect(formatFieldName('score')).toBe('Score');
      expect(formatFieldName('rate')).toBe('Rate');
    });
  });

  describe('getScoreColor', () => {
    it('should return correct colors for 0-1 scale', () => {
      expect(getScoreColor(0.95)).toBe('#059669'); // Dark green
      expect(getScoreColor(0.85)).toBe('#10b981'); // Green
      expect(getScoreColor(0.75)).toBe('#34d399'); // Light green
      expect(getScoreColor(0.65)).toBe('#fbbf24'); // Yellow
      expect(getScoreColor(0.55)).toBe('#f59e0b'); // Orange
      expect(getScoreColor(0.45)).toBe('#f97316'); // Dark orange
      expect(getScoreColor(0.35)).toBe('#ef4444'); // Red
      expect(getScoreColor(0.25)).toBe('#dc2626'); // Dark red
    });

    it('should normalize 0-10 scale to 0-1', () => {
      expect(getScoreColor(9.5)).toBe('#059669'); // 0.95
      expect(getScoreColor(8.5)).toBe('#10b981'); // 0.85
      expect(getScoreColor(7.5)).toBe('#34d399'); // 0.75
    });

    it('should handle edge cases', () => {
      expect(getScoreColor(0)).toBe('#dc2626');
      expect(getScoreColor(1)).toBe('#059669');
      expect(getScoreColor(10)).toBe('#059669');
    });

    it('should return gray for invalid values', () => {
      expect(getScoreColor(null)).toBe('#6b7280');
      expect(getScoreColor(undefined)).toBe('#6b7280');
      expect(getScoreColor(NaN)).toBe('#6b7280');
    });
  });

  describe('calculateAggregateScores', () => {
    it('should calculate averages for all metrics', () => {
      const questions = [
        {
          id: '1',
          output_score: { value: 0.9, reason: 'Good' },
          relevancy_score: { value: 0.8, reason: 'OK' }
        },
        {
          id: '2',
          output_score: { value: 0.8, reason: 'Good' },
          relevancy_score: { value: 0.9, reason: 'Great' }
        }
      ];

      const result = calculateAggregateScores(questions);

      expect(result.count).toBe(2);
      expect(result.metrics).toHaveLength(2);

      const outputScore = result.metrics.find(m => m.key === 'output_score');
      expect(outputScore.average).toBeCloseTo(0.85);
      expect(outputScore.formatted).toBe('0.85');

      const relevancyScore = result.metrics.find(m => m.key === 'relevancy_score');
      expect(relevancyScore.average).toBeCloseTo(0.85);
    });

    it('should handle empty array', () => {
      const result = calculateAggregateScores([]);
      expect(result.count).toBe(0);
      expect(result.metrics).toHaveLength(0);
    });

    it('should handle null/undefined', () => {
      expect(calculateAggregateScores(null)).toEqual({ metrics: [], count: 0 });
      expect(calculateAggregateScores(undefined)).toEqual({ metrics: [], count: 0 });
    });
  });

  describe('getUniqueScoreFields', () => {
    it('should extract unique metric fields from runs', () => {
      const runs = [
        {
          id: '1',
          output_score: { value: 0.9, reason: 'Good' },
          relevancy_score: { value: 0.8, reason: 'OK' }
        },
        {
          id: '2',
          output_score: { value: 0.85, reason: 'Good' },
          accuracy: { value: 0.95, reason: 'Excellent' }
        }
      ];

      const result = getUniqueScoreFields(runs);

      expect(result).toHaveLength(3);
      expect(result.map(f => f.key)).toContain('output_score');
      expect(result.map(f => f.key)).toContain('relevancy_score');
      expect(result.map(f => f.key)).toContain('accuracy');
    });

    it('should return empty array for empty input', () => {
      expect(getUniqueScoreFields([])).toEqual([]);
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with specified decimals', () => {
      expect(formatNumber(0.123456, 2)).toBe('0.12');
      expect(formatNumber(0.987654, 3)).toBe('0.988');
      expect(formatNumber(1, 2)).toBe('1.00');
    });

    it('should use 2 decimals by default', () => {
      expect(formatNumber(0.123456)).toBe('0.12');
      expect(formatNumber(5.6789)).toBe('5.68');
    });

    it('should return "-" for invalid values', () => {
      expect(formatNumber(null)).toBe('-');
      expect(formatNumber(undefined)).toBe('-');
      expect(formatNumber(NaN)).toBe('-');
      expect(formatNumber('not a number')).toBe('-');
    });
  });
});
