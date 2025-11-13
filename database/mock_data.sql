-- ==========================================================
-- MOCK DATA
-- ==========================================================

-- Projects
INSERT INTO project (name, description) VALUES
('AI Evaluation Platform', 'System for evaluating AI workflows and test runs'),
('NLP Benchmark Suite', 'Collection of NLP models tested against language benchmarks');

-- Workflows (some with hierarchy)
INSERT INTO workflow (project_id, parent_workflow_id, name, meta_info) VALUES
(1, NULL, 'Main Evaluation Workflow', '{"version": "1.0", "purpose": "evaluate AI models"}'),
(1, 1, 'Subworkflow - Model A', '{"model": "GPT-Test-A", "type": "LLM"}'),
(1, 1, 'Subworkflow - Model B', '{"model": "GPT-Test-B", "type": "LLM"}'),
(2, NULL, 'NLP Metrics Workflow', '{"metrics": ["BLEU", "ROUGE"]}');

-- Test Runs
INSERT INTO test_run (workflow_id, start_ts, finish_ts) VALUES
(1, '2025-11-13 10:00:00', '2025-11-13 10:05:00'),  -- run_1
(1, '2025-11-13 12:00:00', '2025-11-13 12:06:00'),  -- run_2 (same workflow for comparison)
(1, '2025-11-13 14:00:00', '2025-11-13 14:07:00'),  -- run_3 (same workflow for comparison)
(2, '2025-11-13 11:00:00', '2025-11-13 11:04:00'),  -- run_4
(2, '2025-11-13 13:00:00', '2025-11-13 13:05:00'),  -- run_5 (same subworkflow for comparison)
(3, '2025-11-13 11:05:00', '2025-11-13 11:09:00');  -- run_6

-- Test Executions
-- Run 1 (Main Workflow)
INSERT INTO test_execution (run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, execution_ts) VALUES
(1, 1, 'session_run1', NULL, 'What is AI?', 'Artificial Intelligence is ...', 2.5, 120, '2025-11-13 10:01:00'),
(1, 1, 'session_run1', 1, 'Define Machine Learning.', 'Machine Learning is ...', 2.7, 130, '2025-11-13 10:02:00'),
(1, 1, 'session_run1', NULL, 'Explain Neural Networks.', 'Neural networks are computational models inspired by the human brain.', 3.2, 150, '2025-11-13 10:03:00');

-- Run 2 (Main Workflow - Same questions for comparison)
INSERT INTO test_execution (run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, execution_ts) VALUES
(2, 1, 'session_run2', NULL, 'What is AI?', 'Artificial Intelligence is ...', 2.3, 115, '2025-11-13 12:01:00'),
(2, 1, 'session_run2', 4, 'Define Machine Learning.', 'Machine Learning is ...', 2.9, 135, '2025-11-13 12:02:00'),
(2, 1, 'session_run2', NULL, 'Explain Neural Networks.', 'Neural networks are computational models inspired by the human brain.', 3.0, 145, '2025-11-13 12:03:00');

-- Run 3 (Main Workflow - Same questions for comparison)
INSERT INTO test_execution (run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, execution_ts) VALUES
(3, 1, 'session_run3', NULL, 'What is AI?', 'Artificial Intelligence is ...', 2.8, 125, '2025-11-13 14:01:00'),
(3, 1, 'session_run3', 7, 'Define Machine Learning.', 'Machine Learning is ...', 2.6, 128, '2025-11-13 14:02:00'),
(3, 1, 'session_run3', NULL, 'Explain Neural Networks.', 'Neural networks are computational models inspired by the human brain.', 3.1, 148, '2025-11-13 14:03:00');

-- Run 4 (Subworkflow Model A)
INSERT INTO test_execution (run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, execution_ts) VALUES
(4, 2, 'session_modelA', NULL, 'Summarize this text.', 'This text is about ...', 3.0, 140, '2025-11-13 11:01:00'),
(4, 2, 'session_modelA', NULL, 'What are transformers?', 'Transformers are a type of deep learning architecture.', 2.8, 135, '2025-11-13 11:02:00');

-- Run 5 (Subworkflow Model A - Same questions for comparison)
INSERT INTO test_execution (run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, execution_ts) VALUES
(5, 2, 'session_modelA2', NULL, 'Summarize this text.', 'This text is about ...', 2.9, 138, '2025-11-13 13:01:00'),
(5, 2, 'session_modelA2', NULL, 'What are transformers?', 'Transformers are a type of deep learning architecture.', 3.1, 142, '2025-11-13 13:02:00');

-- Run 6 (Subworkflow Model B)
INSERT INTO test_execution (run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, execution_ts) VALUES
(6, 3, 'session_modelB', NULL, 'Translate to French: Hello World', 'Bonjour le monde', 1.8, 100, '2025-11-13 11:06:00');

-- Test Responses
INSERT INTO test_response (test_execution_id, output) VALUES
-- Run 1
(1, 'AI stands for Artificial Intelligence, the simulation of human intelligence in machines.'),
(2, 'Machine Learning is a subset of AI focused on learning from data.'),
(3, 'Neural networks consist of interconnected layers of nodes that process information similar to neurons in the brain.'),
-- Run 2
(4, 'Artificial Intelligence (AI) refers to computer systems designed to perform tasks that typically require human intelligence.'),
(5, 'Machine Learning is a branch of AI that enables systems to learn and improve from experience without being explicitly programmed.'),
(6, 'Neural networks are computing systems inspired by biological neural networks, consisting of interconnected nodes organized in layers.'),
-- Run 3
(7, 'AI is the field of computer science focused on creating intelligent machines capable of performing human-like tasks.'),
(8, 'ML is a subset of artificial intelligence that focuses on developing algorithms that learn from data.'),
(9, 'Neural networks are layered structures of artificial neurons that can learn complex patterns from data.'),
-- Run 4
(10, 'The text mainly discusses the importance of natural language processing.'),
(11, 'Transformers are a neural network architecture that uses self-attention mechanisms to process sequential data.'),
-- Run 5
(12, 'This text primarily covers natural language processing and its applications.'),
(13, 'Transformers represent a breakthrough in deep learning, using attention mechanisms to handle sequential data efficiently.'),
-- Run 6
(14, 'Bonjour le monde');

-- Evaluations
INSERT INTO evaluation (test_execution_id, type, metric_name, metric_value, metric_reason) VALUES
-- Run 1 evaluations
(1, 'automated', 'accuracy', 0.95, 'Matched expected output closely'),
(1, 'automated', 'clarity', 0.92, 'Clear and concise explanation'),
(2, 'manual', 'clarity', 0.9, 'Explanation was clear and concise'),
(2, 'automated', 'accuracy', 0.88, 'Good alignment with expected content'),
(3, 'automated', 'accuracy', 0.91, 'Comprehensive explanation of neural networks'),
(3, 'automated', 'BLEU', 0.85, 'Good semantic similarity'),
-- Run 2 evaluations (slightly different scores)
(4, 'automated', 'accuracy', 0.97, 'Excellent match with expected output'),
(4, 'automated', 'clarity', 0.94, 'Very clear and well-structured'),
(5, 'automated', 'clarity', 0.93, 'Well articulated explanation'),
(5, 'automated', 'accuracy', 0.91, 'Strong alignment with expected content'),
(6, 'automated', 'accuracy', 0.89, 'Good coverage of neural network concepts'),
(6, 'automated', 'BLEU', 0.87, 'Strong semantic similarity'),
-- Run 3 evaluations (different variations)
(7, 'automated', 'accuracy', 0.93, 'Good match with expected definition'),
(7, 'automated', 'clarity', 0.90, 'Clear but could be more detailed'),
(8, 'automated', 'clarity', 0.88, 'Concise but lacks some detail'),
(8, 'automated', 'accuracy', 0.86, 'Adequate alignment with expected content'),
(9, 'automated', 'accuracy', 0.90, 'Solid explanation of neural networks'),
(9, 'automated', 'BLEU', 0.83, 'Acceptable semantic similarity'),
-- Run 4 evaluations
(10, 'automated', 'BLEU', 0.82, 'Translation quality within acceptable range'),
(10, 'automated', 'relevance', 0.88, 'Response relevant to query'),
(11, 'automated', 'accuracy', 0.92, 'Accurate description of transformers'),
(11, 'automated', 'clarity', 0.94, 'Very clear technical explanation'),
-- Run 5 evaluations
(12, 'automated', 'BLEU', 0.84, 'Good translation quality'),
(12, 'automated', 'relevance', 0.90, 'Highly relevant response'),
(13, 'automated', 'accuracy', 0.94, 'Excellent description of transformers'),
(13, 'automated', 'clarity', 0.96, 'Exceptionally clear explanation'),
-- Run 6 evaluations
(14, 'automated', 'latency', 1.8, 'Execution completed in 1.8 seconds'),
(14, 'automated', 'accuracy', 0.99, 'Perfect translation');
