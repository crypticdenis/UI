--
-- PostgreSQL database dump
--

\restrict 40wSc7sQagQqWhrFQ2jZdAcor9oY8u5MdIsVa7TAXQprKIwBgrex6i1tidSE86b

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

\unrestrict 40wSc7sQagQqWhrFQ2jZdAcor9oY8u5MdIsVa7TAXQprKIwBgrex6i1tidSE86b

