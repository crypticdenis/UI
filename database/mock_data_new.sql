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

-- ========================================
-- ADDITIONAL TEST RUNS FOR TREND VISUALIZATION
-- More runs with varying performance over time
-- ========================================

-- Run 4: Performance improvement
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (4, 'RE_Butler', '2025-11-13 14:00:00', '2025-11-13 14:12:00', '2025-11-13 13:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES 
(27, 4, 'RE_Butler', 'session_027', NULL, 'What is artificial intelligence?', 'AI is the simulation...', 2.1, 140, '2025-11-13 14:00:00'),
(28, 4, 'RE_Butler', 'session_028', NULL, 'Explain machine learning', 'ML is a subset...', 2.8, 165, '2025-11-13 14:02:00'),
(29, 4, 'RE_Butler', 'session_029', NULL, 'What are neural networks?', 'NNs are computing...', 2.5, 155, '2025-11-13 14:04:00'),
(30, 4, 'RE_Butler', 'session_030', NULL, 'Define deep learning', 'DL is a subset...', 2.7, 160, '2025-11-13 14:06:00'),
(31, 4, 'RE_Butler', 'session_031', NULL, 'What is natural language processing?', 'NLP is a branch...', 2.4, 150, '2025-11-13 14:08:00'),
(32, 4, 'RE_Butler', 'session_032', NULL, 'Explain computer vision', 'CV enables...', 2.6, 158, '2025-11-13 14:10:00'),
(33, 4, 'RE_Butler', 'session_033', NULL, 'What is reinforcement learning?', 'RL is a type...', 2.9, 170, '2025-11-13 14:11:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES 
(27, 'AI is the capability of machines to imitate intelligent human behavior through advanced algorithms and neural networks.'),
(28, 'Machine Learning enables systems to automatically improve through experience and data analysis without explicit programming.'),
(29, 'Neural networks are interconnected computing systems inspired by biological neurons that process information in layers.'),
(30, 'Deep Learning utilizes multiple layers of neural networks to extract increasingly abstract features from raw data.'),
(31, 'Natural Language Processing empowers machines to understand, interpret, and generate human language meaningfully.'),
(32, 'Computer vision allows computers to derive meaningful information from visual inputs using deep learning techniques.'),
(33, 'Reinforcement learning trains intelligent agents through trial-and-error interactions with environments to maximize rewards.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES 
(27, 'RE_Butler', 'accuracy', 0.94, 'Excellent comprehensive definition'),
(27, 'RE_Butler', 'relevance', 0.96, 'Highly relevant with good detail'),
(27, 'RE_Butler', 'completeness', 0.91, 'Comprehensive with examples'),
(28, 'RE_Butler', 'accuracy', 0.92, 'Strong explanation with clarity'),
(28, 'RE_Butler', 'relevance', 0.95, 'Very relevant answer'),
(28, 'RE_Butler', 'completeness', 0.89, 'Good coverage of concepts'),
(29, 'RE_Butler', 'accuracy', 0.93, 'Excellent technical detail'),
(29, 'RE_Butler', 'relevance', 0.94, 'Highly relevant'),
(29, 'RE_Butler', 'completeness', 0.90, 'Well-rounded explanation'),
(30, 'RE_Butler', 'accuracy', 0.95, 'Outstanding accuracy'),
(30, 'RE_Butler', 'relevance', 0.97, 'Extremely relevant'),
(30, 'RE_Butler', 'completeness', 0.93, 'Comprehensive coverage'),
(31, 'RE_Butler', 'accuracy', 0.91, 'Accurate and clear'),
(31, 'RE_Butler', 'relevance', 0.95, 'Very relevant'),
(31, 'RE_Butler', 'completeness', 0.88, 'Good explanation'),
(32, 'RE_Butler', 'accuracy', 0.94, 'Excellent definition'),
(32, 'RE_Butler', 'relevance', 0.96, 'Highly relevant with context'),
(32, 'RE_Butler', 'completeness', 0.92, 'Comprehensive answer'),
(33, 'RE_Butler', 'accuracy', 0.96, 'Outstanding technical accuracy'),
(33, 'RE_Butler', 'relevance', 0.97, 'Extremely relevant'),
(33, 'RE_Butler', 'completeness', 0.94, 'Very comprehensive');

-- Run 5: Slight performance dip
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (5, 'RE_Butler', '2025-11-13 16:00:00', '2025-11-13 16:13:00', '2025-11-13 15:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES 
(34, 5, 'RE_Butler', 'session_034', NULL, 'What is artificial intelligence?', 'AI is the simulation...', 2.4, 148, '2025-11-13 16:00:00'),
(35, 5, 'RE_Butler', 'session_035', NULL, 'Explain machine learning', 'ML is a subset...', 3.1, 175, '2025-11-13 16:02:00'),
(36, 5, 'RE_Butler', 'session_036', NULL, 'What are neural networks?', 'NNs are computing...', 2.8, 162, '2025-11-13 16:04:00'),
(37, 5, 'RE_Butler', 'session_037', NULL, 'Define deep learning', 'DL is a subset...', 2.9, 168, '2025-11-13 16:06:00'),
(38, 5, 'RE_Butler', 'session_038', NULL, 'What is natural language processing?', 'NLP is a branch...', 2.6, 157, '2025-11-13 16:08:00'),
(39, 5, 'RE_Butler', 'session_039', NULL, 'Explain computer vision', 'CV enables...', 2.7, 163, '2025-11-13 16:10:00'),
(40, 5, 'RE_Butler', 'session_040', NULL, 'What is reinforcement learning?', 'RL is a type...', 3.0, 178, '2025-11-13 16:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES 
(34, 'AI simulates human intelligence in machines for learning and problem-solving tasks.'),
(35, 'Machine Learning allows systems to learn from data patterns automatically.'),
(36, 'Neural networks process information through interconnected nodes similar to brain neurons.'),
(37, 'Deep Learning uses layered networks to analyze complex data patterns.'),
(38, 'NLP enables computers to work with human language data effectively.'),
(39, 'Computer vision helps machines interpret visual information from images and videos.'),
(40, 'Reinforcement learning uses rewards to train decision-making systems.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES 
(34, 'RE_Butler', 'accuracy', 0.89, 'Good but somewhat simplified'),
(34, 'RE_Butler', 'relevance', 0.92, 'Relevant answer'),
(34, 'RE_Butler', 'completeness', 0.84, 'Lacks some depth'),
(35, 'RE_Butler', 'accuracy', 0.87, 'Accurate but brief'),
(35, 'RE_Butler', 'relevance', 0.91, 'Relevant'),
(35, 'RE_Butler', 'completeness', 0.81, 'Could be more detailed'),
(36, 'RE_Butler', 'accuracy', 0.90, 'Good technical accuracy'),
(36, 'RE_Butler', 'relevance', 0.93, 'Very relevant'),
(36, 'RE_Butler', 'completeness', 0.86, 'Decent coverage'),
(37, 'RE_Butler', 'accuracy', 0.91, 'Strong explanation'),
(37, 'RE_Butler', 'relevance', 0.94, 'Highly relevant'),
(37, 'RE_Butler', 'completeness', 0.88, 'Good detail level'),
(38, 'RE_Butler', 'accuracy', 0.88, 'Accurate but concise'),
(38, 'RE_Butler', 'relevance', 0.92, 'Relevant answer'),
(38, 'RE_Butler', 'completeness', 0.83, 'Basic coverage'),
(39, 'RE_Butler', 'accuracy', 0.90, 'Good definition'),
(39, 'RE_Butler', 'relevance', 0.93, 'Very relevant'),
(39, 'RE_Butler', 'completeness', 0.87, 'Solid explanation'),
(40, 'RE_Butler', 'accuracy', 0.92, 'Strong definition'),
(40, 'RE_Butler', 'relevance', 0.94, 'Highly relevant'),
(40, 'RE_Butler', 'completeness', 0.89, 'Good coverage');

-- Run 6: Recovery and improvement
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (6, 'RE_Butler', '2025-11-14 09:00:00', '2025-11-14 09:11:00', '2025-11-14 08:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES 
(41, 6, 'RE_Butler', 'session_041', NULL, 'What is artificial intelligence?', 'AI is the simulation...', 2.0, 138, '2025-11-14 09:00:00'),
(42, 6, 'RE_Butler', 'session_042', NULL, 'Explain machine learning', 'ML is a subset...', 2.7, 162, '2025-11-14 09:02:00'),
(43, 6, 'RE_Butler', 'session_043', NULL, 'What are neural networks?', 'NNs are computing...', 2.4, 152, '2025-11-14 09:04:00'),
(44, 6, 'RE_Butler', 'session_044', NULL, 'Define deep learning', 'DL is a subset...', 2.6, 158, '2025-11-14 09:06:00'),
(45, 6, 'RE_Butler', 'session_045', NULL, 'What is natural language processing?', 'NLP is a branch...', 2.2, 147, '2025-11-14 09:08:00'),
(46, 6, 'RE_Butler', 'session_046', NULL, 'Explain computer vision', 'CV enables...', 2.5, 156, '2025-11-14 09:09:00'),
(47, 6, 'RE_Butler', 'session_047', NULL, 'What is reinforcement learning?', 'RL is a type...', 2.8, 167, '2025-11-14 09:10:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES 
(41, 'Artificial Intelligence represents sophisticated algorithms enabling machines to perform cognitive tasks typically requiring human intelligence.'),
(42, 'Machine Learning empowers systems to identify patterns, make predictions, and improve performance through data-driven learning.'),
(43, 'Neural networks are computational architectures consisting of interconnected processing nodes that work collectively to solve complex problems.'),
(44, 'Deep Learning leverages multi-layered neural architectures to automatically discover hierarchical feature representations in data.'),
(45, 'Natural Language Processing combines computational linguistics and machine learning to enable intelligent human-computer language interaction.'),
(46, 'Computer vision integrates image processing, pattern recognition, and deep learning to extract semantic understanding from visual data.'),
(47, 'Reinforcement learning optimizes agent behavior through environmental interaction, learning optimal strategies via reward signals.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES 
(41, 'RE_Butler', 'accuracy', 0.97, 'Exceptional technical precision'),
(41, 'RE_Butler', 'relevance', 0.98, 'Extremely relevant and detailed'),
(41, 'RE_Butler', 'completeness', 0.95, 'Outstanding comprehensiveness'),
(42, 'RE_Butler', 'accuracy', 0.96, 'Excellent accuracy'),
(42, 'RE_Butler', 'relevance', 0.97, 'Highly relevant'),
(42, 'RE_Butler', 'completeness', 0.94, 'Very comprehensive'),
(43, 'RE_Butler', 'accuracy', 0.95, 'Strong technical detail'),
(43, 'RE_Butler', 'relevance', 0.96, 'Very relevant'),
(43, 'RE_Butler', 'completeness', 0.93, 'Comprehensive explanation'),
(44, 'RE_Butler', 'accuracy', 0.98, 'Outstanding accuracy'),
(44, 'RE_Butler', 'relevance', 0.99, 'Perfectly relevant'),
(44, 'RE_Butler', 'completeness', 0.96, 'Exceptional coverage'),
(45, 'RE_Butler', 'accuracy', 0.94, 'Excellent definition'),
(45, 'RE_Butler', 'relevance', 0.97, 'Highly relevant'),
(45, 'RE_Butler', 'completeness', 0.92, 'Very good coverage'),
(46, 'RE_Butler', 'accuracy', 0.96, 'Outstanding accuracy'),
(46, 'RE_Butler', 'relevance', 0.98, 'Extremely relevant'),
(46, 'RE_Butler', 'completeness', 0.95, 'Comprehensive answer'),
(47, 'RE_Butler', 'accuracy', 0.97, 'Exceptional precision'),
(47, 'RE_Butler', 'relevance', 0.98, 'Highly relevant'),
(47, 'RE_Butler', 'completeness', 0.96, 'Outstanding detail');

-- Run 7: Continued strong performance
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (7, 'RE_Butler', '2025-11-14 13:00:00', '2025-11-14 13:10:00', '2025-11-14 12:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES 
(48, 7, 'RE_Butler', 'session_048', NULL, 'What is artificial intelligence?', 'AI is the simulation...', 1.9, 135, '2025-11-14 13:00:00'),
(49, 7, 'RE_Butler', 'session_049', NULL, 'Explain machine learning', 'ML is a subset...', 2.6, 160, '2025-11-14 13:02:00'),
(50, 7, 'RE_Butler', 'session_050', NULL, 'What are neural networks?', 'NNs are computing...', 2.3, 150, '2025-11-14 13:04:00'),
(51, 7, 'RE_Butler', 'session_051', NULL, 'Define deep learning', 'DL is a subset...', 2.5, 156, '2025-11-14 13:06:00'),
(52, 7, 'RE_Butler', 'session_052', NULL, 'What is natural language processing?', 'NLP is a branch...', 2.1, 145, '2025-11-14 13:07:00'),
(53, 7, 'RE_Butler', 'session_053', NULL, 'Explain computer vision', 'CV enables...', 2.4, 154, '2025-11-14 13:08:00'),
(54, 7, 'RE_Butler', 'session_054', NULL, 'What is reinforcement learning?', 'RL is a type...', 2.7, 165, '2025-11-14 13:09:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES 
(48, 'AI encompasses advanced computational systems designed to replicate human cognitive abilities including reasoning, learning, and adaptation.'),
(49, 'Machine Learning utilizes statistical algorithms and computational models to enable systems to improve task performance through experience.'),
(50, 'Neural networks employ interconnected computational units organized in layers to process information and recognize complex patterns.'),
(51, 'Deep Learning applies multiple processing layers to extract progressively abstract features, enabling sophisticated pattern recognition.'),
(52, 'Natural Language Processing integrates linguistic theory, statistical methods, and neural networks to facilitate human-machine communication.'),
(53, 'Computer vision synthesizes techniques from image processing, machine learning, and artificial intelligence to interpret visual information.'),
(54, 'Reinforcement learning employs reward-based training paradigms where agents learn optimal decision policies through environmental feedback.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES 
(48, 'RE_Butler', 'accuracy', 0.98, 'Exceptional precision and depth'),
(48, 'RE_Butler', 'relevance', 0.99, 'Perfectly relevant'),
(48, 'RE_Butler', 'completeness', 0.96, 'Outstanding comprehensiveness'),
(49, 'RE_Butler', 'accuracy', 0.97, 'Excellent technical accuracy'),
(49, 'RE_Butler', 'relevance', 0.98, 'Highly relevant'),
(49, 'RE_Butler', 'completeness', 0.95, 'Very comprehensive'),
(50, 'RE_Butler', 'accuracy', 0.96, 'Strong accuracy'),
(50, 'RE_Butler', 'relevance', 0.97, 'Very relevant'),
(50, 'RE_Butler', 'completeness', 0.94, 'Comprehensive'),
(51, 'RE_Butler', 'accuracy', 0.99, 'Nearly perfect accuracy'),
(51, 'RE_Butler', 'relevance', 0.99, 'Extremely relevant'),
(51, 'RE_Butler', 'completeness', 0.97, 'Exceptional detail'),
(52, 'RE_Butler', 'accuracy', 0.95, 'Excellent accuracy'),
(52, 'RE_Butler', 'relevance', 0.98, 'Highly relevant'),
(52, 'RE_Butler', 'completeness', 0.93, 'Very good coverage'),
(53, 'RE_Butler', 'accuracy', 0.97, 'Outstanding accuracy'),
(53, 'RE_Butler', 'relevance', 0.98, 'Extremely relevant'),
(53, 'RE_Butler', 'completeness', 0.96, 'Comprehensive explanation'),
(54, 'RE_Butler', 'accuracy', 0.98, 'Exceptional precision'),
(54, 'RE_Butler', 'relevance', 0.99, 'Perfectly relevant'),
(54, 'RE_Butler', 'completeness', 0.97, 'Outstanding detail');

-- Reset sequence to continue from max ID
SELECT setval('evaluation.test_run_id_seq', (SELECT MAX(id) FROM evaluation.test_run));
SELECT setval('evaluation.test_execution_id_seq', (SELECT MAX(id) FROM evaluation.test_execution));
SELECT setval('evaluation.test_response_id_seq', (SELECT MAX(id) FROM evaluation.test_response));
SELECT setval('evaluation.evaluation_id_seq', (SELECT MAX(id) FROM evaluation.evaluation));

-- Run 8
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (8, 'RE_Butler', '2025-11-14 14:00:00', '2025-11-14 14:15:00', '2025-11-14 13:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(55, 8, 'RE_Butler', 'session_0055', NULL, 'What is artificial intelligence?', 'Expected output...', 2.3, 157, '2025-11-14 14:00:00'),
(56, 8, 'RE_Butler', 'session_0056', NULL, 'Explain machine learning', 'Expected output...', 3.4, 167, '2025-11-14 14:02:00'),
(57, 8, 'RE_Butler', 'session_0057', NULL, 'What are neural networks?', 'Expected output...', 2.5, 168, '2025-11-14 14:04:00'),
(58, 8, 'RE_Butler', 'session_0058', NULL, 'Define deep learning', 'Expected output...', 3.1, 185, '2025-11-14 14:06:00'),
(59, 8, 'RE_Butler', 'session_0059', NULL, 'What is natural language processing?', 'Expected output...', 3.4, 172, '2025-11-14 14:08:00'),
(60, 8, 'RE_Butler', 'session_0060', NULL, 'Explain computer vision', 'Expected output...', 2.7, 157, '2025-11-14 14:10:00'),
(61, 8, 'RE_Butler', 'session_0061', NULL, 'What is reinforcement learning?', 'Expected output...', 2.7, 169, '2025-11-14 14:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(55, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(56, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(57, 'Neural networks are computational architectures with interconnected processing nodes.'),
(58, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(59, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(60, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(61, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(55, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(55, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(55, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(56, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(56, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(56, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(57, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(57, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(57, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(58, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(58, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(58, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(59, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(59, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(59, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(60, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(60, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(60, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(61, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(61, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(61, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation');

-- Run 9
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (9, 'RE_Butler', '2025-11-14 16:00:00', '2025-11-14 16:14:00', '2025-11-14 15:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(62, 9, 'RE_Butler', 'session_0062', NULL, 'What is artificial intelligence?', 'Expected output...', 2.9, 160, '2025-11-14 16:00:00'),
(63, 9, 'RE_Butler', 'session_0063', NULL, 'Explain machine learning', 'Expected output...', 2.5, 161, '2025-11-14 16:02:00'),
(64, 9, 'RE_Butler', 'session_0064', NULL, 'What are neural networks?', 'Expected output...', 3.2, 138, '2025-11-14 16:04:00'),
(65, 9, 'RE_Butler', 'session_0065', NULL, 'Define deep learning', 'Expected output...', 2.8, 149, '2025-11-14 16:06:00'),
(66, 9, 'RE_Butler', 'session_0066', NULL, 'What is natural language processing?', 'Expected output...', 2.2, 168, '2025-11-14 16:08:00'),
(67, 9, 'RE_Butler', 'session_0067', NULL, 'Explain computer vision', 'Expected output...', 3.1, 169, '2025-11-14 16:10:00'),
(68, 9, 'RE_Butler', 'session_0068', NULL, 'What is reinforcement learning?', 'Expected output...', 3.1, 169, '2025-11-14 16:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(62, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(63, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(64, 'Neural networks are computational architectures with interconnected processing nodes.'),
(65, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(66, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(67, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(68, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(62, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(62, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(62, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(63, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(63, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(63, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(64, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(64, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(64, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(65, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(65, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(65, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(66, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(66, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(66, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(67, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(67, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(67, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(68, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(68, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(68, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation');

-- Run 10
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (10, 'RE_Butler', '2025-11-14 18:00:00', '2025-11-14 18:12:00', '2025-11-14 17:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(69, 10, 'RE_Butler', 'session_0069', NULL, 'What is artificial intelligence?', 'Expected output...', 2.8, 141, '2025-11-14 18:00:00'),
(70, 10, 'RE_Butler', 'session_0070', NULL, 'Explain machine learning', 'Expected output...', 3.2, 140, '2025-11-14 18:02:00'),
(71, 10, 'RE_Butler', 'session_0071', NULL, 'What are neural networks?', 'Expected output...', 2.9, 168, '2025-11-14 18:04:00'),
(72, 10, 'RE_Butler', 'session_0072', NULL, 'Define deep learning', 'Expected output...', 3.1, 156, '2025-11-14 18:06:00'),
(73, 10, 'RE_Butler', 'session_0073', NULL, 'What is natural language processing?', 'Expected output...', 2.2, 179, '2025-11-14 18:08:00'),
(74, 10, 'RE_Butler', 'session_0074', NULL, 'Explain computer vision', 'Expected output...', 3.4, 147, '2025-11-14 18:10:00'),
(75, 10, 'RE_Butler', 'session_0075', NULL, 'What is reinforcement learning?', 'Expected output...', 2.2, 163, '2025-11-14 18:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(69, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(70, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(71, 'Neural networks are computational architectures with interconnected processing nodes.'),
(72, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(73, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(74, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(75, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(69, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(69, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(69, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(70, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(70, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(70, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(71, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(71, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(71, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(72, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(72, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(72, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(73, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(73, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(73, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(74, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(74, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(74, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(75, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(75, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(75, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation');

-- Run 11
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (11, 'RE_Butler', '2025-11-14 20:00:00', '2025-11-14 20:13:00', '2025-11-14 19:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(76, 11, 'RE_Butler', 'session_0076', NULL, 'What is artificial intelligence?', 'Expected output...', 3.2, 148, '2025-11-14 20:00:00'),
(77, 11, 'RE_Butler', 'session_0077', NULL, 'Explain machine learning', 'Expected output...', 2.7, 149, '2025-11-14 20:02:00'),
(78, 11, 'RE_Butler', 'session_0078', NULL, 'What are neural networks?', 'Expected output...', 2.3, 136, '2025-11-14 20:04:00'),
(79, 11, 'RE_Butler', 'session_0079', NULL, 'Define deep learning', 'Expected output...', 3.1, 182, '2025-11-14 20:06:00'),
(80, 11, 'RE_Butler', 'session_0080', NULL, 'What is natural language processing?', 'Expected output...', 2.4, 165, '2025-11-14 20:08:00'),
(81, 11, 'RE_Butler', 'session_0081', NULL, 'Explain computer vision', 'Expected output...', 3.0, 158, '2025-11-14 20:10:00'),
(82, 11, 'RE_Butler', 'session_0082', NULL, 'What is reinforcement learning?', 'Expected output...', 2.0, 135, '2025-11-14 20:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(76, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(77, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(78, 'Neural networks are computational architectures with interconnected processing nodes.'),
(79, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(80, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(81, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(82, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(76, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(76, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(76, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(77, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(77, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(77, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(78, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(78, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(78, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(79, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(79, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(79, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(80, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(80, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(80, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(81, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(81, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(81, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(82, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(82, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(82, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation');

-- Run 12
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (12, 'RE_Butler', '2025-11-14 22:00:00', '2025-11-14 22:14:00', '2025-11-14 21:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(83, 12, 'RE_Butler', 'session_0083', NULL, 'What is artificial intelligence?', 'Expected output...', 2.8, 152, '2025-11-14 22:00:00'),
(84, 12, 'RE_Butler', 'session_0084', NULL, 'Explain machine learning', 'Expected output...', 3.1, 179, '2025-11-14 22:02:00'),
(85, 12, 'RE_Butler', 'session_0085', NULL, 'What are neural networks?', 'Expected output...', 3.3, 185, '2025-11-14 22:04:00'),
(86, 12, 'RE_Butler', 'session_0086', NULL, 'Define deep learning', 'Expected output...', 2.0, 159, '2025-11-14 22:06:00'),
(87, 12, 'RE_Butler', 'session_0087', NULL, 'What is natural language processing?', 'Expected output...', 2.5, 158, '2025-11-14 22:08:00'),
(88, 12, 'RE_Butler', 'session_0088', NULL, 'Explain computer vision', 'Expected output...', 3.4, 145, '2025-11-14 22:10:00'),
(89, 12, 'RE_Butler', 'session_0089', NULL, 'What is reinforcement learning?', 'Expected output...', 3.2, 168, '2025-11-14 22:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(83, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(84, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(85, 'Neural networks are computational architectures with interconnected processing nodes.'),
(86, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(87, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(88, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(89, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(83, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(83, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(83, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(84, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(84, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(84, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(85, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(85, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(85, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(86, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(86, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(86, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(87, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(87, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(87, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(88, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(88, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(88, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(89, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(89, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(89, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation');

-- Run 13
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (13, 'RE_Butler', '2025-11-15 00:00:00', '2025-11-15 00:15:00', '2025-11-14 23:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(90, 13, 'RE_Butler', 'session_0090', NULL, 'What is artificial intelligence?', 'Expected output...', 2.5, 176, '2025-11-15 00:00:00'),
(91, 13, 'RE_Butler', 'session_0091', NULL, 'Explain machine learning', 'Expected output...', 2.3, 153, '2025-11-15 00:02:00'),
(92, 13, 'RE_Butler', 'session_0092', NULL, 'What are neural networks?', 'Expected output...', 2.3, 150, '2025-11-15 00:04:00'),
(93, 13, 'RE_Butler', 'session_0093', NULL, 'Define deep learning', 'Expected output...', 2.5, 162, '2025-11-15 00:06:00'),
(94, 13, 'RE_Butler', 'session_0094', NULL, 'What is natural language processing?', 'Expected output...', 2.6, 179, '2025-11-15 00:08:00'),
(95, 13, 'RE_Butler', 'session_0095', NULL, 'Explain computer vision', 'Expected output...', 2.3, 146, '2025-11-15 00:10:00'),
(96, 13, 'RE_Butler', 'session_0096', NULL, 'What is reinforcement learning?', 'Expected output...', 2.3, 135, '2025-11-15 00:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(90, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(91, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(92, 'Neural networks are computational architectures with interconnected processing nodes.'),
(93, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(94, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(95, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(96, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(90, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(90, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(90, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(91, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(91, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(91, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(92, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(92, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(92, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(93, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(93, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(93, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(94, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(94, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(94, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(95, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(95, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(95, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(96, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(96, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(96, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation');

-- Run 14
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (14, 'RE_Butler', '2025-11-15 02:00:00', '2025-11-15 02:14:00', '2025-11-15 01:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(97, 14, 'RE_Butler', 'session_0097', NULL, 'What is artificial intelligence?', 'Expected output...', 3.1, 145, '2025-11-15 02:00:00'),
(98, 14, 'RE_Butler', 'session_0098', NULL, 'Explain machine learning', 'Expected output...', 2.9, 173, '2025-11-15 02:02:00'),
(99, 14, 'RE_Butler', 'session_0099', NULL, 'What are neural networks?', 'Expected output...', 3.4, 140, '2025-11-15 02:04:00'),
(100, 14, 'RE_Butler', 'session_0100', NULL, 'Define deep learning', 'Expected output...', 2.0, 147, '2025-11-15 02:06:00'),
(101, 14, 'RE_Butler', 'session_0101', NULL, 'What is natural language processing?', 'Expected output...', 3.1, 167, '2025-11-15 02:08:00'),
(102, 14, 'RE_Butler', 'session_0102', NULL, 'Explain computer vision', 'Expected output...', 2.9, 137, '2025-11-15 02:10:00'),
(103, 14, 'RE_Butler', 'session_0103', NULL, 'What is reinforcement learning?', 'Expected output...', 2.4, 140, '2025-11-15 02:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(97, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(98, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(99, 'Neural networks are computational architectures with interconnected processing nodes.'),
(100, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(101, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(102, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(103, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(97, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(97, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(97, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(98, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(98, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(98, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(99, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(99, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(99, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(100, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(100, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(100, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(101, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(101, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(101, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(102, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(102, 'RE_Butler', 'relevance', 0.86, 'Generated test evaluation'),
(102, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(103, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(103, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(103, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation');

-- Run 15
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (15, 'RE_Butler', '2025-11-15 04:00:00', '2025-11-15 04:11:00', '2025-11-15 03:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(104, 15, 'RE_Butler', 'session_0104', NULL, 'What is artificial intelligence?', 'Expected output...', 2.3, 159, '2025-11-15 04:00:00'),
(105, 15, 'RE_Butler', 'session_0105', NULL, 'Explain machine learning', 'Expected output...', 2.5, 182, '2025-11-15 04:02:00'),
(106, 15, 'RE_Butler', 'session_0106', NULL, 'What are neural networks?', 'Expected output...', 3.4, 167, '2025-11-15 04:04:00'),
(107, 15, 'RE_Butler', 'session_0107', NULL, 'Define deep learning', 'Expected output...', 3.2, 149, '2025-11-15 04:06:00'),
(108, 15, 'RE_Butler', 'session_0108', NULL, 'What is natural language processing?', 'Expected output...', 2.9, 149, '2025-11-15 04:08:00'),
(109, 15, 'RE_Butler', 'session_0109', NULL, 'Explain computer vision', 'Expected output...', 2.7, 138, '2025-11-15 04:10:00'),
(110, 15, 'RE_Butler', 'session_0110', NULL, 'What is reinforcement learning?', 'Expected output...', 3.4, 181, '2025-11-15 04:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(104, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(105, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(106, 'Neural networks are computational architectures with interconnected processing nodes.'),
(107, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(108, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(109, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(110, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(104, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(104, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(104, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(105, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(105, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(105, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(106, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(106, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(106, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(107, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(107, 'RE_Butler', 'relevance', 0.86, 'Generated test evaluation'),
(107, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(108, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(108, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(108, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(109, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(109, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(109, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(110, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(110, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(110, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation');

-- Run 16
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (16, 'RE_Butler', '2025-11-15 06:00:00', '2025-11-15 06:15:00', '2025-11-15 05:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(111, 16, 'RE_Butler', 'session_0111', NULL, 'What is artificial intelligence?', 'Expected output...', 2.6, 148, '2025-11-15 06:00:00'),
(112, 16, 'RE_Butler', 'session_0112', NULL, 'Explain machine learning', 'Expected output...', 3.1, 173, '2025-11-15 06:02:00'),
(113, 16, 'RE_Butler', 'session_0113', NULL, 'What are neural networks?', 'Expected output...', 3.0, 163, '2025-11-15 06:04:00'),
(114, 16, 'RE_Butler', 'session_0114', NULL, 'Define deep learning', 'Expected output...', 2.3, 140, '2025-11-15 06:06:00'),
(115, 16, 'RE_Butler', 'session_0115', NULL, 'What is natural language processing?', 'Expected output...', 2.7, 177, '2025-11-15 06:08:00'),
(116, 16, 'RE_Butler', 'session_0116', NULL, 'Explain computer vision', 'Expected output...', 2.6, 179, '2025-11-15 06:10:00'),
(117, 16, 'RE_Butler', 'session_0117', NULL, 'What is reinforcement learning?', 'Expected output...', 2.5, 171, '2025-11-15 06:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(111, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(112, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(113, 'Neural networks are computational architectures with interconnected processing nodes.'),
(114, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(115, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(116, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(117, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(111, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(111, 'RE_Butler', 'relevance', 0.86, 'Generated test evaluation'),
(111, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(112, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(112, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(112, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(113, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(113, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(113, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(114, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(114, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(114, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(115, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(115, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(115, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(116, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(116, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(116, 'RE_Butler', 'completeness', 0.81, 'Generated test evaluation'),
(117, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(117, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(117, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation');

-- Run 17
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (17, 'RE_Butler', '2025-11-15 08:00:00', '2025-11-15 08:10:00', '2025-11-15 07:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(118, 17, 'RE_Butler', 'session_0118', NULL, 'What is artificial intelligence?', 'Expected output...', 2.6, 160, '2025-11-15 08:00:00'),
(119, 17, 'RE_Butler', 'session_0119', NULL, 'Explain machine learning', 'Expected output...', 3.2, 145, '2025-11-15 08:02:00'),
(120, 17, 'RE_Butler', 'session_0120', NULL, 'What are neural networks?', 'Expected output...', 3.4, 151, '2025-11-15 08:04:00'),
(121, 17, 'RE_Butler', 'session_0121', NULL, 'Define deep learning', 'Expected output...', 2.4, 166, '2025-11-15 08:06:00'),
(122, 17, 'RE_Butler', 'session_0122', NULL, 'What is natural language processing?', 'Expected output...', 3.2, 149, '2025-11-15 08:08:00'),
(123, 17, 'RE_Butler', 'session_0123', NULL, 'Explain computer vision', 'Expected output...', 3.0, 167, '2025-11-15 08:10:00'),
(124, 17, 'RE_Butler', 'session_0124', NULL, 'What is reinforcement learning?', 'Expected output...', 2.2, 160, '2025-11-15 08:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(118, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(119, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(120, 'Neural networks are computational architectures with interconnected processing nodes.'),
(121, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(122, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(123, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(124, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(118, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(118, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(118, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(119, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(119, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(119, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(120, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(120, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(120, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(121, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(121, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(121, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(122, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(122, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(122, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(123, 'RE_Butler', 'accuracy', 0.83, 'Generated test evaluation'),
(123, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(123, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(124, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(124, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(124, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation');

-- Run 18
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (18, 'RE_Butler', '2025-11-15 10:00:00', '2025-11-15 10:12:00', '2025-11-15 09:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(125, 18, 'RE_Butler', 'session_0125', NULL, 'What is artificial intelligence?', 'Expected output...', 3.2, 150, '2025-11-15 10:00:00'),
(126, 18, 'RE_Butler', 'session_0126', NULL, 'Explain machine learning', 'Expected output...', 2.8, 161, '2025-11-15 10:02:00'),
(127, 18, 'RE_Butler', 'session_0127', NULL, 'What are neural networks?', 'Expected output...', 2.2, 145, '2025-11-15 10:04:00'),
(128, 18, 'RE_Butler', 'session_0128', NULL, 'Define deep learning', 'Expected output...', 3.1, 147, '2025-11-15 10:06:00'),
(129, 18, 'RE_Butler', 'session_0129', NULL, 'What is natural language processing?', 'Expected output...', 2.2, 183, '2025-11-15 10:08:00'),
(130, 18, 'RE_Butler', 'session_0130', NULL, 'Explain computer vision', 'Expected output...', 2.7, 180, '2025-11-15 10:10:00'),
(131, 18, 'RE_Butler', 'session_0131', NULL, 'What is reinforcement learning?', 'Expected output...', 2.7, 141, '2025-11-15 10:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(125, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(126, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(127, 'Neural networks are computational architectures with interconnected processing nodes.'),
(128, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(129, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(130, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(131, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(125, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(125, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(125, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(126, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(126, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(126, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(127, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(127, 'RE_Butler', 'relevance', 0.86, 'Generated test evaluation'),
(127, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(128, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(128, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(128, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(129, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(129, 'RE_Butler', 'relevance', 0.86, 'Generated test evaluation'),
(129, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(130, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(130, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(130, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(131, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(131, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(131, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation');

-- Run 19
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (19, 'RE_Butler', '2025-11-15 12:00:00', '2025-11-15 12:10:00', '2025-11-15 11:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(132, 19, 'RE_Butler', 'session_0132', NULL, 'What is artificial intelligence?', 'Expected output...', 2.0, 157, '2025-11-15 12:00:00'),
(133, 19, 'RE_Butler', 'session_0133', NULL, 'Explain machine learning', 'Expected output...', 2.8, 170, '2025-11-15 12:02:00'),
(134, 19, 'RE_Butler', 'session_0134', NULL, 'What are neural networks?', 'Expected output...', 3.3, 158, '2025-11-15 12:04:00'),
(135, 19, 'RE_Butler', 'session_0135', NULL, 'Define deep learning', 'Expected output...', 3.2, 175, '2025-11-15 12:06:00'),
(136, 19, 'RE_Butler', 'session_0136', NULL, 'What is natural language processing?', 'Expected output...', 2.2, 144, '2025-11-15 12:08:00'),
(137, 19, 'RE_Butler', 'session_0137', NULL, 'Explain computer vision', 'Expected output...', 2.3, 171, '2025-11-15 12:10:00'),
(138, 19, 'RE_Butler', 'session_0138', NULL, 'What is reinforcement learning?', 'Expected output...', 3.1, 171, '2025-11-15 12:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(132, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(133, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(134, 'Neural networks are computational architectures with interconnected processing nodes.'),
(135, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(136, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(137, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(138, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(132, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(132, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(132, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(133, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(133, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(133, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(134, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(134, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(134, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(135, 'RE_Butler', 'accuracy', 0.83, 'Generated test evaluation'),
(135, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(135, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(136, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(136, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(136, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(137, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(137, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(137, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(138, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(138, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(138, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation');

-- Run 20
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (20, 'RE_Butler', '2025-11-15 14:00:00', '2025-11-15 14:15:00', '2025-11-15 13:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(139, 20, 'RE_Butler', 'session_0139', NULL, 'What is artificial intelligence?', 'Expected output...', 2.2, 137, '2025-11-15 14:00:00'),
(140, 20, 'RE_Butler', 'session_0140', NULL, 'Explain machine learning', 'Expected output...', 2.2, 160, '2025-11-15 14:02:00'),
(141, 20, 'RE_Butler', 'session_0141', NULL, 'What are neural networks?', 'Expected output...', 2.9, 162, '2025-11-15 14:04:00'),
(142, 20, 'RE_Butler', 'session_0142', NULL, 'Define deep learning', 'Expected output...', 2.5, 146, '2025-11-15 14:06:00'),
(143, 20, 'RE_Butler', 'session_0143', NULL, 'What is natural language processing?', 'Expected output...', 2.7, 140, '2025-11-15 14:08:00'),
(144, 20, 'RE_Butler', 'session_0144', NULL, 'Explain computer vision', 'Expected output...', 3.1, 138, '2025-11-15 14:10:00'),
(145, 20, 'RE_Butler', 'session_0145', NULL, 'What is reinforcement learning?', 'Expected output...', 3.1, 182, '2025-11-15 14:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(139, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(140, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(141, 'Neural networks are computational architectures with interconnected processing nodes.'),
(142, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(143, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(144, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(145, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(139, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(139, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(139, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(140, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(140, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(140, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(141, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(141, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(141, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(142, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(142, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(142, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(143, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(143, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(143, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(144, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(144, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(144, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(145, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(145, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(145, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation');

-- Run 21
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (21, 'RE_Butler', '2025-11-15 16:00:00', '2025-11-15 16:15:00', '2025-11-15 15:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(146, 21, 'RE_Butler', 'session_0146', NULL, 'What is artificial intelligence?', 'Expected output...', 2.5, 177, '2025-11-15 16:00:00'),
(147, 21, 'RE_Butler', 'session_0147', NULL, 'Explain machine learning', 'Expected output...', 2.0, 139, '2025-11-15 16:02:00'),
(148, 21, 'RE_Butler', 'session_0148', NULL, 'What are neural networks?', 'Expected output...', 2.4, 162, '2025-11-15 16:04:00'),
(149, 21, 'RE_Butler', 'session_0149', NULL, 'Define deep learning', 'Expected output...', 2.6, 158, '2025-11-15 16:06:00'),
(150, 21, 'RE_Butler', 'session_0150', NULL, 'What is natural language processing?', 'Expected output...', 2.0, 158, '2025-11-15 16:08:00'),
(151, 21, 'RE_Butler', 'session_0151', NULL, 'Explain computer vision', 'Expected output...', 2.6, 163, '2025-11-15 16:10:00'),
(152, 21, 'RE_Butler', 'session_0152', NULL, 'What is reinforcement learning?', 'Expected output...', 2.4, 159, '2025-11-15 16:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(146, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(147, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(148, 'Neural networks are computational architectures with interconnected processing nodes.'),
(149, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(150, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(151, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(152, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(146, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(146, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(146, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(147, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(147, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(147, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(148, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(148, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(148, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(149, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(149, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(149, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(150, 'RE_Butler', 'accuracy', 0.83, 'Generated test evaluation'),
(150, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(150, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(151, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(151, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(151, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(152, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(152, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(152, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation');

-- Run 22
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (22, 'RE_Butler', '2025-11-15 18:00:00', '2025-11-15 18:13:00', '2025-11-15 17:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(153, 22, 'RE_Butler', 'session_0153', NULL, 'What is artificial intelligence?', 'Expected output...', 2.9, 143, '2025-11-15 18:00:00'),
(154, 22, 'RE_Butler', 'session_0154', NULL, 'Explain machine learning', 'Expected output...', 2.5, 146, '2025-11-15 18:02:00'),
(155, 22, 'RE_Butler', 'session_0155', NULL, 'What are neural networks?', 'Expected output...', 3.1, 178, '2025-11-15 18:04:00'),
(156, 22, 'RE_Butler', 'session_0156', NULL, 'Define deep learning', 'Expected output...', 2.7, 162, '2025-11-15 18:06:00'),
(157, 22, 'RE_Butler', 'session_0157', NULL, 'What is natural language processing?', 'Expected output...', 2.1, 142, '2025-11-15 18:08:00'),
(158, 22, 'RE_Butler', 'session_0158', NULL, 'Explain computer vision', 'Expected output...', 2.9, 181, '2025-11-15 18:10:00'),
(159, 22, 'RE_Butler', 'session_0159', NULL, 'What is reinforcement learning?', 'Expected output...', 2.1, 151, '2025-11-15 18:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(153, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(154, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(155, 'Neural networks are computational architectures with interconnected processing nodes.'),
(156, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(157, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(158, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(159, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(153, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(153, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(153, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(154, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(154, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(154, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(155, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(155, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(155, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(156, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(156, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(156, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(157, 'RE_Butler', 'accuracy', 0.83, 'Generated test evaluation'),
(157, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(157, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(158, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(158, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(158, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(159, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(159, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(159, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation');

-- Run 23
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (23, 'RE_Butler', '2025-11-15 20:00:00', '2025-11-15 20:10:00', '2025-11-15 19:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(160, 23, 'RE_Butler', 'session_0160', NULL, 'What is artificial intelligence?', 'Expected output...', 3.1, 142, '2025-11-15 20:00:00'),
(161, 23, 'RE_Butler', 'session_0161', NULL, 'Explain machine learning', 'Expected output...', 3.0, 149, '2025-11-15 20:02:00'),
(162, 23, 'RE_Butler', 'session_0162', NULL, 'What are neural networks?', 'Expected output...', 2.0, 139, '2025-11-15 20:04:00'),
(163, 23, 'RE_Butler', 'session_0163', NULL, 'Define deep learning', 'Expected output...', 2.5, 140, '2025-11-15 20:06:00'),
(164, 23, 'RE_Butler', 'session_0164', NULL, 'What is natural language processing?', 'Expected output...', 3.0, 149, '2025-11-15 20:08:00'),
(165, 23, 'RE_Butler', 'session_0165', NULL, 'Explain computer vision', 'Expected output...', 2.1, 184, '2025-11-15 20:10:00'),
(166, 23, 'RE_Butler', 'session_0166', NULL, 'What is reinforcement learning?', 'Expected output...', 2.3, 167, '2025-11-15 20:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(160, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(161, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(162, 'Neural networks are computational architectures with interconnected processing nodes.'),
(163, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(164, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(165, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(166, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(160, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(160, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(160, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(161, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(161, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(161, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(162, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(162, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(162, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(163, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(163, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(163, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(164, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(164, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(164, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(165, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(165, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(165, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(166, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(166, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(166, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation');

-- Run 24
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (24, 'RE_Butler', '2025-11-15 22:00:00', '2025-11-15 22:14:00', '2025-11-15 21:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(167, 24, 'RE_Butler', 'session_0167', NULL, 'What is artificial intelligence?', 'Expected output...', 2.2, 138, '2025-11-15 22:00:00'),
(168, 24, 'RE_Butler', 'session_0168', NULL, 'Explain machine learning', 'Expected output...', 2.7, 175, '2025-11-15 22:02:00'),
(169, 24, 'RE_Butler', 'session_0169', NULL, 'What are neural networks?', 'Expected output...', 2.1, 161, '2025-11-15 22:04:00'),
(170, 24, 'RE_Butler', 'session_0170', NULL, 'Define deep learning', 'Expected output...', 2.5, 135, '2025-11-15 22:06:00'),
(171, 24, 'RE_Butler', 'session_0171', NULL, 'What is natural language processing?', 'Expected output...', 2.6, 142, '2025-11-15 22:08:00'),
(172, 24, 'RE_Butler', 'session_0172', NULL, 'Explain computer vision', 'Expected output...', 3.4, 135, '2025-11-15 22:10:00'),
(173, 24, 'RE_Butler', 'session_0173', NULL, 'What is reinforcement learning?', 'Expected output...', 3.0, 169, '2025-11-15 22:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(167, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(168, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(169, 'Neural networks are computational architectures with interconnected processing nodes.'),
(170, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(171, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(172, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(173, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(167, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(167, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(167, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(168, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(168, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(168, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(169, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(169, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(169, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(170, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(170, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(170, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(171, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(171, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(171, 'RE_Butler', 'completeness', 0.81, 'Generated test evaluation'),
(172, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(172, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(172, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(173, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(173, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(173, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation');

-- Run 25
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (25, 'RE_Butler', '2025-11-16 00:00:00', '2025-11-16 00:14:00', '2025-11-15 23:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(174, 25, 'RE_Butler', 'session_0174', NULL, 'What is artificial intelligence?', 'Expected output...', 2.1, 145, '2025-11-16 00:00:00'),
(175, 25, 'RE_Butler', 'session_0175', NULL, 'Explain machine learning', 'Expected output...', 3.3, 172, '2025-11-16 00:02:00'),
(176, 25, 'RE_Butler', 'session_0176', NULL, 'What are neural networks?', 'Expected output...', 2.0, 169, '2025-11-16 00:04:00'),
(177, 25, 'RE_Butler', 'session_0177', NULL, 'Define deep learning', 'Expected output...', 2.2, 147, '2025-11-16 00:06:00'),
(178, 25, 'RE_Butler', 'session_0178', NULL, 'What is natural language processing?', 'Expected output...', 2.7, 179, '2025-11-16 00:08:00'),
(179, 25, 'RE_Butler', 'session_0179', NULL, 'Explain computer vision', 'Expected output...', 2.2, 169, '2025-11-16 00:10:00'),
(180, 25, 'RE_Butler', 'session_0180', NULL, 'What is reinforcement learning?', 'Expected output...', 2.8, 147, '2025-11-16 00:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(174, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(175, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(176, 'Neural networks are computational architectures with interconnected processing nodes.'),
(177, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(178, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(179, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(180, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(174, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(174, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(174, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(175, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(175, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(175, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(176, 'RE_Butler', 'accuracy', 0.83, 'Generated test evaluation'),
(176, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(176, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(177, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(177, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(177, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(178, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(178, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(178, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(179, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(179, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(179, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(180, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(180, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(180, 'RE_Butler', 'completeness', 0.81, 'Generated test evaluation');

-- Run 26
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (26, 'RE_Butler', '2025-11-16 02:00:00', '2025-11-16 02:15:00', '2025-11-16 01:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(181, 26, 'RE_Butler', 'session_0181', NULL, 'What is artificial intelligence?', 'Expected output...', 2.7, 135, '2025-11-16 02:00:00'),
(182, 26, 'RE_Butler', 'session_0182', NULL, 'Explain machine learning', 'Expected output...', 2.2, 139, '2025-11-16 02:02:00'),
(183, 26, 'RE_Butler', 'session_0183', NULL, 'What are neural networks?', 'Expected output...', 3.1, 161, '2025-11-16 02:04:00'),
(184, 26, 'RE_Butler', 'session_0184', NULL, 'Define deep learning', 'Expected output...', 2.6, 139, '2025-11-16 02:06:00'),
(185, 26, 'RE_Butler', 'session_0185', NULL, 'What is natural language processing?', 'Expected output...', 2.8, 148, '2025-11-16 02:08:00'),
(186, 26, 'RE_Butler', 'session_0186', NULL, 'Explain computer vision', 'Expected output...', 3.2, 167, '2025-11-16 02:10:00'),
(187, 26, 'RE_Butler', 'session_0187', NULL, 'What is reinforcement learning?', 'Expected output...', 2.0, 155, '2025-11-16 02:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(181, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(182, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(183, 'Neural networks are computational architectures with interconnected processing nodes.'),
(184, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(185, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(186, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(187, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(181, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(181, 'RE_Butler', 'relevance', 0.86, 'Generated test evaluation'),
(181, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(182, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(182, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(182, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(183, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(183, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(183, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(184, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(184, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(184, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(185, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(185, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(185, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(186, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(186, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(186, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(187, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(187, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(187, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation');

-- Run 27
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (27, 'RE_Butler', '2025-11-16 04:00:00', '2025-11-16 04:15:00', '2025-11-16 03:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(188, 27, 'RE_Butler', 'session_0188', NULL, 'What is artificial intelligence?', 'Expected output...', 3.1, 181, '2025-11-16 04:00:00'),
(189, 27, 'RE_Butler', 'session_0189', NULL, 'Explain machine learning', 'Expected output...', 2.7, 182, '2025-11-16 04:02:00'),
(190, 27, 'RE_Butler', 'session_0190', NULL, 'What are neural networks?', 'Expected output...', 2.2, 140, '2025-11-16 04:04:00'),
(191, 27, 'RE_Butler', 'session_0191', NULL, 'Define deep learning', 'Expected output...', 2.4, 158, '2025-11-16 04:06:00'),
(192, 27, 'RE_Butler', 'session_0192', NULL, 'What is natural language processing?', 'Expected output...', 3.4, 178, '2025-11-16 04:08:00'),
(193, 27, 'RE_Butler', 'session_0193', NULL, 'Explain computer vision', 'Expected output...', 2.3, 141, '2025-11-16 04:10:00'),
(194, 27, 'RE_Butler', 'session_0194', NULL, 'What is reinforcement learning?', 'Expected output...', 2.3, 143, '2025-11-16 04:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(188, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(189, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(190, 'Neural networks are computational architectures with interconnected processing nodes.'),
(191, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(192, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(193, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(194, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(188, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(188, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(188, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(189, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(189, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(189, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(190, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(190, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(190, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(191, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(191, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(191, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(192, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(192, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(192, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(193, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(193, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(193, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(194, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(194, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(194, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation');

-- Run 28
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (28, 'RE_Butler', '2025-11-16 06:00:00', '2025-11-16 06:15:00', '2025-11-16 05:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(195, 28, 'RE_Butler', 'session_0195', NULL, 'What is artificial intelligence?', 'Expected output...', 3.1, 168, '2025-11-16 06:00:00'),
(196, 28, 'RE_Butler', 'session_0196', NULL, 'Explain machine learning', 'Expected output...', 2.2, 161, '2025-11-16 06:02:00'),
(197, 28, 'RE_Butler', 'session_0197', NULL, 'What are neural networks?', 'Expected output...', 2.6, 178, '2025-11-16 06:04:00'),
(198, 28, 'RE_Butler', 'session_0198', NULL, 'Define deep learning', 'Expected output...', 3.3, 165, '2025-11-16 06:06:00'),
(199, 28, 'RE_Butler', 'session_0199', NULL, 'What is natural language processing?', 'Expected output...', 3.2, 147, '2025-11-16 06:08:00'),
(200, 28, 'RE_Butler', 'session_0200', NULL, 'Explain computer vision', 'Expected output...', 3.2, 148, '2025-11-16 06:10:00'),
(201, 28, 'RE_Butler', 'session_0201', NULL, 'What is reinforcement learning?', 'Expected output...', 2.7, 161, '2025-11-16 06:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(195, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(196, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(197, 'Neural networks are computational architectures with interconnected processing nodes.'),
(198, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(199, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(200, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(201, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(195, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(195, 'RE_Butler', 'relevance', 0.86, 'Generated test evaluation'),
(195, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(196, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(196, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(196, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(197, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(197, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(197, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(198, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(198, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(198, 'RE_Butler', 'completeness', 0.81, 'Generated test evaluation'),
(199, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(199, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(199, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(200, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(200, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(200, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(201, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(201, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(201, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation');

-- Run 29
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (29, 'RE_Butler', '2025-11-16 08:00:00', '2025-11-16 08:15:00', '2025-11-16 07:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(202, 29, 'RE_Butler', 'session_0202', NULL, 'What is artificial intelligence?', 'Expected output...', 2.8, 138, '2025-11-16 08:00:00'),
(203, 29, 'RE_Butler', 'session_0203', NULL, 'Explain machine learning', 'Expected output...', 2.4, 156, '2025-11-16 08:02:00'),
(204, 29, 'RE_Butler', 'session_0204', NULL, 'What are neural networks?', 'Expected output...', 3.5, 140, '2025-11-16 08:04:00'),
(205, 29, 'RE_Butler', 'session_0205', NULL, 'Define deep learning', 'Expected output...', 3.4, 156, '2025-11-16 08:06:00'),
(206, 29, 'RE_Butler', 'session_0206', NULL, 'What is natural language processing?', 'Expected output...', 3.3, 147, '2025-11-16 08:08:00'),
(207, 29, 'RE_Butler', 'session_0207', NULL, 'Explain computer vision', 'Expected output...', 2.2, 185, '2025-11-16 08:10:00'),
(208, 29, 'RE_Butler', 'session_0208', NULL, 'What is reinforcement learning?', 'Expected output...', 2.8, 145, '2025-11-16 08:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(202, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(203, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(204, 'Neural networks are computational architectures with interconnected processing nodes.'),
(205, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(206, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(207, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(208, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(202, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(202, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(202, 'RE_Butler', 'completeness', 0.81, 'Generated test evaluation'),
(203, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(203, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(203, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(204, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(204, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(204, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(205, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(205, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(205, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(206, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(206, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(206, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(207, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(207, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(207, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(208, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(208, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(208, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation');

-- Run 30
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (30, 'RE_Butler', '2025-11-16 10:00:00', '2025-11-16 10:14:00', '2025-11-16 09:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(209, 30, 'RE_Butler', 'session_0209', NULL, 'What is artificial intelligence?', 'Expected output...', 3.1, 156, '2025-11-16 10:00:00'),
(210, 30, 'RE_Butler', 'session_0210', NULL, 'Explain machine learning', 'Expected output...', 2.8, 179, '2025-11-16 10:02:00'),
(211, 30, 'RE_Butler', 'session_0211', NULL, 'What are neural networks?', 'Expected output...', 3.4, 138, '2025-11-16 10:04:00'),
(212, 30, 'RE_Butler', 'session_0212', NULL, 'Define deep learning', 'Expected output...', 3.5, 184, '2025-11-16 10:06:00'),
(213, 30, 'RE_Butler', 'session_0213', NULL, 'What is natural language processing?', 'Expected output...', 2.1, 181, '2025-11-16 10:08:00'),
(214, 30, 'RE_Butler', 'session_0214', NULL, 'Explain computer vision', 'Expected output...', 3.2, 169, '2025-11-16 10:10:00'),
(215, 30, 'RE_Butler', 'session_0215', NULL, 'What is reinforcement learning?', 'Expected output...', 2.7, 155, '2025-11-16 10:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(209, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(210, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(211, 'Neural networks are computational architectures with interconnected processing nodes.'),
(212, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(213, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(214, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(215, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(209, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(209, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(209, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(210, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(210, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(210, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(211, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(211, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(211, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(212, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(212, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(212, 'RE_Butler', 'completeness', 0.81, 'Generated test evaluation'),
(213, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(213, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(213, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(214, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(214, 'RE_Butler', 'relevance', 0.86, 'Generated test evaluation'),
(214, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(215, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(215, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(215, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation');

-- Run 31
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (31, 'RE_Butler', '2025-11-16 12:00:00', '2025-11-16 12:12:00', '2025-11-16 11:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(216, 31, 'RE_Butler', 'session_0216', NULL, 'What is artificial intelligence?', 'Expected output...', 2.3, 167, '2025-11-16 12:00:00'),
(217, 31, 'RE_Butler', 'session_0217', NULL, 'Explain machine learning', 'Expected output...', 2.6, 141, '2025-11-16 12:02:00'),
(218, 31, 'RE_Butler', 'session_0218', NULL, 'What are neural networks?', 'Expected output...', 3.1, 159, '2025-11-16 12:04:00'),
(219, 31, 'RE_Butler', 'session_0219', NULL, 'Define deep learning', 'Expected output...', 3.4, 178, '2025-11-16 12:06:00'),
(220, 31, 'RE_Butler', 'session_0220', NULL, 'What is natural language processing?', 'Expected output...', 2.2, 177, '2025-11-16 12:08:00'),
(221, 31, 'RE_Butler', 'session_0221', NULL, 'Explain computer vision', 'Expected output...', 3.5, 147, '2025-11-16 12:10:00'),
(222, 31, 'RE_Butler', 'session_0222', NULL, 'What is reinforcement learning?', 'Expected output...', 3.2, 137, '2025-11-16 12:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(216, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(217, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(218, 'Neural networks are computational architectures with interconnected processing nodes.'),
(219, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(220, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(221, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(222, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(216, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(216, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(216, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(217, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(217, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(217, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(218, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(218, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(218, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(219, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(219, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(219, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(220, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(220, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(220, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(221, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(221, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(221, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(222, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(222, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(222, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation');

-- Run 32
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (32, 'RE_Butler', '2025-11-16 14:00:00', '2025-11-16 14:11:00', '2025-11-16 13:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(223, 32, 'RE_Butler', 'session_0223', NULL, 'What is artificial intelligence?', 'Expected output...', 2.4, 141, '2025-11-16 14:00:00'),
(224, 32, 'RE_Butler', 'session_0224', NULL, 'Explain machine learning', 'Expected output...', 2.3, 178, '2025-11-16 14:02:00'),
(225, 32, 'RE_Butler', 'session_0225', NULL, 'What are neural networks?', 'Expected output...', 2.6, 176, '2025-11-16 14:04:00'),
(226, 32, 'RE_Butler', 'session_0226', NULL, 'Define deep learning', 'Expected output...', 2.4, 185, '2025-11-16 14:06:00'),
(227, 32, 'RE_Butler', 'session_0227', NULL, 'What is natural language processing?', 'Expected output...', 3.1, 154, '2025-11-16 14:08:00'),
(228, 32, 'RE_Butler', 'session_0228', NULL, 'Explain computer vision', 'Expected output...', 2.4, 151, '2025-11-16 14:10:00'),
(229, 32, 'RE_Butler', 'session_0229', NULL, 'What is reinforcement learning?', 'Expected output...', 3.1, 154, '2025-11-16 14:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(223, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(224, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(225, 'Neural networks are computational architectures with interconnected processing nodes.'),
(226, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(227, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(228, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(229, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(223, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(223, 'RE_Butler', 'relevance', 0.86, 'Generated test evaluation'),
(223, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(224, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(224, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(224, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(225, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(225, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(225, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(226, 'RE_Butler', 'accuracy', 0.83, 'Generated test evaluation'),
(226, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(226, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(227, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(227, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(227, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(228, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(228, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(228, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(229, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(229, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(229, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation');

-- Run 33
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (33, 'RE_Butler', '2025-11-16 16:00:00', '2025-11-16 16:15:00', '2025-11-16 15:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(230, 33, 'RE_Butler', 'session_0230', NULL, 'What is artificial intelligence?', 'Expected output...', 2.4, 162, '2025-11-16 16:00:00'),
(231, 33, 'RE_Butler', 'session_0231', NULL, 'Explain machine learning', 'Expected output...', 3.4, 135, '2025-11-16 16:02:00'),
(232, 33, 'RE_Butler', 'session_0232', NULL, 'What are neural networks?', 'Expected output...', 2.8, 174, '2025-11-16 16:04:00'),
(233, 33, 'RE_Butler', 'session_0233', NULL, 'Define deep learning', 'Expected output...', 3.2, 179, '2025-11-16 16:06:00'),
(234, 33, 'RE_Butler', 'session_0234', NULL, 'What is natural language processing?', 'Expected output...', 2.1, 179, '2025-11-16 16:08:00'),
(235, 33, 'RE_Butler', 'session_0235', NULL, 'Explain computer vision', 'Expected output...', 3.0, 147, '2025-11-16 16:10:00'),
(236, 33, 'RE_Butler', 'session_0236', NULL, 'What is reinforcement learning?', 'Expected output...', 2.2, 180, '2025-11-16 16:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(230, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(231, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(232, 'Neural networks are computational architectures with interconnected processing nodes.'),
(233, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(234, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(235, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(236, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(230, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(230, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(230, 'RE_Butler', 'completeness', 0.81, 'Generated test evaluation'),
(231, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(231, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(231, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(232, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(232, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(232, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(233, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(233, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(233, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(234, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(234, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(234, 'RE_Butler', 'completeness', 0.81, 'Generated test evaluation'),
(235, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(235, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(235, 'RE_Butler', 'completeness', 0.81, 'Generated test evaluation'),
(236, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(236, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(236, 'RE_Butler', 'completeness', 0.81, 'Generated test evaluation');

-- Run 34
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (34, 'RE_Butler', '2025-11-16 18:00:00', '2025-11-16 18:13:00', '2025-11-16 17:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(237, 34, 'RE_Butler', 'session_0237', NULL, 'What is artificial intelligence?', 'Expected output...', 3.4, 151, '2025-11-16 18:00:00'),
(238, 34, 'RE_Butler', 'session_0238', NULL, 'Explain machine learning', 'Expected output...', 2.8, 178, '2025-11-16 18:02:00'),
(239, 34, 'RE_Butler', 'session_0239', NULL, 'What are neural networks?', 'Expected output...', 2.3, 166, '2025-11-16 18:04:00'),
(240, 34, 'RE_Butler', 'session_0240', NULL, 'Define deep learning', 'Expected output...', 2.4, 156, '2025-11-16 18:06:00'),
(241, 34, 'RE_Butler', 'session_0241', NULL, 'What is natural language processing?', 'Expected output...', 2.6, 158, '2025-11-16 18:08:00'),
(242, 34, 'RE_Butler', 'session_0242', NULL, 'Explain computer vision', 'Expected output...', 3.4, 177, '2025-11-16 18:10:00'),
(243, 34, 'RE_Butler', 'session_0243', NULL, 'What is reinforcement learning?', 'Expected output...', 2.7, 174, '2025-11-16 18:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(237, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(238, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(239, 'Neural networks are computational architectures with interconnected processing nodes.'),
(240, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(241, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(242, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(243, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(237, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(237, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(237, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(238, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(238, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(238, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(239, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(239, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(239, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(240, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(240, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(240, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(241, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(241, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(241, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(242, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(242, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(242, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(243, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(243, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(243, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation');

-- Run 35
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (35, 'RE_Butler', '2025-11-16 20:00:00', '2025-11-16 20:10:00', '2025-11-16 19:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(244, 35, 'RE_Butler', 'session_0244', NULL, 'What is artificial intelligence?', 'Expected output...', 3.3, 181, '2025-11-16 20:00:00'),
(245, 35, 'RE_Butler', 'session_0245', NULL, 'Explain machine learning', 'Expected output...', 2.1, 164, '2025-11-16 20:02:00'),
(246, 35, 'RE_Butler', 'session_0246', NULL, 'What are neural networks?', 'Expected output...', 3.1, 145, '2025-11-16 20:04:00'),
(247, 35, 'RE_Butler', 'session_0247', NULL, 'Define deep learning', 'Expected output...', 2.6, 166, '2025-11-16 20:06:00'),
(248, 35, 'RE_Butler', 'session_0248', NULL, 'What is natural language processing?', 'Expected output...', 2.9, 180, '2025-11-16 20:08:00'),
(249, 35, 'RE_Butler', 'session_0249', NULL, 'Explain computer vision', 'Expected output...', 2.3, 175, '2025-11-16 20:10:00'),
(250, 35, 'RE_Butler', 'session_0250', NULL, 'What is reinforcement learning?', 'Expected output...', 2.5, 171, '2025-11-16 20:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(244, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(245, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(246, 'Neural networks are computational architectures with interconnected processing nodes.'),
(247, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(248, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(249, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(250, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(244, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(244, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(244, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(245, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(245, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(245, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(246, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(246, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(246, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(247, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(247, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(247, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(248, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(248, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(248, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(249, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(249, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(249, 'RE_Butler', 'completeness', 0.81, 'Generated test evaluation'),
(250, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(250, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(250, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation');

-- Run 36
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (36, 'RE_Butler', '2025-11-16 22:00:00', '2025-11-16 22:11:00', '2025-11-16 21:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(251, 36, 'RE_Butler', 'session_0251', NULL, 'What is artificial intelligence?', 'Expected output...', 2.3, 143, '2025-11-16 22:00:00'),
(252, 36, 'RE_Butler', 'session_0252', NULL, 'Explain machine learning', 'Expected output...', 2.5, 160, '2025-11-16 22:02:00'),
(253, 36, 'RE_Butler', 'session_0253', NULL, 'What are neural networks?', 'Expected output...', 2.5, 182, '2025-11-16 22:04:00'),
(254, 36, 'RE_Butler', 'session_0254', NULL, 'Define deep learning', 'Expected output...', 2.2, 147, '2025-11-16 22:06:00'),
(255, 36, 'RE_Butler', 'session_0255', NULL, 'What is natural language processing?', 'Expected output...', 3.4, 154, '2025-11-16 22:08:00'),
(256, 36, 'RE_Butler', 'session_0256', NULL, 'Explain computer vision', 'Expected output...', 2.9, 158, '2025-11-16 22:10:00'),
(257, 36, 'RE_Butler', 'session_0257', NULL, 'What is reinforcement learning?', 'Expected output...', 2.8, 177, '2025-11-16 22:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(251, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(252, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(253, 'Neural networks are computational architectures with interconnected processing nodes.'),
(254, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(255, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(256, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(257, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(251, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(251, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(251, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(252, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(252, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(252, 'RE_Butler', 'completeness', 0.82, 'Generated test evaluation'),
(253, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(253, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(253, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(254, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(254, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(254, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(255, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(255, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(255, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(256, 'RE_Butler', 'accuracy', 0.85, 'Generated test evaluation'),
(256, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(256, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(257, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(257, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(257, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation');

-- Run 37
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (37, 'RE_Butler', '2025-11-17 00:00:00', '2025-11-17 00:10:00', '2025-11-16 23:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(258, 37, 'RE_Butler', 'session_0258', NULL, 'What is artificial intelligence?', 'Expected output...', 3.2, 156, '2025-11-17 00:00:00'),
(259, 37, 'RE_Butler', 'session_0259', NULL, 'Explain machine learning', 'Expected output...', 2.2, 152, '2025-11-17 00:02:00'),
(260, 37, 'RE_Butler', 'session_0260', NULL, 'What are neural networks?', 'Expected output...', 3.3, 155, '2025-11-17 00:04:00'),
(261, 37, 'RE_Butler', 'session_0261', NULL, 'Define deep learning', 'Expected output...', 3.1, 148, '2025-11-17 00:06:00'),
(262, 37, 'RE_Butler', 'session_0262', NULL, 'What is natural language processing?', 'Expected output...', 3.3, 160, '2025-11-17 00:08:00'),
(263, 37, 'RE_Butler', 'session_0263', NULL, 'Explain computer vision', 'Expected output...', 2.9, 163, '2025-11-17 00:10:00'),
(264, 37, 'RE_Butler', 'session_0264', NULL, 'What is reinforcement learning?', 'Expected output...', 2.6, 183, '2025-11-17 00:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(258, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(259, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(260, 'Neural networks are computational architectures with interconnected processing nodes.'),
(261, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(262, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(263, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(264, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(258, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(258, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(258, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(259, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(259, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(259, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(260, 'RE_Butler', 'accuracy', 0.84, 'Generated test evaluation'),
(260, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(260, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(261, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(261, 'RE_Butler', 'relevance', 0.86, 'Generated test evaluation'),
(261, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(262, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(262, 'RE_Butler', 'relevance', 0.87, 'Generated test evaluation'),
(262, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(263, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(263, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(263, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(264, 'RE_Butler', 'accuracy', 0.83, 'Generated test evaluation'),
(264, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(264, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation');

-- Run 38
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (38, 'RE_Butler', '2025-11-17 02:00:00', '2025-11-17 02:10:00', '2025-11-17 01:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(265, 38, 'RE_Butler', 'session_0265', NULL, 'What is artificial intelligence?', 'Expected output...', 2.4, 174, '2025-11-17 02:00:00'),
(266, 38, 'RE_Butler', 'session_0266', NULL, 'Explain machine learning', 'Expected output...', 2.9, 179, '2025-11-17 02:02:00'),
(267, 38, 'RE_Butler', 'session_0267', NULL, 'What are neural networks?', 'Expected output...', 2.2, 168, '2025-11-17 02:04:00'),
(268, 38, 'RE_Butler', 'session_0268', NULL, 'Define deep learning', 'Expected output...', 3.4, 142, '2025-11-17 02:06:00'),
(269, 38, 'RE_Butler', 'session_0269', NULL, 'What is natural language processing?', 'Expected output...', 2.0, 153, '2025-11-17 02:08:00'),
(270, 38, 'RE_Butler', 'session_0270', NULL, 'Explain computer vision', 'Expected output...', 3.5, 159, '2025-11-17 02:10:00'),
(271, 38, 'RE_Butler', 'session_0271', NULL, 'What is reinforcement learning?', 'Expected output...', 3.4, 177, '2025-11-17 02:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(265, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(266, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(267, 'Neural networks are computational architectures with interconnected processing nodes.'),
(268, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(269, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(270, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(271, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(265, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(265, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(265, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(266, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(266, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(266, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(267, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(267, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(267, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(268, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(268, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(268, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(269, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(269, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(269, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(270, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(270, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(270, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(271, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(271, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(271, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation');

-- Run 39
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (39, 'RE_Butler', '2025-11-17 04:00:00', '2025-11-17 04:15:00', '2025-11-17 03:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(272, 39, 'RE_Butler', 'session_0272', NULL, 'What is artificial intelligence?', 'Expected output...', 2.3, 140, '2025-11-17 04:00:00'),
(273, 39, 'RE_Butler', 'session_0273', NULL, 'Explain machine learning', 'Expected output...', 3.1, 145, '2025-11-17 04:02:00'),
(274, 39, 'RE_Butler', 'session_0274', NULL, 'What are neural networks?', 'Expected output...', 2.0, 155, '2025-11-17 04:04:00'),
(275, 39, 'RE_Butler', 'session_0275', NULL, 'Define deep learning', 'Expected output...', 2.1, 142, '2025-11-17 04:06:00'),
(276, 39, 'RE_Butler', 'session_0276', NULL, 'What is natural language processing?', 'Expected output...', 2.7, 141, '2025-11-17 04:08:00'),
(277, 39, 'RE_Butler', 'session_0277', NULL, 'Explain computer vision', 'Expected output...', 2.9, 166, '2025-11-17 04:10:00'),
(278, 39, 'RE_Butler', 'session_0278', NULL, 'What is reinforcement learning?', 'Expected output...', 2.7, 142, '2025-11-17 04:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(272, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(273, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(274, 'Neural networks are computational architectures with interconnected processing nodes.'),
(275, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(276, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(277, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(278, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(272, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(272, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(272, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(273, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(273, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(273, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(274, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(274, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(274, 'RE_Butler', 'completeness', 0.83, 'Generated test evaluation'),
(275, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(275, 'RE_Butler', 'relevance', 0.88, 'Generated test evaluation'),
(275, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(276, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(276, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(276, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(277, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(277, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(277, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(278, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(278, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(278, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation');

-- Run 40
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (40, 'RE_Butler', '2025-11-17 06:00:00', '2025-11-17 06:12:00', '2025-11-17 05:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(279, 40, 'RE_Butler', 'session_0279', NULL, 'What is artificial intelligence?', 'Expected output...', 2.0, 143, '2025-11-17 06:00:00'),
(280, 40, 'RE_Butler', 'session_0280', NULL, 'Explain machine learning', 'Expected output...', 2.6, 141, '2025-11-17 06:02:00'),
(281, 40, 'RE_Butler', 'session_0281', NULL, 'What are neural networks?', 'Expected output...', 3.1, 144, '2025-11-17 06:04:00'),
(282, 40, 'RE_Butler', 'session_0282', NULL, 'Define deep learning', 'Expected output...', 3.4, 163, '2025-11-17 06:06:00'),
(283, 40, 'RE_Butler', 'session_0283', NULL, 'What is natural language processing?', 'Expected output...', 2.7, 173, '2025-11-17 06:08:00'),
(284, 40, 'RE_Butler', 'session_0284', NULL, 'Explain computer vision', 'Expected output...', 2.0, 144, '2025-11-17 06:10:00'),
(285, 40, 'RE_Butler', 'session_0285', NULL, 'What is reinforcement learning?', 'Expected output...', 2.5, 179, '2025-11-17 06:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(279, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(280, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(281, 'Neural networks are computational architectures with interconnected processing nodes.'),
(282, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(283, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(284, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(285, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(279, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(279, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(279, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(280, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(280, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(280, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(281, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(281, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(281, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(282, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(282, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(282, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(283, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(283, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(283, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(284, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(284, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(284, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(285, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(285, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(285, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation');

-- Run 41
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (41, 'RE_Butler', '2025-11-17 08:00:00', '2025-11-17 08:12:00', '2025-11-17 07:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(286, 41, 'RE_Butler', 'session_0286', NULL, 'What is artificial intelligence?', 'Expected output...', 2.3, 182, '2025-11-17 08:00:00'),
(287, 41, 'RE_Butler', 'session_0287', NULL, 'Explain machine learning', 'Expected output...', 3.2, 154, '2025-11-17 08:02:00'),
(288, 41, 'RE_Butler', 'session_0288', NULL, 'What are neural networks?', 'Expected output...', 2.3, 145, '2025-11-17 08:04:00'),
(289, 41, 'RE_Butler', 'session_0289', NULL, 'Define deep learning', 'Expected output...', 2.4, 164, '2025-11-17 08:06:00'),
(290, 41, 'RE_Butler', 'session_0290', NULL, 'What is natural language processing?', 'Expected output...', 3.0, 162, '2025-11-17 08:08:00'),
(291, 41, 'RE_Butler', 'session_0291', NULL, 'Explain computer vision', 'Expected output...', 3.2, 152, '2025-11-17 08:10:00'),
(292, 41, 'RE_Butler', 'session_0292', NULL, 'What is reinforcement learning?', 'Expected output...', 3.2, 139, '2025-11-17 08:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(286, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(287, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(288, 'Neural networks are computational architectures with interconnected processing nodes.'),
(289, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(290, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(291, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(292, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(286, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(286, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(286, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(287, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(287, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(287, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(288, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(288, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(288, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(289, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(289, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(289, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(290, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(290, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(290, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(291, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(291, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(291, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(292, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(292, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(292, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation');

-- Run 42
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (42, 'RE_Butler', '2025-11-17 10:00:00', '2025-11-17 10:14:00', '2025-11-17 09:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(293, 42, 'RE_Butler', 'session_0293', NULL, 'What is artificial intelligence?', 'Expected output...', 3.1, 169, '2025-11-17 10:00:00'),
(294, 42, 'RE_Butler', 'session_0294', NULL, 'Explain machine learning', 'Expected output...', 2.7, 183, '2025-11-17 10:02:00'),
(295, 42, 'RE_Butler', 'session_0295', NULL, 'What are neural networks?', 'Expected output...', 3.2, 151, '2025-11-17 10:04:00'),
(296, 42, 'RE_Butler', 'session_0296', NULL, 'Define deep learning', 'Expected output...', 3.3, 152, '2025-11-17 10:06:00'),
(297, 42, 'RE_Butler', 'session_0297', NULL, 'What is natural language processing?', 'Expected output...', 3.2, 136, '2025-11-17 10:08:00'),
(298, 42, 'RE_Butler', 'session_0298', NULL, 'Explain computer vision', 'Expected output...', 2.5, 160, '2025-11-17 10:10:00'),
(299, 42, 'RE_Butler', 'session_0299', NULL, 'What is reinforcement learning?', 'Expected output...', 3.0, 153, '2025-11-17 10:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(293, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(294, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(295, 'Neural networks are computational architectures with interconnected processing nodes.'),
(296, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(297, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(298, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(299, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(293, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(293, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(293, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(294, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(294, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(294, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(295, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(295, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(295, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(296, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(296, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(296, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(297, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(297, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(297, 'RE_Butler', 'completeness', 0.84, 'Generated test evaluation'),
(298, 'RE_Butler', 'accuracy', 0.86, 'Generated test evaluation'),
(298, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(298, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(299, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(299, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(299, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation');

-- Run 43
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (43, 'RE_Butler', '2025-11-17 12:00:00', '2025-11-17 12:14:00', '2025-11-17 11:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(300, 43, 'RE_Butler', 'session_0300', NULL, 'What is artificial intelligence?', 'Expected output...', 2.3, 143, '2025-11-17 12:00:00'),
(301, 43, 'RE_Butler', 'session_0301', NULL, 'Explain machine learning', 'Expected output...', 3.1, 173, '2025-11-17 12:02:00'),
(302, 43, 'RE_Butler', 'session_0302', NULL, 'What are neural networks?', 'Expected output...', 3.3, 153, '2025-11-17 12:04:00'),
(303, 43, 'RE_Butler', 'session_0303', NULL, 'Define deep learning', 'Expected output...', 2.7, 167, '2025-11-17 12:06:00'),
(304, 43, 'RE_Butler', 'session_0304', NULL, 'What is natural language processing?', 'Expected output...', 3.5, 176, '2025-11-17 12:08:00'),
(305, 43, 'RE_Butler', 'session_0305', NULL, 'Explain computer vision', 'Expected output...', 2.7, 165, '2025-11-17 12:10:00'),
(306, 43, 'RE_Butler', 'session_0306', NULL, 'What is reinforcement learning?', 'Expected output...', 2.1, 154, '2025-11-17 12:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(300, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(301, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(302, 'Neural networks are computational architectures with interconnected processing nodes.'),
(303, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(304, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(305, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(306, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(300, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(300, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(300, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(301, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(301, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(301, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(302, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(302, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(302, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(303, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(303, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(303, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(304, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(304, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(304, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(305, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(305, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(305, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(306, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(306, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(306, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation');

-- Run 44
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (44, 'RE_Butler', '2025-11-17 14:00:00', '2025-11-17 14:13:00', '2025-11-17 13:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(307, 44, 'RE_Butler', 'session_0307', NULL, 'What is artificial intelligence?', 'Expected output...', 2.0, 166, '2025-11-17 14:00:00'),
(308, 44, 'RE_Butler', 'session_0308', NULL, 'Explain machine learning', 'Expected output...', 3.4, 175, '2025-11-17 14:02:00'),
(309, 44, 'RE_Butler', 'session_0309', NULL, 'What are neural networks?', 'Expected output...', 2.7, 146, '2025-11-17 14:04:00'),
(310, 44, 'RE_Butler', 'session_0310', NULL, 'Define deep learning', 'Expected output...', 3.1, 172, '2025-11-17 14:06:00'),
(311, 44, 'RE_Butler', 'session_0311', NULL, 'What is natural language processing?', 'Expected output...', 2.5, 167, '2025-11-17 14:08:00'),
(312, 44, 'RE_Butler', 'session_0312', NULL, 'Explain computer vision', 'Expected output...', 3.5, 179, '2025-11-17 14:10:00'),
(313, 44, 'RE_Butler', 'session_0313', NULL, 'What is reinforcement learning?', 'Expected output...', 2.2, 171, '2025-11-17 14:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(307, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(308, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(309, 'Neural networks are computational architectures with interconnected processing nodes.'),
(310, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(311, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(312, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(313, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(307, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(307, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(307, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(308, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(308, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(308, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation'),
(309, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(309, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(309, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(310, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(310, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(310, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(311, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(311, 'RE_Butler', 'relevance', 0.89, 'Generated test evaluation'),
(311, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(312, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(312, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(312, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(313, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(313, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(313, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation');

-- Run 45
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (45, 'RE_Butler', '2025-11-17 16:00:00', '2025-11-17 16:14:00', '2025-11-17 15:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(314, 45, 'RE_Butler', 'session_0314', NULL, 'What is artificial intelligence?', 'Expected output...', 2.2, 174, '2025-11-17 16:00:00'),
(315, 45, 'RE_Butler', 'session_0315', NULL, 'Explain machine learning', 'Expected output...', 2.8, 170, '2025-11-17 16:02:00'),
(316, 45, 'RE_Butler', 'session_0316', NULL, 'What are neural networks?', 'Expected output...', 2.3, 141, '2025-11-17 16:04:00'),
(317, 45, 'RE_Butler', 'session_0317', NULL, 'Define deep learning', 'Expected output...', 2.4, 157, '2025-11-17 16:06:00'),
(318, 45, 'RE_Butler', 'session_0318', NULL, 'What is natural language processing?', 'Expected output...', 2.8, 136, '2025-11-17 16:08:00'),
(319, 45, 'RE_Butler', 'session_0319', NULL, 'Explain computer vision', 'Expected output...', 2.4, 144, '2025-11-17 16:10:00'),
(320, 45, 'RE_Butler', 'session_0320', NULL, 'What is reinforcement learning?', 'Expected output...', 3.4, 144, '2025-11-17 16:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(314, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(315, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(316, 'Neural networks are computational architectures with interconnected processing nodes.'),
(317, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(318, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(319, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(320, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(314, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(314, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(314, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(315, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(315, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(315, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(316, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(316, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(316, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(317, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(317, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(317, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(318, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(318, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(318, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(319, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(319, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(319, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(320, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(320, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(320, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation');

-- Run 46
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (46, 'RE_Butler', '2025-11-17 18:00:00', '2025-11-17 18:12:00', '2025-11-17 17:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(321, 46, 'RE_Butler', 'session_0321', NULL, 'What is artificial intelligence?', 'Expected output...', 3.2, 179, '2025-11-17 18:00:00'),
(322, 46, 'RE_Butler', 'session_0322', NULL, 'Explain machine learning', 'Expected output...', 2.8, 172, '2025-11-17 18:02:00'),
(323, 46, 'RE_Butler', 'session_0323', NULL, 'What are neural networks?', 'Expected output...', 3.4, 160, '2025-11-17 18:04:00'),
(324, 46, 'RE_Butler', 'session_0324', NULL, 'Define deep learning', 'Expected output...', 2.8, 185, '2025-11-17 18:06:00'),
(325, 46, 'RE_Butler', 'session_0325', NULL, 'What is natural language processing?', 'Expected output...', 3.4, 159, '2025-11-17 18:08:00'),
(326, 46, 'RE_Butler', 'session_0326', NULL, 'Explain computer vision', 'Expected output...', 2.6, 148, '2025-11-17 18:10:00'),
(327, 46, 'RE_Butler', 'session_0327', NULL, 'What is reinforcement learning?', 'Expected output...', 2.5, 137, '2025-11-17 18:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(321, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(322, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(323, 'Neural networks are computational architectures with interconnected processing nodes.'),
(324, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(325, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(326, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(327, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(321, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(321, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(321, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(322, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(322, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(322, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(323, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(323, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(323, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(324, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(324, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(324, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(325, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(325, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(325, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(326, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(326, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(326, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(327, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(327, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(327, 'RE_Butler', 'completeness', 0.85, 'Generated test evaluation');

-- Run 47
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (47, 'RE_Butler', '2025-11-17 20:00:00', '2025-11-17 20:11:00', '2025-11-17 19:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(328, 47, 'RE_Butler', 'session_0328', NULL, 'What is artificial intelligence?', 'Expected output...', 2.1, 159, '2025-11-17 20:00:00'),
(329, 47, 'RE_Butler', 'session_0329', NULL, 'Explain machine learning', 'Expected output...', 2.8, 149, '2025-11-17 20:02:00'),
(330, 47, 'RE_Butler', 'session_0330', NULL, 'What are neural networks?', 'Expected output...', 2.3, 153, '2025-11-17 20:04:00'),
(331, 47, 'RE_Butler', 'session_0331', NULL, 'Define deep learning', 'Expected output...', 3.1, 146, '2025-11-17 20:06:00'),
(332, 47, 'RE_Butler', 'session_0332', NULL, 'What is natural language processing?', 'Expected output...', 2.0, 183, '2025-11-17 20:08:00'),
(333, 47, 'RE_Butler', 'session_0333', NULL, 'Explain computer vision', 'Expected output...', 2.5, 169, '2025-11-17 20:10:00'),
(334, 47, 'RE_Butler', 'session_0334', NULL, 'What is reinforcement learning?', 'Expected output...', 2.9, 150, '2025-11-17 20:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(328, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(329, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(330, 'Neural networks are computational architectures with interconnected processing nodes.'),
(331, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(332, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(333, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(334, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(328, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(328, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(328, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(329, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(329, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(329, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(330, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(330, 'RE_Butler', 'relevance', 0.9, 'Generated test evaluation'),
(330, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(331, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(331, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(331, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(332, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(332, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(332, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(333, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(333, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(333, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(334, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(334, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(334, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation');

-- Run 48
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (48, 'RE_Butler', '2025-11-17 22:00:00', '2025-11-17 22:12:00', '2025-11-17 21:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(335, 48, 'RE_Butler', 'session_0335', NULL, 'What is artificial intelligence?', 'Expected output...', 3.3, 165, '2025-11-17 22:00:00'),
(336, 48, 'RE_Butler', 'session_0336', NULL, 'Explain machine learning', 'Expected output...', 3.4, 170, '2025-11-17 22:02:00'),
(337, 48, 'RE_Butler', 'session_0337', NULL, 'What are neural networks?', 'Expected output...', 3.3, 151, '2025-11-17 22:04:00'),
(338, 48, 'RE_Butler', 'session_0338', NULL, 'Define deep learning', 'Expected output...', 3.3, 135, '2025-11-17 22:06:00'),
(339, 48, 'RE_Butler', 'session_0339', NULL, 'What is natural language processing?', 'Expected output...', 2.0, 149, '2025-11-17 22:08:00'),
(340, 48, 'RE_Butler', 'session_0340', NULL, 'Explain computer vision', 'Expected output...', 2.2, 167, '2025-11-17 22:10:00'),
(341, 48, 'RE_Butler', 'session_0341', NULL, 'What is reinforcement learning?', 'Expected output...', 2.1, 153, '2025-11-17 22:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(335, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(336, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(337, 'Neural networks are computational architectures with interconnected processing nodes.'),
(338, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(339, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(340, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(341, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(335, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(335, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(335, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(336, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(336, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(336, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(337, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(337, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(337, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(338, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(338, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(338, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(339, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(339, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(339, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(340, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(340, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(340, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(341, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(341, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(341, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation');

-- Run 49
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (49, 'RE_Butler', '2025-11-18 00:00:00', '2025-11-18 00:10:00', '2025-11-17 23:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(342, 49, 'RE_Butler', 'session_0342', NULL, 'What is artificial intelligence?', 'Expected output...', 2.1, 169, '2025-11-18 00:00:00'),
(343, 49, 'RE_Butler', 'session_0343', NULL, 'Explain machine learning', 'Expected output...', 2.4, 180, '2025-11-18 00:02:00'),
(344, 49, 'RE_Butler', 'session_0344', NULL, 'What are neural networks?', 'Expected output...', 3.3, 156, '2025-11-18 00:04:00'),
(345, 49, 'RE_Butler', 'session_0345', NULL, 'Define deep learning', 'Expected output...', 2.0, 173, '2025-11-18 00:06:00'),
(346, 49, 'RE_Butler', 'session_0346', NULL, 'What is natural language processing?', 'Expected output...', 3.4, 184, '2025-11-18 00:08:00'),
(347, 49, 'RE_Butler', 'session_0347', NULL, 'Explain computer vision', 'Expected output...', 2.7, 160, '2025-11-18 00:10:00'),
(348, 49, 'RE_Butler', 'session_0348', NULL, 'What is reinforcement learning?', 'Expected output...', 3.0, 179, '2025-11-18 00:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(342, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(343, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(344, 'Neural networks are computational architectures with interconnected processing nodes.'),
(345, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(346, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(347, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(348, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(342, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(342, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(342, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(343, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(343, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(343, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(344, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(344, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(344, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(345, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(345, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(345, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(346, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(346, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(346, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(347, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(347, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(347, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(348, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(348, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(348, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation');

-- Run 50
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (50, 'RE_Butler', '2025-11-18 02:00:00', '2025-11-18 02:11:00', '2025-11-18 01:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(349, 50, 'RE_Butler', 'session_0349', NULL, 'What is artificial intelligence?', 'Expected output...', 3.1, 143, '2025-11-18 02:00:00'),
(350, 50, 'RE_Butler', 'session_0350', NULL, 'Explain machine learning', 'Expected output...', 3.0, 171, '2025-11-18 02:02:00'),
(351, 50, 'RE_Butler', 'session_0351', NULL, 'What are neural networks?', 'Expected output...', 3.2, 154, '2025-11-18 02:04:00'),
(352, 50, 'RE_Butler', 'session_0352', NULL, 'Define deep learning', 'Expected output...', 3.4, 174, '2025-11-18 02:06:00'),
(353, 50, 'RE_Butler', 'session_0353', NULL, 'What is natural language processing?', 'Expected output...', 2.8, 141, '2025-11-18 02:08:00'),
(354, 50, 'RE_Butler', 'session_0354', NULL, 'Explain computer vision', 'Expected output...', 2.4, 159, '2025-11-18 02:10:00'),
(355, 50, 'RE_Butler', 'session_0355', NULL, 'What is reinforcement learning?', 'Expected output...', 2.1, 181, '2025-11-18 02:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(349, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(350, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(351, 'Neural networks are computational architectures with interconnected processing nodes.'),
(352, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(353, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(354, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(355, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(349, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(349, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(349, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(350, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(350, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(350, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(351, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(351, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(351, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(352, 'RE_Butler', 'accuracy', 0.87, 'Generated test evaluation'),
(352, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(352, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(353, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(353, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(353, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(354, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(354, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(354, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(355, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(355, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(355, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation');

-- Run 51
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (51, 'RE_Butler', '2025-11-18 04:00:00', '2025-11-18 04:13:00', '2025-11-18 03:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(356, 51, 'RE_Butler', 'session_0356', NULL, 'What is artificial intelligence?', 'Expected output...', 2.5, 160, '2025-11-18 04:00:00'),
(357, 51, 'RE_Butler', 'session_0357', NULL, 'Explain machine learning', 'Expected output...', 3.3, 172, '2025-11-18 04:02:00'),
(358, 51, 'RE_Butler', 'session_0358', NULL, 'What are neural networks?', 'Expected output...', 3.2, 149, '2025-11-18 04:04:00'),
(359, 51, 'RE_Butler', 'session_0359', NULL, 'Define deep learning', 'Expected output...', 2.4, 180, '2025-11-18 04:06:00'),
(360, 51, 'RE_Butler', 'session_0360', NULL, 'What is natural language processing?', 'Expected output...', 2.7, 154, '2025-11-18 04:08:00'),
(361, 51, 'RE_Butler', 'session_0361', NULL, 'Explain computer vision', 'Expected output...', 3.4, 156, '2025-11-18 04:10:00'),
(362, 51, 'RE_Butler', 'session_0362', NULL, 'What is reinforcement learning?', 'Expected output...', 3.4, 164, '2025-11-18 04:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(356, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(357, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(358, 'Neural networks are computational architectures with interconnected processing nodes.'),
(359, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(360, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(361, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(362, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(356, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(356, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(356, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(357, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(357, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(357, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(358, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(358, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(358, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(359, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(359, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(359, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(360, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(360, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(360, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(361, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(361, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(361, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(362, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(362, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(362, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation');

-- Run 52
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (52, 'RE_Butler', '2025-11-18 06:00:00', '2025-11-18 06:11:00', '2025-11-18 05:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(363, 52, 'RE_Butler', 'session_0363', NULL, 'What is artificial intelligence?', 'Expected output...', 2.3, 177, '2025-11-18 06:00:00'),
(364, 52, 'RE_Butler', 'session_0364', NULL, 'Explain machine learning', 'Expected output...', 3.4, 176, '2025-11-18 06:02:00'),
(365, 52, 'RE_Butler', 'session_0365', NULL, 'What are neural networks?', 'Expected output...', 3.5, 151, '2025-11-18 06:04:00'),
(366, 52, 'RE_Butler', 'session_0366', NULL, 'Define deep learning', 'Expected output...', 2.6, 166, '2025-11-18 06:06:00'),
(367, 52, 'RE_Butler', 'session_0367', NULL, 'What is natural language processing?', 'Expected output...', 2.8, 169, '2025-11-18 06:08:00'),
(368, 52, 'RE_Butler', 'session_0368', NULL, 'Explain computer vision', 'Expected output...', 2.5, 167, '2025-11-18 06:10:00'),
(369, 52, 'RE_Butler', 'session_0369', NULL, 'What is reinforcement learning?', 'Expected output...', 2.1, 150, '2025-11-18 06:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(363, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(364, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(365, 'Neural networks are computational architectures with interconnected processing nodes.'),
(366, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(367, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(368, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(369, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(363, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(363, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(363, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(364, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(364, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(364, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(365, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(365, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(365, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(366, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(366, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(366, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(367, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(367, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(367, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(368, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(368, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(368, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(369, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(369, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(369, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation');

-- Run 53
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (53, 'RE_Butler', '2025-11-18 08:00:00', '2025-11-18 08:10:00', '2025-11-18 07:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(370, 53, 'RE_Butler', 'session_0370', NULL, 'What is artificial intelligence?', 'Expected output...', 2.1, 141, '2025-11-18 08:00:00'),
(371, 53, 'RE_Butler', 'session_0371', NULL, 'Explain machine learning', 'Expected output...', 3.5, 136, '2025-11-18 08:02:00'),
(372, 53, 'RE_Butler', 'session_0372', NULL, 'What are neural networks?', 'Expected output...', 3.1, 182, '2025-11-18 08:04:00'),
(373, 53, 'RE_Butler', 'session_0373', NULL, 'Define deep learning', 'Expected output...', 3.4, 155, '2025-11-18 08:06:00'),
(374, 53, 'RE_Butler', 'session_0374', NULL, 'What is natural language processing?', 'Expected output...', 2.1, 161, '2025-11-18 08:08:00'),
(375, 53, 'RE_Butler', 'session_0375', NULL, 'Explain computer vision', 'Expected output...', 2.1, 178, '2025-11-18 08:10:00'),
(376, 53, 'RE_Butler', 'session_0376', NULL, 'What is reinforcement learning?', 'Expected output...', 2.4, 178, '2025-11-18 08:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(370, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(371, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(372, 'Neural networks are computational architectures with interconnected processing nodes.'),
(373, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(374, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(375, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(376, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(370, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(370, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(370, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(371, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(371, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(371, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(372, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(372, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(372, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(373, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(373, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(373, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(374, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(374, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(374, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(375, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(375, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(375, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(376, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(376, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(376, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation');

-- Run 54
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (54, 'RE_Butler', '2025-11-18 10:00:00', '2025-11-18 10:15:00', '2025-11-18 09:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(377, 54, 'RE_Butler', 'session_0377', NULL, 'What is artificial intelligence?', 'Expected output...', 2.3, 156, '2025-11-18 10:00:00'),
(378, 54, 'RE_Butler', 'session_0378', NULL, 'Explain machine learning', 'Expected output...', 2.4, 149, '2025-11-18 10:02:00'),
(379, 54, 'RE_Butler', 'session_0379', NULL, 'What are neural networks?', 'Expected output...', 2.2, 166, '2025-11-18 10:04:00'),
(380, 54, 'RE_Butler', 'session_0380', NULL, 'Define deep learning', 'Expected output...', 2.4, 156, '2025-11-18 10:06:00'),
(381, 54, 'RE_Butler', 'session_0381', NULL, 'What is natural language processing?', 'Expected output...', 3.1, 138, '2025-11-18 10:08:00'),
(382, 54, 'RE_Butler', 'session_0382', NULL, 'Explain computer vision', 'Expected output...', 2.9, 155, '2025-11-18 10:10:00'),
(383, 54, 'RE_Butler', 'session_0383', NULL, 'What is reinforcement learning?', 'Expected output...', 2.5, 177, '2025-11-18 10:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(377, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(378, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(379, 'Neural networks are computational architectures with interconnected processing nodes.'),
(380, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(381, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(382, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(383, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(377, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(377, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(377, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(378, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(378, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(378, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(379, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(379, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(379, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(380, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(380, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(380, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(381, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(381, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(381, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(382, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(382, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(382, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(383, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(383, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(383, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation');

-- Run 55
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (55, 'RE_Butler', '2025-11-18 12:00:00', '2025-11-18 12:12:00', '2025-11-18 11:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(384, 55, 'RE_Butler', 'session_0384', NULL, 'What is artificial intelligence?', 'Expected output...', 2.1, 158, '2025-11-18 12:00:00'),
(385, 55, 'RE_Butler', 'session_0385', NULL, 'Explain machine learning', 'Expected output...', 2.6, 135, '2025-11-18 12:02:00'),
(386, 55, 'RE_Butler', 'session_0386', NULL, 'What are neural networks?', 'Expected output...', 2.3, 182, '2025-11-18 12:04:00'),
(387, 55, 'RE_Butler', 'session_0387', NULL, 'Define deep learning', 'Expected output...', 2.2, 176, '2025-11-18 12:06:00'),
(388, 55, 'RE_Butler', 'session_0388', NULL, 'What is natural language processing?', 'Expected output...', 3.0, 173, '2025-11-18 12:08:00'),
(389, 55, 'RE_Butler', 'session_0389', NULL, 'Explain computer vision', 'Expected output...', 3.2, 170, '2025-11-18 12:10:00'),
(390, 55, 'RE_Butler', 'session_0390', NULL, 'What is reinforcement learning?', 'Expected output...', 3.2, 174, '2025-11-18 12:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(384, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(385, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(386, 'Neural networks are computational architectures with interconnected processing nodes.'),
(387, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(388, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(389, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(390, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(384, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(384, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(384, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(385, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(385, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(385, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(386, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(386, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(386, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(387, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(387, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(387, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(388, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(388, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(388, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(389, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(389, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(389, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(390, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(390, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(390, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation');

-- Run 56
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (56, 'RE_Butler', '2025-11-18 14:00:00', '2025-11-18 14:15:00', '2025-11-18 13:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(391, 56, 'RE_Butler', 'session_0391', NULL, 'What is artificial intelligence?', 'Expected output...', 3.5, 183, '2025-11-18 14:00:00'),
(392, 56, 'RE_Butler', 'session_0392', NULL, 'Explain machine learning', 'Expected output...', 2.9, 143, '2025-11-18 14:02:00'),
(393, 56, 'RE_Butler', 'session_0393', NULL, 'What are neural networks?', 'Expected output...', 3.3, 158, '2025-11-18 14:04:00'),
(394, 56, 'RE_Butler', 'session_0394', NULL, 'Define deep learning', 'Expected output...', 2.3, 145, '2025-11-18 14:06:00'),
(395, 56, 'RE_Butler', 'session_0395', NULL, 'What is natural language processing?', 'Expected output...', 2.7, 184, '2025-11-18 14:08:00'),
(396, 56, 'RE_Butler', 'session_0396', NULL, 'Explain computer vision', 'Expected output...', 3.1, 181, '2025-11-18 14:10:00'),
(397, 56, 'RE_Butler', 'session_0397', NULL, 'What is reinforcement learning?', 'Expected output...', 2.5, 167, '2025-11-18 14:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(391, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(392, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(393, 'Neural networks are computational architectures with interconnected processing nodes.'),
(394, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(395, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(396, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(397, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(391, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(391, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(391, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(392, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(392, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(392, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(393, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(393, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(393, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(394, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(394, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(394, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(395, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(395, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(395, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(396, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(396, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(396, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(397, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(397, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(397, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation');

-- Run 57
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (57, 'RE_Butler', '2025-11-18 16:00:00', '2025-11-18 16:14:00', '2025-11-18 15:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(398, 57, 'RE_Butler', 'session_0398', NULL, 'What is artificial intelligence?', 'Expected output...', 2.3, 156, '2025-11-18 16:00:00'),
(399, 57, 'RE_Butler', 'session_0399', NULL, 'Explain machine learning', 'Expected output...', 3.4, 175, '2025-11-18 16:02:00'),
(400, 57, 'RE_Butler', 'session_0400', NULL, 'What are neural networks?', 'Expected output...', 2.8, 144, '2025-11-18 16:04:00'),
(401, 57, 'RE_Butler', 'session_0401', NULL, 'Define deep learning', 'Expected output...', 3.2, 149, '2025-11-18 16:06:00'),
(402, 57, 'RE_Butler', 'session_0402', NULL, 'What is natural language processing?', 'Expected output...', 2.5, 185, '2025-11-18 16:08:00'),
(403, 57, 'RE_Butler', 'session_0403', NULL, 'Explain computer vision', 'Expected output...', 2.7, 163, '2025-11-18 16:10:00'),
(404, 57, 'RE_Butler', 'session_0404', NULL, 'What is reinforcement learning?', 'Expected output...', 2.1, 174, '2025-11-18 16:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(398, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(399, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(400, 'Neural networks are computational architectures with interconnected processing nodes.'),
(401, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(402, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(403, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(404, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(398, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(398, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(398, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(399, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(399, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(399, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(400, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(400, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(400, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(401, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(401, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(401, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(402, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(402, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(402, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(403, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(403, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(403, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(404, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(404, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(404, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation');

-- Run 58
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (58, 'RE_Butler', '2025-11-18 18:00:00', '2025-11-18 18:15:00', '2025-11-18 17:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(405, 58, 'RE_Butler', 'session_0405', NULL, 'What is artificial intelligence?', 'Expected output...', 2.7, 135, '2025-11-18 18:00:00'),
(406, 58, 'RE_Butler', 'session_0406', NULL, 'Explain machine learning', 'Expected output...', 2.7, 161, '2025-11-18 18:02:00'),
(407, 58, 'RE_Butler', 'session_0407', NULL, 'What are neural networks?', 'Expected output...', 3.0, 172, '2025-11-18 18:04:00'),
(408, 58, 'RE_Butler', 'session_0408', NULL, 'Define deep learning', 'Expected output...', 3.5, 139, '2025-11-18 18:06:00'),
(409, 58, 'RE_Butler', 'session_0409', NULL, 'What is natural language processing?', 'Expected output...', 2.8, 176, '2025-11-18 18:08:00'),
(410, 58, 'RE_Butler', 'session_0410', NULL, 'Explain computer vision', 'Expected output...', 2.0, 151, '2025-11-18 18:10:00'),
(411, 58, 'RE_Butler', 'session_0411', NULL, 'What is reinforcement learning?', 'Expected output...', 3.2, 183, '2025-11-18 18:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(405, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(406, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(407, 'Neural networks are computational architectures with interconnected processing nodes.'),
(408, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(409, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(410, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(411, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(405, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(405, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(405, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(406, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(406, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(406, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(407, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(407, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(407, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(408, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(408, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(408, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(409, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(409, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(409, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(410, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(410, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(410, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(411, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(411, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(411, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation');

-- Run 59
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (59, 'RE_Butler', '2025-11-18 20:00:00', '2025-11-18 20:10:00', '2025-11-18 19:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(412, 59, 'RE_Butler', 'session_0412', NULL, 'What is artificial intelligence?', 'Expected output...', 3.0, 136, '2025-11-18 20:00:00'),
(413, 59, 'RE_Butler', 'session_0413', NULL, 'Explain machine learning', 'Expected output...', 2.1, 167, '2025-11-18 20:02:00'),
(414, 59, 'RE_Butler', 'session_0414', NULL, 'What are neural networks?', 'Expected output...', 3.0, 146, '2025-11-18 20:04:00'),
(415, 59, 'RE_Butler', 'session_0415', NULL, 'Define deep learning', 'Expected output...', 2.5, 135, '2025-11-18 20:06:00'),
(416, 59, 'RE_Butler', 'session_0416', NULL, 'What is natural language processing?', 'Expected output...', 3.3, 161, '2025-11-18 20:08:00'),
(417, 59, 'RE_Butler', 'session_0417', NULL, 'Explain computer vision', 'Expected output...', 2.1, 151, '2025-11-18 20:10:00'),
(418, 59, 'RE_Butler', 'session_0418', NULL, 'What is reinforcement learning?', 'Expected output...', 2.8, 163, '2025-11-18 20:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(412, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(413, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(414, 'Neural networks are computational architectures with interconnected processing nodes.'),
(415, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(416, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(417, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(418, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(412, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(412, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(412, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(413, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(413, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(413, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(414, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(414, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(414, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(415, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(415, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(415, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(416, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(416, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(416, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(417, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(417, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(417, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(418, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(418, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(418, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation');

-- Run 60
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (60, 'RE_Butler', '2025-11-18 22:00:00', '2025-11-18 22:11:00', '2025-11-18 21:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(419, 60, 'RE_Butler', 'session_0419', NULL, 'What is artificial intelligence?', 'Expected output...', 2.7, 176, '2025-11-18 22:00:00'),
(420, 60, 'RE_Butler', 'session_0420', NULL, 'Explain machine learning', 'Expected output...', 2.8, 146, '2025-11-18 22:02:00'),
(421, 60, 'RE_Butler', 'session_0421', NULL, 'What are neural networks?', 'Expected output...', 2.0, 165, '2025-11-18 22:04:00'),
(422, 60, 'RE_Butler', 'session_0422', NULL, 'Define deep learning', 'Expected output...', 2.7, 155, '2025-11-18 22:06:00'),
(423, 60, 'RE_Butler', 'session_0423', NULL, 'What is natural language processing?', 'Expected output...', 3.0, 183, '2025-11-18 22:08:00'),
(424, 60, 'RE_Butler', 'session_0424', NULL, 'Explain computer vision', 'Expected output...', 2.7, 169, '2025-11-18 22:10:00'),
(425, 60, 'RE_Butler', 'session_0425', NULL, 'What is reinforcement learning?', 'Expected output...', 2.1, 163, '2025-11-18 22:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(419, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(420, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(421, 'Neural networks are computational architectures with interconnected processing nodes.'),
(422, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(423, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(424, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(425, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(419, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(419, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(419, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(420, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(420, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(420, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(421, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(421, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(421, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(422, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(422, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(422, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(423, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(423, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(423, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(424, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(424, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(424, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(425, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(425, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(425, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation');

-- Run 61
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (61, 'RE_Butler', '2025-11-19 00:00:00', '2025-11-19 00:13:00', '2025-11-18 23:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(426, 61, 'RE_Butler', 'session_0426', NULL, 'What is artificial intelligence?', 'Expected output...', 2.4, 170, '2025-11-19 00:00:00'),
(427, 61, 'RE_Butler', 'session_0427', NULL, 'Explain machine learning', 'Expected output...', 2.3, 157, '2025-11-19 00:02:00'),
(428, 61, 'RE_Butler', 'session_0428', NULL, 'What are neural networks?', 'Expected output...', 2.6, 156, '2025-11-19 00:04:00'),
(429, 61, 'RE_Butler', 'session_0429', NULL, 'Define deep learning', 'Expected output...', 2.7, 157, '2025-11-19 00:06:00'),
(430, 61, 'RE_Butler', 'session_0430', NULL, 'What is natural language processing?', 'Expected output...', 2.7, 172, '2025-11-19 00:08:00'),
(431, 61, 'RE_Butler', 'session_0431', NULL, 'Explain computer vision', 'Expected output...', 2.1, 137, '2025-11-19 00:10:00'),
(432, 61, 'RE_Butler', 'session_0432', NULL, 'What is reinforcement learning?', 'Expected output...', 2.3, 154, '2025-11-19 00:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(426, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(427, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(428, 'Neural networks are computational architectures with interconnected processing nodes.'),
(429, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(430, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(431, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(432, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(426, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(426, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(426, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(427, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(427, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(427, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(428, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(428, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(428, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(429, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(429, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(429, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation'),
(430, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(430, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(430, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(431, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(431, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(431, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(432, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(432, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(432, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation');

-- Run 62
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (62, 'RE_Butler', '2025-11-19 02:00:00', '2025-11-19 02:14:00', '2025-11-19 01:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(433, 62, 'RE_Butler', 'session_0433', NULL, 'What is artificial intelligence?', 'Expected output...', 2.7, 165, '2025-11-19 02:00:00'),
(434, 62, 'RE_Butler', 'session_0434', NULL, 'Explain machine learning', 'Expected output...', 3.0, 178, '2025-11-19 02:02:00'),
(435, 62, 'RE_Butler', 'session_0435', NULL, 'What are neural networks?', 'Expected output...', 3.4, 149, '2025-11-19 02:04:00'),
(436, 62, 'RE_Butler', 'session_0436', NULL, 'Define deep learning', 'Expected output...', 2.0, 174, '2025-11-19 02:06:00'),
(437, 62, 'RE_Butler', 'session_0437', NULL, 'What is natural language processing?', 'Expected output...', 2.3, 139, '2025-11-19 02:08:00'),
(438, 62, 'RE_Butler', 'session_0438', NULL, 'Explain computer vision', 'Expected output...', 2.1, 183, '2025-11-19 02:10:00'),
(439, 62, 'RE_Butler', 'session_0439', NULL, 'What is reinforcement learning?', 'Expected output...', 2.7, 159, '2025-11-19 02:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(433, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(434, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(435, 'Neural networks are computational architectures with interconnected processing nodes.'),
(436, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(437, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(438, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(439, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(433, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(433, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(433, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(434, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(434, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(434, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(435, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(435, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(435, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(436, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(436, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(436, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(437, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(437, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(437, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(438, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(438, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(438, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(439, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(439, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(439, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation');

-- Run 63
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (63, 'RE_Butler', '2025-11-19 04:00:00', '2025-11-19 04:15:00', '2025-11-19 03:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(440, 63, 'RE_Butler', 'session_0440', NULL, 'What is artificial intelligence?', 'Expected output...', 2.6, 162, '2025-11-19 04:00:00'),
(441, 63, 'RE_Butler', 'session_0441', NULL, 'Explain machine learning', 'Expected output...', 2.0, 159, '2025-11-19 04:02:00'),
(442, 63, 'RE_Butler', 'session_0442', NULL, 'What are neural networks?', 'Expected output...', 3.2, 148, '2025-11-19 04:04:00'),
(443, 63, 'RE_Butler', 'session_0443', NULL, 'Define deep learning', 'Expected output...', 2.8, 178, '2025-11-19 04:06:00'),
(444, 63, 'RE_Butler', 'session_0444', NULL, 'What is natural language processing?', 'Expected output...', 3.3, 163, '2025-11-19 04:08:00'),
(445, 63, 'RE_Butler', 'session_0445', NULL, 'Explain computer vision', 'Expected output...', 2.4, 148, '2025-11-19 04:10:00'),
(446, 63, 'RE_Butler', 'session_0446', NULL, 'What is reinforcement learning?', 'Expected output...', 3.5, 163, '2025-11-19 04:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(440, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(441, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(442, 'Neural networks are computational architectures with interconnected processing nodes.'),
(443, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(444, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(445, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(446, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(440, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(440, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(440, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(441, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(441, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(441, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(442, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(442, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(442, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(443, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(443, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(443, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(444, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(444, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(444, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(445, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(445, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(445, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(446, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(446, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(446, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation');

-- Run 64
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (64, 'RE_Butler', '2025-11-19 06:00:00', '2025-11-19 06:15:00', '2025-11-19 05:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(447, 64, 'RE_Butler', 'session_0447', NULL, 'What is artificial intelligence?', 'Expected output...', 2.7, 149, '2025-11-19 06:00:00'),
(448, 64, 'RE_Butler', 'session_0448', NULL, 'Explain machine learning', 'Expected output...', 3.1, 174, '2025-11-19 06:02:00'),
(449, 64, 'RE_Butler', 'session_0449', NULL, 'What are neural networks?', 'Expected output...', 2.1, 152, '2025-11-19 06:04:00'),
(450, 64, 'RE_Butler', 'session_0450', NULL, 'Define deep learning', 'Expected output...', 2.9, 156, '2025-11-19 06:06:00'),
(451, 64, 'RE_Butler', 'session_0451', NULL, 'What is natural language processing?', 'Expected output...', 2.5, 163, '2025-11-19 06:08:00'),
(452, 64, 'RE_Butler', 'session_0452', NULL, 'Explain computer vision', 'Expected output...', 2.5, 177, '2025-11-19 06:10:00'),
(453, 64, 'RE_Butler', 'session_0453', NULL, 'What is reinforcement learning?', 'Expected output...', 3.0, 173, '2025-11-19 06:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(447, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(448, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(449, 'Neural networks are computational architectures with interconnected processing nodes.'),
(450, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(451, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(452, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(453, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(447, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(447, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(447, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(448, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(448, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(448, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(449, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(449, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(449, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(450, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(450, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(450, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(451, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(451, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(451, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(452, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(452, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(452, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(453, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(453, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(453, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation');

-- Run 65
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (65, 'RE_Butler', '2025-11-19 08:00:00', '2025-11-19 08:10:00', '2025-11-19 07:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(454, 65, 'RE_Butler', 'session_0454', NULL, 'What is artificial intelligence?', 'Expected output...', 2.8, 161, '2025-11-19 08:00:00'),
(455, 65, 'RE_Butler', 'session_0455', NULL, 'Explain machine learning', 'Expected output...', 2.3, 152, '2025-11-19 08:02:00'),
(456, 65, 'RE_Butler', 'session_0456', NULL, 'What are neural networks?', 'Expected output...', 2.0, 179, '2025-11-19 08:04:00'),
(457, 65, 'RE_Butler', 'session_0457', NULL, 'Define deep learning', 'Expected output...', 2.2, 164, '2025-11-19 08:06:00'),
(458, 65, 'RE_Butler', 'session_0458', NULL, 'What is natural language processing?', 'Expected output...', 3.4, 158, '2025-11-19 08:08:00'),
(459, 65, 'RE_Butler', 'session_0459', NULL, 'Explain computer vision', 'Expected output...', 2.3, 172, '2025-11-19 08:10:00'),
(460, 65, 'RE_Butler', 'session_0460', NULL, 'What is reinforcement learning?', 'Expected output...', 2.9, 157, '2025-11-19 08:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(454, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(455, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(456, 'Neural networks are computational architectures with interconnected processing nodes.'),
(457, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(458, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(459, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(460, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(454, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(454, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(454, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(455, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(455, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(455, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(456, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(456, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(456, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(457, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(457, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(457, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(458, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(458, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(458, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(459, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(459, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(459, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation'),
(460, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(460, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(460, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation');

-- Run 66
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (66, 'RE_Butler', '2025-11-19 10:00:00', '2025-11-19 10:15:00', '2025-11-19 09:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(461, 66, 'RE_Butler', 'session_0461', NULL, 'What is artificial intelligence?', 'Expected output...', 3.5, 142, '2025-11-19 10:00:00'),
(462, 66, 'RE_Butler', 'session_0462', NULL, 'Explain machine learning', 'Expected output...', 3.3, 144, '2025-11-19 10:02:00'),
(463, 66, 'RE_Butler', 'session_0463', NULL, 'What are neural networks?', 'Expected output...', 3.4, 182, '2025-11-19 10:04:00'),
(464, 66, 'RE_Butler', 'session_0464', NULL, 'Define deep learning', 'Expected output...', 2.6, 185, '2025-11-19 10:06:00'),
(465, 66, 'RE_Butler', 'session_0465', NULL, 'What is natural language processing?', 'Expected output...', 2.1, 151, '2025-11-19 10:08:00'),
(466, 66, 'RE_Butler', 'session_0466', NULL, 'Explain computer vision', 'Expected output...', 2.5, 143, '2025-11-19 10:10:00'),
(467, 66, 'RE_Butler', 'session_0467', NULL, 'What is reinforcement learning?', 'Expected output...', 3.4, 172, '2025-11-19 10:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(461, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(462, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(463, 'Neural networks are computational architectures with interconnected processing nodes.'),
(464, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(465, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(466, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(467, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(461, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(461, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(461, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(462, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(462, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(462, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(463, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(463, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(463, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(464, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(464, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(464, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(465, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(465, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(465, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(466, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(466, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(466, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(467, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(467, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(467, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation');

-- Run 67
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (67, 'RE_Butler', '2025-11-19 12:00:00', '2025-11-19 12:10:00', '2025-11-19 11:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(468, 67, 'RE_Butler', 'session_0468', NULL, 'What is artificial intelligence?', 'Expected output...', 2.2, 178, '2025-11-19 12:00:00'),
(469, 67, 'RE_Butler', 'session_0469', NULL, 'Explain machine learning', 'Expected output...', 2.2, 157, '2025-11-19 12:02:00'),
(470, 67, 'RE_Butler', 'session_0470', NULL, 'What are neural networks?', 'Expected output...', 2.6, 161, '2025-11-19 12:04:00'),
(471, 67, 'RE_Butler', 'session_0471', NULL, 'Define deep learning', 'Expected output...', 2.4, 140, '2025-11-19 12:06:00'),
(472, 67, 'RE_Butler', 'session_0472', NULL, 'What is natural language processing?', 'Expected output...', 3.0, 160, '2025-11-19 12:08:00'),
(473, 67, 'RE_Butler', 'session_0473', NULL, 'Explain computer vision', 'Expected output...', 2.2, 167, '2025-11-19 12:10:00'),
(474, 67, 'RE_Butler', 'session_0474', NULL, 'What is reinforcement learning?', 'Expected output...', 2.3, 139, '2025-11-19 12:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(468, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(469, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(470, 'Neural networks are computational architectures with interconnected processing nodes.'),
(471, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(472, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(473, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(474, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(468, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(468, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(468, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(469, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(469, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(469, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(470, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(470, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(470, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation'),
(471, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(471, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(471, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation'),
(472, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(472, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(472, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(473, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(473, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(473, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(474, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(474, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(474, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation');

-- Run 68
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (68, 'RE_Butler', '2025-11-19 14:00:00', '2025-11-19 14:14:00', '2025-11-19 13:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(475, 68, 'RE_Butler', 'session_0475', NULL, 'What is artificial intelligence?', 'Expected output...', 2.4, 181, '2025-11-19 14:00:00'),
(476, 68, 'RE_Butler', 'session_0476', NULL, 'Explain machine learning', 'Expected output...', 2.3, 158, '2025-11-19 14:02:00'),
(477, 68, 'RE_Butler', 'session_0477', NULL, 'What are neural networks?', 'Expected output...', 3.3, 146, '2025-11-19 14:04:00'),
(478, 68, 'RE_Butler', 'session_0478', NULL, 'Define deep learning', 'Expected output...', 2.1, 137, '2025-11-19 14:06:00'),
(479, 68, 'RE_Butler', 'session_0479', NULL, 'What is natural language processing?', 'Expected output...', 2.6, 146, '2025-11-19 14:08:00'),
(480, 68, 'RE_Butler', 'session_0480', NULL, 'Explain computer vision', 'Expected output...', 2.9, 174, '2025-11-19 14:10:00'),
(481, 68, 'RE_Butler', 'session_0481', NULL, 'What is reinforcement learning?', 'Expected output...', 3.1, 168, '2025-11-19 14:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(475, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(476, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(477, 'Neural networks are computational architectures with interconnected processing nodes.'),
(478, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(479, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(480, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(481, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(475, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(475, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(475, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(476, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(476, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(476, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(477, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(477, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(477, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(478, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(478, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(478, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(479, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(479, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(479, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(480, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(480, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(480, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(481, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(481, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(481, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation');

-- Run 69
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (69, 'RE_Butler', '2025-11-19 16:00:00', '2025-11-19 16:14:00', '2025-11-19 15:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(482, 69, 'RE_Butler', 'session_0482', NULL, 'What is artificial intelligence?', 'Expected output...', 3.2, 156, '2025-11-19 16:00:00'),
(483, 69, 'RE_Butler', 'session_0483', NULL, 'Explain machine learning', 'Expected output...', 3.4, 155, '2025-11-19 16:02:00'),
(484, 69, 'RE_Butler', 'session_0484', NULL, 'What are neural networks?', 'Expected output...', 2.4, 179, '2025-11-19 16:04:00'),
(485, 69, 'RE_Butler', 'session_0485', NULL, 'Define deep learning', 'Expected output...', 2.7, 142, '2025-11-19 16:06:00'),
(486, 69, 'RE_Butler', 'session_0486', NULL, 'What is natural language processing?', 'Expected output...', 2.7, 145, '2025-11-19 16:08:00'),
(487, 69, 'RE_Butler', 'session_0487', NULL, 'Explain computer vision', 'Expected output...', 2.6, 138, '2025-11-19 16:10:00'),
(488, 69, 'RE_Butler', 'session_0488', NULL, 'What is reinforcement learning?', 'Expected output...', 2.5, 155, '2025-11-19 16:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(482, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(483, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(484, 'Neural networks are computational architectures with interconnected processing nodes.'),
(485, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(486, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(487, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(488, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(482, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(482, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(482, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(483, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(483, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(483, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(484, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(484, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(484, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(485, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(485, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(485, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(486, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(486, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(486, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(487, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(487, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(487, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(488, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(488, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(488, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation');

-- Run 70
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (70, 'RE_Butler', '2025-11-19 18:00:00', '2025-11-19 18:13:00', '2025-11-19 17:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(489, 70, 'RE_Butler', 'session_0489', NULL, 'What is artificial intelligence?', 'Expected output...', 2.7, 176, '2025-11-19 18:00:00'),
(490, 70, 'RE_Butler', 'session_0490', NULL, 'Explain machine learning', 'Expected output...', 3.1, 147, '2025-11-19 18:02:00'),
(491, 70, 'RE_Butler', 'session_0491', NULL, 'What are neural networks?', 'Expected output...', 2.2, 157, '2025-11-19 18:04:00'),
(492, 70, 'RE_Butler', 'session_0492', NULL, 'Define deep learning', 'Expected output...', 2.2, 172, '2025-11-19 18:06:00'),
(493, 70, 'RE_Butler', 'session_0493', NULL, 'What is natural language processing?', 'Expected output...', 2.9, 171, '2025-11-19 18:08:00'),
(494, 70, 'RE_Butler', 'session_0494', NULL, 'Explain computer vision', 'Expected output...', 2.8, 182, '2025-11-19 18:10:00'),
(495, 70, 'RE_Butler', 'session_0495', NULL, 'What is reinforcement learning?', 'Expected output...', 3.5, 169, '2025-11-19 18:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(489, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(490, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(491, 'Neural networks are computational architectures with interconnected processing nodes.'),
(492, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(493, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(494, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(495, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(489, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(489, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(489, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(490, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(490, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(490, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(491, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(491, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(491, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(492, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(492, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(492, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(493, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(493, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(493, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(494, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(494, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(494, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(495, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(495, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(495, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation');

-- Run 71
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (71, 'RE_Butler', '2025-11-19 20:00:00', '2025-11-19 20:11:00', '2025-11-19 19:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(496, 71, 'RE_Butler', 'session_0496', NULL, 'What is artificial intelligence?', 'Expected output...', 2.5, 152, '2025-11-19 20:00:00'),
(497, 71, 'RE_Butler', 'session_0497', NULL, 'Explain machine learning', 'Expected output...', 2.5, 140, '2025-11-19 20:02:00'),
(498, 71, 'RE_Butler', 'session_0498', NULL, 'What are neural networks?', 'Expected output...', 2.1, 168, '2025-11-19 20:04:00'),
(499, 71, 'RE_Butler', 'session_0499', NULL, 'Define deep learning', 'Expected output...', 3.0, 135, '2025-11-19 20:06:00'),
(500, 71, 'RE_Butler', 'session_0500', NULL, 'What is natural language processing?', 'Expected output...', 2.7, 159, '2025-11-19 20:08:00'),
(501, 71, 'RE_Butler', 'session_0501', NULL, 'Explain computer vision', 'Expected output...', 3.3, 151, '2025-11-19 20:10:00'),
(502, 71, 'RE_Butler', 'session_0502', NULL, 'What is reinforcement learning?', 'Expected output...', 2.5, 165, '2025-11-19 20:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(496, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(497, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(498, 'Neural networks are computational architectures with interconnected processing nodes.'),
(499, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(500, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(501, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(502, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(496, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(496, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(496, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(497, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(497, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(497, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(498, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(498, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(498, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(499, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(499, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(499, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(500, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(500, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(500, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(501, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(501, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(501, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation'),
(502, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(502, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(502, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation');

-- Run 72
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (72, 'RE_Butler', '2025-11-19 22:00:00', '2025-11-19 22:11:00', '2025-11-19 21:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(503, 72, 'RE_Butler', 'session_0503', NULL, 'What is artificial intelligence?', 'Expected output...', 3.2, 179, '2025-11-19 22:00:00'),
(504, 72, 'RE_Butler', 'session_0504', NULL, 'Explain machine learning', 'Expected output...', 2.2, 155, '2025-11-19 22:02:00'),
(505, 72, 'RE_Butler', 'session_0505', NULL, 'What are neural networks?', 'Expected output...', 3.1, 182, '2025-11-19 22:04:00'),
(506, 72, 'RE_Butler', 'session_0506', NULL, 'Define deep learning', 'Expected output...', 2.1, 173, '2025-11-19 22:06:00'),
(507, 72, 'RE_Butler', 'session_0507', NULL, 'What is natural language processing?', 'Expected output...', 3.4, 162, '2025-11-19 22:08:00'),
(508, 72, 'RE_Butler', 'session_0508', NULL, 'Explain computer vision', 'Expected output...', 2.4, 175, '2025-11-19 22:10:00'),
(509, 72, 'RE_Butler', 'session_0509', NULL, 'What is reinforcement learning?', 'Expected output...', 2.9, 145, '2025-11-19 22:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(503, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(504, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(505, 'Neural networks are computational architectures with interconnected processing nodes.'),
(506, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(507, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(508, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(509, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(503, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(503, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(503, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(504, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(504, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(504, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation'),
(505, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(505, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(505, 'RE_Butler', 'completeness', 0.99, 'Generated test evaluation'),
(506, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(506, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(506, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(507, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(507, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(507, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(508, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(508, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(508, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(509, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(509, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(509, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation');

-- Run 73
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (73, 'RE_Butler', '2025-11-20 00:00:00', '2025-11-20 00:14:00', '2025-11-19 23:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(510, 73, 'RE_Butler', 'session_0510', NULL, 'What is artificial intelligence?', 'Expected output...', 3.0, 146, '2025-11-20 00:00:00'),
(511, 73, 'RE_Butler', 'session_0511', NULL, 'Explain machine learning', 'Expected output...', 3.5, 168, '2025-11-20 00:02:00'),
(512, 73, 'RE_Butler', 'session_0512', NULL, 'What are neural networks?', 'Expected output...', 2.4, 172, '2025-11-20 00:04:00'),
(513, 73, 'RE_Butler', 'session_0513', NULL, 'Define deep learning', 'Expected output...', 3.3, 176, '2025-11-20 00:06:00'),
(514, 73, 'RE_Butler', 'session_0514', NULL, 'What is natural language processing?', 'Expected output...', 3.3, 136, '2025-11-20 00:08:00'),
(515, 73, 'RE_Butler', 'session_0515', NULL, 'Explain computer vision', 'Expected output...', 3.4, 154, '2025-11-20 00:10:00'),
(516, 73, 'RE_Butler', 'session_0516', NULL, 'What is reinforcement learning?', 'Expected output...', 3.3, 167, '2025-11-20 00:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(510, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(511, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(512, 'Neural networks are computational architectures with interconnected processing nodes.'),
(513, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(514, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(515, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(516, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(510, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(510, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(510, 'RE_Butler', 'completeness', 0.99, 'Generated test evaluation'),
(511, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(511, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(511, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(512, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(512, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(512, 'RE_Butler', 'completeness', 0.99, 'Generated test evaluation'),
(513, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(513, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(513, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(514, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(514, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(514, 'RE_Butler', 'completeness', 0.99, 'Generated test evaluation'),
(515, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(515, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(515, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(516, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(516, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(516, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation');

-- Run 74
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (74, 'RE_Butler', '2025-11-20 02:00:00', '2025-11-20 02:12:00', '2025-11-20 01:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(517, 74, 'RE_Butler', 'session_0517', NULL, 'What is artificial intelligence?', 'Expected output...', 2.1, 180, '2025-11-20 02:00:00'),
(518, 74, 'RE_Butler', 'session_0518', NULL, 'Explain machine learning', 'Expected output...', 2.3, 172, '2025-11-20 02:02:00'),
(519, 74, 'RE_Butler', 'session_0519', NULL, 'What are neural networks?', 'Expected output...', 3.0, 165, '2025-11-20 02:04:00'),
(520, 74, 'RE_Butler', 'session_0520', NULL, 'Define deep learning', 'Expected output...', 2.4, 164, '2025-11-20 02:06:00'),
(521, 74, 'RE_Butler', 'session_0521', NULL, 'What is natural language processing?', 'Expected output...', 2.3, 143, '2025-11-20 02:08:00'),
(522, 74, 'RE_Butler', 'session_0522', NULL, 'Explain computer vision', 'Expected output...', 2.9, 146, '2025-11-20 02:10:00'),
(523, 74, 'RE_Butler', 'session_0523', NULL, 'What is reinforcement learning?', 'Expected output...', 2.7, 164, '2025-11-20 02:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(517, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(518, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(519, 'Neural networks are computational architectures with interconnected processing nodes.'),
(520, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(521, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(522, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(523, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(517, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(517, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(517, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(518, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(518, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(518, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(519, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(519, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(519, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(520, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(520, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(520, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(521, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(521, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(521, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(522, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(522, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(522, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(523, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(523, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(523, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation');

-- Run 75
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (75, 'RE_Butler', '2025-11-20 04:00:00', '2025-11-20 04:12:00', '2025-11-20 03:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(524, 75, 'RE_Butler', 'session_0524', NULL, 'What is artificial intelligence?', 'Expected output...', 3.1, 139, '2025-11-20 04:00:00'),
(525, 75, 'RE_Butler', 'session_0525', NULL, 'Explain machine learning', 'Expected output...', 2.2, 174, '2025-11-20 04:02:00'),
(526, 75, 'RE_Butler', 'session_0526', NULL, 'What are neural networks?', 'Expected output...', 3.4, 148, '2025-11-20 04:04:00'),
(527, 75, 'RE_Butler', 'session_0527', NULL, 'Define deep learning', 'Expected output...', 2.0, 140, '2025-11-20 04:06:00'),
(528, 75, 'RE_Butler', 'session_0528', NULL, 'What is natural language processing?', 'Expected output...', 2.5, 146, '2025-11-20 04:08:00'),
(529, 75, 'RE_Butler', 'session_0529', NULL, 'Explain computer vision', 'Expected output...', 2.8, 137, '2025-11-20 04:10:00'),
(530, 75, 'RE_Butler', 'session_0530', NULL, 'What is reinforcement learning?', 'Expected output...', 3.4, 174, '2025-11-20 04:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(524, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(525, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(526, 'Neural networks are computational architectures with interconnected processing nodes.'),
(527, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(528, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(529, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(530, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(524, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(524, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(524, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(525, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(525, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(525, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(526, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(526, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(526, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(527, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(527, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(527, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(528, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(528, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(528, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(529, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(529, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(529, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(530, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(530, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(530, 'RE_Butler', 'completeness', 0.99, 'Generated test evaluation');

-- Run 76
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (76, 'RE_Butler', '2025-11-20 06:00:00', '2025-11-20 06:10:00', '2025-11-20 05:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(531, 76, 'RE_Butler', 'session_0531', NULL, 'What is artificial intelligence?', 'Expected output...', 3.1, 154, '2025-11-20 06:00:00'),
(532, 76, 'RE_Butler', 'session_0532', NULL, 'Explain machine learning', 'Expected output...', 3.5, 136, '2025-11-20 06:02:00'),
(533, 76, 'RE_Butler', 'session_0533', NULL, 'What are neural networks?', 'Expected output...', 2.5, 162, '2025-11-20 06:04:00'),
(534, 76, 'RE_Butler', 'session_0534', NULL, 'Define deep learning', 'Expected output...', 2.5, 149, '2025-11-20 06:06:00'),
(535, 76, 'RE_Butler', 'session_0535', NULL, 'What is natural language processing?', 'Expected output...', 2.1, 168, '2025-11-20 06:08:00'),
(536, 76, 'RE_Butler', 'session_0536', NULL, 'Explain computer vision', 'Expected output...', 3.0, 164, '2025-11-20 06:10:00'),
(537, 76, 'RE_Butler', 'session_0537', NULL, 'What is reinforcement learning?', 'Expected output...', 2.3, 142, '2025-11-20 06:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(531, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(532, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(533, 'Neural networks are computational architectures with interconnected processing nodes.'),
(534, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(535, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(536, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(537, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(531, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(531, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(531, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(532, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(532, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(532, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(533, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(533, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(533, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(534, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(534, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(534, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(535, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(535, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(535, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(536, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(536, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(536, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(537, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(537, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(537, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation');

-- Run 77
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (77, 'RE_Butler', '2025-11-20 08:00:00', '2025-11-20 08:10:00', '2025-11-20 07:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(538, 77, 'RE_Butler', 'session_0538', NULL, 'What is artificial intelligence?', 'Expected output...', 2.6, 149, '2025-11-20 08:00:00'),
(539, 77, 'RE_Butler', 'session_0539', NULL, 'Explain machine learning', 'Expected output...', 2.9, 173, '2025-11-20 08:02:00'),
(540, 77, 'RE_Butler', 'session_0540', NULL, 'What are neural networks?', 'Expected output...', 2.4, 180, '2025-11-20 08:04:00'),
(541, 77, 'RE_Butler', 'session_0541', NULL, 'Define deep learning', 'Expected output...', 3.0, 138, '2025-11-20 08:06:00'),
(542, 77, 'RE_Butler', 'session_0542', NULL, 'What is natural language processing?', 'Expected output...', 2.3, 138, '2025-11-20 08:08:00'),
(543, 77, 'RE_Butler', 'session_0543', NULL, 'Explain computer vision', 'Expected output...', 2.4, 157, '2025-11-20 08:10:00'),
(544, 77, 'RE_Butler', 'session_0544', NULL, 'What is reinforcement learning?', 'Expected output...', 2.0, 151, '2025-11-20 08:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(538, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(539, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(540, 'Neural networks are computational architectures with interconnected processing nodes.'),
(541, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(542, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(543, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(544, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(538, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(538, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(538, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(539, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(539, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(539, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation'),
(540, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(540, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(540, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(541, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(541, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(541, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(542, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(542, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(542, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(543, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(543, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(543, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(544, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(544, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(544, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation');

-- Run 78
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (78, 'RE_Butler', '2025-11-20 10:00:00', '2025-11-20 10:12:00', '2025-11-20 09:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(545, 78, 'RE_Butler', 'session_0545', NULL, 'What is artificial intelligence?', 'Expected output...', 3.0, 185, '2025-11-20 10:00:00'),
(546, 78, 'RE_Butler', 'session_0546', NULL, 'Explain machine learning', 'Expected output...', 3.5, 139, '2025-11-20 10:02:00'),
(547, 78, 'RE_Butler', 'session_0547', NULL, 'What are neural networks?', 'Expected output...', 3.2, 176, '2025-11-20 10:04:00'),
(548, 78, 'RE_Butler', 'session_0548', NULL, 'Define deep learning', 'Expected output...', 2.4, 138, '2025-11-20 10:06:00'),
(549, 78, 'RE_Butler', 'session_0549', NULL, 'What is natural language processing?', 'Expected output...', 3.2, 170, '2025-11-20 10:08:00'),
(550, 78, 'RE_Butler', 'session_0550', NULL, 'Explain computer vision', 'Expected output...', 2.5, 150, '2025-11-20 10:10:00'),
(551, 78, 'RE_Butler', 'session_0551', NULL, 'What is reinforcement learning?', 'Expected output...', 2.4, 137, '2025-11-20 10:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(545, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(546, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(547, 'Neural networks are computational architectures with interconnected processing nodes.'),
(548, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(549, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(550, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(551, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(545, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(545, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(545, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(546, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(546, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(546, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(547, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(547, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(547, 'RE_Butler', 'completeness', 0.99, 'Generated test evaluation'),
(548, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(548, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(548, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(549, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(549, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(549, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(550, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(550, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(550, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(551, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(551, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(551, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation');

-- Run 79
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (79, 'RE_Butler', '2025-11-20 12:00:00', '2025-11-20 12:15:00', '2025-11-20 11:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(552, 79, 'RE_Butler', 'session_0552', NULL, 'What is artificial intelligence?', 'Expected output...', 2.8, 145, '2025-11-20 12:00:00'),
(553, 79, 'RE_Butler', 'session_0553', NULL, 'Explain machine learning', 'Expected output...', 2.7, 150, '2025-11-20 12:02:00'),
(554, 79, 'RE_Butler', 'session_0554', NULL, 'What are neural networks?', 'Expected output...', 2.1, 146, '2025-11-20 12:04:00'),
(555, 79, 'RE_Butler', 'session_0555', NULL, 'Define deep learning', 'Expected output...', 2.2, 185, '2025-11-20 12:06:00'),
(556, 79, 'RE_Butler', 'session_0556', NULL, 'What is natural language processing?', 'Expected output...', 2.1, 135, '2025-11-20 12:08:00'),
(557, 79, 'RE_Butler', 'session_0557', NULL, 'Explain computer vision', 'Expected output...', 2.6, 163, '2025-11-20 12:10:00'),
(558, 79, 'RE_Butler', 'session_0558', NULL, 'What is reinforcement learning?', 'Expected output...', 2.3, 155, '2025-11-20 12:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(552, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(553, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(554, 'Neural networks are computational architectures with interconnected processing nodes.'),
(555, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(556, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(557, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(558, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(552, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(552, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(552, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(553, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(553, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(553, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(554, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(554, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(554, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(555, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(555, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(555, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(556, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(556, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(556, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(557, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(557, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(557, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(558, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(558, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(558, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation');

-- Run 80
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (80, 'RE_Butler', '2025-11-20 14:00:00', '2025-11-20 14:11:00', '2025-11-20 13:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(559, 80, 'RE_Butler', 'session_0559', NULL, 'What is artificial intelligence?', 'Expected output...', 2.2, 163, '2025-11-20 14:00:00'),
(560, 80, 'RE_Butler', 'session_0560', NULL, 'Explain machine learning', 'Expected output...', 3.4, 180, '2025-11-20 14:02:00'),
(561, 80, 'RE_Butler', 'session_0561', NULL, 'What are neural networks?', 'Expected output...', 3.5, 172, '2025-11-20 14:04:00'),
(562, 80, 'RE_Butler', 'session_0562', NULL, 'Define deep learning', 'Expected output...', 2.9, 163, '2025-11-20 14:06:00'),
(563, 80, 'RE_Butler', 'session_0563', NULL, 'What is natural language processing?', 'Expected output...', 2.1, 151, '2025-11-20 14:08:00'),
(564, 80, 'RE_Butler', 'session_0564', NULL, 'Explain computer vision', 'Expected output...', 2.0, 184, '2025-11-20 14:10:00'),
(565, 80, 'RE_Butler', 'session_0565', NULL, 'What is reinforcement learning?', 'Expected output...', 2.6, 140, '2025-11-20 14:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(559, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(560, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(561, 'Neural networks are computational architectures with interconnected processing nodes.'),
(562, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(563, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(564, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(565, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(559, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(559, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(559, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(560, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(560, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(560, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(561, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(561, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(561, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(562, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(562, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(562, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(563, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(563, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(563, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(564, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(564, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(564, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(565, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(565, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(565, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation');

-- Run 81
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (81, 'RE_Butler', '2025-11-20 16:00:00', '2025-11-20 16:12:00', '2025-11-20 15:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(566, 81, 'RE_Butler', 'session_0566', NULL, 'What is artificial intelligence?', 'Expected output...', 3.3, 170, '2025-11-20 16:00:00'),
(567, 81, 'RE_Butler', 'session_0567', NULL, 'Explain machine learning', 'Expected output...', 2.0, 182, '2025-11-20 16:02:00'),
(568, 81, 'RE_Butler', 'session_0568', NULL, 'What are neural networks?', 'Expected output...', 2.3, 170, '2025-11-20 16:04:00'),
(569, 81, 'RE_Butler', 'session_0569', NULL, 'Define deep learning', 'Expected output...', 3.1, 173, '2025-11-20 16:06:00'),
(570, 81, 'RE_Butler', 'session_0570', NULL, 'What is natural language processing?', 'Expected output...', 2.3, 168, '2025-11-20 16:08:00'),
(571, 81, 'RE_Butler', 'session_0571', NULL, 'Explain computer vision', 'Expected output...', 3.0, 149, '2025-11-20 16:10:00'),
(572, 81, 'RE_Butler', 'session_0572', NULL, 'What is reinforcement learning?', 'Expected output...', 2.7, 165, '2025-11-20 16:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(566, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(567, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(568, 'Neural networks are computational architectures with interconnected processing nodes.'),
(569, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(570, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(571, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(572, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(566, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(566, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(566, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(567, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(567, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(567, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(568, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(568, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(568, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(569, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(569, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(569, 'RE_Butler', 'completeness', 0.99, 'Generated test evaluation'),
(570, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(570, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(570, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(571, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(571, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(571, 'RE_Butler', 'completeness', 0.99, 'Generated test evaluation'),
(572, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(572, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(572, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation');

-- Run 82
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (82, 'RE_Butler', '2025-11-20 18:00:00', '2025-11-20 18:11:00', '2025-11-20 17:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(573, 82, 'RE_Butler', 'session_0573', NULL, 'What is artificial intelligence?', 'Expected output...', 3.5, 163, '2025-11-20 18:00:00'),
(574, 82, 'RE_Butler', 'session_0574', NULL, 'Explain machine learning', 'Expected output...', 2.2, 138, '2025-11-20 18:02:00'),
(575, 82, 'RE_Butler', 'session_0575', NULL, 'What are neural networks?', 'Expected output...', 2.9, 170, '2025-11-20 18:04:00'),
(576, 82, 'RE_Butler', 'session_0576', NULL, 'Define deep learning', 'Expected output...', 2.7, 138, '2025-11-20 18:06:00'),
(577, 82, 'RE_Butler', 'session_0577', NULL, 'What is natural language processing?', 'Expected output...', 2.9, 175, '2025-11-20 18:08:00'),
(578, 82, 'RE_Butler', 'session_0578', NULL, 'Explain computer vision', 'Expected output...', 2.7, 173, '2025-11-20 18:10:00'),
(579, 82, 'RE_Butler', 'session_0579', NULL, 'What is reinforcement learning?', 'Expected output...', 2.4, 138, '2025-11-20 18:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(573, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(574, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(575, 'Neural networks are computational architectures with interconnected processing nodes.'),
(576, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(577, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(578, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(579, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(573, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(573, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(573, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(574, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(574, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(574, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(575, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(575, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(575, 'RE_Butler', 'completeness', 0.99, 'Generated test evaluation'),
(576, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(576, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(576, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(577, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(577, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(577, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(578, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(578, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(578, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(579, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(579, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(579, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation');

-- Run 83
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (83, 'RE_Butler', '2025-11-20 20:00:00', '2025-11-20 20:11:00', '2025-11-20 19:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(580, 83, 'RE_Butler', 'session_0580', NULL, 'What is artificial intelligence?', 'Expected output...', 2.6, 165, '2025-11-20 20:00:00'),
(581, 83, 'RE_Butler', 'session_0581', NULL, 'Explain machine learning', 'Expected output...', 3.5, 185, '2025-11-20 20:02:00'),
(582, 83, 'RE_Butler', 'session_0582', NULL, 'What are neural networks?', 'Expected output...', 2.6, 153, '2025-11-20 20:04:00'),
(583, 83, 'RE_Butler', 'session_0583', NULL, 'Define deep learning', 'Expected output...', 3.4, 151, '2025-11-20 20:06:00'),
(584, 83, 'RE_Butler', 'session_0584', NULL, 'What is natural language processing?', 'Expected output...', 2.6, 156, '2025-11-20 20:08:00'),
(585, 83, 'RE_Butler', 'session_0585', NULL, 'Explain computer vision', 'Expected output...', 3.5, 140, '2025-11-20 20:10:00'),
(586, 83, 'RE_Butler', 'session_0586', NULL, 'What is reinforcement learning?', 'Expected output...', 3.3, 143, '2025-11-20 20:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(580, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(581, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(582, 'Neural networks are computational architectures with interconnected processing nodes.'),
(583, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(584, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(585, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(586, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(580, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(580, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(580, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(581, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(581, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(581, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(582, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(582, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(582, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(583, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(583, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(583, 'RE_Butler', 'completeness', 0.99, 'Generated test evaluation'),
(584, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(584, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(584, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(585, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(585, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(585, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(586, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(586, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(586, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation');

-- Run 84
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (84, 'RE_Butler', '2025-11-20 22:00:00', '2025-11-20 22:12:00', '2025-11-20 21:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(587, 84, 'RE_Butler', 'session_0587', NULL, 'What is artificial intelligence?', 'Expected output...', 2.0, 162, '2025-11-20 22:00:00'),
(588, 84, 'RE_Butler', 'session_0588', NULL, 'Explain machine learning', 'Expected output...', 3.4, 147, '2025-11-20 22:02:00'),
(589, 84, 'RE_Butler', 'session_0589', NULL, 'What are neural networks?', 'Expected output...', 3.3, 156, '2025-11-20 22:04:00'),
(590, 84, 'RE_Butler', 'session_0590', NULL, 'Define deep learning', 'Expected output...', 2.3, 154, '2025-11-20 22:06:00'),
(591, 84, 'RE_Butler', 'session_0591', NULL, 'What is natural language processing?', 'Expected output...', 2.7, 142, '2025-11-20 22:08:00'),
(592, 84, 'RE_Butler', 'session_0592', NULL, 'Explain computer vision', 'Expected output...', 2.7, 174, '2025-11-20 22:10:00'),
(593, 84, 'RE_Butler', 'session_0593', NULL, 'What is reinforcement learning?', 'Expected output...', 2.7, 166, '2025-11-20 22:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(587, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(588, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(589, 'Neural networks are computational architectures with interconnected processing nodes.'),
(590, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(591, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(592, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(593, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(587, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(587, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(587, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(588, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(588, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(588, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(589, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(589, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(589, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(590, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(590, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(590, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(591, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(591, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(591, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(592, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(592, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(592, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(593, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(593, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(593, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation');

-- Run 85
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (85, 'RE_Butler', '2025-11-21 00:00:00', '2025-11-21 00:12:00', '2025-11-20 23:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(594, 85, 'RE_Butler', 'session_0594', NULL, 'What is artificial intelligence?', 'Expected output...', 3.2, 138, '2025-11-21 00:00:00'),
(595, 85, 'RE_Butler', 'session_0595', NULL, 'Explain machine learning', 'Expected output...', 3.1, 177, '2025-11-21 00:02:00'),
(596, 85, 'RE_Butler', 'session_0596', NULL, 'What are neural networks?', 'Expected output...', 2.3, 160, '2025-11-21 00:04:00'),
(597, 85, 'RE_Butler', 'session_0597', NULL, 'Define deep learning', 'Expected output...', 3.4, 180, '2025-11-21 00:06:00'),
(598, 85, 'RE_Butler', 'session_0598', NULL, 'What is natural language processing?', 'Expected output...', 2.7, 143, '2025-11-21 00:08:00'),
(599, 85, 'RE_Butler', 'session_0599', NULL, 'Explain computer vision', 'Expected output...', 2.9, 166, '2025-11-21 00:10:00'),
(600, 85, 'RE_Butler', 'session_0600', NULL, 'What is reinforcement learning?', 'Expected output...', 3.5, 156, '2025-11-21 00:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(594, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(595, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(596, 'Neural networks are computational architectures with interconnected processing nodes.'),
(597, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(598, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(599, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(600, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(594, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(594, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(594, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(595, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(595, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(595, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(596, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(596, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(596, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(597, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(597, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(597, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation'),
(598, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(598, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(598, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(599, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(599, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(599, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(600, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(600, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(600, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation');

-- Run 86
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (86, 'RE_Butler', '2025-11-21 02:00:00', '2025-11-21 02:10:00', '2025-11-21 01:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(601, 86, 'RE_Butler', 'session_0601', NULL, 'What is artificial intelligence?', 'Expected output...', 2.7, 175, '2025-11-21 02:00:00'),
(602, 86, 'RE_Butler', 'session_0602', NULL, 'Explain machine learning', 'Expected output...', 2.2, 142, '2025-11-21 02:02:00'),
(603, 86, 'RE_Butler', 'session_0603', NULL, 'What are neural networks?', 'Expected output...', 2.5, 157, '2025-11-21 02:04:00'),
(604, 86, 'RE_Butler', 'session_0604', NULL, 'Define deep learning', 'Expected output...', 2.1, 147, '2025-11-21 02:06:00'),
(605, 86, 'RE_Butler', 'session_0605', NULL, 'What is natural language processing?', 'Expected output...', 2.3, 157, '2025-11-21 02:08:00'),
(606, 86, 'RE_Butler', 'session_0606', NULL, 'Explain computer vision', 'Expected output...', 2.9, 176, '2025-11-21 02:10:00'),
(607, 86, 'RE_Butler', 'session_0607', NULL, 'What is reinforcement learning?', 'Expected output...', 2.0, 160, '2025-11-21 02:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(601, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(602, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(603, 'Neural networks are computational architectures with interconnected processing nodes.'),
(604, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(605, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(606, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(607, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(601, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(601, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(601, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(602, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(602, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(602, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(603, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(603, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(603, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(604, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(604, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(604, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(605, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(605, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(605, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(606, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(606, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(606, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(607, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(607, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(607, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation');

-- Run 87
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (87, 'RE_Butler', '2025-11-21 04:00:00', '2025-11-21 04:14:00', '2025-11-21 03:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(608, 87, 'RE_Butler', 'session_0608', NULL, 'What is artificial intelligence?', 'Expected output...', 2.2, 179, '2025-11-21 04:00:00'),
(609, 87, 'RE_Butler', 'session_0609', NULL, 'Explain machine learning', 'Expected output...', 2.7, 156, '2025-11-21 04:02:00'),
(610, 87, 'RE_Butler', 'session_0610', NULL, 'What are neural networks?', 'Expected output...', 2.2, 156, '2025-11-21 04:04:00'),
(611, 87, 'RE_Butler', 'session_0611', NULL, 'Define deep learning', 'Expected output...', 2.2, 154, '2025-11-21 04:06:00'),
(612, 87, 'RE_Butler', 'session_0612', NULL, 'What is natural language processing?', 'Expected output...', 2.7, 173, '2025-11-21 04:08:00'),
(613, 87, 'RE_Butler', 'session_0613', NULL, 'Explain computer vision', 'Expected output...', 2.2, 171, '2025-11-21 04:10:00'),
(614, 87, 'RE_Butler', 'session_0614', NULL, 'What is reinforcement learning?', 'Expected output...', 3.2, 185, '2025-11-21 04:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(608, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(609, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(610, 'Neural networks are computational architectures with interconnected processing nodes.'),
(611, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(612, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(613, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(614, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(608, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(608, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(608, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(609, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(609, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(609, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(610, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(610, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(610, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(611, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(611, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(611, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(612, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(612, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(612, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(613, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(613, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(613, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(614, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(614, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(614, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation');

-- Run 88
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (88, 'RE_Butler', '2025-11-21 06:00:00', '2025-11-21 06:11:00', '2025-11-21 05:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(615, 88, 'RE_Butler', 'session_0615', NULL, 'What is artificial intelligence?', 'Expected output...', 2.4, 140, '2025-11-21 06:00:00'),
(616, 88, 'RE_Butler', 'session_0616', NULL, 'Explain machine learning', 'Expected output...', 3.4, 174, '2025-11-21 06:02:00'),
(617, 88, 'RE_Butler', 'session_0617', NULL, 'What are neural networks?', 'Expected output...', 2.7, 183, '2025-11-21 06:04:00'),
(618, 88, 'RE_Butler', 'session_0618', NULL, 'Define deep learning', 'Expected output...', 2.8, 179, '2025-11-21 06:06:00'),
(619, 88, 'RE_Butler', 'session_0619', NULL, 'What is natural language processing?', 'Expected output...', 2.5, 173, '2025-11-21 06:08:00'),
(620, 88, 'RE_Butler', 'session_0620', NULL, 'Explain computer vision', 'Expected output...', 3.0, 136, '2025-11-21 06:10:00'),
(621, 88, 'RE_Butler', 'session_0621', NULL, 'What is reinforcement learning?', 'Expected output...', 3.1, 161, '2025-11-21 06:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(615, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(616, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(617, 'Neural networks are computational architectures with interconnected processing nodes.'),
(618, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(619, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(620, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(621, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(615, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(615, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(615, 'RE_Butler', 'completeness', 0.99, 'Generated test evaluation'),
(616, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(616, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(616, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(617, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(617, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(617, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(618, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(618, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(618, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(619, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(619, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(619, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(620, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(620, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(620, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(621, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(621, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(621, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation');

-- Run 89
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (89, 'RE_Butler', '2025-11-21 08:00:00', '2025-11-21 08:15:00', '2025-11-21 07:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(622, 89, 'RE_Butler', 'session_0622', NULL, 'What is artificial intelligence?', 'Expected output...', 2.6, 142, '2025-11-21 08:00:00'),
(623, 89, 'RE_Butler', 'session_0623', NULL, 'Explain machine learning', 'Expected output...', 2.3, 180, '2025-11-21 08:02:00'),
(624, 89, 'RE_Butler', 'session_0624', NULL, 'What are neural networks?', 'Expected output...', 2.2, 147, '2025-11-21 08:04:00'),
(625, 89, 'RE_Butler', 'session_0625', NULL, 'Define deep learning', 'Expected output...', 3.2, 150, '2025-11-21 08:06:00'),
(626, 89, 'RE_Butler', 'session_0626', NULL, 'What is natural language processing?', 'Expected output...', 2.1, 171, '2025-11-21 08:08:00'),
(627, 89, 'RE_Butler', 'session_0627', NULL, 'Explain computer vision', 'Expected output...', 2.2, 136, '2025-11-21 08:10:00'),
(628, 89, 'RE_Butler', 'session_0628', NULL, 'What is reinforcement learning?', 'Expected output...', 3.1, 140, '2025-11-21 08:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(622, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(623, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(624, 'Neural networks are computational architectures with interconnected processing nodes.'),
(625, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(626, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(627, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(628, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(622, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(622, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(622, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(623, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(623, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(623, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(624, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(624, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(624, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation'),
(625, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(625, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(625, 'RE_Butler', 'completeness', 0.99, 'Generated test evaluation'),
(626, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(626, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(626, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation'),
(627, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(627, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(627, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation'),
(628, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(628, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(628, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation');

-- Run 90
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (90, 'RE_Butler', '2025-11-21 10:00:00', '2025-11-21 10:13:00', '2025-11-21 09:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(629, 90, 'RE_Butler', 'session_0629', NULL, 'What is artificial intelligence?', 'Expected output...', 2.9, 148, '2025-11-21 10:00:00'),
(630, 90, 'RE_Butler', 'session_0630', NULL, 'Explain machine learning', 'Expected output...', 3.2, 137, '2025-11-21 10:02:00'),
(631, 90, 'RE_Butler', 'session_0631', NULL, 'What are neural networks?', 'Expected output...', 3.4, 136, '2025-11-21 10:04:00'),
(632, 90, 'RE_Butler', 'session_0632', NULL, 'Define deep learning', 'Expected output...', 2.1, 140, '2025-11-21 10:06:00'),
(633, 90, 'RE_Butler', 'session_0633', NULL, 'What is natural language processing?', 'Expected output...', 2.2, 174, '2025-11-21 10:08:00'),
(634, 90, 'RE_Butler', 'session_0634', NULL, 'Explain computer vision', 'Expected output...', 3.2, 149, '2025-11-21 10:10:00'),
(635, 90, 'RE_Butler', 'session_0635', NULL, 'What is reinforcement learning?', 'Expected output...', 2.5, 146, '2025-11-21 10:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(629, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(630, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(631, 'Neural networks are computational architectures with interconnected processing nodes.'),
(632, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(633, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(634, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(635, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(629, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(629, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(629, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(630, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(630, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(630, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(631, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(631, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(631, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(632, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(632, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(632, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(633, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(633, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(633, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(634, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(634, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(634, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(635, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(635, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(635, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation');

-- Run 91
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (91, 'RE_Butler', '2025-11-21 12:00:00', '2025-11-21 12:11:00', '2025-11-21 11:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(636, 91, 'RE_Butler', 'session_0636', NULL, 'What is artificial intelligence?', 'Expected output...', 2.8, 136, '2025-11-21 12:00:00'),
(637, 91, 'RE_Butler', 'session_0637', NULL, 'Explain machine learning', 'Expected output...', 2.6, 155, '2025-11-21 12:02:00'),
(638, 91, 'RE_Butler', 'session_0638', NULL, 'What are neural networks?', 'Expected output...', 2.6, 168, '2025-11-21 12:04:00'),
(639, 91, 'RE_Butler', 'session_0639', NULL, 'Define deep learning', 'Expected output...', 2.4, 170, '2025-11-21 12:06:00'),
(640, 91, 'RE_Butler', 'session_0640', NULL, 'What is natural language processing?', 'Expected output...', 3.4, 185, '2025-11-21 12:08:00'),
(641, 91, 'RE_Butler', 'session_0641', NULL, 'Explain computer vision', 'Expected output...', 3.2, 185, '2025-11-21 12:10:00'),
(642, 91, 'RE_Butler', 'session_0642', NULL, 'What is reinforcement learning?', 'Expected output...', 2.4, 169, '2025-11-21 12:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(636, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(637, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(638, 'Neural networks are computational architectures with interconnected processing nodes.'),
(639, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(640, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(641, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(642, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(636, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(636, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(636, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(637, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(637, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(637, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(638, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(638, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(638, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(639, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(639, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(639, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation'),
(640, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(640, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(640, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation'),
(641, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(641, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(641, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(642, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(642, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(642, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation');

-- Run 92
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (92, 'RE_Butler', '2025-11-21 14:00:00', '2025-11-21 14:11:00', '2025-11-21 13:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(643, 92, 'RE_Butler', 'session_0643', NULL, 'What is artificial intelligence?', 'Expected output...', 2.7, 141, '2025-11-21 14:00:00'),
(644, 92, 'RE_Butler', 'session_0644', NULL, 'Explain machine learning', 'Expected output...', 2.8, 158, '2025-11-21 14:02:00'),
(645, 92, 'RE_Butler', 'session_0645', NULL, 'What are neural networks?', 'Expected output...', 3.0, 185, '2025-11-21 14:04:00'),
(646, 92, 'RE_Butler', 'session_0646', NULL, 'Define deep learning', 'Expected output...', 2.8, 158, '2025-11-21 14:06:00'),
(647, 92, 'RE_Butler', 'session_0647', NULL, 'What is natural language processing?', 'Expected output...', 2.1, 146, '2025-11-21 14:08:00'),
(648, 92, 'RE_Butler', 'session_0648', NULL, 'Explain computer vision', 'Expected output...', 3.2, 171, '2025-11-21 14:10:00'),
(649, 92, 'RE_Butler', 'session_0649', NULL, 'What is reinforcement learning?', 'Expected output...', 2.7, 138, '2025-11-21 14:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(643, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(644, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(645, 'Neural networks are computational architectures with interconnected processing nodes.'),
(646, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(647, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(648, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(649, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(643, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(643, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(643, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(644, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(644, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(644, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(645, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(645, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(645, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(646, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(646, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(646, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(647, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(647, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(647, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(648, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(648, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(648, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(649, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(649, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(649, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation');

-- Run 93
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (93, 'RE_Butler', '2025-11-21 16:00:00', '2025-11-21 16:15:00', '2025-11-21 15:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(650, 93, 'RE_Butler', 'session_0650', NULL, 'What is artificial intelligence?', 'Expected output...', 2.2, 144, '2025-11-21 16:00:00'),
(651, 93, 'RE_Butler', 'session_0651', NULL, 'Explain machine learning', 'Expected output...', 2.9, 137, '2025-11-21 16:02:00'),
(652, 93, 'RE_Butler', 'session_0652', NULL, 'What are neural networks?', 'Expected output...', 3.1, 167, '2025-11-21 16:04:00'),
(653, 93, 'RE_Butler', 'session_0653', NULL, 'Define deep learning', 'Expected output...', 2.4, 135, '2025-11-21 16:06:00'),
(654, 93, 'RE_Butler', 'session_0654', NULL, 'What is natural language processing?', 'Expected output...', 2.1, 175, '2025-11-21 16:08:00'),
(655, 93, 'RE_Butler', 'session_0655', NULL, 'Explain computer vision', 'Expected output...', 3.3, 178, '2025-11-21 16:10:00'),
(656, 93, 'RE_Butler', 'session_0656', NULL, 'What is reinforcement learning?', 'Expected output...', 3.2, 137, '2025-11-21 16:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(650, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(651, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(652, 'Neural networks are computational architectures with interconnected processing nodes.'),
(653, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(654, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(655, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(656, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(650, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(650, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(650, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(651, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(651, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(651, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(652, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(652, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(652, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation'),
(653, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(653, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(653, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(654, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(654, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(654, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(655, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(655, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(655, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(656, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(656, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(656, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation');

-- Run 94
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (94, 'RE_Butler', '2025-11-21 18:00:00', '2025-11-21 18:13:00', '2025-11-21 17:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(657, 94, 'RE_Butler', 'session_0657', NULL, 'What is artificial intelligence?', 'Expected output...', 2.6, 185, '2025-11-21 18:00:00'),
(658, 94, 'RE_Butler', 'session_0658', NULL, 'Explain machine learning', 'Expected output...', 2.6, 174, '2025-11-21 18:02:00'),
(659, 94, 'RE_Butler', 'session_0659', NULL, 'What are neural networks?', 'Expected output...', 2.7, 171, '2025-11-21 18:04:00'),
(660, 94, 'RE_Butler', 'session_0660', NULL, 'Define deep learning', 'Expected output...', 2.7, 160, '2025-11-21 18:06:00'),
(661, 94, 'RE_Butler', 'session_0661', NULL, 'What is natural language processing?', 'Expected output...', 3.3, 177, '2025-11-21 18:08:00'),
(662, 94, 'RE_Butler', 'session_0662', NULL, 'Explain computer vision', 'Expected output...', 2.1, 150, '2025-11-21 18:10:00'),
(663, 94, 'RE_Butler', 'session_0663', NULL, 'What is reinforcement learning?', 'Expected output...', 3.0, 173, '2025-11-21 18:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(657, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(658, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(659, 'Neural networks are computational architectures with interconnected processing nodes.'),
(660, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(661, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(662, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(663, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(657, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(657, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(657, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(658, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(658, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(658, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(659, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(659, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(659, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(660, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(660, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(660, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(661, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(661, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(661, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(662, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(662, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(662, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(663, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(663, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(663, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation');

-- Run 95
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (95, 'RE_Butler', '2025-11-21 20:00:00', '2025-11-21 20:14:00', '2025-11-21 19:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(664, 95, 'RE_Butler', 'session_0664', NULL, 'What is artificial intelligence?', 'Expected output...', 3.4, 135, '2025-11-21 20:00:00'),
(665, 95, 'RE_Butler', 'session_0665', NULL, 'Explain machine learning', 'Expected output...', 2.1, 160, '2025-11-21 20:02:00'),
(666, 95, 'RE_Butler', 'session_0666', NULL, 'What are neural networks?', 'Expected output...', 3.1, 141, '2025-11-21 20:04:00'),
(667, 95, 'RE_Butler', 'session_0667', NULL, 'Define deep learning', 'Expected output...', 3.4, 149, '2025-11-21 20:06:00'),
(668, 95, 'RE_Butler', 'session_0668', NULL, 'What is natural language processing?', 'Expected output...', 2.7, 149, '2025-11-21 20:08:00'),
(669, 95, 'RE_Butler', 'session_0669', NULL, 'Explain computer vision', 'Expected output...', 2.8, 175, '2025-11-21 20:10:00'),
(670, 95, 'RE_Butler', 'session_0670', NULL, 'What is reinforcement learning?', 'Expected output...', 2.2, 178, '2025-11-21 20:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(664, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(665, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(666, 'Neural networks are computational architectures with interconnected processing nodes.'),
(667, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(668, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(669, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(670, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(664, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(664, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(664, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(665, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(665, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(665, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(666, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(666, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(666, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(667, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(667, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(667, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(668, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(668, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(668, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(669, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(669, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(669, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(670, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(670, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(670, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation');

-- Run 96
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (96, 'RE_Butler', '2025-11-21 22:00:00', '2025-11-21 22:15:00', '2025-11-21 21:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(671, 96, 'RE_Butler', 'session_0671', NULL, 'What is artificial intelligence?', 'Expected output...', 2.2, 166, '2025-11-21 22:00:00'),
(672, 96, 'RE_Butler', 'session_0672', NULL, 'Explain machine learning', 'Expected output...', 3.1, 170, '2025-11-21 22:02:00'),
(673, 96, 'RE_Butler', 'session_0673', NULL, 'What are neural networks?', 'Expected output...', 2.6, 167, '2025-11-21 22:04:00'),
(674, 96, 'RE_Butler', 'session_0674', NULL, 'Define deep learning', 'Expected output...', 2.9, 165, '2025-11-21 22:06:00'),
(675, 96, 'RE_Butler', 'session_0675', NULL, 'What is natural language processing?', 'Expected output...', 3.0, 141, '2025-11-21 22:08:00'),
(676, 96, 'RE_Butler', 'session_0676', NULL, 'Explain computer vision', 'Expected output...', 2.9, 179, '2025-11-21 22:10:00'),
(677, 96, 'RE_Butler', 'session_0677', NULL, 'What is reinforcement learning?', 'Expected output...', 2.4, 176, '2025-11-21 22:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(671, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(672, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(673, 'Neural networks are computational architectures with interconnected processing nodes.'),
(674, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(675, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(676, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(677, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(671, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(671, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(671, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(672, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(672, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(672, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(673, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(673, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(673, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(674, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(674, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(674, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(675, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(675, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(675, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(676, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(676, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(676, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(677, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(677, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(677, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation');

-- Run 97
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (97, 'RE_Butler', '2025-11-22 00:00:00', '2025-11-22 00:14:00', '2025-11-21 23:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(678, 97, 'RE_Butler', 'session_0678', NULL, 'What is artificial intelligence?', 'Expected output...', 2.3, 151, '2025-11-22 00:00:00'),
(679, 97, 'RE_Butler', 'session_0679', NULL, 'Explain machine learning', 'Expected output...', 2.3, 163, '2025-11-22 00:02:00'),
(680, 97, 'RE_Butler', 'session_0680', NULL, 'What are neural networks?', 'Expected output...', 3.2, 143, '2025-11-22 00:04:00'),
(681, 97, 'RE_Butler', 'session_0681', NULL, 'Define deep learning', 'Expected output...', 3.1, 169, '2025-11-22 00:06:00'),
(682, 97, 'RE_Butler', 'session_0682', NULL, 'What is natural language processing?', 'Expected output...', 3.5, 144, '2025-11-22 00:08:00'),
(683, 97, 'RE_Butler', 'session_0683', NULL, 'Explain computer vision', 'Expected output...', 2.6, 137, '2025-11-22 00:10:00'),
(684, 97, 'RE_Butler', 'session_0684', NULL, 'What is reinforcement learning?', 'Expected output...', 2.5, 156, '2025-11-22 00:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(678, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(679, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(680, 'Neural networks are computational architectures with interconnected processing nodes.'),
(681, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(682, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(683, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(684, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(678, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(678, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(678, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(679, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(679, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(679, 'RE_Butler', 'completeness', 0.99, 'Generated test evaluation'),
(680, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(680, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(680, 'RE_Butler', 'completeness', 0.99, 'Generated test evaluation'),
(681, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(681, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(681, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(682, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(682, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(682, 'RE_Butler', 'completeness', 0.99, 'Generated test evaluation'),
(683, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(683, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(683, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(684, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(684, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(684, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation');

-- Run 98
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (98, 'RE_Butler', '2025-11-22 02:00:00', '2025-11-22 02:11:00', '2025-11-22 01:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(685, 98, 'RE_Butler', 'session_0685', NULL, 'What is artificial intelligence?', 'Expected output...', 2.3, 148, '2025-11-22 02:00:00'),
(686, 98, 'RE_Butler', 'session_0686', NULL, 'Explain machine learning', 'Expected output...', 3.5, 144, '2025-11-22 02:02:00'),
(687, 98, 'RE_Butler', 'session_0687', NULL, 'What are neural networks?', 'Expected output...', 2.5, 183, '2025-11-22 02:04:00'),
(688, 98, 'RE_Butler', 'session_0688', NULL, 'Define deep learning', 'Expected output...', 2.8, 135, '2025-11-22 02:06:00'),
(689, 98, 'RE_Butler', 'session_0689', NULL, 'What is natural language processing?', 'Expected output...', 2.0, 151, '2025-11-22 02:08:00'),
(690, 98, 'RE_Butler', 'session_0690', NULL, 'Explain computer vision', 'Expected output...', 2.3, 144, '2025-11-22 02:10:00'),
(691, 98, 'RE_Butler', 'session_0691', NULL, 'What is reinforcement learning?', 'Expected output...', 2.9, 168, '2025-11-22 02:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(685, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(686, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(687, 'Neural networks are computational architectures with interconnected processing nodes.'),
(688, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(689, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(690, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(691, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(685, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(685, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(685, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(686, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(686, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(686, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(687, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(687, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(687, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(688, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(688, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(688, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(689, 'RE_Butler', 'accuracy', 0.88, 'Generated test evaluation'),
(689, 'RE_Butler', 'relevance', 0.91, 'Generated test evaluation'),
(689, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(690, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(690, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(690, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(691, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(691, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(691, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation');

-- Run 99
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (99, 'RE_Butler', '2025-11-22 04:00:00', '2025-11-22 04:10:00', '2025-11-22 03:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(692, 99, 'RE_Butler', 'session_0692', NULL, 'What is artificial intelligence?', 'Expected output...', 2.2, 136, '2025-11-22 04:00:00'),
(693, 99, 'RE_Butler', 'session_0693', NULL, 'Explain machine learning', 'Expected output...', 3.3, 181, '2025-11-22 04:02:00'),
(694, 99, 'RE_Butler', 'session_0694', NULL, 'What are neural networks?', 'Expected output...', 2.1, 146, '2025-11-22 04:04:00'),
(695, 99, 'RE_Butler', 'session_0695', NULL, 'Define deep learning', 'Expected output...', 2.9, 179, '2025-11-22 04:06:00'),
(696, 99, 'RE_Butler', 'session_0696', NULL, 'What is natural language processing?', 'Expected output...', 2.5, 154, '2025-11-22 04:08:00'),
(697, 99, 'RE_Butler', 'session_0697', NULL, 'Explain computer vision', 'Expected output...', 3.2, 181, '2025-11-22 04:10:00'),
(698, 99, 'RE_Butler', 'session_0698', NULL, 'What is reinforcement learning?', 'Expected output...', 3.4, 166, '2025-11-22 04:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(692, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(693, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(694, 'Neural networks are computational architectures with interconnected processing nodes.'),
(695, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(696, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(697, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(698, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(692, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(692, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(692, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(693, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(693, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(693, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(694, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(694, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(694, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(695, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(695, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(695, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(696, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(696, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(696, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(697, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(697, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(697, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(698, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(698, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(698, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation');

-- Run 100
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (100, 'RE_Butler', '2025-11-22 06:00:00', '2025-11-22 06:10:00', '2025-11-22 05:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(699, 100, 'RE_Butler', 'session_0699', NULL, 'What is artificial intelligence?', 'Expected output...', 2.2, 145, '2025-11-22 06:00:00'),
(700, 100, 'RE_Butler', 'session_0700', NULL, 'Explain machine learning', 'Expected output...', 2.2, 180, '2025-11-22 06:02:00'),
(701, 100, 'RE_Butler', 'session_0701', NULL, 'What are neural networks?', 'Expected output...', 3.2, 183, '2025-11-22 06:04:00'),
(702, 100, 'RE_Butler', 'session_0702', NULL, 'Define deep learning', 'Expected output...', 2.6, 181, '2025-11-22 06:06:00'),
(703, 100, 'RE_Butler', 'session_0703', NULL, 'What is natural language processing?', 'Expected output...', 2.9, 182, '2025-11-22 06:08:00'),
(704, 100, 'RE_Butler', 'session_0704', NULL, 'Explain computer vision', 'Expected output...', 3.5, 168, '2025-11-22 06:10:00'),
(705, 100, 'RE_Butler', 'session_0705', NULL, 'What is reinforcement learning?', 'Expected output...', 2.9, 179, '2025-11-22 06:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(699, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(700, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(701, 'Neural networks are computational architectures with interconnected processing nodes.'),
(702, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(703, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(704, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(705, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(699, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(699, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(699, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(700, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(700, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(700, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(701, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(701, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(701, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(702, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(702, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(702, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(703, 'RE_Butler', 'accuracy', 0.92, 'Generated test evaluation'),
(703, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(703, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(704, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(704, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(704, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(705, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(705, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(705, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation');

-- Run 101
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (101, 'RE_Butler', '2025-11-22 08:00:00', '2025-11-22 08:11:00', '2025-11-22 07:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(706, 101, 'RE_Butler', 'session_0706', NULL, 'What is artificial intelligence?', 'Expected output...', 2.2, 175, '2025-11-22 08:00:00'),
(707, 101, 'RE_Butler', 'session_0707', NULL, 'Explain machine learning', 'Expected output...', 3.2, 158, '2025-11-22 08:02:00'),
(708, 101, 'RE_Butler', 'session_0708', NULL, 'What are neural networks?', 'Expected output...', 2.1, 174, '2025-11-22 08:04:00'),
(709, 101, 'RE_Butler', 'session_0709', NULL, 'Define deep learning', 'Expected output...', 2.1, 172, '2025-11-22 08:06:00'),
(710, 101, 'RE_Butler', 'session_0710', NULL, 'What is natural language processing?', 'Expected output...', 3.1, 172, '2025-11-22 08:08:00'),
(711, 101, 'RE_Butler', 'session_0711', NULL, 'Explain computer vision', 'Expected output...', 2.2, 147, '2025-11-22 08:10:00'),
(712, 101, 'RE_Butler', 'session_0712', NULL, 'What is reinforcement learning?', 'Expected output...', 3.1, 178, '2025-11-22 08:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(706, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(707, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(708, 'Neural networks are computational architectures with interconnected processing nodes.'),
(709, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(710, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(711, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(712, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(706, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(706, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(706, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(707, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(707, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(707, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(708, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(708, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(708, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(709, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(709, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(709, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(710, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(710, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(710, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(711, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(711, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(711, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(712, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(712, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(712, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation');

-- Run 102
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (102, 'RE_Butler', '2025-11-22 10:00:00', '2025-11-22 10:15:00', '2025-11-22 09:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(713, 102, 'RE_Butler', 'session_0713', NULL, 'What is artificial intelligence?', 'Expected output...', 2.6, 161, '2025-11-22 10:00:00'),
(714, 102, 'RE_Butler', 'session_0714', NULL, 'Explain machine learning', 'Expected output...', 2.4, 162, '2025-11-22 10:02:00'),
(715, 102, 'RE_Butler', 'session_0715', NULL, 'What are neural networks?', 'Expected output...', 2.7, 162, '2025-11-22 10:04:00'),
(716, 102, 'RE_Butler', 'session_0716', NULL, 'Define deep learning', 'Expected output...', 2.7, 161, '2025-11-22 10:06:00'),
(717, 102, 'RE_Butler', 'session_0717', NULL, 'What is natural language processing?', 'Expected output...', 2.1, 165, '2025-11-22 10:08:00'),
(718, 102, 'RE_Butler', 'session_0718', NULL, 'Explain computer vision', 'Expected output...', 2.1, 150, '2025-11-22 10:10:00'),
(719, 102, 'RE_Butler', 'session_0719', NULL, 'What is reinforcement learning?', 'Expected output...', 2.7, 176, '2025-11-22 10:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(713, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(714, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(715, 'Neural networks are computational architectures with interconnected processing nodes.'),
(716, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(717, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(718, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(719, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(713, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(713, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(713, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation'),
(714, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(714, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(714, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(715, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(715, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(715, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(716, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(716, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(716, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(717, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(717, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(717, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(718, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(718, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(718, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(719, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(719, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(719, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation');

-- Run 103
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (103, 'RE_Butler', '2025-11-22 12:00:00', '2025-11-22 12:10:00', '2025-11-22 11:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(720, 103, 'RE_Butler', 'session_0720', NULL, 'What is artificial intelligence?', 'Expected output...', 3.1, 167, '2025-11-22 12:00:00'),
(721, 103, 'RE_Butler', 'session_0721', NULL, 'Explain machine learning', 'Expected output...', 2.3, 157, '2025-11-22 12:02:00'),
(722, 103, 'RE_Butler', 'session_0722', NULL, 'What are neural networks?', 'Expected output...', 2.9, 181, '2025-11-22 12:04:00'),
(723, 103, 'RE_Butler', 'session_0723', NULL, 'Define deep learning', 'Expected output...', 2.8, 178, '2025-11-22 12:06:00'),
(724, 103, 'RE_Butler', 'session_0724', NULL, 'What is natural language processing?', 'Expected output...', 2.9, 184, '2025-11-22 12:08:00'),
(725, 103, 'RE_Butler', 'session_0725', NULL, 'Explain computer vision', 'Expected output...', 3.1, 143, '2025-11-22 12:10:00'),
(726, 103, 'RE_Butler', 'session_0726', NULL, 'What is reinforcement learning?', 'Expected output...', 3.0, 145, '2025-11-22 12:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(720, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(721, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(722, 'Neural networks are computational architectures with interconnected processing nodes.'),
(723, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(724, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(725, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(726, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(720, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(720, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(720, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(721, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(721, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(721, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(722, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(722, 'RE_Butler', 'relevance', 0.95, 'Generated test evaluation'),
(722, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(723, 'RE_Butler', 'accuracy', 0.98, 'Generated test evaluation'),
(723, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(723, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(724, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(724, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(724, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(725, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(725, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(725, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(726, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(726, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(726, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation');

-- Run 104
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (104, 'RE_Butler', '2025-11-22 14:00:00', '2025-11-22 14:15:00', '2025-11-22 13:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(727, 104, 'RE_Butler', 'session_0727', NULL, 'What is artificial intelligence?', 'Expected output...', 2.6, 183, '2025-11-22 14:00:00'),
(728, 104, 'RE_Butler', 'session_0728', NULL, 'Explain machine learning', 'Expected output...', 2.8, 171, '2025-11-22 14:02:00'),
(729, 104, 'RE_Butler', 'session_0729', NULL, 'What are neural networks?', 'Expected output...', 2.6, 166, '2025-11-22 14:04:00'),
(730, 104, 'RE_Butler', 'session_0730', NULL, 'Define deep learning', 'Expected output...', 2.8, 149, '2025-11-22 14:06:00'),
(731, 104, 'RE_Butler', 'session_0731', NULL, 'What is natural language processing?', 'Expected output...', 2.5, 185, '2025-11-22 14:08:00'),
(732, 104, 'RE_Butler', 'session_0732', NULL, 'Explain computer vision', 'Expected output...', 3.2, 170, '2025-11-22 14:10:00'),
(733, 104, 'RE_Butler', 'session_0733', NULL, 'What is reinforcement learning?', 'Expected output...', 2.7, 145, '2025-11-22 14:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(727, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(728, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(729, 'Neural networks are computational architectures with interconnected processing nodes.'),
(730, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(731, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(732, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(733, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(727, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(727, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(727, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(728, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(728, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(728, 'RE_Butler', 'completeness', 0.9, 'Generated test evaluation'),
(729, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(729, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(729, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(730, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(730, 'RE_Butler', 'relevance', 0.92, 'Generated test evaluation'),
(730, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(731, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(731, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(731, 'RE_Butler', 'completeness', 0.86, 'Generated test evaluation'),
(732, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(732, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(732, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(733, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(733, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(733, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation');

-- Run 105
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (105, 'RE_Butler', '2025-11-22 16:00:00', '2025-11-22 16:14:00', '2025-11-22 15:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(734, 105, 'RE_Butler', 'session_0734', NULL, 'What is artificial intelligence?', 'Expected output...', 3.3, 150, '2025-11-22 16:00:00'),
(735, 105, 'RE_Butler', 'session_0735', NULL, 'Explain machine learning', 'Expected output...', 3.0, 162, '2025-11-22 16:02:00'),
(736, 105, 'RE_Butler', 'session_0736', NULL, 'What are neural networks?', 'Expected output...', 2.9, 169, '2025-11-22 16:04:00'),
(737, 105, 'RE_Butler', 'session_0737', NULL, 'Define deep learning', 'Expected output...', 2.7, 139, '2025-11-22 16:06:00'),
(738, 105, 'RE_Butler', 'session_0738', NULL, 'What is natural language processing?', 'Expected output...', 2.9, 183, '2025-11-22 16:08:00'),
(739, 105, 'RE_Butler', 'session_0739', NULL, 'Explain computer vision', 'Expected output...', 2.7, 150, '2025-11-22 16:10:00'),
(740, 105, 'RE_Butler', 'session_0740', NULL, 'What is reinforcement learning?', 'Expected output...', 2.6, 149, '2025-11-22 16:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(734, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(735, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(736, 'Neural networks are computational architectures with interconnected processing nodes.'),
(737, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(738, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(739, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(740, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(734, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(734, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(734, 'RE_Butler', 'completeness', 0.96, 'Generated test evaluation'),
(735, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(735, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(735, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(736, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(736, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(736, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(737, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(737, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(737, 'RE_Butler', 'completeness', 0.91, 'Generated test evaluation'),
(738, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(738, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(738, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(739, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(739, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(739, 'RE_Butler', 'completeness', 0.93, 'Generated test evaluation'),
(740, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(740, 'RE_Butler', 'relevance', 0.94, 'Generated test evaluation'),
(740, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation');

-- Run 106
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (106, 'RE_Butler', '2025-11-22 18:00:00', '2025-11-22 18:14:00', '2025-11-22 17:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(741, 106, 'RE_Butler', 'session_0741', NULL, 'What is artificial intelligence?', 'Expected output...', 2.5, 154, '2025-11-22 18:00:00'),
(742, 106, 'RE_Butler', 'session_0742', NULL, 'Explain machine learning', 'Expected output...', 2.7, 165, '2025-11-22 18:02:00'),
(743, 106, 'RE_Butler', 'session_0743', NULL, 'What are neural networks?', 'Expected output...', 2.4, 174, '2025-11-22 18:04:00'),
(744, 106, 'RE_Butler', 'session_0744', NULL, 'Define deep learning', 'Expected output...', 2.6, 160, '2025-11-22 18:06:00'),
(745, 106, 'RE_Butler', 'session_0745', NULL, 'What is natural language processing?', 'Expected output...', 2.9, 171, '2025-11-22 18:08:00'),
(746, 106, 'RE_Butler', 'session_0746', NULL, 'Explain computer vision', 'Expected output...', 2.5, 158, '2025-11-22 18:10:00'),
(747, 106, 'RE_Butler', 'session_0747', NULL, 'What is reinforcement learning?', 'Expected output...', 3.3, 148, '2025-11-22 18:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(741, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(742, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(743, 'Neural networks are computational architectures with interconnected processing nodes.'),
(744, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(745, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(746, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(747, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(741, 'RE_Butler', 'accuracy', 0.99, 'Generated test evaluation'),
(741, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(741, 'RE_Butler', 'completeness', 0.97, 'Generated test evaluation'),
(742, 'RE_Butler', 'accuracy', 0.96, 'Generated test evaluation'),
(742, 'RE_Butler', 'relevance', 0.98, 'Generated test evaluation'),
(742, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(743, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(743, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(743, 'RE_Butler', 'completeness', 0.99, 'Generated test evaluation'),
(744, 'RE_Butler', 'accuracy', 0.94, 'Generated test evaluation'),
(744, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(744, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation'),
(745, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(745, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(745, 'RE_Butler', 'completeness', 0.94, 'Generated test evaluation'),
(746, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(746, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(746, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation'),
(747, 'RE_Butler', 'accuracy', 0.93, 'Generated test evaluation'),
(747, 'RE_Butler', 'relevance', 0.97, 'Generated test evaluation'),
(747, 'RE_Butler', 'completeness', 0.98, 'Generated test evaluation');

-- Run 107
INSERT INTO evaluation.test_run (id, workflow_id, start_ts, finish_ts, creation_ts)
VALUES (107, 'RE_Butler', '2025-11-22 20:00:00', '2025-11-22 20:12:00', '2025-11-22 19:55:00');

INSERT INTO evaluation.test_execution (id, run_id, workflow_id, session_id, parent_execution_id, input, expected_output, duration, total_tokens, creation_ts)
VALUES
(748, 107, 'RE_Butler', 'session_0748', NULL, 'What is artificial intelligence?', 'Expected output...', 2.9, 155, '2025-11-22 20:00:00'),
(749, 107, 'RE_Butler', 'session_0749', NULL, 'Explain machine learning', 'Expected output...', 3.4, 176, '2025-11-22 20:02:00'),
(750, 107, 'RE_Butler', 'session_0750', NULL, 'What are neural networks?', 'Expected output...', 2.5, 184, '2025-11-22 20:04:00'),
(751, 107, 'RE_Butler', 'session_0751', NULL, 'Define deep learning', 'Expected output...', 2.1, 160, '2025-11-22 20:06:00'),
(752, 107, 'RE_Butler', 'session_0752', NULL, 'What is natural language processing?', 'Expected output...', 3.1, 185, '2025-11-22 20:08:00'),
(753, 107, 'RE_Butler', 'session_0753', NULL, 'Explain computer vision', 'Expected output...', 2.9, 178, '2025-11-22 20:10:00'),
(754, 107, 'RE_Butler', 'session_0754', NULL, 'What is reinforcement learning?', 'Expected output...', 2.1, 163, '2025-11-22 20:12:00');

INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES
(748, 'AI represents sophisticated algorithms enabling machines to perform cognitive tasks.'),
(749, 'Machine Learning empowers systems to identify patterns and make predictions from data.'),
(750, 'Neural networks are computational architectures with interconnected processing nodes.'),
(751, 'Deep Learning leverages multi-layered neural architectures for pattern recognition.'),
(752, 'Natural Language Processing enables intelligent human-computer language interaction.'),
(753, 'Computer vision extracts semantic understanding from visual data using deep learning.'),
(754, 'Reinforcement learning optimizes agent behavior through environmental interaction.');

INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
(748, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(748, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(748, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(749, 'RE_Butler', 'accuracy', 0.91, 'Generated test evaluation'),
(749, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(749, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(750, 'RE_Butler', 'accuracy', 0.95, 'Generated test evaluation'),
(750, 'RE_Butler', 'relevance', 0.99, 'Generated test evaluation'),
(750, 'RE_Butler', 'completeness', 0.89, 'Generated test evaluation'),
(751, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(751, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(751, 'RE_Butler', 'completeness', 0.88, 'Generated test evaluation'),
(752, 'RE_Butler', 'accuracy', 0.97, 'Generated test evaluation'),
(752, 'RE_Butler', 'relevance', 0.93, 'Generated test evaluation'),
(752, 'RE_Butler', 'completeness', 0.95, 'Generated test evaluation'),
(753, 'RE_Butler', 'accuracy', 0.89, 'Generated test evaluation'),
(753, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(753, 'RE_Butler', 'completeness', 0.87, 'Generated test evaluation'),
(754, 'RE_Butler', 'accuracy', 0.9, 'Generated test evaluation'),
(754, 'RE_Butler', 'relevance', 0.96, 'Generated test evaluation'),
(754, 'RE_Butler', 'completeness', 0.92, 'Generated test evaluation');

-- Reset sequences
SELECT setval('evaluation.test_run_id_seq', (SELECT MAX(id) FROM evaluation.test_run));
SELECT setval('evaluation.test_execution_id_seq', (SELECT MAX(id) FROM evaluation.test_execution));
SELECT setval('evaluation.test_response_id_seq', (SELECT MAX(id) FROM evaluation.test_response));
SELECT setval('evaluation.evaluation_id_seq', (SELECT MAX(id) FROM evaluation.evaluation));
