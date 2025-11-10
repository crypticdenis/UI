--
-- PostgreSQL database dump
--

\restrict cHm7flfdg8qGvnBNDsowSpS7l6dvpcFpcfqb0Yhqm5xcBCoz9i5t2uu00qjAcMi

-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: butler_user
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO butler_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: butler_user
--

CREATE TABLE public.projects (
    id character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.projects OWNER TO butler_user;

--
-- Name: TABLE projects; Type: COMMENT; Schema: public; Owner: butler_user
--

COMMENT ON TABLE public.projects IS 'Top-level organizational unit. Empty in current implementation.
Consider populating or removing if hierarchical structure is not needed.';


--
-- Name: question_evaluations; Type: TABLE; Schema: public; Owner: denis
--

CREATE TABLE public.question_evaluations (
    id integer NOT NULL,
    question_id integer NOT NULL,
    output_score numeric(3,2),
    rag_relevancy_score numeric(3,2),
    hallucination_rate numeric(3,2),
    system_prompt_alignment_score numeric(3,2),
    reasoning text,
    evaluation_metadata jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    test_score numeric(3,2),
    test_score_reason text
);


ALTER TABLE public.question_evaluations OWNER TO denis;

--
-- Name: TABLE question_evaluations; Type: COMMENT; Schema: public; Owner: denis
--

COMMENT ON TABLE public.question_evaluations IS 'Source of truth for evaluation scores. Contains individual question evaluations.
When adding new score metrics, add column here first, then sync to runs table.';


--
-- Name: question_evaluations_id_seq; Type: SEQUENCE; Schema: public; Owner: denis
--

CREATE SEQUENCE public.question_evaluations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.question_evaluations_id_seq OWNER TO denis;

--
-- Name: question_evaluations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: denis
--

ALTER SEQUENCE public.question_evaluations_id_seq OWNED BY public.question_evaluations.id;


--
-- Name: run_questions; Type: TABLE; Schema: public; Owner: denis
--

CREATE TABLE public.run_questions (
    id integer NOT NULL,
    run_id integer NOT NULL,
    question_number integer NOT NULL,
    question_text text NOT NULL,
    ground_truth_answer text,
    expected_sources text[],
    execution_answer text,
    execution_sources text[],
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.run_questions OWNER TO denis;

--
-- Name: TABLE run_questions; Type: COMMENT; Schema: public; Owner: denis
--

COMMENT ON TABLE public.run_questions IS 'Individual questions within test runs. Empty - data flow bypasses this table.';


--
-- Name: run_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: denis
--

CREATE SEQUENCE public.run_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.run_questions_id_seq OWNER TO denis;

--
-- Name: run_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: denis
--

ALTER SEQUENCE public.run_questions_id_seq OWNED BY public.run_questions.id;


--
-- Name: runs; Type: TABLE; Schema: public; Owner: butler_user
--

CREATE TABLE public.runs (
    id character varying(100) NOT NULL,
    workflow_id character varying(50),
    subworkflow_id character varying(50),
    base_id integer NOT NULL,
    version character varying(100) NOT NULL,
    active boolean DEFAULT false,
    is_running boolean DEFAULT false,
    model character varying(100) NOT NULL,
    prompt_version character varying(100) NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    ground_truth_id character varying(100),
    input_text text,
    expected_output text,
    execution_id character varying(100),
    output text,
    output_score numeric(5,4),
    output_score_reason text,
    rag_relevancy_score numeric(5,4),
    rag_relevancy_score_reason text,
    hallucination_rate numeric(5,4),
    hallucination_rate_reason text,
    system_prompt_alignment_score numeric(5,4),
    system_prompt_alignment_score_reason text,
    test_score numeric(5,4),
    CONSTRAINT check_parent CHECK ((((workflow_id IS NOT NULL) AND (subworkflow_id IS NULL)) OR ((workflow_id IS NULL) AND (subworkflow_id IS NOT NULL))))
);


ALTER TABLE public.runs OWNER TO butler_user;

--
-- Name: TABLE runs; Type: COMMENT; Schema: public; Owner: butler_user
--

COMMENT ON TABLE public.runs IS 'Denormalized view combining test execution results with evaluation scores. 
Backend reads from this table via SELECT * and dynamically extracts all score fields.
New metrics added here will automatically appear in the UI without code changes.';


--
-- Name: COLUMN runs.id; Type: COMMENT; Schema: public; Owner: butler_user
--

COMMENT ON COLUMN public.runs.id IS 'Composite key: {base_id}-{version}. Example: 42-run_gpt4_v1';


--
-- Name: COLUMN runs.output_score; Type: COMMENT; Schema: public; Owner: butler_user
--

COMMENT ON COLUMN public.runs.output_score IS 'Quality score for model output (0-1 scale). Higher is better.';


--
-- Name: COLUMN runs.test_score; Type: COMMENT; Schema: public; Owner: butler_user
--

COMMENT ON COLUMN public.runs.test_score IS 'Custom test metric added for validation (0-1 scale). Example of dynamic metric.';


--
-- Name: subworkflows; Type: TABLE; Schema: public; Owner: butler_user
--

CREATE TABLE public.subworkflows (
    id character varying(50) NOT NULL,
    workflow_id character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.subworkflows OWNER TO butler_user;

--
-- Name: TABLE subworkflows; Type: COMMENT; Schema: public; Owner: butler_user
--

COMMENT ON TABLE public.subworkflows IS 'Sub-components of workflows. Empty in current implementation.';


--
-- Name: workflows; Type: TABLE; Schema: public; Owner: butler_user
--

CREATE TABLE public.workflows (
    id character varying(50) NOT NULL,
    project_id character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.workflows OWNER TO butler_user;

--
-- Name: TABLE workflows; Type: COMMENT; Schema: public; Owner: butler_user
--

COMMENT ON TABLE public.workflows IS 'Evaluation workflows within projects. Empty in current implementation.';


--
-- Name: question_evaluations id; Type: DEFAULT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.question_evaluations ALTER COLUMN id SET DEFAULT nextval('public.question_evaluations_id_seq'::regclass);


--
-- Name: run_questions id; Type: DEFAULT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.run_questions ALTER COLUMN id SET DEFAULT nextval('public.run_questions_id_seq'::regclass);


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: butler_user
--

COPY public.projects (id, name, description, created_at, updated_at) FROM stdin;
proj-1	Butler Evaluation Project	Main evaluation project for Butler AI assistant with n8n workflows	2025-10-15 10:00:00	2025-11-06 14:30:00
\.


--
-- Data for Name: question_evaluations; Type: TABLE DATA; Schema: public; Owner: denis
--

COPY public.question_evaluations (id, question_id, output_score, rag_relevancy_score, hallucination_rate, system_prompt_alignment_score, reasoning, evaluation_metadata, created_at, updated_at, test_score, test_score_reason) FROM stdin;
5	5	0.72	0.77	0.42	0.67	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.96	\N
28	28	0.83	0.88	0.25	0.81	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.75	\N
29	29	0.85	0.90	0.37	0.83	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.68	\N
30	30	0.90	0.95	0.37	0.88	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.79	\N
31	31	0.87	0.92	0.37	0.85	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.79	\N
32	32	0.90	0.95	0.25	0.88	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.97	\N
33	33	0.85	0.90	0.34	0.83	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.92	\N
34	34	0.89	0.94	0.40	0.87	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.96	\N
35	35	0.91	0.96	0.34	0.89	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.98	\N
36	36	0.80	0.85	0.34	0.78	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.84	\N
37	37	0.81	0.86	0.29	0.79	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.88	\N
38	38	0.80	0.85	0.35	0.78	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.96	\N
39	39	0.75	0.80	0.35	0.73	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.93	\N
40	40	0.94	0.99	0.39	0.92	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.67	\N
41	41	0.83	0.88	0.38	0.81	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.69	\N
42	42	0.83	0.88	0.29	0.81	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.70	\N
43	43	0.91	0.96	0.28	0.89	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.64	\N
44	44	0.88	0.93	0.30	0.86	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.91	\N
45	45	0.88	0.93	0.37	0.86	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.91	\N
46	46	0.84	0.89	0.33	0.82	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.97	\N
47	47	0.79	0.84	0.36	0.77	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.78	\N
48	48	0.77	0.82	0.33	0.75	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.63	\N
49	49	0.95	1.00	0.34	0.93	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.93	\N
50	50	0.85	0.90	0.26	0.83	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.78	\N
51	51	0.97	0.94	0.36	0.87	GPT-4 Turbo shows improved output quality with better context understanding. Lower hallucination rate compared to GPT-4.	\N	2025-11-07 13:48:43.038675	2025-11-07 13:48:43.038675	0.70	\N
52	52	0.89	0.93	0.35	0.89	GPT-4 Turbo shows improved output quality with better context understanding. Lower hallucination rate compared to GPT-4.	\N	2025-11-07 13:48:43.038675	2025-11-07 13:48:43.038675	0.77	\N
53	53	0.93	0.94	0.37	0.94	GPT-4 Turbo shows improved output quality with better context understanding. Lower hallucination rate compared to GPT-4.	\N	2025-11-07 13:48:43.038675	2025-11-07 13:48:43.038675	0.81	\N
65	65	0.89	0.85	0.36	0.73	UserStory Creation v1: Good baseline performance with structured output.	\N	2025-11-07 13:49:10.096212	2025-11-07 13:49:10.096212	0.61	\N
66	66	0.85	0.91	0.29	0.85	UserStory Creation v2: Improved with better benefit clauses and more complete RAG retrieval.	\N	2025-11-07 13:49:10.09783	2025-11-07 13:49:10.09783	0.84	\N
67	67	0.82	0.90	0.40	0.89	UserStory Creation v2: Improved with better benefit clauses and more complete RAG retrieval.	\N	2025-11-07 13:49:10.09783	2025-11-07 13:49:10.09783	0.93	\N
68	68	0.86	0.93	0.29	0.85	UserStory Creation v2: Improved with better benefit clauses and more complete RAG retrieval.	\N	2025-11-07 13:49:10.09783	2025-11-07 13:49:10.09783	0.72	\N
69	69	0.93	0.93	0.38	0.86	UserStory Creation v2: Improved with better benefit clauses and more complete RAG retrieval.	\N	2025-11-07 13:49:10.09783	2025-11-07 13:49:10.09783	0.76	\N
70	70	0.86	0.89	0.29	0.92	UserStory Creation v2: Improved with better benefit clauses and more complete RAG retrieval.	\N	2025-11-07 13:49:10.09783	2025-11-07 13:49:10.09783	0.84	\N
71	71	0.85	0.87	0.48	0.90	Update flow showing good understanding of existing context and modification requirements.	\N	2025-11-07 13:49:48.342584	2025-11-07 13:49:48.342584	0.73	\N
72	72	0.84	0.92	0.47	0.82	Update flow showing good understanding of existing context and modification requirements.	\N	2025-11-07 13:49:48.342584	2025-11-07 13:49:48.342584	0.62	\N
73	73	0.93	0.87	0.32	0.78	Update flow showing good understanding of existing context and modification requirements.	\N	2025-11-07 13:49:48.342584	2025-11-07 13:49:48.342584	0.95	\N
74	74	0.92	0.85	0.46	0.85	Update flow showing good understanding of existing context and modification requirements.	\N	2025-11-07 13:49:48.342584	2025-11-07 13:49:48.342584	0.89	\N
75	75	0.93	0.97	0.34	0.96	Information retrieval excellent with high RAG relevancy and accurate source citations.	\N	2025-11-07 13:49:48.344367	2025-11-07 13:49:48.344367	0.93	\N
76	76	0.87	0.94	0.33	0.91	Information retrieval excellent with high RAG relevancy and accurate source citations.	\N	2025-11-07 13:49:48.344367	2025-11-07 13:49:48.344367	0.70	\N
77	77	0.88	0.94	0.33	0.94	Information retrieval excellent with high RAG relevancy and accurate source citations.	\N	2025-11-07 13:49:48.344367	2025-11-07 13:49:48.344367	0.81	\N
78	78	0.88	0.98	0.24	0.93	Information retrieval excellent with high RAG relevancy and accurate source citations.	\N	2025-11-07 13:49:48.344367	2025-11-07 13:49:48.344367	0.91	\N
79	79	0.93	0.94	0.24	0.85	Information retrieval excellent with high RAG relevancy and accurate source citations.	\N	2025-11-07 13:49:48.344367	2025-11-07 13:49:48.344367	0.87	\N
80	80	0.92	0.90	0.30	0.92	Search flow performs well with accurate result counts and relevant story retrieval.	\N	2025-11-07 13:50:07.298577	2025-11-07 13:50:07.298577	0.64	\N
81	81	0.96	0.92	0.37	0.89	Search flow performs well with accurate result counts and relevant story retrieval.	\N	2025-11-07 13:50:07.298577	2025-11-07 13:50:07.298577	0.91	\N
82	82	0.89	0.92	0.32	0.92	Search flow performs well with accurate result counts and relevant story retrieval.	\N	2025-11-07 13:50:07.298577	2025-11-07 13:50:07.298577	0.85	\N
83	83	0.94	0.93	0.40	0.82	Search flow performs well with accurate result counts and relevant story retrieval.	\N	2025-11-07 13:50:07.298577	2025-11-07 13:50:07.298577	0.86	\N
84	84	0.84	0.91	0.27	0.82	Search flow performs well with accurate result counts and relevant story retrieval.	\N	2025-11-07 13:50:07.298577	2025-11-07 13:50:07.298577	0.88	\N
85	85	0.87	0.94	0.33	0.85	Search flow performs well with accurate result counts and relevant story retrieval.	\N	2025-11-07 13:50:07.298577	2025-11-07 13:50:07.298577	0.67	\N
1	1	0.75	0.85	0.42	0.70	Good output but missing benefit clause. RAG retrieved correct policy. Some hallucination in formatting.	\N	2025-11-07 12:49:57.85803	2025-11-07 12:49:57.85803	0.79	\N
2	2	0.80	0.88	0.35	0.75	Found most stories, missed one. Good retrieval relevance.	\N	2025-11-07 12:49:57.85803	2025-11-07 12:49:57.85803	0.87	\N
3	3	0.88	0.90	0.30	0.85	Excellent output with complete benefit clause. Perfect RAG retrieval. Low hallucination.	\N	2025-11-07 12:49:57.859139	2025-11-07 12:49:57.859139	0.61	\N
4	4	0.85	0.92	0.32	0.80	Perfect retrieval of all stories. Excellent RAG relevance.	\N	2025-11-07 12:49:57.859139	2025-11-07 12:49:57.859139	0.76	\N
6	6	0.74	0.79	0.34	0.69	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.63	\N
7	7	0.76	0.81	0.34	0.71	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.71	\N
8	8	0.86	0.91	0.39	0.81	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.74	\N
9	9	0.77	0.82	0.42	0.72	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.98	\N
10	10	0.77	0.82	0.43	0.72	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.91	\N
11	11	0.73	0.78	0.39	0.68	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.63	\N
12	12	0.72	0.77	0.43	0.67	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.95	\N
13	13	0.88	0.93	0.32	0.83	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.75	\N
14	14	0.73	0.78	0.36	0.68	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.77	\N
15	15	0.82	0.87	0.37	0.77	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.97	\N
16	16	0.79	0.84	0.45	0.74	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.71	\N
17	17	0.73	0.78	0.42	0.68	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.67	\N
18	18	0.78	0.83	0.43	0.73	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.64	\N
19	19	0.71	0.76	0.39	0.66	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.83	\N
20	20	0.76	0.81	0.36	0.71	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.88	\N
21	21	0.80	0.85	0.38	0.75	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.61	\N
22	22	0.85	0.90	0.42	0.80	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.93	\N
23	23	0.81	0.86	0.44	0.76	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.78	\N
24	24	0.81	0.86	0.33	0.76	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.64	\N
25	25	0.88	0.93	0.42	0.83	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.62	\N
26	26	0.73	0.78	0.44	0.68	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.86	\N
27	27	0.87	0.92	0.40	0.82	\N	\N	2025-11-07 12:49:57.85958	2025-11-07 12:49:57.85958	0.99	\N
54	54	0.94	0.94	0.37	0.87	GPT-4 Turbo shows improved output quality with better context understanding. Lower hallucination rate compared to GPT-4.	\N	2025-11-07 13:48:43.038675	2025-11-07 13:48:43.038675	0.66	\N
55	55	0.96	0.93	0.26	0.86	GPT-4 Turbo shows improved output quality with better context understanding. Lower hallucination rate compared to GPT-4.	\N	2025-11-07 13:48:43.038675	2025-11-07 13:48:43.038675	0.63	\N
56	56	0.97	0.95	0.34	0.91	GPT-4 Turbo shows improved output quality with better context understanding. Lower hallucination rate compared to GPT-4.	\N	2025-11-07 13:48:43.038675	2025-11-07 13:48:43.038675	0.84	\N
57	57	0.94	0.98	0.33	0.95	GPT-4 Turbo shows improved output quality with better context understanding. Lower hallucination rate compared to GPT-4.	\N	2025-11-07 13:48:43.038675	2025-11-07 13:48:43.038675	0.61	\N
58	58	0.90	0.92	0.40	0.87	GPT-4 Turbo shows improved output quality with better context understanding. Lower hallucination rate compared to GPT-4.	\N	2025-11-07 13:48:43.038675	2025-11-07 13:48:43.038675	0.94	\N
59	59	0.98	0.94	0.32	0.88	GPT-4 Turbo shows improved output quality with better context understanding. Lower hallucination rate compared to GPT-4.	\N	2025-11-07 13:48:43.038675	2025-11-07 13:48:43.038675	0.93	\N
60	60	0.97	0.93	0.35	0.89	GPT-4 Turbo shows improved output quality with better context understanding. Lower hallucination rate compared to GPT-4.	\N	2025-11-07 13:48:43.038675	2025-11-07 13:48:43.038675	0.91	\N
61	61	0.80	0.83	0.42	0.81	UserStory Creation v1: Good baseline performance with structured output.	\N	2025-11-07 13:49:10.096212	2025-11-07 13:49:10.096212	0.89	\N
62	62	0.76	0.83	0.39	0.83	UserStory Creation v1: Good baseline performance with structured output.	\N	2025-11-07 13:49:10.096212	2025-11-07 13:49:10.096212	0.94	\N
63	63	0.77	0.83	0.38	0.80	UserStory Creation v1: Good baseline performance with structured output.	\N	2025-11-07 13:49:10.096212	2025-11-07 13:49:10.096212	0.80	\N
64	64	0.86	0.90	0.36	0.81	UserStory Creation v1: Good baseline performance with structured output.	\N	2025-11-07 13:49:10.096212	2025-11-07 13:49:10.096212	0.99	\N
\.


--
-- Data for Name: run_questions; Type: TABLE DATA; Schema: public; Owner: denis
--

COPY public.run_questions (id, run_id, question_number, question_text, ground_truth_answer, expected_sources, execution_answer, execution_sources, created_at) FROM stdin;
1	1	1	Create a user story for password reset functionality	Als Mitarbeiter:in möchte ich mein Passwort selbst zurücksetzen können, damit ich schnell wieder Zugriff erhalte	{"IT Security Policy","User Management Guidelines"}	Als Mitarbeiter:in möchte ich mein Passwort selbst zurücksetzen können	{"IT Security Policy"}	2025-11-07 12:49:57.855929
2	1	2	Find existing user stories related to authentication	Found 5 user stories: ABC-123, ABC-124, ABC-125, ABC-126, ABC-127	{"Azure DevOps Project"}	Found 4 user stories: ABC-123, ABC-124, ABC-125, ABC-126	{"Azure DevOps Project"}	2025-11-07 12:49:57.855929
3	2	1	Create a user story for password reset functionality	Als Mitarbeiter:in möchte ich mein Passwort selbst zurücksetzen können, damit ich schnell wieder Zugriff erhalte	{"IT Security Policy","User Management Guidelines"}	Als Mitarbeiter:in möchte ich mein Passwort selbst zurücksetzen können, damit ich ohne Helpdesk-Kontakt wieder arbeiten kann	{"IT Security Policy","User Management Guidelines"}	2025-11-07 12:49:57.857615
4	2	2	Find existing user stories related to authentication	Found 5 user stories: ABC-123, ABC-124, ABC-125, ABC-126, ABC-127	{"Azure DevOps Project"}	Found 5 user stories: ABC-123, ABC-124, ABC-125, ABC-126, ABC-127	{"Azure DevOps Project"}	2025-11-07 12:49:57.857615
5	1	3	Sample question 3 for testing	Expected answer 3	\N	Actual answer 3	\N	2025-11-07 12:49:57.85958
6	1	4	Sample question 4 for testing	Expected answer 4	\N	Actual answer 4	\N	2025-11-07 12:49:57.85958
7	1	5	Sample question 5 for testing	Expected answer 5	\N	Actual answer 5	\N	2025-11-07 12:49:57.85958
8	1	6	Sample question 6 for testing	Expected answer 6	\N	Actual answer 6	\N	2025-11-07 12:49:57.85958
9	1	7	Sample question 7 for testing	Expected answer 7	\N	Actual answer 7	\N	2025-11-07 12:49:57.85958
10	1	8	Sample question 8 for testing	Expected answer 8	\N	Actual answer 8	\N	2025-11-07 12:49:57.85958
11	1	9	Sample question 9 for testing	Expected answer 9	\N	Actual answer 9	\N	2025-11-07 12:49:57.85958
12	1	10	Sample question 10 for testing	Expected answer 10	\N	Actual answer 10	\N	2025-11-07 12:49:57.85958
13	1	11	Sample question 11 for testing	Expected answer 11	\N	Actual answer 11	\N	2025-11-07 12:49:57.85958
14	1	12	Sample question 12 for testing	Expected answer 12	\N	Actual answer 12	\N	2025-11-07 12:49:57.85958
15	1	13	Sample question 13 for testing	Expected answer 13	\N	Actual answer 13	\N	2025-11-07 12:49:57.85958
16	1	14	Sample question 14 for testing	Expected answer 14	\N	Actual answer 14	\N	2025-11-07 12:49:57.85958
17	1	15	Sample question 15 for testing	Expected answer 15	\N	Actual answer 15	\N	2025-11-07 12:49:57.85958
18	1	16	Sample question 16 for testing	Expected answer 16	\N	Actual answer 16	\N	2025-11-07 12:49:57.85958
19	1	17	Sample question 17 for testing	Expected answer 17	\N	Actual answer 17	\N	2025-11-07 12:49:57.85958
20	1	18	Sample question 18 for testing	Expected answer 18	\N	Actual answer 18	\N	2025-11-07 12:49:57.85958
21	1	19	Sample question 19 for testing	Expected answer 19	\N	Actual answer 19	\N	2025-11-07 12:49:57.85958
22	1	20	Sample question 20 for testing	Expected answer 20	\N	Actual answer 20	\N	2025-11-07 12:49:57.85958
23	1	21	Sample question 21 for testing	Expected answer 21	\N	Actual answer 21	\N	2025-11-07 12:49:57.85958
24	1	22	Sample question 22 for testing	Expected answer 22	\N	Actual answer 22	\N	2025-11-07 12:49:57.85958
25	1	23	Sample question 23 for testing	Expected answer 23	\N	Actual answer 23	\N	2025-11-07 12:49:57.85958
26	1	24	Sample question 24 for testing	Expected answer 24	\N	Actual answer 24	\N	2025-11-07 12:49:57.85958
27	1	25	Sample question 25 for testing	Expected answer 25	\N	Actual answer 25	\N	2025-11-07 12:49:57.85958
28	2	3	Sample question 3 for testing v2	Expected answer 3	\N	Improved answer 3	\N	2025-11-07 12:49:57.85958
29	2	4	Sample question 4 for testing v2	Expected answer 4	\N	Improved answer 4	\N	2025-11-07 12:49:57.85958
30	2	5	Sample question 5 for testing v2	Expected answer 5	\N	Improved answer 5	\N	2025-11-07 12:49:57.85958
31	2	6	Sample question 6 for testing v2	Expected answer 6	\N	Improved answer 6	\N	2025-11-07 12:49:57.85958
32	2	7	Sample question 7 for testing v2	Expected answer 7	\N	Improved answer 7	\N	2025-11-07 12:49:57.85958
33	2	8	Sample question 8 for testing v2	Expected answer 8	\N	Improved answer 8	\N	2025-11-07 12:49:57.85958
34	2	9	Sample question 9 for testing v2	Expected answer 9	\N	Improved answer 9	\N	2025-11-07 12:49:57.85958
35	2	10	Sample question 10 for testing v2	Expected answer 10	\N	Improved answer 10	\N	2025-11-07 12:49:57.85958
36	2	11	Sample question 11 for testing v2	Expected answer 11	\N	Improved answer 11	\N	2025-11-07 12:49:57.85958
37	2	12	Sample question 12 for testing v2	Expected answer 12	\N	Improved answer 12	\N	2025-11-07 12:49:57.85958
38	2	13	Sample question 13 for testing v2	Expected answer 13	\N	Improved answer 13	\N	2025-11-07 12:49:57.85958
39	2	14	Sample question 14 for testing v2	Expected answer 14	\N	Improved answer 14	\N	2025-11-07 12:49:57.85958
40	2	15	Sample question 15 for testing v2	Expected answer 15	\N	Improved answer 15	\N	2025-11-07 12:49:57.85958
41	2	16	Sample question 16 for testing v2	Expected answer 16	\N	Improved answer 16	\N	2025-11-07 12:49:57.85958
42	2	17	Sample question 17 for testing v2	Expected answer 17	\N	Improved answer 17	\N	2025-11-07 12:49:57.85958
43	2	18	Sample question 18 for testing v2	Expected answer 18	\N	Improved answer 18	\N	2025-11-07 12:49:57.85958
44	2	19	Sample question 19 for testing v2	Expected answer 19	\N	Improved answer 19	\N	2025-11-07 12:49:57.85958
45	2	20	Sample question 20 for testing v2	Expected answer 20	\N	Improved answer 20	\N	2025-11-07 12:49:57.85958
46	2	21	Sample question 21 for testing v2	Expected answer 21	\N	Improved answer 21	\N	2025-11-07 12:49:57.85958
47	2	22	Sample question 22 for testing v2	Expected answer 22	\N	Improved answer 22	\N	2025-11-07 12:49:57.85958
48	2	23	Sample question 23 for testing v2	Expected answer 23	\N	Improved answer 23	\N	2025-11-07 12:49:57.85958
49	2	24	Sample question 24 for testing v2	Expected answer 24	\N	Improved answer 24	\N	2025-11-07 12:49:57.85958
50	2	25	Sample question 25 for testing v2	Expected answer 25	\N	Improved answer 25	\N	2025-11-07 12:49:57.85958
51	3	1	Create a user story for email notification settings	Als Benutzer:in möchte ich meine E-Mail-Benachrichtigungen anpassen können, damit ich nur relevante Updates erhalte	{"User Settings Guide","Notification Policy"}	Als Benutzer:in möchte ich E-Mail-Benachrichtigungen konfigurieren können	{"User Settings Guide"}	2025-11-07 13:48:43.035441
52	3	2	Create a user story for two-factor authentication	Als Benutzer:in möchte ich Zwei-Faktor-Authentifizierung aktivieren können, damit mein Konto sicherer ist	{"Security Guidelines","Authentication Policy"}	Als Benutzer:in möchte ich 2FA einrichten können für bessere Sicherheit	{"Security Guidelines"}	2025-11-07 13:48:43.035441
53	3	3	Create a user story for data export functionality	Als Benutzer:in möchte ich meine Daten exportieren können, damit ich eine Sicherungskopie habe	{"Data Management","GDPR Compliance"}	Als Benutzer:in möchte ich Daten exportieren können	{"Data Management"}	2025-11-07 13:48:43.035441
54	3	4	Create a user story for profile picture upload	Als Benutzer:in möchte ich ein Profilbild hochladen können, damit andere mich erkennen	{"User Profile Specs","Media Guidelines"}	Als Benutzer:in möchte ich mein Profilbild ändern können	{"User Profile Specs"}	2025-11-07 13:48:43.035441
55	3	5	Create a user story for search functionality	Als Benutzer:in möchte ich nach User Stories suchen können, damit ich schnell relevante Informationen finde	{"Search Requirements","UX Guidelines"}	Als Benutzer:in möchte ich eine Suchfunktion nutzen können	{"Search Requirements"}	2025-11-07 13:48:43.035441
56	3	6	Create a user story for dark mode	Als Benutzer:in möchte ich zwischen hellem und dunklem Modus wechseln können, damit ich die Anzeige an meine Präferenz anpassen kann	{"UI Guidelines","Accessibility Standards"}	Als Benutzer:in möchte ich Dark Mode aktivieren können	{"UI Guidelines"}	2025-11-07 13:48:43.035441
57	3	7	Create a user story for language preferences	Als Benutzer:in möchte ich meine bevorzugte Sprache einstellen können, damit die Oberfläche in meiner Sprache angezeigt wird	{"Localization Guide","Language Support"}	Als Benutzer:in möchte ich die Sprache ändern können	{"Localization Guide"}	2025-11-07 13:48:43.035441
58	3	8	Create a user story for activity log	Als Benutzer:in möchte ich meine letzten Aktivitäten sehen können, damit ich meine Arbeitshistorie nachvollziehen kann	{"Audit Requirements","User Activity Tracking"}	Als Benutzer:in möchte ich ein Aktivitätsprotokoll einsehen	{"Audit Requirements"}	2025-11-07 13:48:43.035441
59	3	9	Create a user story for batch operations	Als Benutzer:in möchte ich mehrere User Stories gleichzeitig bearbeiten können, damit ich effizienter arbeite	{"Bulk Operations Guide","Performance Requirements"}	Als Benutzer:in möchte ich Massenoperationen durchführen können	{"Bulk Operations Guide"}	2025-11-07 13:48:43.035441
60	3	10	Create a user story for keyboard shortcuts	Als Benutzer:in möchte ich Tastaturkürzel verwenden können, damit ich schneller navigieren kann	{"Accessibility Standards","UX Best Practices"}	Als Benutzer:in möchte ich Shortcuts nutzen können	{"Accessibility Standards"}	2025-11-07 13:48:43.035441
61	4	1	Create user story: Add new customer	Als Vertriebsmitarbeiter:in möchte ich neue Kunden anlegen können, damit ich ihre Daten im System erfasse	{"CRM Requirements","Data Entry Guidelines"}	Als Vertriebsmitarbeiter:in möchte ich Kunden hinzufügen können	{"CRM Requirements"}	2025-11-07 13:49:10.094312
62	4	2	Create user story: Generate invoice	Als Buchhalter:in möchte ich Rechnungen erstellen können, damit ich Zahlungen abrechnen kann	{"Invoicing Policy","Finance Guidelines"}	Als Buchhalter:in möchte ich Rechnungen generieren können	{"Invoicing Policy"}	2025-11-07 13:49:10.094312
63	4	3	Create user story: Schedule meeting	Als Projektmanager:in möchte ich Meetings planen können, damit das Team koordiniert arbeitet	{"Calendar Integration","Meeting Guidelines"}	Als Projektmanager:in möchte ich Termine einstellen können	{"Calendar Integration"}	2025-11-07 13:49:10.094312
64	4	4	Create user story: Track time	Als Entwickler:in möchte ich meine Arbeitszeit erfassen können, damit Projekte korrekt abgerechnet werden	{"Time Tracking Policy","Project Management"}	Als Entwickler:in möchte ich Zeit buchen können	{"Time Tracking Policy"}	2025-11-07 13:49:10.094312
65	4	5	Create user story: Generate report	Als Manager:in möchte ich Berichte erstellen können, damit ich den Projektstatus überwache	{"Reporting Requirements","BI Guidelines"}	Als Manager:in möchte ich Reports generieren können	{"Reporting Requirements"}	2025-11-07 13:49:10.094312
66	5	1	Create user story: Add new customer	Als Vertriebsmitarbeiter:in möchte ich neue Kunden anlegen können, damit ich ihre Daten im System erfasse	{"CRM Requirements","Data Entry Guidelines"}	Als Vertriebsmitarbeiter:in möchte ich neue Kunden im System erfassen können, damit ich ihre Informationen verwalte	{"CRM Requirements","Data Entry Guidelines"}	2025-11-07 13:49:10.097435
67	5	2	Create user story: Generate invoice	Als Buchhalter:in möchte ich Rechnungen erstellen können, damit ich Zahlungen abrechnen kann	{"Invoicing Policy","Finance Guidelines"}	Als Buchhalter:in möchte ich Rechnungen erstellen können, damit ich die Zahlung vom Kunden erhalte	{"Invoicing Policy","Finance Guidelines"}	2025-11-07 13:49:10.097435
68	5	3	Create user story: Schedule meeting	Als Projektmanager:in möchte ich Meetings planen können, damit das Team koordiniert arbeitet	{"Calendar Integration","Meeting Guidelines"}	Als Projektmanager:in möchte ich Besprechungen terminieren können, damit das Team effektiv zusammenarbeitet	{"Calendar Integration","Meeting Guidelines"}	2025-11-07 13:49:10.097435
69	5	4	Create user story: Track time	Als Entwickler:in möchte ich meine Arbeitszeit erfassen können, damit Projekte korrekt abgerechnet werden	{"Time Tracking Policy","Project Management"}	Als Entwickler:in möchte ich meine Arbeitsstunden tracken können, damit die Abrechnung korrekt erfolgt	{"Time Tracking Policy","Project Management"}	2025-11-07 13:49:10.097435
70	5	5	Create user story: Generate report	Als Manager:in möchte ich Berichte erstellen können, damit ich den Projektstatus überwache	{"Reporting Requirements","BI Guidelines"}	Als Manager:in möchte ich Statusberichte generieren können, damit ich den Projektfortschritt überwache	{"Reporting Requirements","BI Guidelines"}	2025-11-07 13:49:10.097435
71	6	1	Update user story: Add acceptance criteria	Als Product Owner möchte ich Akzeptanzkriterien zu User Stories hinzufügen können, damit die Definition of Done klar ist	{"Scrum Guide","DoD Template"}	Als Product Owner möchte ich Akzeptanzkriterien ergänzen können	{"Scrum Guide"}	2025-11-07 13:49:48.340356
72	6	2	Update user story: Change priority	Als Product Owner möchte ich die Priorität von User Stories ändern können, damit wichtige Features zuerst entwickelt werden	{"Backlog Management","Priority Framework"}	Als Product Owner möchte ich Prioritäten anpassen können	{"Backlog Management"}	2025-11-07 13:49:48.340356
73	6	3	Update user story: Assign to sprint	Als Scrum Master möchte ich User Stories einem Sprint zuordnen können, damit die Planung strukturiert erfolgt	{"Sprint Planning Guide","Agile Practices"}	Als Scrum Master möchte ich Stories zu Sprints hinzufügen	{"Sprint Planning Guide"}	2025-11-07 13:49:48.340356
74	6	4	Update user story: Add story points	Als Team möchten wir Story Points schätzen können, damit wir die Velocity messen	{"Estimation Guide","Planning Poker"}	Als Team möchten wir Aufwandsschätzungen hinzufügen	{"Estimation Guide"}	2025-11-07 13:49:48.340356
75	7	1	Find documentation about authentication	Authentication requires OAuth 2.0 with JWT tokens. See Security Guidelines section 3.2.	{"Security Guidelines","API Documentation"}	OAuth 2.0 with JWT tokens is required for authentication as per security standards	{"Security Guidelines","API Documentation"}	2025-11-07 13:49:48.343988
76	7	2	Find best practices for error handling	Use structured error responses with error codes, messages, and details. Log all errors centrally.	{"Error Handling Guide","Logging Best Practices"}	Implement structured error responses and central logging	{"Error Handling Guide"}	2025-11-07 13:49:48.343988
77	7	3	Find deployment procedures	Deployments follow CI/CD pipeline: Build → Test → Staging → Production with automated rollback.	{"DevOps Guide","Deployment Checklist"}	Use CI/CD pipeline with automated testing and rollback capability	{"DevOps Guide","Deployment Checklist"}	2025-11-07 13:49:48.343988
78	7	4	Find data retention policy	Personal data retained for 7 years, logs for 90 days, backups for 30 days per GDPR requirements.	{"Data Policy","GDPR Compliance"}	GDPR-compliant retention: 7 years for personal data, 90 days for logs	{"Data Policy","GDPR Compliance"}	2025-11-07 13:49:48.343988
79	7	5	Find code review guidelines	All PRs require 2 approvals, automated tests must pass, code coverage >80%.	{"Development Standards","Code Review Process"}	Two approvals required with 80% code coverage threshold	{"Development Standards"}	2025-11-07 13:49:48.343988
80	8	1	Search for authentication related stories	Found 3 stories: Login functionality, Password reset, Two-factor authentication	{"User Stories Backlog","Security Features"}	3 authentication stories found: Login, Password reset, 2FA	{"User Stories Backlog"}	2025-11-07 13:50:07.296523
81	8	2	Search for reporting features	Found 5 stories: Dashboard, Export to PDF, Custom reports, Analytics, Charts	{"User Stories Backlog","Reporting Module"}	5 reporting features: Dashboard, PDF export, Custom reports, Analytics, Charts	{"User Stories Backlog","Reporting Module"}	2025-11-07 13:50:07.296523
82	8	3	Search for payment related stories	Found 4 stories: Payment processing, Invoice generation, Refunds, Subscription management	{"User Stories Backlog","Payment Features"}	Payment stories: Processing, Invoicing, Refunds, Subscriptions (4 total)	{"User Stories Backlog"}	2025-11-07 13:50:07.296523
83	8	4	Search for notification stories	Found 6 stories: Email notifications, Push notifications, SMS alerts, In-app messages, Notification preferences, Quiet hours	{"User Stories Backlog","Notification System"}	6 notification stories including Email, Push, SMS, In-app, Preferences, Quiet hours	{"User Stories Backlog","Notification System"}	2025-11-07 13:50:07.296523
84	8	5	Search for mobile features	Found 7 stories: Mobile responsive design, Touch gestures, Offline mode, Camera integration, GPS location, Biometric auth, Mobile notifications	{"User Stories Backlog","Mobile Features"}	7 mobile features: Responsive design, Touch, Offline, Camera, GPS, Biometric, Notifications	{"User Stories Backlog","Mobile Features"}	2025-11-07 13:50:07.296523
85	8	6	Search for admin panel features	Found 8 stories: User management, Role permissions, System settings, Audit logs, Backup/restore, Monitoring dashboard, Analytics, API keys	{"User Stories Backlog","Admin Module"}	8 admin features: Users, Roles, Settings, Logs, Backup, Monitoring, Analytics, API keys	{"User Stories Backlog","Admin Module"}	2025-11-07 13:50:07.296523
\.


--
-- Data for Name: runs; Type: TABLE DATA; Schema: public; Owner: butler_user
--

COPY public.runs (id, workflow_id, subworkflow_id, base_id, version, active, is_running, model, prompt_version, "timestamp", ground_truth_id, input_text, expected_output, execution_id, output, output_score, output_score_reason, rag_relevancy_score, rag_relevancy_score_reason, hallucination_rate, hallucination_rate_reason, system_prompt_alignment_score, system_prompt_alignment_score_reason, test_score) FROM stdin;
1-main_workflow_v1	wf-1	\N	1	main_workflow_v1	f	f	gpt-4	v1.0	2025-11-01 09:00:00	GT001-main_v1	Teste den kompletten Butler Workflow	Der Butler Workflow sollte alle Anfragen korrekt verarbeiten und relevante Informationen aus der Wissensdatenbank abrufen.	EX001-main_v1	Butler Workflow läuft erfolgreich und verarbeitet Anfragen mit hoher Genauigkeit.	0.8500	Good overall performance	0.9200	Excellent context retrieval	0.1500	Low hallucination rate	0.8800	Strong alignment with instructions	0.7900
4-main_workflow_v2	wf-1	\N	1	main_workflow_v2	f	f	gpt-4-turbo	v2.0	2025-11-05 14:00:00	GT001-main_v2	Teste den kompletten Butler Workflow	Der Butler Workflow sollte alle Anfragen korrekt verarbeiten und relevante Informationen aus der Wissensdatenbank abrufen.	EX001-main_v2	Der Butler Workflow verarbeitet Anfragen effizient und liefert präzise Antworten basierend auf der Wissensdatenbank.	0.9100	Excellent performance with v2	0.9500	Outstanding retrieval quality	0.0900	Very low hallucination	0.9300	Excellent alignment	0.7900
1-run_gpt4_v1	\N	subwf-1	1	run_gpt4_v1	f	f	gpt-4	v1.0	2025-11-01 10:00:00	GT001-run_gpt4_v1	Was ist immo+ ?	Smart Immo+ (SI+) ist ein EnBW-Geschäftsbereich, der B2B-Dienstleistungen für Unternehmen anbietet. SI+ vertreibt EnBW Commodity über die Wohnungswirtschaftsbranche. \n\nDie Hauptzielgruppe sind Wohnungswirtschaftsunternehmen (WWU), die mindestens fünf und teilweise bis zu Tausende Immobilien in ihrem WWU-Bestand verwalten. WWU profitieren von attraktiven B2B-Lieferkonditionen für ihren gesamten Verwalterbestand und wünschen sich skalierbare und effiziente Möglichkeiten für resultierende Lieferstellen- und Energievertragsdatenverwaltung in hohem Volumen. \n\nImmobilienverwalter verantworten die Erfüllung gesetzlicher Pflichten wie die Verwaltung von Lieferstellen aus ihrem Immobilienbestand. SI+ Kunden sind in Masse für die reibungslose Energieversorgung von Lieferstellen für Allgemein- und Leerstandversorgung verantwortlich.\n\nDas SI+ Angebot unterstützt die Tagesgeschäftanforderungen für WWU und deren Mitarbeiter insbesondere durch exklusive SI+ Online-Portal-Services, welche u.A. durch Standardisierung von Formularen und Prozessen auf Kunden und Anbieterseite die Effizienz für erforderliche Meldeprozesse und resultierender Energiekunden und -vertragsverwaltung für Allgemein und/oder Leerstandsversorgung positiv unterstützt.	EX001-run_gpt4_v1	immo+ ist ein von EnBW angebotenes Geschäftsportal für Wohnungswirtschaftsunternehmen (WWU), das die zentrale Verwaltung von Energielieferstellen für Allgemein- und Leerstandversorgung ermöglicht. Durch standardisierte Meldeprozesse, ein zentrales Kundenportal und günstige Commodity-Preise reduziert es den administrativen Aufwand für WWU mit mindestens 5 Immobilien (15 Lieferstellen) im Bestand.	0.6100	The Actual Output correctly identifies immo+ as an EnBW portal for WWU, mentions centralized management of energy delivery points, and highlights reduced administrative effort for companies with at least 5 properties. However, it omits several key details from the Expected Output: it does not mention the B2B nature of the service, the scalability for thousands of properties, the fulfillment of legal obligations, or the exclusive SI+ online portal services. The Actual Output is clear and mostly accurate but lacks the depth and completeness of the Expected Output.	0.8540	The score is 0.85 because, despite several irrelevant elements like section headings and placeholders, the retrieval context contains many detailed and directly relevant statements explaining what immo+ is, such as 'Das Smart immo+ Angebot der EnBW verfolgt das Ziel, Commodity-Vertrieb für Allgemein- und Leerstandversorgung über den B2B-Vertriebsweg Wohnungswirtschaftsbranche zu betreiben.'	0.3900	Geschätzt aus Output-Qualitätsscore	0.7300	Geschätzt basierend auf Relevanz und Output-Score	0.7900
3-run_gpt4_v2	\N	subwf-1	1	run_gpt4_v2	f	f	gpt-4	v2.0	2025-11-04 15:30:00	GT001-run_gpt4_v2	Was ist immo+ ?	Smart Immo+ (SI+) ist ein EnBW-Geschäftsbereich, der B2B-Dienstleistungen für Unternehmen anbietet. SI+ vertreibt EnBW Commodity über die Wohnungswirtschaftsbranche. \n\nDie Hauptzielgruppe sind Wohnungswirtschaftsunternehmen (WWU), die mindestens fünf und teilweise bis zu Tausende Immobilien in ihrem WWU-Bestand verwalten. WWU profitieren von attraktiven B2B-Lieferkonditionen für ihren gesamten Verwalterbestand und wünschen sich skalierbare und effiziente Möglichkeiten für resultierende Lieferstellen- und Energievertragsdatenverwaltung in hohem Volumen. \n\nImmobilienverwalter verantworten die Erfüllung gesetzlicher Pflichten wie die Verwaltung von Lieferstellen aus ihrem Immobilienbestand. SI+ Kunden sind in Masse für die reibungslose Energieversorgung von Lieferstellen für Allgemein- und Leerstandversorgung verantwortlich.\n\nDas SI+ Angebot unterstützt die Tagesgeschäftanforderungen für WWU und deren Mitarbeiter insbesondere durch exklusive SI+ Online-Portal-Services, welche u.A. durch Standardisierung von Formularen und Prozessen auf Kunden und Anbieterseite die Effizienz für erforderliche Meldeprozesse und resultierender Energiekunden und -vertragsverwaltung für Allgemein und/oder Leerstandsversorgung positiv unterstützt.	EX001-run_gpt4_v2	Smart Immo+ (SI+) ist ein B2B-Geschäftsbereich der EnBW, der sich auf Dienstleistungen für Wohnungswirtschaftsunternehmen (WWU) spezialisiert hat. SI+ ermöglicht WWU die effiziente Verwaltung von Energielieferstellen für Allgemein- und Leerstandversorgung durch standardisierte Prozesse, exklusive Online-Portal-Services und attraktive Commodity-Konditionen.	0.8200	Much improved with v2.0 prompt - captures key B2B nature and main services	0.9100	Excellent retrieval with better context selection	0.1800	Significantly reduced hallucination	0.8500	Strong improvement in alignment	0.7900
5-run_claude_v1	\N	subwf-1	1	run_claude_v1	f	f	claude-3-sonnet	v1.0	2025-11-03 11:20:00	GT001-run_claude_v1	Was ist immo+ ?	Smart Immo+ (SI+) ist ein EnBW-Geschäftsbereich, der B2B-Dienstleistungen für Unternehmen anbietet. SI+ vertreibt EnBW Commodity über die Wohnungswirtschaftsbranche. \n\nDie Hauptzielgruppe sind Wohnungswirtschaftsunternehmen (WWU), die mindestens fünf und teilweise bis zu Tausende Immobilien in ihrem WWU-Bestand verwalten. WWU profitieren von attraktiven B2B-Lieferkonditionen für ihren gesamten Verwalterbestand und wünschen sich skalierbare und effiziente Möglichkeiten für resultierende Lieferstellen- und Energievertragsdatenverwaltung in hohem Volumen. \n\nImmobilienverwalter verantworten die Erfüllung gesetzlicher Pflichten wie die Verwaltung von Lieferstellen aus ihrem Immobilienbestand. SI+ Kunden sind in Masse für die reibungslose Energieversorgung von Lieferstellen für Allgemein- und Leerstandversorgung verantwortlich.\n\nDas SI+ Angebot unterstützt die Tagesgeschäftanforderungen für WWU und deren Mitarbeiter insbesondere durch exklusive SI+ Online-Portal-Services, welche u.A. durch Standardisierung von Formularen und Prozessen auf Kunden und Anbieterseite die Effizienz für erforderliche Meldeprozesse und resultierender Energiekunden und -vertragsverwaltung für Allgemein und/oder Leerstandsversorgung positiv unterstützt.	EX001-run_claude_v1	Smart Immo+ ist ein spezialisierter B2B-Service der EnBW für die Wohnungswirtschaftsbranche. Das Angebot richtet sich an Wohnungswirtschaftsunternehmen (WWU) und unterstützt diese bei der effizienten Verwaltung von Energielieferstellen durch Online-Portal-Services, standardisierte Prozesse und günstige Energiekonditionen.	0.7400	Solid answer covering main aspects, Claude's concise style	0.8800	Good context retrieval	0.2600	Acceptable hallucination level	0.7900	Good alignment	0.7900
2-main_workflow_v1	wf-1	\N	2	main_workflow_v1	f	f	gpt-4	v1.0	2025-11-01 09:00:00	GT002-main_v1	Wie funktioniert die Energieabrechnung?	Die Energieabrechnung erfolgt monatlich basierend auf den erfassten Zählerständen.	EX002-main_v1	Die Abrechnung wird monatlich durchgeführt und basiert auf den gemeldeten Verbrauchswerten.	0.7800	Acceptable answer quality	0.8200	Good context usage	0.2200	Some minor inaccuracies	0.7500	Moderate alignment	0.8700
5-main_workflow_v2	wf-1	\N	2	main_workflow_v2	f	f	gpt-4-turbo	v2.0	2025-11-05 14:00:00	GT002-main_v2	Wie funktioniert die Energieabrechnung?	Die Energieabrechnung erfolgt monatlich basierend auf den erfassten Zählerständen.	EX002-main_v2	Die Energieabrechnung wird monatlich durchgeführt und basiert auf den aktuellen Zählerständen der Lieferstellen.	0.8900	Very good answer with improved accuracy	0.9100	Excellent context retrieval	0.1100	Minimal hallucination	0.8700	Strong alignment	0.8700
2-run_gpt4_v1	\N	subwf-1	2	run_gpt4_v1	f	f	gpt-4	v1.0	2025-11-01 10:00:00	GT002-run_gpt4_v1	Wofür steht WWU?	WWU steht für Wohnungswirtschaftsunternehmen – ein Unternehmen, das in der Wohnungswirtschaft tätig ist, wie z. B. eine Baugenossenschaft oder eine Hausverwaltung - Hauptsache Immobilienverwalter. \n\nDiese Firmen übernehmen Verwalterpflichten für oder als Immobilieneigentümer und sind genau deswegen Hauptzielgruppe des B2B-Geschäftsbereichs Smart Immo+. WWU erfüllt für jede Lieferstelle aus dem Verwalterbestand (Allgemein- und Leerstandversorgung) in nachgewiesener Verwalterrolle die gesetzlichen Pflichten der eigentlichen Immobilien-/Wohnraumeigentümer.\n\nWWU fungiert für den beim Energieversorger nachgewiesenen Lieferstellenbestand - rechtlich anerkannte Vertretung des belieferten Energiekunden (Immobilieneigentümer). WWU erfüllen alle klassischen Lieferkunden-Aufgaben von Energieversorgerwahl, Abschlagzahlung, Zählerstände, Rechnungen und Kundendatenpflege. WWU verwalten Energielieferkunden und -verträge aus ihrem Bestand vom jeweiligen Lieferstart bis zum Lieferende.	EX002-run_gpt4_v1	WWU steht für **Wohnungswirtschaftsunternehmen**. Das sind Unternehmen wie Baugenossenschaften oder Hausverwaltungen, die im Rahmen der Immobilienverwaltung als Eigen- oder Fremdleistung tätig sind und gesetzlich vorgeschriebene Versorgungspflichten für Allgemein- und Leerstandversorgung übernehmen.	0.4320	The Actual Output correctly defines WWU as Wohnungswirtschaftsunternehmen and mentions examples like Baugenossenschaften and Hausverwaltungen, aligning with the Expected Output. However, it omits several key details: the specific role of WWU as the main B2B target for Smart Immo+, their legal representation of energy customers, and their responsibilities regarding energy supply management (e.g., supplier selection, billing, meter readings). The Actual Output is clear but lacks the depth and completeness found in the Expected Output.	0.5640	The score is 0.56 because, while the relevant statements clearly define 'WWU' as 'Wohnungswirtschaftsunternehmen' and provide detailed context, the majority of the retrieval context is not directly answering what 'WWU' stands for, as noted in the irrelevancy reasons such as 'does not explain what WWU stands for' and 'describes the responsibilities of a WWU, not what the abbreviation stands for.'	0.5700	Geschätzt aus Output-Qualitätsscore	0.4500	Geschätzt basierend auf Relevanz und Output-Score	0.8700
4-run_gpt4_v2	\N	subwf-1	2	run_gpt4_v2	f	f	gpt-4	v2.0	2025-11-04 15:30:00	GT002-run_gpt4_v2	Wofür steht WWU?	WWU steht für Wohnungswirtschaftsunternehmen – ein Unternehmen, das in der Wohnungswirtschaft tätig ist, wie z. B. eine Baugenossenschaft oder eine Hausverwaltung - Hauptsache Immobilienverwalter. \n\nDiese Firmen übernehmen Verwalterpflichten für oder als Immobilieneigentümer und sind genau deswegen Hauptzielgruppe des B2B-Geschäftsbereichs Smart Immo+. WWU erfüllt für jede Lieferstelle aus dem Verwalterbestand (Allgemein- und Leerstandversorgung) in nachgewiesener Verwalterrolle die gesetzlichen Pflichten der eigentlichen Immobilien-/Wohnraumeigentümer.\n\nWWU fungiert für den beim Energieversorger nachgewiesenen Lieferstellenbestand - rechtlich anerkannte Vertretung des belieferten Energiekunden (Immobilieneigentümer). WWU erfüllen alle klassischen Lieferkunden-Aufgaben von Energieversorgerwahl, Abschlagzahlung, Zählerstände, Rechnungen und Kundendatenpflege. WWU verwalten Energielieferkunden und -verträge aus ihrem Bestand vom jeweiligen Lieferstart bis zum Lieferende.	EX002-run_gpt4_v2	WWU steht für Wohnungswirtschaftsunternehmen. Das sind Unternehmen wie Baugenossenschaften oder Hausverwaltungen, die als Immobilienverwalter tätig sind. Sie sind die Hauptzielgruppe von Smart Immo+ und übernehmen als rechtlich anerkannte Vertretung der Immobilieneigentümer alle Aufgaben der Energieversorgung, einschließlich Vertragsmanagement, Abschlagzahlungen und Rechnungsverwaltung für Lieferstellen.	0.7800	Good improvement - includes key role in Smart Immo+ and legal representation	0.8400	Better context selection with improved relevance	0.2200	Reduced hallucination rate	0.8100	Improved alignment with better completeness	0.8700
3-main_workflow_v1	wf-1	\N	3	main_workflow_v1	f	f	gpt-4	v1.0	2025-11-01 09:00:00	GT003-main_v1	Was sind die Vorteile von Smart Immo+?	Smart Immo+ bietet Wohnungswirtschaftsunternehmen attraktive B2B-Konditionen, standardisierte Prozesse und effiziente Verwaltung von Energielieferstellen.	EX003-main_v1	Die Vorteile sind günstige Energiepreise, zentrale Verwaltung und vereinfachte Prozesse für WWU.	0.7200	Covers main points but lacks detail	0.7900	Relevant but could be more specific	0.2800	Some generalizations	0.7100	Adequate alignment	0.6100
6-main_workflow_v2	wf-1	\N	3	main_workflow_v2	f	f	gpt-4-turbo	v2.0	2025-11-05 14:00:00	GT003-main_v2	Was sind die Vorteile von Smart Immo+?	Smart Immo+ bietet Wohnungswirtschaftsunternehmen attraktive B2B-Konditionen, standardisierte Prozesse und effiziente Verwaltung von Energielieferstellen.	EX003-main_v2	Smart Immo+ bietet Wohnungswirtschaftsunternehmen attraktive B2B-Lieferkonditionen, standardisierte und effiziente Prozesse für die Verwaltung von Energielieferstellen sowie exklusive Online-Portal-Services.	0.9400	Excellent comprehensive answer	0.9600	Highly relevant with specific details	0.0600	Almost no hallucination	0.9500	Outstanding alignment	0.6100
3-run_claude_v1	\N	subwf-2	3	run_claude_v1	f	f	claude-3	v1.0	2025-11-05 16:00:00	GT003-run_claude_v1	Was ist immo+ ?	Smart Immo+ (SI+) ist ein EnBW-Geschäftsbereich, der B2B-Dienstleistungen für Unternehmen anbietet.	EX003-run_claude_v1	immo+ ist ein Business-Portal der EnBW für Wohnungswirtschaftsunternehmen zur Verwaltung von Energielieferstellen.	0.7500	Good summary but missing some details	0.9200	Excellent retrieval of relevant context	0.2500	Minimal hallucination detected	0.8800	Strong alignment with system prompt	0.6100
4-run_gpt4_v1	\N	subwf-2	4	run_gpt4_v1	f	f	gpt-4	v1.0	2025-11-02 10:00:00	GT004-run_gpt4_v1	Was ist immo+ ?	Smart Immo+ (SI+) ist ein EnBW-Geschäftsbereich, der B2B-Dienstleistungen für Unternehmen anbietet.	EX004-run_gpt4_v1	Immo+ ist ein EnBW-Portal für Wohnungswirtschaft zur Verwaltung von Energieverträgen.	0.6500	Basic answer, missing B2B context	0.7600	Moderate retrieval quality	0.3500	Some information not from context	0.7200	Acceptable alignment	0.7600
5-run_claude_v2	\N	subwf-2	5	run_claude_v2	f	f	claude-3-opus	v2.0	2025-11-06 09:00:00	GT005-run_claude_v2	Was ist immo+ ?	Smart Immo+ (SI+) ist ein EnBW-Geschäftsbereich, der B2B-Dienstleistungen für Unternehmen anbietet.	EX005-run_claude_v2	Smart Immo+ ist ein B2B-Geschäftsbereich der EnBW, spezialisiert auf Dienstleistungen für Wohnungswirtschaftsunternehmen. Der Service bietet standardisierte Prozesse für die Verwaltung von Energielieferstellen, attraktive Commodity-Konditionen und exklusive Online-Portal-Funktionen.	0.8700	Excellent comprehensive answer with v2.0 and Opus model	0.9400	Outstanding context retrieval and usage	0.1300	Very low hallucination	0.9100	Excellent alignment	0.9600
6-run_gpt4turbo_v2	\N	subwf-2	6	run_gpt4turbo_v2	f	f	gpt-4-turbo	v2.0	2025-11-06 14:00:00	GT006-run_gpt4turbo_v2	Was ist immo+ ?	Smart Immo+ (SI+) ist ein EnBW-Geschäftsbereich, der B2B-Dienstleistungen für Unternehmen anbietet.	EX006-run_gpt4turbo_v2	Smart Immo+ (SI+) ist ein EnBW-Geschäftsbereich, der B2B-Dienstleistungen für Wohnungswirtschaftsunternehmen anbietet. SI+ vertreibt EnBW Commodity über die Wohnungswirtschaftsbranche und unterstützt WWU durch Online-Portal-Services, standardisierte Prozesse und attraktive Lieferkonditionen bei der effizienten Verwaltung von Energielieferstellen.	0.9300	Excellent comprehensive answer, nearly perfect	0.9700	Outstanding retrieval with high precision	0.0700	Minimal hallucination	0.9600	Near perfect alignment	0.6300
\.


--
-- Data for Name: subworkflows; Type: TABLE DATA; Schema: public; Owner: butler_user
--

COPY public.subworkflows (id, workflow_id, name, description, created_at, updated_at) FROM stdin;
subwf-1	wf-1	Question Answering Subworkflow	Evaluates Butler's question answering capabilities	2025-10-15 11:00:00	2025-11-06 14:30:00
subwf-2	wf-1	RAG Performance Subworkflow	Tests retrieval-augmented generation performance	2025-10-20 09:00:00	2025-11-05 16:00:00
\.


--
-- Data for Name: workflows; Type: TABLE DATA; Schema: public; Owner: butler_user
--

COPY public.workflows (id, project_id, name, description, created_at, updated_at) FROM stdin;
wf-1	proj-1	Main Butler Workflow	Primary workflow for Butler evaluation with its own runs and subworkflows	2025-10-15 10:30:00	2025-11-06 14:30:00
\.


--
-- Name: question_evaluations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: denis
--

SELECT pg_catalog.setval('public.question_evaluations_id_seq', 85, true);


--
-- Name: run_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: denis
--

SELECT pg_catalog.setval('public.run_questions_id_seq', 85, true);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: butler_user
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: question_evaluations question_evaluations_pkey; Type: CONSTRAINT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.question_evaluations
    ADD CONSTRAINT question_evaluations_pkey PRIMARY KEY (id);


--
-- Name: run_questions run_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.run_questions
    ADD CONSTRAINT run_questions_pkey PRIMARY KEY (id);


--
-- Name: run_questions run_questions_run_id_question_number_key; Type: CONSTRAINT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.run_questions
    ADD CONSTRAINT run_questions_run_id_question_number_key UNIQUE (run_id, question_number);


--
-- Name: runs runs_pkey; Type: CONSTRAINT; Schema: public; Owner: butler_user
--

ALTER TABLE ONLY public.runs
    ADD CONSTRAINT runs_pkey PRIMARY KEY (id);


--
-- Name: subworkflows subworkflows_pkey; Type: CONSTRAINT; Schema: public; Owner: butler_user
--

ALTER TABLE ONLY public.subworkflows
    ADD CONSTRAINT subworkflows_pkey PRIMARY KEY (id);


--
-- Name: workflows workflows_pkey; Type: CONSTRAINT; Schema: public; Owner: butler_user
--

ALTER TABLE ONLY public.workflows
    ADD CONSTRAINT workflows_pkey PRIMARY KEY (id);


--
-- Name: idx_question_evaluations_question; Type: INDEX; Schema: public; Owner: denis
--

CREATE INDEX idx_question_evaluations_question ON public.question_evaluations USING btree (question_id);


--
-- Name: idx_question_evaluations_question_id; Type: INDEX; Schema: public; Owner: denis
--

CREATE INDEX idx_question_evaluations_question_id ON public.question_evaluations USING btree (question_id);


--
-- Name: idx_run_questions_run; Type: INDEX; Schema: public; Owner: denis
--

CREATE INDEX idx_run_questions_run ON public.run_questions USING btree (run_id);


--
-- Name: idx_runs_active; Type: INDEX; Schema: public; Owner: butler_user
--

CREATE INDEX idx_runs_active ON public.runs USING btree (active);


--
-- Name: idx_runs_base_id; Type: INDEX; Schema: public; Owner: butler_user
--

CREATE INDEX idx_runs_base_id ON public.runs USING btree (base_id);


--
-- Name: idx_runs_base_id_version; Type: INDEX; Schema: public; Owner: butler_user
--

CREATE INDEX idx_runs_base_id_version ON public.runs USING btree (base_id, version);


--
-- Name: idx_runs_subworkflow_id; Type: INDEX; Schema: public; Owner: butler_user
--

CREATE INDEX idx_runs_subworkflow_id ON public.runs USING btree (subworkflow_id);


--
-- Name: idx_runs_timestamp; Type: INDEX; Schema: public; Owner: butler_user
--

CREATE INDEX idx_runs_timestamp ON public.runs USING btree ("timestamp");


--
-- Name: idx_runs_version; Type: INDEX; Schema: public; Owner: butler_user
--

CREATE INDEX idx_runs_version ON public.runs USING btree (version);


--
-- Name: idx_runs_workflow_id; Type: INDEX; Schema: public; Owner: butler_user
--

CREATE INDEX idx_runs_workflow_id ON public.runs USING btree (workflow_id);


--
-- Name: idx_subworkflows_workflow_id; Type: INDEX; Schema: public; Owner: butler_user
--

CREATE INDEX idx_subworkflows_workflow_id ON public.subworkflows USING btree (workflow_id);


--
-- Name: idx_workflows_project_id; Type: INDEX; Schema: public; Owner: butler_user
--

CREATE INDEX idx_workflows_project_id ON public.workflows USING btree (project_id);


--
-- Name: question_evaluations question_evaluations_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.question_evaluations
    ADD CONSTRAINT question_evaluations_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.run_questions(id) ON DELETE CASCADE;


--
-- Name: runs runs_subworkflow_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: butler_user
--

ALTER TABLE ONLY public.runs
    ADD CONSTRAINT runs_subworkflow_id_fkey FOREIGN KEY (subworkflow_id) REFERENCES public.subworkflows(id) ON DELETE CASCADE;


--
-- Name: runs runs_workflow_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: butler_user
--

ALTER TABLE ONLY public.runs
    ADD CONSTRAINT runs_workflow_id_fkey FOREIGN KEY (workflow_id) REFERENCES public.workflows(id) ON DELETE CASCADE;


--
-- Name: subworkflows subworkflows_workflow_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: butler_user
--

ALTER TABLE ONLY public.subworkflows
    ADD CONSTRAINT subworkflows_workflow_id_fkey FOREIGN KEY (workflow_id) REFERENCES public.workflows(id) ON DELETE CASCADE;


--
-- Name: workflows workflows_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: butler_user
--

ALTER TABLE ONLY public.workflows
    ADD CONSTRAINT workflows_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: denis
--

GRANT ALL ON SCHEMA public TO butler_user;


--
-- Name: TABLE question_evaluations; Type: ACL; Schema: public; Owner: denis
--

GRANT ALL ON TABLE public.question_evaluations TO butler_user;


--
-- Name: SEQUENCE question_evaluations_id_seq; Type: ACL; Schema: public; Owner: denis
--

GRANT ALL ON SEQUENCE public.question_evaluations_id_seq TO butler_user;


--
-- Name: TABLE run_questions; Type: ACL; Schema: public; Owner: denis
--

GRANT ALL ON TABLE public.run_questions TO butler_user;


--
-- Name: SEQUENCE run_questions_id_seq; Type: ACL; Schema: public; Owner: denis
--

GRANT ALL ON SEQUENCE public.run_questions_id_seq TO butler_user;


--
-- PostgreSQL database dump complete
--

\unrestrict cHm7flfdg8qGvnBNDsowSpS7l6dvpcFpcfqb0Yhqm5xcBCoz9i5t2uu00qjAcMi

