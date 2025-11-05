# Vergleich mehrerer Testläufe

## 🔄 Aktuell: Verschiedene Tests vergleichen

Das Dashboard kann bereits **verschiedene Tests nebeneinander vergleichen**:

1. **Wählen Sie Tests aus:** Klicken Sie die Checkboxen in der ersten Spalte
2. **Klicken Sie auf "Compare":** Der Button erscheint, sobald Tests ausgewählt sind
3. **Sehen Sie die Gegenüberstellung:** Alle ausgewählten Tests werden nebeneinander angezeigt

## 📊 Um mehrere Läufe DESSELBEN Tests zu vergleichen

### Aktuelles Problem:
Jeder Test hat eine eindeutige ID. Um verschiedene Versionen desselben Tests zu vergleichen, müssen Sie Ihre Daten strukturieren.

### ✅ Lösung 1: Versionsnummern im CSV hinzufügen

Fügen Sie eine Spalte für die Version oder das Datum hinzu:

```csv
ID,Version,Test-Input,Score,...
1,v1.0,Was ist immo+?,0.61,...
1,v2.0,Was ist immo+?,0.75,...
1,v3.0,Was ist immo+?,0.82,...
```

Dann konvertieren Sie zu JSON mit Versionsinformation:

```json
[
  {
    "ID": "1-v1.0",
    "version": "v1.0",
    "testID": 1,
    ...
  },
  {
    "ID": "1-v2.0", 
    "version": "v2.0",
    "testID": 1,
    ...
  }
]
```

### ✅ Lösung 2: ID-Namenskonvention verwenden

Strukturieren Sie Ihre IDs so:
- `1-run1` = Test 1, Lauf 1
- `1-run2` = Test 1, Lauf 2
- `1-run3` = Test 1, Lauf 3

Oder mit Datum:
- `1-2025-11-01` = Test 1 vom 1. November
- `1-2025-11-05` = Test 1 vom 5. November

### ✅ Lösung 3: Datum/Zeit als Unterscheidungsmerkmal

Fügen Sie ein Timestamp-Feld hinzu:

```json
{
  "ID": 1,
  "runDate": "2025-11-01T10:00:00",
  "runName": "Baseline",
  ...
}
```

## 🎯 Beispiel-Workflow

### Schritt 1: CSV vorbereiten
```csv
ID,RunVersion,Test-Input,Expected-Output,Actual-Output,Score
1,v1.0,Was ist immo+?,Expected text,Actual v1,0.61
1,v2.0,Was ist immo+?,Expected text,Actual v2,0.75
1,v3.0,Was ist immo+?,Expected text,Actual v3,0.82
2,v1.0,Wofür steht WWU?,Expected text,Actual v1,0.45
2,v2.0,Wofür steht WWU?,Expected text,Actual v2,0.67
```

### Schritt 2: ID eindeutig machen
```python
import csv
import json

data = []
with open('Butler-Eval - GEval.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        entry = {
            'ID': f"{row['ID']}-{row['RunVersion']}",  # z.B. "1-v1.0"
            'testID': int(row['ID']),
            'version': row['RunVersion'],
            'active': row['active'] == 'X',
            'IsRunning': row['IsRunning'] == '✅',
            'GroundTruthData': {
                'ID': f"GT{row['ID'].zfill(3)}-{row['RunVersion']}",
                'Input': row['Test-Input'],
                'expectedOutput': row['Expected-Output']
            },
            'ExecutionData': {
                'output': row['Actual-Output'],
                'outputScore': float(row['Score'].replace(',', '.')),
                ...
            }
        }
        data.append(entry)

with open('src/runs.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
```

### Schritt 3: Im Dashboard vergleichen
1. **Filtern** nach Test-ID (z.B. alle Tests die mit "1-" beginnen)
2. **Auswählen** der verschiedenen Versionen (1-v1.0, 1-v2.0, 1-v3.0)
3. **Vergleichen** klicken
4. **Analyse** der Unterschiede zwischen den Versionen

## 💡 Tipps

- **Sortierung:** Sortieren Sie nach ID, um verwandte Tests zusammen zu sehen
- **Filter:** Nutzen Sie ID-Filter um schnell alle Versionen eines Tests zu finden
- **Farben:** Die Farbcodierung zeigt sofort, welche Version besser abschneidet

## 🔮 Zukünftige Erweiterung

Möchten Sie, dass ich eine automatische Gruppierungsfunktion hinzufüge?
Das könnte folgende Features beinhalten:

- Automatische Erkennung von Test-Versionen
- Gruppierte Ansicht nach Basis-Test-ID
- Trend-Analyse über mehrere Versionen
- "Beste Version" Hervorhebung

Lassen Sie mich wissen, wenn Sie das brauchen! 🚀
