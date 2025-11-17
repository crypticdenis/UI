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
