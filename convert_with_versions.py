#!/usr/bin/env python3
"""
Konvertiert CSV mit mehreren Testversionen zu JSON
Ermöglicht den Vergleich verschiedener Läufe desselben Tests
"""

import csv
import json
from datetime import datetime

def convert_csv_with_versions(csv_file='Butler-Eval - GEval.csv', output_file='src/runs.json'):
    """
    Konvertiert CSV zu JSON und fügt Versionsunterstützung hinzu.
    
    Erwartete CSV-Spalten:
    - ID: Basis-Test-ID (z.B. 1, 2, 3)
    - RunVersion: Version oder Datum (z.B. v1.0, 2025-11-01)
    - Alle anderen Spalten wie gewohnt
    """
    data = []
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for i, row in enumerate(reader, 1):
            # Skip leere Zeilen
            if not row.get('ID') or row['ID'].strip() == '':
                continue
            
            # Basis-ID und Version extrahieren
            base_id = row['ID'].strip()
            version = row.get('RunVersion', 'v1.0').strip() if row.get('RunVersion') else f"run{i}"
            
            # Kombinierte eindeutige ID erstellen
            unique_id = f"{base_id}-{version}"
            
            entry = {
                'ID': unique_id,
                'baseID': int(base_id) if base_id.isdigit() else base_id,
                'version': version,
                'active': row.get('active', '') == 'X',
                'IsRunning': row.get('IsRunning', '') == '✅',
                'GroundTruthData': {
                    'ID': f"GT{base_id.zfill(3)}-{version}",
                    'Input': row.get('Test-Input', '').strip(),
                    'expectedOutput': row.get('Expected-Output', '').strip()
                },
                'ExecutionData': {
                    'ID': f"EX{base_id.zfill(3)}-{version}",
                    'output': row.get('Acutal-Ouput', '').strip(),
                    'outputScore': parse_float(row.get('Score', '0')),
                    'outputScoreReason': row.get('Reason', '').strip(),
                    'ragRelevancyScore': parse_float(row.get('RAG Relevancy Score', '0')),
                    'ragRelevancyScoreReason': row.get('RAG Relevancy Reason', '').strip(),
                    'hallucinationRate': 0.0,
                    'hallucinationRateReason': 'Geschätzt aus Output-Qualitätsscore',
                    'systemPromptAlignmentScore': 0.0,
                    'systemPromptAlignmentScoreReason': 'Geschätzt basierend auf Relevanz und Output-Score'
                }
            }
            
            # Berechne Hallucination Rate
            if entry['ExecutionData']['outputScore'] > 0:
                entry['ExecutionData']['hallucinationRate'] = round(
                    1 - entry['ExecutionData']['outputScore'], 2
                )
            
            # Berechne System Prompt Alignment
            output_score = entry['ExecutionData']['outputScore']
            rag_score = entry['ExecutionData']['ragRelevancyScore']
            if output_score > 0 and rag_score > 0:
                entry['ExecutionData']['systemPromptAlignmentScore'] = round(
                    (output_score + rag_score) / 2, 2
                )
            
            data.append(entry)
    
    # Nach baseID und Version sortieren
    data.sort(key=lambda x: (x['baseID'], x['version']))
    
    # JSON speichern
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f'✅ Erfolgreich {len(data)} Einträge konvertiert')
    print(f'📁 Gespeichert in: {output_file}')
    
    # Statistiken ausgeben
    base_ids = {}
    for entry in data:
        base_id = entry['baseID']
        if base_id not in base_ids:
            base_ids[base_id] = []
        base_ids[base_id].append(entry['version'])
    
    print(f'\n📊 Statistiken:')
    print(f'   Eindeutige Tests: {len(base_ids)}')
    for base_id, versions in sorted(base_ids.items()):
        print(f'   Test {base_id}: {len(versions)} Versionen ({", ".join(versions)})')

def parse_float(value):
    """Konvertiert String zu Float, behandelt Kommas und leere Werte"""
    if not value or not value.strip():
        return 0.0
    try:
        return float(value.replace(',', '.'))
    except (ValueError, AttributeError):
        return 0.0

if __name__ == '__main__':
    # Beispiel-Aufruf
    convert_csv_with_versions()
    
    print('\n💡 Tipp: Um verschiedene Versionen zu vergleichen:')
    print('   1. Filtern Sie nach baseID (z.B. "1-")')
    print('   2. Wählen Sie mehrere Versionen aus')
    print('   3. Klicken Sie auf "Compare"')
