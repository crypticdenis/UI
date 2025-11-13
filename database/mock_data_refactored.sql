-- ==========================================================
-- Mock Data for Refactored Schema
-- Single Project: "RE Butler Evaluation"
-- ==========================================================

-- Clear existing data
TRUNCATE TABLE evaluation CASCADE;
TRUNCATE TABLE test_response CASCADE;
TRUNCATE TABLE test_execution CASCADE;
TRUNCATE TABLE test_run CASCADE;

-- ==========================================================
-- MAIN WORKFLOW: QA Evaluation
-- 3 runs with same questions for comparison
-- ==========================================================

-- Main Workflow Run 1
INSERT INTO test_run (id, workflow_id, parent_run_id, start_ts, finish_ts) VALUES
(1, 'QA_Evaluation', NULL, '2025-11-13 10:00:00', '2025-11-13 10:15:00');

-- Main Workflow Run 2
INSERT INTO test_run (id, workflow_id, parent_run_id, start_ts, finish_ts) VALUES
(2, 'QA_Evaluation', NULL, '2025-11-13 12:00:00', '2025-11-13 12:15:00');

-- Main Workflow Run 3
INSERT INTO test_run (id, workflow_id, parent_run_id, start_ts, finish_ts) VALUES
(3, 'QA_Evaluation', NULL, '2025-11-13 14:00:00', '2025-11-13 14:15:00');

-- ==========================================================
-- SUBWORKFLOW A: Prompt Tuning (linked to Run 1)
-- 2 runs
-- ==========================================================
INSERT INTO test_run (id, workflow_id, parent_run_id, start_ts, finish_ts) VALUES
(4, 'Prompt_Tuning', 1, '2025-11-13 10:20:00', '2025-11-13 10:30:00'),
(5, 'Prompt_Tuning', 1, '2025-11-13 10:35:00', '2025-11-13 10:45:00');

-- ==========================================================
-- SUBWORKFLOW B: Model Comparison (linked to Run 2)
-- 1 run
-- ==========================================================
INSERT INTO test_run (id, workflow_id, parent_run_id, start_ts, finish_ts) VALUES
(6, 'Model_Comparison', 2, '2025-11-13 12:20:00', '2025-11-13 12:35:00');

-- ==========================================================
-- TEST EXECUTIONS
-- ==========================================================

-- Run 1 Executions (QA_Evaluation)
INSERT INTO test_execution (id, run_id, session_id, parent_execution_id, subworkflow_run_id, input, expected_output, duration, total_tokens, execution_ts) VALUES
(1, 1, 'session_1_1', NULL, 4, 'What is AI?', 'Artificial Intelligence is the simulation of human intelligence by machines.', 2.5, 150, '2025-11-13 10:01:00'),
(2, 1, 'session_1_1', NULL, NULL, 'Define Machine Learning.', 'Machine Learning is a subset of AI that enables systems to learn from data.', 3.2, 200, '2025-11-13 10:02:00'),
(3, 1, 'session_1_1', NULL, NULL, 'Explain Neural Networks.', 'Neural Networks are computing systems inspired by biological neural networks.', 4.1, 250, '2025-11-13 10:03:00');

-- Run 2 Executions (QA_Evaluation)
INSERT INTO test_execution (id, run_id, session_id, parent_execution_id, subworkflow_run_id, input, expected_output, duration, total_tokens, execution_ts) VALUES
(4, 2, 'session_2_1', NULL, NULL, 'What is AI?', 'Artificial Intelligence is the simulation of human intelligence by machines.', 2.3, 145, '2025-11-13 12:01:00'),
(5, 2, 'session_2_1', NULL, 6, 'Define Machine Learning.', 'Machine Learning is a subset of AI that enables systems to learn from data.', 2.8, 180, '2025-11-13 12:02:00'),
(6, 2, 'session_2_1', NULL, NULL, 'Explain Neural Networks.', 'Neural Networks are computing systems inspired by biological neural networks.', 3.5, 220, '2025-11-13 12:03:00');

-- Run 3 Executions (QA_Evaluation)
INSERT INTO test_execution (id, run_id, session_id, parent_execution_id, subworkflow_run_id, input, expected_output, duration, total_tokens, execution_ts) VALUES
(7, 3, 'session_3_1', NULL, NULL, 'What is AI?', 'Artificial Intelligence is the simulation of human intelligence by machines.', 2.1, 140, '2025-11-13 14:01:00'),
(8, 3, 'session_3_1', NULL, NULL, 'Define Machine Learning.', 'Machine Learning is a subset of AI that enables systems to learn from data.', 2.9, 190, '2025-11-13 14:02:00'),
(9, 3, 'session_3_1', NULL, NULL, 'Explain Neural Networks.', 'Neural Networks are computing systems inspired by biological neural networks.', 3.8, 240, '2025-11-13 14:03:00');

-- Subworkflow A Executions (Prompt_Tuning - Run 4)
INSERT INTO test_execution (id, run_id, session_id, parent_execution_id, subworkflow_run_id, input, expected_output, duration, total_tokens, execution_ts) VALUES
(10, 4, 'session_4_1', NULL, NULL, 'What is AI? (Tuned Prompt)', 'AI simulates human intelligence in machines.', 2.0, 130, '2025-11-13 10:21:00'),
(11, 4, 'session_4_1', NULL, NULL, 'What is AI? (Tuned Prompt v2)', 'Artificial Intelligence enables machines to mimic human cognition.', 2.2, 135, '2025-11-13 10:22:00');

-- Subworkflow A Executions (Prompt_Tuning - Run 5)
INSERT INTO test_execution (id, run_id, session_id, parent_execution_id, subworkflow_run_id, input, expected_output, duration, total_tokens, execution_ts) VALUES
(12, 5, 'session_5_1', NULL, NULL, 'What is AI? (Tuned Prompt v3)', 'AI is machine-based simulation of human intelligence.', 1.9, 125, '2025-11-13 10:36:00'),
(13, 5, 'session_5_1', NULL, NULL, 'What is AI? (Tuned Prompt v4)', 'Artificial Intelligence replicates human cognitive functions.', 2.1, 128, '2025-11-13 10:37:00');

-- Subworkflow B Executions (Model_Comparison - Run 6)
INSERT INTO test_execution (id, run_id, session_id, parent_execution_id, subworkflow_run_id, input, expected_output, duration, total_tokens, execution_ts) VALUES
(14, 6, 'session_6_1', NULL, NULL, 'Define Machine Learning. (Model: GPT-4)', 'ML allows systems to learn from data without explicit programming.', 2.5, 170, '2025-11-13 12:21:00');

-- ==========================================================
-- TEST RESPONSES
-- ==========================================================
INSERT INTO test_response (test_execution_id, output) VALUES
(1, 'AI refers to computer systems that can perform tasks requiring human-like intelligence.'),
(2, 'ML is a branch of AI focusing on algorithms that improve through experience.'),
(3, 'Neural networks consist of layers of interconnected nodes that process information.'),
(4, 'Artificial Intelligence enables machines to simulate human reasoning and decision-making.'),
(5, 'Machine Learning uses statistical techniques to give computers the ability to learn.'),
(6, 'Neural networks are modeled after the human brain structure.'),
(7, 'AI is technology that mimics human cognitive functions like learning and problem-solving.'),
(8, 'Machine Learning algorithms learn patterns from data to make predictions.'),
(9, 'Neural networks use layered architectures to recognize complex patterns.'),
(10, 'AI simulates human intelligence through computational systems.'),
(11, 'Artificial Intelligence creates smart machines capable of human-like tasks.'),
(12, 'AI technology replicates intelligent human behavior in machines.'),
(13, 'Artificial Intelligence mimics human thought processes in computer systems.'),
(14, 'Machine Learning enables systems to automatically improve from experience.');

-- ==========================================================
-- EVALUATIONS
-- Multiple metrics per execution
-- ==========================================================
-- Run 1 Evaluations
INSERT INTO evaluation (test_execution_id, type, metric_name, metric_value, metric_reason) VALUES
(1, 'similarity', 'accuracy', 0.85, 'Good coverage of key concepts'),
(1, 'similarity', 'relevance', 0.90, 'Highly relevant to the question'),
(2, 'similarity', 'accuracy', 0.78, 'Covers main points but lacks depth'),
(2, 'similarity', 'relevance', 0.88, 'Relevant explanation'),
(3, 'similarity', 'accuracy', 0.72, 'Basic explanation provided'),
(3, 'similarity', 'relevance', 0.85, 'On-topic response');

-- Run 2 Evaluations
INSERT INTO evaluation (test_execution_id, type, metric_name, metric_value, metric_reason) VALUES
(4, 'similarity', 'accuracy', 0.88, 'Excellent definition with clear reasoning'),
(4, 'similarity', 'relevance', 0.92, 'Very relevant and comprehensive'),
(5, 'similarity', 'accuracy', 0.82, 'Good explanation with statistical focus'),
(5, 'similarity', 'relevance', 0.89, 'Relevant technical explanation'),
(6, 'similarity', 'accuracy', 0.75, 'Simplified but accurate'),
(6, 'similarity', 'relevance', 0.87, 'Appropriately focused');

-- Run 3 Evaluations
INSERT INTO evaluation (test_execution_id, type, metric_name, metric_value, metric_reason) VALUES
(7, 'similarity', 'accuracy', 0.92, 'Precise and comprehensive definition'),
(7, 'similarity', 'relevance', 0.95, 'Exceptionally relevant'),
(8, 'similarity', 'accuracy', 0.86, 'Strong technical accuracy'),
(8, 'similarity', 'relevance', 0.91, 'Highly relevant and clear'),
(9, 'similarity', 'accuracy', 0.80, 'Good pattern recognition focus'),
(9, 'similarity', 'relevance', 0.88, 'Relevant architectural explanation');

-- Subworkflow A Evaluations (Prompt_Tuning)
INSERT INTO evaluation (test_execution_id, type, metric_name, metric_value, metric_reason) VALUES
(10, 'similarity', 'accuracy', 0.90, 'Concise and accurate'),
(10, 'similarity', 'relevance', 0.93, 'Well-tuned response'),
(11, 'similarity', 'accuracy', 0.87, 'Good cognitive focus'),
(11, 'similarity', 'relevance', 0.91, 'Relevant mimic terminology'),
(12, 'similarity', 'accuracy', 0.89, 'Clear simulation focus'),
(12, 'similarity', 'relevance', 0.92, 'Well-articulated'),
(13, 'similarity', 'accuracy', 0.91, 'Strong cognitive function emphasis'),
(13, 'similarity', 'relevance', 0.94, 'Highly relevant replication concept');

-- Subworkflow B Evaluations (Model_Comparison)
INSERT INTO evaluation (test_execution_id, type, metric_name, metric_value, metric_reason) VALUES
(14, 'similarity', 'accuracy', 0.84, 'Good technical explanation'),
(14, 'similarity', 'relevance', 0.90, 'Relevant model comparison result');

-- Reset sequence counters
SELECT setval('test_run_id_seq', (SELECT MAX(id) FROM test_run));
SELECT setval('test_execution_id_seq', (SELECT MAX(id) FROM test_execution));
SELECT setval('test_response_id_seq', (SELECT MAX(id) FROM test_response));
SELECT setval('evaluation_id_seq', (SELECT MAX(id) FROM evaluation));
