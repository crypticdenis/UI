-- Clear existing data
TRUNCATE TABLE evaluation.evaluation, evaluation.test_response, evaluation.test_execution, evaluation.test_run RESTART IDENTITY CASCADE;

-- ========================================
-- TEST RUN 1: RE Butler Workflow (Main)
-- 7 test questions, direct testing
-- ========================================
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (1, 'RE_Butler', '2025-11-13 10:00:00', '2025-11-13 10:15:00', '2025-11-13 09:55:00');

-- Executions for Run 1 (all direct tests, no parent_execution_id)
INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES 
(1, 1, 'RE_Butler', 'session_001', NULL, 'What is artificial intelligence?', 'AI is the simulation of human intelligence...', 2.5, 150, '2025-11-13 10:00:00'),
(2, 1, 'RE_Butler', 'session_002', NULL, 'Explain machine learning', 'Machine learning is a subset of AI...', 3.2, 180, '2025-11-13 10:02:00'),
(3, 1, 'RE_Butler', 'session_003', NULL, 'What are neural networks?', 'Neural networks are computing systems...', 2.8, 165, '2025-11-13 10:04:00'),
(4, 1, 'RE_Butler', 'session_004', NULL, 'Define deep learning', 'Deep learning is a subset of machine learning...', 3.0, 175, '2025-11-13 10:06:00'),
(5, 1, 'RE_Butler', 'session_005', NULL, 'What is natural language processing?', 'NLP is a branch of AI...', 2.6, 160, '2025-11-13 10:08:00'),
(6, 1, 'RE_Butler', 'session_006', NULL, 'Explain computer vision', 'Computer vision enables computers to interpret visual data...', 2.9, 170, '2025-11-13 10:10:00'),
(7, 1, 'RE_Butler', 'session_007', NULL, 'What is reinforcement learning?', 'Reinforcement learning is a type of ML...', 3.1, 185, '2025-11-13 10:12:00');

-- Responses for Run 1
INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES 
(1, 'Artificial Intelligence (AI) refers to the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction.'),
(2, 'Machine Learning is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.'),
(3, 'Neural networks are a series of algorithms that endeavor to recognize underlying relationships in a set of data through a process that mimics the way the human brain operates.'),
(4, 'Deep Learning is a subset of machine learning in artificial intelligence that has networks capable of learning unsupervised from data that is unstructured or unlabeled.'),
(5, 'Natural Language Processing (NLP) is a branch of AI that helps computers understand, interpret and manipulate human language.'),
(6, 'Computer vision is an interdisciplinary field that deals with how computers can gain high-level understanding from digital images or videos.'),
(7, 'Reinforcement learning is a type of machine learning where an agent learns to make decisions by performing actions and receiving rewards or penalties.');

-- Evaluations for Run 1
INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES 
-- Execution 1 evaluations
(1, 'RE_Butler', 'accuracy', 0.92, 'Comprehensive definition covering key aspects'),
(1, 'RE_Butler', 'relevance', 0.95, 'Highly relevant to the question'),
(1, 'RE_Butler', 'completeness', 0.88, 'Good coverage but could include more examples'),
-- Execution 2 evaluations
(2, 'RE_Butler', 'accuracy', 0.90, 'Correct definition with good explanation'),
(2, 'RE_Butler', 'relevance', 0.94, 'Directly answers the question'),
(2, 'RE_Butler', 'completeness', 0.85, 'Could benefit from more detail'),
-- Execution 3 evaluations
(3, 'RE_Butler', 'accuracy', 0.88, 'Good analogy to brain function'),
(3, 'RE_Butler', 'relevance', 0.92, 'Relevant explanation'),
(3, 'RE_Butler', 'completeness', 0.80, 'Basic explanation, lacks depth'),
-- Execution 4 evaluations
(4, 'RE_Butler', 'accuracy', 0.91, 'Accurate description of deep learning'),
(4, 'RE_Butler', 'relevance', 0.93, 'Very relevant'),
(4, 'RE_Butler', 'completeness', 0.87, 'Good but could expand on applications'),
-- Execution 5 evaluations
(5, 'RE_Butler', 'accuracy', 0.89, 'Clear and accurate'),
(5, 'RE_Butler', 'relevance', 0.96, 'Excellent relevance'),
(5, 'RE_Butler', 'completeness', 0.83, 'Solid overview'),
-- Execution 6 evaluations
(6, 'RE_Butler', 'accuracy', 0.87, 'Good technical explanation'),
(6, 'RE_Butler', 'relevance', 0.90, 'Relevant to query'),
(6, 'RE_Butler', 'completeness', 0.82, 'Could include more use cases'),
-- Execution 7 evaluations
(7, 'RE_Butler', 'accuracy', 0.93, 'Excellent definition'),
(7, 'RE_Butler', 'relevance', 0.94, 'Highly relevant'),
(7, 'RE_Butler', 'completeness', 0.89, 'Comprehensive explanation');

-- ========================================
-- TEST RUN 2: RE Butler Workflow (Main)
-- Same 7 questions, different model version
-- ========================================
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (2, 'RE_Butler', '2025-11-13 11:00:00', '2025-11-13 11:14:00', '2025-11-13 10:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES 
(8, 2, 'RE_Butler', 'session_008', NULL, 'What is artificial intelligence?', 'AI is the simulation of human intelligence...', 2.3, 145, '2025-11-13 11:00:00'),
(9, 2, 'RE_Butler', 'session_009', NULL, 'Explain machine learning', 'Machine learning is a subset of AI...', 3.0, 170, '2025-11-13 11:02:00'),
(10, 2, 'RE_Butler', 'session_010', NULL, 'What are neural networks?', 'Neural networks are computing systems...', 2.7, 160, '2025-11-13 11:04:00'),
(11, 2, 'RE_Butler', 'session_011', NULL, 'Define deep learning', 'Deep learning is a subset of machine learning...', 2.9, 168, '2025-11-13 11:06:00'),
(12, 2, 'RE_Butler', 'session_012', NULL, 'What is natural language processing?', 'NLP is a branch of AI...', 2.5, 155, '2025-11-13 11:08:00'),
(13, 2, 'RE_Butler', 'session_013', NULL, 'Explain computer vision', 'Computer vision enables computers to interpret visual data...', 2.8, 165, '2025-11-13 11:10:00'),
(14, 2, 'RE_Butler', 'session_014', NULL, 'What is reinforcement learning?', 'Reinforcement learning is a type of ML...', 3.2, 180, '2025-11-13 11:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES 
(8, 'AI represents the capability of machines to mimic human cognitive functions such as learning and problem-solving.'),
(9, 'Machine Learning allows computers to learn patterns from data and make predictions without explicit programming.'),
(10, 'Neural networks are computational models inspired by biological neural networks in the human brain.'),
(11, 'Deep Learning uses multi-layered neural networks to progressively extract higher-level features from raw input.'),
(12, 'NLP enables machines to read, understand, and derive meaning from human languages.'),
(13, 'Computer vision trains computers to interpret and understand the visual world using digital images and deep learning.'),
(14, 'Reinforcement learning trains agents to make sequences of decisions by rewarding desired behaviors.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES 
(8, 'RE_Butler', 'accuracy', 0.90, 'Good definition, slightly less detailed'),
(8, 'RE_Butler', 'relevance', 0.93, 'Very relevant'),
(8, 'RE_Butler', 'completeness', 0.85, 'Concise but complete'),
(9, 'RE_Butler', 'accuracy', 0.88, 'Accurate but could be more detailed'),
(9, 'RE_Butler', 'relevance', 0.92, 'Relevant answer'),
(9, 'RE_Butler', 'completeness', 0.82, 'Good overview'),
(10, 'RE_Butler', 'accuracy', 0.91, 'Strong biological analogy'),
(10, 'RE_Butler', 'relevance', 0.94, 'Highly relevant'),
(10, 'RE_Butler', 'completeness', 0.86, 'Good explanation'),
(11, 'RE_Butler', 'accuracy', 0.93, 'Excellent technical accuracy'),
(11, 'RE_Butler', 'relevance', 0.95, 'Very relevant'),
(11, 'RE_Butler', 'completeness', 0.90, 'Comprehensive'),
(12, 'RE_Butler', 'accuracy', 0.89, 'Clear and accurate'),
(12, 'RE_Butler', 'relevance', 0.94, 'Highly relevant'),
(12, 'RE_Butler', 'completeness', 0.84, 'Good coverage'),
(13, 'RE_Butler', 'accuracy', 0.92, 'Excellent definition with context'),
(13, 'RE_Butler', 'relevance', 0.96, 'Very relevant'),
(13, 'RE_Butler', 'completeness', 0.88, 'Well explained'),
(14, 'RE_Butler', 'accuracy', 0.94, 'Excellent definition'),
(14, 'RE_Butler', 'relevance', 0.95, 'Highly relevant'),
(14, 'RE_Butler', 'completeness', 0.91, 'Comprehensive explanation');



-- ========================================
-- SUB-EXECUTIONS: RAG_Search calls made DURING RE_Butler execution
-- These represent the hierarchy: RE_Butler (main) -> RAG_Search (sub)
-- They belong to the same run_id but have workflow_id='RAG_Search'
-- parent_execution_id links to the RE_Butler execution that triggered them
-- ========================================

-- Run 1 Sub-executions: RAG_Search calls during various RE_Butler tests
INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES 
-- Sub-execution for Execution 2 (Machine Learning question)
(15, 1, 'RAG_Search', 'session_002_rag', 2, 'Search: machine learning papers', 'RAG retrieval for ML context', 0.5, 40, '2025-11-13 10:03:05'),
-- Sub-execution for Execution 3 (Neural Networks question)
(16, 1, 'RAG_Search', 'session_003_rag', 3, 'Search: neural network architectures', 'RAG retrieval for NN context', 0.6, 45, '2025-11-13 10:05:10'),
-- Sub-execution for Execution 5 (NLP question)
(17, 1, 'RAG_Search', 'session_005_rag', 5, 'Search: NLP techniques', 'RAG retrieval for NLP context', 0.4, 35, '2025-11-13 10:09:08');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES 
(15, 'Retrieved 8 machine learning papers and documentation covering supervised/unsupervised learning'),
(16, 'Found 6 neural network architecture diagrams and implementation guides'),
(17, 'Retrieved 5 NLP technique papers covering tokenization, embeddings, and transformers');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES 
(15, 'RAG_Search', 'retrieval_accuracy', 0.91, 'Retrieved highly relevant ML documents'),
(15, 'RAG_Search', 'retrieval_speed', 0.95, 'Fast retrieval time'),
(15, 'RAG_Search', 'relevance', 0.89, 'Good contextual relevance'),
(16, 'RAG_Search', 'retrieval_accuracy', 0.93, 'Excellent architectural resources'),
(16, 'RAG_Search', 'retrieval_speed', 0.92, 'Good response time'),
(16, 'RAG_Search', 'relevance', 0.94, 'Highly relevant to query'),
(17, 'RAG_Search', 'retrieval_accuracy', 0.88, 'Good NLP resources'),
(17, 'RAG_Search', 'retrieval_speed', 0.97, 'Very fast retrieval'),
(17, 'RAG_Search', 'relevance', 0.90, 'Relevant NLP content');

-- Run 2 Sub-executions: RAG_Search calls during RE_Butler tests
INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES 
-- Sub-execution for Execution 9 (Machine Learning question)
(18, 2, 'RAG_Search', 'session_009_rag', 9, 'Search: ML algorithms', 'RAG retrieval for ML context', 0.5, 42, '2025-11-13 11:03:12'),
-- Sub-execution for Execution 11 (Deep Learning question)  
(19, 2, 'RAG_Search', 'session_011_rag', 11, 'Search: deep learning frameworks', 'RAG retrieval for DL context', 0.7, 50, '2025-11-13 11:07:15'),
-- Sub-execution for Execution 13 (Computer Vision question)
(20, 2, 'RAG_Search', 'session_013_rag', 13, 'Search: computer vision techniques', 'RAG retrieval for CV context', 0.6, 48, '2025-11-13 11:11:18'),
-- Sub-execution for Execution 14 (Reinforcement Learning question)
(21, 2, 'RAG_Search', 'session_014_rag', 14, 'Search: RL algorithms', 'RAG retrieval for RL context', 0.5, 44, '2025-11-13 11:13:20');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES 
(18, 'Retrieved 7 ML algorithm implementations and comparison studies'),
(19, 'Found 9 deep learning framework documentations (PyTorch, TensorFlow, JAX)'),
(20, 'Retrieved 10 computer vision technique papers covering CNNs, object detection, segmentation'),
(21, 'Found 6 reinforcement learning algorithm papers covering Q-learning, policy gradients, actor-critic');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES 
(18, 'RAG_Search', 'retrieval_accuracy', 0.90, 'Good ML algorithm resources'),
(18, 'RAG_Search', 'retrieval_speed', 0.94, 'Fast retrieval'),
(18, 'RAG_Search', 'relevance', 0.88, 'Relevant algorithm content'),
(19, 'RAG_Search', 'retrieval_accuracy', 0.95, 'Excellent framework documentation'),
(19, 'RAG_Search', 'retrieval_speed', 0.89, 'Acceptable speed'),
(19, 'RAG_Search', 'relevance', 0.96, 'Highly relevant frameworks'),
(20, 'RAG_Search', 'retrieval_accuracy', 0.92, 'Comprehensive CV techniques'),
(20, 'RAG_Search', 'retrieval_speed', 0.93, 'Good response time'),
(20, 'RAG_Search', 'relevance', 0.94, 'Highly relevant CV content'),
(21, 'RAG_Search', 'retrieval_accuracy', 0.91, 'Strong RL algorithm coverage'),
(21, 'RAG_Search', 'retrieval_speed', 0.95, 'Fast retrieval'),
(21, 'RAG_Search', 'relevance', 0.92, 'Relevant RL content');

-- ========================================
-- TEST RUN 3: RAG_Search Workflow (Standalone)
-- RAG_Search as its own workflow with dedicated tests
-- This shows RAG_Search can be tested independently
-- ========================================
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (3, 'RAG_Search', '2025-11-13 15:00:00', '2025-11-13 15:08:00', '2025-11-13 14:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES 
(22, 3, 'RAG_Search', 'session_022', NULL, 'Find documents about transformers', 'Retrieved transformer papers', 1.2, 80, '2025-11-13 15:00:00'),
(23, 3, 'RAG_Search', 'session_023', NULL, 'Search for attention mechanisms', 'Found attention papers', 1.4, 90, '2025-11-13 15:02:00'),
(24, 3, 'RAG_Search', 'session_024', NULL, 'Retrieve BERT documentation', 'Located BERT resources', 1.1, 75, '2025-11-13 15:04:00'),
(25, 3, 'RAG_Search', 'session_025', NULL, 'Find GPT architecture papers', 'Retrieved GPT papers', 1.3, 85, '2025-11-13 15:05:00'),
(26, 3, 'RAG_Search', 'session_026', NULL, 'Search vector databases', 'Found vector DB docs', 1.0, 70, '2025-11-13 15:06:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES 
(22, 'Retrieved 12 papers on transformer architecture including attention mechanisms and positional encoding'),
(23, 'Found 8 papers detailing self-attention, multi-head attention, and cross-attention mechanisms'),
(24, 'Located comprehensive BERT documentation including pre-training strategies and fine-tuning guides'),
(25, 'Retrieved 10 GPT architecture papers covering GPT-1 through GPT-4 evolution'),
(26, 'Found documentation for Pinecone, Weaviate, Milvus, and FAISS vector databases');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES 
(22, 'RAG_Search', 'retrieval_accuracy', 0.96, 'Excellent transformer paper selection'),
(22, 'RAG_Search', 'retrieval_speed', 0.94, 'Fast retrieval'),
(22, 'RAG_Search', 'precision', 0.95, 'Highly precise results'),
(23, 'RAG_Search', 'retrieval_accuracy', 0.94, 'Comprehensive attention mechanism coverage'),
(23, 'RAG_Search', 'retrieval_speed', 0.91, 'Good speed'),
(23, 'RAG_Search', 'precision', 0.93, 'Precise and relevant'),
(24, 'RAG_Search', 'retrieval_accuracy', 0.97, 'Excellent BERT resource quality'),
(24, 'RAG_Search', 'retrieval_speed', 0.96, 'Very fast'),
(24, 'RAG_Search', 'precision', 0.98, 'Highly precise'),
(25, 'RAG_Search', 'retrieval_accuracy', 0.95, 'Comprehensive GPT coverage'),
(25, 'RAG_Search', 'retrieval_speed', 0.93, 'Good retrieval time'),
(25, 'RAG_Search', 'precision', 0.94, 'Precise results'),
(26, 'RAG_Search', 'retrieval_accuracy', 0.93, 'Good vector DB documentation'),
(26, 'RAG_Search', 'retrieval_speed', 0.97, 'Very fast'),
(26, 'RAG_Search', 'precision', 0.92, 'Relevant resources');

-- Reset sequence to continue from max ID
SELECT setval('evaluation.test_run_id_seq', (SELECT MAX(id) FROM evaluation.test_run));
SELECT setval('evaluation.test_execution_id_seq', (SELECT MAX(id) FROM evaluation.test_execution));
SELECT setval('evaluation.test_response_id_seq', (SELECT MAX(id) FROM evaluation.test_response));
SELECT setval('evaluation.evaluation_id_seq', (SELECT MAX(id) FROM evaluation.evaluation));
