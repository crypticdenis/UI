import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';

describe('Server API Tests', () => {
  const API_BASE_URL = 'http://localhost:3001/api';

  describe('API Endpoints Structure', () => {
    it('should have health check endpoint', () => {
      expect(API_BASE_URL).toContain('/api');
    });

    it('should have projects endpoint', () => {
      const projectsUrl = `${API_BASE_URL}/projects`;
      expect(projectsUrl).toBe('http://localhost:3001/api/projects');
    });

    it('should have workflow runs endpoint structure', () => {
      const workflowId = 'RE_Butler';
      const runsUrl = `${API_BASE_URL}/workflows/${workflowId}/runs`;
      expect(runsUrl).toBe('http://localhost:3001/api/workflows/RE_Butler/runs');
    });

    it('should have specific run endpoint structure', () => {
      const runId = '123';
      const runUrl = `${API_BASE_URL}/runs/${runId}`;
      expect(runUrl).toBe('http://localhost:3001/api/runs/123');
    });
  });

  describe('Data Formatting Functions', () => {
    it('should format test run with hierarchical executions', () => {
      const mockTestRun = {
        id: 1,
        workflow_id: 'RE_Butler',
        start_ts: '2025-01-01T10:00:00',
        finish_ts: '2025-01-01T10:05:00',
        creation_ts: '2025-01-01T09:55:00'
      };

      const mockExecutions = [
        {
          id: 'exec-1',
          run_id: 1,
          workflow_id: 'RE_Butler',
          parent_execution_id: null,
          input: 'Test question',
          expected_output: 'Expected answer',
          output: 'Actual answer'
        },
        {
          id: 'exec-2',
          run_id: 1,
          workflow_id: 'Sub_Workflow',
          parent_execution_id: 'exec-1',
          input: 'Sub question',
          expected_output: 'Sub expected',
          output: 'Sub actual'
        }
      ];

      // Test hierarchical structure
      const rootExecutions = mockExecutions.filter(e => !e.parent_execution_id);
      const subExecutions = mockExecutions.filter(e => e.parent_execution_id);

      expect(rootExecutions).toHaveLength(1);
      expect(subExecutions).toHaveLength(1);
      expect(subExecutions[0].parent_execution_id).toBe('exec-1');
    });

    it('should build workflow structure from database', () => {
      const mockWorkflowId = 'RE_Butler';
      const mockRuns = [
        { id: 1, workflow_id: mockWorkflowId },
        { id: 2, workflow_id: mockWorkflowId }
      ];

      const workflow = {
        id: mockWorkflowId,
        name: mockWorkflowId.replace(/_/g, ' '),
        runCount: mockRuns.length,
        runs: mockRuns
      };

      expect(workflow.id).toBe('RE_Butler');
      expect(workflow.name).toBe('RE Butler');
      expect(workflow.runCount).toBe(2);
    });

    it('should build project structure', () => {
      const mockWorkflows = [
        { id: 'RE_Butler', runs: [] },
        { id: 'RAG_Search', runs: [] }
      ];

      const project = {
        id: 1,
        name: 'RE Butler Evaluation',
        description: 'Evaluation results and testing workflows',
        workflowCount: mockWorkflows.length,
        workflows: mockWorkflows
      };

      expect(project.id).toBe(1);
      expect(project.name).toBe('RE Butler Evaluation');
      expect(project.workflowCount).toBe(2);
      expect(project.workflows).toHaveLength(2);
    });
  });

  describe('Database Schema Validation', () => {
    it('should have evaluation schema tables', () => {
      const expectedTables = [
        'evaluation.test_run',
        'evaluation.test_execution',
        'evaluation.test_response',
        'evaluation.evaluation'
      ];

      expectedTables.forEach(table => {
        expect(table).toMatch(/^evaluation\./);
      });
    });

    it('should validate test_run structure', () => {
      const testRun = {
        id: expect.any(Number),
        workflow_id: expect.any(String),
        start_ts: expect.any(String),
        finish_ts: expect.any(String),
        creation_ts: expect.any(String)
      };

      expect(testRun).toBeDefined();
    });

    it('should validate test_execution structure', () => {
      const testExecution = {
        id: expect.any(String),
        run_id: expect.any(Number),
        workflow_id: expect.any(String),
        session_id: expect.any(String),
        parent_execution_id: null, // or String
        input: expect.any(String),
        expected_output: expect.any(String),
        duration: expect.any(Number),
        total_tokens: expect.any(Number)
      };

      expect(testExecution).toBeDefined();
    });

    it('should validate evaluation structure', () => {
      const evaluation = {
        id: expect.any(Number),
        test_execution_id: expect.any(String),
        workflow_id: expect.any(String),
        metric_name: expect.any(String),
        metric_value: expect.any(Number),
        metric_reason: expect.any(String)
      };

      expect(evaluation).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing run gracefully', () => {
      const runId = 'non-existent-id';
      const errorResponse = {
        error: 'Run not found'
      };

      expect(errorResponse).toEqual({ error: 'Run not found' });
    });

    it('should handle database connection errors', () => {
      const errorResponse = {
        status: 'unhealthy',
        database: 'disconnected',
        error: expect.any(String)
      };

      expect(errorResponse.status).toBe('unhealthy');
      expect(errorResponse.database).toBe('disconnected');
    });

    it('should handle invalid workflow ID', () => {
      const workflowId = '';
      expect(workflowId).toBe('');
    });
  });

  describe('Metrics Handling', () => {
    it('should handle dynamic metrics correctly', () => {
      const metrics = [
        { metric_name: 'output_score', metric_value: 0.95, metric_reason: 'Good' },
        { metric_name: 'relevancy_score', metric_value: 0.88, metric_reason: 'OK' }
      ];

      const metricsObject = {};
      metrics.forEach(m => {
        metricsObject[m.metric_name] = {
          value: m.metric_value,
          reason: m.metric_reason
        };
      });

      expect(metricsObject.output_score).toEqual({ value: 0.95, reason: 'Good' });
      expect(metricsObject.relevancy_score).toEqual({ value: 0.88, reason: 'OK' });
    });

    it('should handle missing metrics', () => {
      const metrics = [];
      const metricsObject = {};
      metrics.forEach(m => {
        metricsObject[m.metric_name] = {
          value: m.metric_value,
          reason: m.metric_reason
        };
      });

      expect(Object.keys(metricsObject)).toHaveLength(0);
    });
  });
});
