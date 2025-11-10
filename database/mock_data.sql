-- Mock Data for Butler Evaluation Database
-- This file populates the database with all the data from your JSON files

-- Insert Projects
INSERT INTO projects (id, name, description, created_at, updated_at) VALUES
('proj-1', 'Butler Evaluation Project', 'Main evaluation project for Butler AI assistant with n8n workflows', '2025-10-15 10:00:00', '2025-11-06 14:30:00');

-- Insert Workflows
INSERT INTO workflows (id, project_id, name, description, created_at, updated_at) VALUES
('wf-1', 'proj-1', 'Main Butler Workflow', 'Primary workflow for Butler evaluation with its own runs and subworkflows', '2025-10-15 10:30:00', '2025-11-06 14:30:00');

-- Insert Subworkflows
INSERT INTO subworkflows (id, workflow_id, name, description, created_at, updated_at) VALUES
('subwf-1', 'wf-1', 'Question Answering Subworkflow', 'Evaluates Butler''s question answering capabilities', '2025-10-15 11:00:00', '2025-11-06 14:30:00'),
('subwf-2', 'wf-1', 'RAG Performance Subworkflow', 'Tests retrieval-augmented generation performance', '2025-10-20 09:00:00', '2025-11-05 16:00:00');

-- Insert Workflow Runs (Main Butler Workflow)
INSERT INTO runs (id, workflow_id, base_id, version, active, is_running, model, prompt_version, timestamp,
                 ground_truth_id, input_text, expected_output,
                 execution_id, output, output_score, output_score_reason,
                 rag_relevancy_score, rag_relevancy_score_reason,
                 hallucination_rate, hallucination_rate_reason,
                 system_prompt_alignment_score, system_prompt_alignment_score_reason) VALUES
-- v1 Runs
('1-main_workflow_v1', 'wf-1', 1, 'main_workflow_v1', false, false, 'gpt-4', 'v1.0', '2025-11-01 09:00:00',
 'GT001-main_v1', 'Teste den kompletten Butler Workflow', 'Der Butler Workflow sollte alle Anfragen korrekt verarbeiten und relevante Informationen aus der Wissensdatenbank abrufen.',
 'EX001-main_v1', 'Butler Workflow läuft erfolgreich und verarbeitet Anfragen mit hoher Genauigkeit.', 0.85, 'Good overall performance',
 0.92, 'Excellent context retrieval', 0.15, 'Low hallucination rate', 0.88, 'Strong alignment with instructions'),

('2-main_workflow_v1', 'wf-1', 2, 'main_workflow_v1', false, false, 'gpt-4', 'v1.0', '2025-11-01 09:00:00',
 'GT002-main_v1', 'Wie funktioniert die Energieabrechnung?', 'Die Energieabrechnung erfolgt monatlich basierend auf den erfassten Zählerständen.',
 'EX002-main_v1', 'Die Abrechnung wird monatlich durchgeführt und basiert auf den gemeldeten Verbrauchswerten.', 0.78, 'Acceptable answer quality',
 0.82, 'Good context usage', 0.22, 'Some minor inaccuracies', 0.75, 'Moderate alignment'),

('3-main_workflow_v1', 'wf-1', 3, 'main_workflow_v1', false, false, 'gpt-4', 'v1.0', '2025-11-01 09:00:00',
 'GT003-main_v1', 'Was sind die Vorteile von Smart Immo+?', 'Smart Immo+ bietet Wohnungswirtschaftsunternehmen attraktive B2B-Konditionen, standardisierte Prozesse und effiziente Verwaltung von Energielieferstellen.',
 'EX003-main_v1', 'Die Vorteile sind günstige Energiepreise, zentrale Verwaltung und vereinfachte Prozesse für WWU.', 0.72, 'Covers main points but lacks detail',
 0.79, 'Relevant but could be more specific', 0.28, 'Some generalizations', 0.71, 'Adequate alignment'),

-- v2 Runs
('4-main_workflow_v2', 'wf-1', 1, 'main_workflow_v2', false, false, 'gpt-4-turbo', 'v2.0', '2025-11-05 14:00:00',
 'GT001-main_v2', 'Teste den kompletten Butler Workflow', 'Der Butler Workflow sollte alle Anfragen korrekt verarbeiten und relevante Informationen aus der Wissensdatenbank abrufen.',
 'EX001-main_v2', 'Der Butler Workflow verarbeitet Anfragen effizient und liefert präzise Antworten basierend auf der Wissensdatenbank.', 0.91, 'Excellent performance with v2',
 0.95, 'Outstanding retrieval quality', 0.09, 'Very low hallucination', 0.93, 'Excellent alignment'),

('5-main_workflow_v2', 'wf-1', 2, 'main_workflow_v2', false, false, 'gpt-4-turbo', 'v2.0', '2025-11-05 14:00:00',
 'GT002-main_v2', 'Wie funktioniert die Energieabrechnung?', 'Die Energieabrechnung erfolgt monatlich basierend auf den erfassten Zählerständen.',
 'EX002-main_v2', 'Die Energieabrechnung wird monatlich durchgeführt und basiert auf den aktuellen Zählerständen der Lieferstellen.', 0.89, 'Very good answer with improved accuracy',
 0.91, 'Excellent context retrieval', 0.11, 'Minimal hallucination', 0.87, 'Strong alignment'),

('6-main_workflow_v2', 'wf-1', 3, 'main_workflow_v2', false, false, 'gpt-4-turbo', 'v2.0', '2025-11-05 14:00:00',
 'GT003-main_v2', 'Was sind die Vorteile von Smart Immo+?', 'Smart Immo+ bietet Wohnungswirtschaftsunternehmen attraktive B2B-Konditionen, standardisierte Prozesse und effiziente Verwaltung von Energielieferstellen.',
 'EX003-main_v2', 'Smart Immo+ bietet Wohnungswirtschaftsunternehmen attraktive B2B-Lieferkonditionen, standardisierte und effiziente Prozesse für die Verwaltung von Energielieferstellen sowie exklusive Online-Portal-Services.', 0.94, 'Excellent comprehensive answer',
 0.96, 'Highly relevant with specific details', 0.06, 'Almost no hallucination', 0.95, 'Outstanding alignment');

-- Insert Subworkflow Runs (Question Answering Subworkflow - subwf-1)
INSERT INTO runs (id, subworkflow_id, base_id, version, active, is_running, model, prompt_version, timestamp,
                 ground_truth_id, input_text, expected_output,
                 execution_id, output, output_score, output_score_reason,
                 rag_relevancy_score, rag_relevancy_score_reason,
                 hallucination_rate, hallucination_rate_reason,
                 system_prompt_alignment_score, system_prompt_alignment_score_reason) VALUES
('1-run_gpt4_v1', 'subwf-1', 1, 'run_gpt4_v1', false, false, 'gpt-4', 'v1.0', '2025-11-01 10:00:00',
 'GT001-run_gpt4_v1', 'Was ist immo+ ?', 'Smart Immo+ (SI+) ist ein EnBW-Geschäftsbereich, der B2B-Dienstleistungen für Unternehmen anbietet. SI+ vertreibt EnBW Commodity über die Wohnungswirtschaftsbranche. 

Die Hauptzielgruppe sind Wohnungswirtschaftsunternehmen (WWU), die mindestens fünf und teilweise bis zu Tausende Immobilien in ihrem WWU-Bestand verwalten. WWU profitieren von attraktiven B2B-Lieferkonditionen für ihren gesamten Verwalterbestand und wünschen sich skalierbare und effiziente Möglichkeiten für resultierende Lieferstellen- und Energievertragsdatenverwaltung in hohem Volumen. 

Immobilienverwalter verantworten die Erfüllung gesetzlicher Pflichten wie die Verwaltung von Lieferstellen aus ihrem Immobilienbestand. SI+ Kunden sind in Masse für die reibungslose Energieversorgung von Lieferstellen für Allgemein- und Leerstandversorgung verantwortlich.

Das SI+ Angebot unterstützt die Tagesgeschäftanforderungen für WWU und deren Mitarbeiter insbesondere durch exklusive SI+ Online-Portal-Services, welche u.A. durch Standardisierung von Formularen und Prozessen auf Kunden und Anbieterseite die Effizienz für erforderliche Meldeprozesse und resultierender Energiekunden und -vertragsverwaltung für Allgemein und/oder Leerstandsversorgung positiv unterstützt.',
 'EX001-run_gpt4_v1', 'immo+ ist ein von EnBW angebotenes Geschäftsportal für Wohnungswirtschaftsunternehmen (WWU), das die zentrale Verwaltung von Energielieferstellen für Allgemein- und Leerstandversorgung ermöglicht. Durch standardisierte Meldeprozesse, ein zentrales Kundenportal und günstige Commodity-Preise reduziert es den administrativen Aufwand für WWU mit mindestens 5 Immobilien (15 Lieferstellen) im Bestand.', 0.61, 'The Actual Output correctly identifies immo+ as an EnBW portal for WWU, mentions centralized management of energy delivery points, and highlights reduced administrative effort for companies with at least 5 properties. However, it omits several key details from the Expected Output: it does not mention the B2B nature of the service, the scalability for thousands of properties, the fulfillment of legal obligations, or the exclusive SI+ online portal services. The Actual Output is clear and mostly accurate but lacks the depth and completeness of the Expected Output.',
 0.854, 'The score is 0.85 because, despite several irrelevant elements like section headings and placeholders, the retrieval context contains many detailed and directly relevant statements explaining what immo+ is, such as ''Das Smart immo+ Angebot der EnBW verfolgt das Ziel, Commodity-Vertrieb für Allgemein- und Leerstandversorgung über den B2B-Vertriebsweg Wohnungswirtschaftsbranche zu betreiben.''', 0.39, 'Geschätzt aus Output-Qualitätsscore', 0.73, 'Geschätzt basierend auf Relevanz und Output-Score'),

('2-run_gpt4_v1', 'subwf-1', 2, 'run_gpt4_v1', false, false, 'gpt-4', 'v1.0', '2025-11-01 10:00:00',
 'GT002-run_gpt4_v1', 'Wofür steht WWU?', 'WWU steht für Wohnungswirtschaftsunternehmen – ein Unternehmen, das in der Wohnungswirtschaft tätig ist, wie z. B. eine Baugenossenschaft oder eine Hausverwaltung - Hauptsache Immobilienverwalter. 

Diese Firmen übernehmen Verwalterpflichten für oder als Immobilieneigentümer und sind genau deswegen Hauptzielgruppe des B2B-Geschäftsbereichs Smart Immo+. WWU erfüllt für jede Lieferstelle aus dem Verwalterbestand (Allgemein- und Leerstandversorgung) in nachgewiesener Verwalterrolle die gesetzlichen Pflichten der eigentlichen Immobilien-/Wohnraumeigentümer.

WWU fungiert für den beim Energieversorger nachgewiesenen Lieferstellenbestand - rechtlich anerkannte Vertretung des belieferten Energiekunden (Immobilieneigentümer). WWU erfüllen alle klassischen Lieferkunden-Aufgaben von Energieversorgerwahl, Abschlagzahlung, Zählerstände, Rechnungen und Kundendatenpflege. WWU verwalten Energielieferkunden und -verträge aus ihrem Bestand vom jeweiligen Lieferstart bis zum Lieferende.',
 'EX002-run_gpt4_v1', 'WWU steht für **Wohnungswirtschaftsunternehmen**. Das sind Unternehmen wie Baugenossenschaften oder Hausverwaltungen, die im Rahmen der Immobilienverwaltung als Eigen- oder Fremdleistung tätig sind und gesetzlich vorgeschriebene Versorgungspflichten für Allgemein- und Leerstandversorgung übernehmen.', 0.432, 'The Actual Output correctly defines WWU as Wohnungswirtschaftsunternehmen and mentions examples like Baugenossenschaften and Hausverwaltungen, aligning with the Expected Output. However, it omits several key details: the specific role of WWU as the main B2B target for Smart Immo+, their legal representation of energy customers, and their responsibilities regarding energy supply management (e.g., supplier selection, billing, meter readings). The Actual Output is clear but lacks the depth and completeness found in the Expected Output.', 0.564, 'The score is 0.56 because, while the relevant statements clearly define ''WWU'' as ''Wohnungswirtschaftsunternehmen'' and provide detailed context, the majority of the retrieval context is not directly answering what ''WWU'' stands for, as noted in the irrelevancy reasons such as ''does not explain what WWU stands for'' and ''describes the responsibilities of a WWU, not what the abbreviation stands for.''', 0.57, 'Geschätzt aus Output-Qualitätsscore', 0.45, 'Geschätzt basierend auf Relevanz und Output-Score'),

('3-run_gpt4_v2', 'subwf-1', 1, 'run_gpt4_v2', false, false, 'gpt-4', 'v2.0', '2025-11-04 15:30:00',
 'GT001-run_gpt4_v2', 'Was ist immo+ ?', 'Smart Immo+ (SI+) ist ein EnBW-Geschäftsbereich, der B2B-Dienstleistungen für Unternehmen anbietet. SI+ vertreibt EnBW Commodity über die Wohnungswirtschaftsbranche. 

Die Hauptzielgruppe sind Wohnungswirtschaftsunternehmen (WWU), die mindestens fünf und teilweise bis zu Tausende Immobilien in ihrem WWU-Bestand verwalten. WWU profitieren von attraktiven B2B-Lieferkonditionen für ihren gesamten Verwalterbestand und wünschen sich skalierbare und effiziente Möglichkeiten für resultierende Lieferstellen- und Energievertragsdatenverwaltung in hohem Volumen. 

Immobilienverwalter verantworten die Erfüllung gesetzlicher Pflichten wie die Verwaltung von Lieferstellen aus ihrem Immobilienbestand. SI+ Kunden sind in Masse für die reibungslose Energieversorgung von Lieferstellen für Allgemein- und Leerstandversorgung verantwortlich.

Das SI+ Angebot unterstützt die Tagesgeschäftanforderungen für WWU und deren Mitarbeiter insbesondere durch exklusive SI+ Online-Portal-Services, welche u.A. durch Standardisierung von Formularen und Prozessen auf Kunden und Anbieterseite die Effizienz für erforderliche Meldeprozesse und resultierender Energiekunden und -vertragsverwaltung für Allgemein und/oder Leerstandsversorgung positiv unterstützt.',
 'EX001-run_gpt4_v2', 'Smart Immo+ (SI+) ist ein B2B-Geschäftsbereich der EnBW, der sich auf Dienstleistungen für Wohnungswirtschaftsunternehmen (WWU) spezialisiert hat. SI+ ermöglicht WWU die effiziente Verwaltung von Energielieferstellen für Allgemein- und Leerstandversorgung durch standardisierte Prozesse, exklusive Online-Portal-Services und attraktive Commodity-Konditionen.', 0.82, 'Much improved with v2.0 prompt - captures key B2B nature and main services', 0.91, 'Excellent retrieval with better context selection', 0.18, 'Significantly reduced hallucination', 0.85, 'Strong improvement in alignment'),

('4-run_gpt4_v2', 'subwf-1', 2, 'run_gpt4_v2', false, false, 'gpt-4', 'v2.0', '2025-11-04 15:30:00',
 'GT002-run_gpt4_v2', 'Wofür steht WWU?', 'WWU steht für Wohnungswirtschaftsunternehmen – ein Unternehmen, das in der Wohnungswirtschaft tätig ist, wie z. B. eine Baugenossenschaft oder eine Hausverwaltung - Hauptsache Immobilienverwalter. 

Diese Firmen übernehmen Verwalterpflichten für oder als Immobilieneigentümer und sind genau deswegen Hauptzielgruppe des B2B-Geschäftsbereichs Smart Immo+. WWU erfüllt für jede Lieferstelle aus dem Verwalterbestand (Allgemein- und Leerstandversorgung) in nachgewiesener Verwalterrolle die gesetzlichen Pflichten der eigentlichen Immobilien-/Wohnraumeigentümer.

WWU fungiert für den beim Energieversorger nachgewiesenen Lieferstellenbestand - rechtlich anerkannte Vertretung des belieferten Energiekunden (Immobilieneigentümer). WWU erfüllen alle klassischen Lieferkunden-Aufgaben von Energieversorgerwahl, Abschlagzahlung, Zählerstände, Rechnungen und Kundendatenpflege. WWU verwalten Energielieferkunden und -verträge aus ihrem Bestand vom jeweiligen Lieferstart bis zum Lieferende.',
 'EX002-run_gpt4_v2', 'WWU steht für Wohnungswirtschaftsunternehmen. Das sind Unternehmen wie Baugenossenschaften oder Hausverwaltungen, die als Immobilienverwalter tätig sind. Sie sind die Hauptzielgruppe von Smart Immo+ und übernehmen als rechtlich anerkannte Vertretung der Immobilieneigentümer alle Aufgaben der Energieversorgung, einschließlich Vertragsmanagement, Abschlagzahlungen und Rechnungsverwaltung für Lieferstellen.', 0.78, 'Good improvement - includes key role in Smart Immo+ and legal representation', 0.84, 'Better context selection with improved relevance', 0.22, 'Reduced hallucination rate', 0.81, 'Improved alignment with better completeness'),

('5-run_claude_v1', 'subwf-1', 1, 'run_claude_v1', false, false, 'claude-3-sonnet', 'v1.0', '2025-11-03 11:20:00',
 'GT001-run_claude_v1', 'Was ist immo+ ?', 'Smart Immo+ (SI+) ist ein EnBW-Geschäftsbereich, der B2B-Dienstleistungen für Unternehmen anbietet. SI+ vertreibt EnBW Commodity über die Wohnungswirtschaftsbranche. 

Die Hauptzielgruppe sind Wohnungswirtschaftsunternehmen (WWU), die mindestens fünf und teilweise bis zu Tausende Immobilien in ihrem WWU-Bestand verwalten. WWU profitieren von attraktiven B2B-Lieferkonditionen für ihren gesamten Verwalterbestand und wünschen sich skalierbare und effiziente Möglichkeiten für resultierende Lieferstellen- und Energievertragsdatenverwaltung in hohem Volumen. 

Immobilienverwalter verantworten die Erfüllung gesetzlicher Pflichten wie die Verwaltung von Lieferstellen aus ihrem Immobilienbestand. SI+ Kunden sind in Masse für die reibungslose Energieversorgung von Lieferstellen für Allgemein- und Leerstandversorgung verantwortlich.

Das SI+ Angebot unterstützt die Tagesgeschäftanforderungen für WWU und deren Mitarbeiter insbesondere durch exklusive SI+ Online-Portal-Services, welche u.A. durch Standardisierung von Formularen und Prozessen auf Kunden und Anbieterseite die Effizienz für erforderliche Meldeprozesse und resultierender Energiekunden und -vertragsverwaltung für Allgemein und/oder Leerstandsversorgung positiv unterstützt.',
 'EX001-run_claude_v1', 'Smart Immo+ ist ein spezialisierter B2B-Service der EnBW für die Wohnungswirtschaftsbranche. Das Angebot richtet sich an Wohnungswirtschaftsunternehmen (WWU) und unterstützt diese bei der effizienten Verwaltung von Energielieferstellen durch Online-Portal-Services, standardisierte Prozesse und günstige Energiekonditionen.', 0.74, 'Solid answer covering main aspects, Claude''s concise style', 0.88, 'Good context retrieval', 0.26, 'Acceptable hallucination level', 0.79, 'Good alignment');

-- Insert Subworkflow Runs (RAG Performance Subworkflow - subwf-2)
INSERT INTO runs (id, subworkflow_id, base_id, version, active, is_running, model, prompt_version, timestamp,
                 ground_truth_id, input_text, expected_output,
                 execution_id, output, output_score, output_score_reason,
                 rag_relevancy_score, rag_relevancy_score_reason,
                 hallucination_rate, hallucination_rate_reason,
                 system_prompt_alignment_score, system_prompt_alignment_score_reason) VALUES
('3-run_claude_v1', 'subwf-2', 3, 'run_claude_v1', false, false, 'claude-3', 'v1.0', '2025-11-05 16:00:00',
 'GT003-run_claude_v1', 'Was ist immo+ ?', 'Smart Immo+ (SI+) ist ein EnBW-Geschäftsbereich, der B2B-Dienstleistungen für Unternehmen anbietet.',
 'EX003-run_claude_v1', 'immo+ ist ein Business-Portal der EnBW für Wohnungswirtschaftsunternehmen zur Verwaltung von Energielieferstellen.', 0.75, 'Good summary but missing some details', 0.92, 'Excellent retrieval of relevant context', 0.25, 'Minimal hallucination detected', 0.88, 'Strong alignment with system prompt'),

('4-run_gpt4_v1', 'subwf-2', 4, 'run_gpt4_v1', false, false, 'gpt-4', 'v1.0', '2025-11-02 10:00:00',
 'GT004-run_gpt4_v1', 'Was ist immo+ ?', 'Smart Immo+ (SI+) ist ein EnBW-Geschäftsbereich, der B2B-Dienstleistungen für Unternehmen anbietet.',
 'EX004-run_gpt4_v1', 'Immo+ ist ein EnBW-Portal für Wohnungswirtschaft zur Verwaltung von Energieverträgen.', 0.65, 'Basic answer, missing B2B context', 0.76, 'Moderate retrieval quality', 0.35, 'Some information not from context', 0.72, 'Acceptable alignment'),

('5-run_claude_v2', 'subwf-2', 5, 'run_claude_v2', false, false, 'claude-3-opus', 'v2.0', '2025-11-06 09:00:00',
 'GT005-run_claude_v2', 'Was ist immo+ ?', 'Smart Immo+ (SI+) ist ein EnBW-Geschäftsbereich, der B2B-Dienstleistungen für Unternehmen anbietet.',
 'EX005-run_claude_v2', 'Smart Immo+ ist ein B2B-Geschäftsbereich der EnBW, spezialisiert auf Dienstleistungen für Wohnungswirtschaftsunternehmen. Der Service bietet standardisierte Prozesse für die Verwaltung von Energielieferstellen, attraktive Commodity-Konditionen und exklusive Online-Portal-Funktionen.', 0.87, 'Excellent comprehensive answer with v2.0 and Opus model', 0.94, 'Outstanding context retrieval and usage', 0.13, 'Very low hallucination', 0.91, 'Excellent alignment'),

('6-run_gpt4turbo_v2', 'subwf-2', 6, 'run_gpt4turbo_v2', false, false, 'gpt-4-turbo', 'v2.0', '2025-11-06 14:00:00',
 'GT006-run_gpt4turbo_v2', 'Was ist immo+ ?', 'Smart Immo+ (SI+) ist ein EnBW-Geschäftsbereich, der B2B-Dienstleistungen für Unternehmen anbietet.',
 'EX006-run_gpt4turbo_v2', 'Smart Immo+ (SI+) ist ein EnBW-Geschäftsbereich, der B2B-Dienstleistungen für Wohnungswirtschaftsunternehmen anbietet. SI+ vertreibt EnBW Commodity über die Wohnungswirtschaftsbranche und unterstützt WWU durch Online-Portal-Services, standardisierte Prozesse und attraktive Lieferkonditionen bei der effizienten Verwaltung von Energielieferstellen.', 0.93, 'Excellent comprehensive answer, nearly perfect', 0.97, 'Outstanding retrieval with high precision', 0.07, 'Minimal hallucination', 0.96, 'Near perfect alignment');
