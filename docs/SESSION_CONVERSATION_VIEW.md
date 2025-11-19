# Session Conversation View Feature

## Überblick

Die neue **Conversation View** gruppiert Test-Executions nach `session_id` und zeigt sie als Chat-Verlauf an - perfekt für Konversations-Tests!

## Wie es funktioniert

### 1. In der Run Details Ansicht

Wenn du einen Run öffnest, siehst du oben rechts einen neuen Button: **"Conversation View"**

```
┌─────────────────────────────────────────┐
│ ← Back to Runs    [💬 Conversation View] │
│                                         │
│ Run: run_v1                             │
│ 7 executions                            │
└─────────────────────────────────────────┘
```

### 2. Click auf "Conversation View"

Die Ansicht wechselt zu einer Chat-ähnlichen Darstellung:

```
┌──────────────────────────────────────────────────────┐
│  Sessions           │  Chat Area                     │
│                     │                                 │
│  📋 session_001    │  🙋 User                        │
│     ⭐ 0.92        │     What is AI?                 │
│     1 message      │                                 │
│                    │  🤖 Assistant           ⭐ 0.92 │
│  📋 session_002 ✓  │     🔍 RAG_Search               │
│     ⭐ 0.89        │     AI is the simulation...     │
│     1 message      │     ┌─────────────────────┐   │
│                    │     │ accuracy:    0.92   │   │
│  📋 session_003    │     │ relevance:   0.88   │   │
│     ⭐ 0.94        │     │ fluency:     0.95   │   │
│     1 message      │     └─────────────────────┘   │
│                    │     ⏱️ 2.5s  💬 150 tokens     │
└──────────────────────────────────────────────────────┘
```

## Features

### ✅ Automatische Gruppierung
- Alle Executions mit derselben `session_id` werden als eine Konversation gruppiert
- Falls keine `session_id` vorhanden, wird jede Execution als eigene "Konversation" angezeigt

### ✅ Chat-ähnliche Darstellung
- **User Messages**: Input als "User" Nachricht (links)
- **Assistant Messages**: Output als "Assistant" Nachricht (rechts)
- **Sub-Executions**: RAG-Calls etc. als eingerückte System-Messages

### ✅ Inline Metrics
- Metriken werden als farbige Badges direkt neben der Antwort angezeigt
- Durchschnitts-Score oben rechts
- Click auf "Show details" für metric_reason

### ✅ Session-Sidebar
- Alle Conversations/Sessions in der linken Sidebar
- Mit Durchschnitts-Score und Vorschau
- Suchfunktion zum Filtern

### ✅ Vollständige Daten
- Expected Output (falls abweichend)
- Duration & Token Count
- Timestamps
- Sub-Executions expandierbar

## Datenstruktur

Die View erwartet Executions mit folgender Struktur:

```javascript
{
  id: 1,
  sessionId: 'session_001',  // Wichtig für Gruppierung!
  input: 'User question...',
  output: 'Assistant response...',
  expectedOutput: 'Expected response...',
  duration: 2.5,
  totalTokens: 150,
  executionTs: '2025-11-13 10:00:00',
  
  // Metrics als Objekte mit value + reason
  accuracy: { value: 0.92, reason: 'Response is correct...' },
  relevance: { value: 0.88, reason: 'Directly answers...' },
  
  // Sub-Executions (z.B. RAG-Calls)
  subExecutions: [
    {
      id: 15,
      workflowId: 'RAG_Search',
      input: 'Search query...',
      output: 'Retrieved context...',
      duration: 0.5,
      totalTokens: 40
    }
  ]
}
```

## Verwendung

### Im Code (App.jsx)

```jsx
// Toggle zwischen Table und Conversation View
const [viewMode, setViewMode] = useState('table');

const handleToggleViewMode = () => {
  setViewMode(prev => prev === 'table' ? 'conversation' : 'table');
};

// In RunDetails
<RunDetails
  {...props}
  onToggleViewMode={handleToggleViewMode}
  viewMode={viewMode}
/>

// Conversation View
{viewMode === 'conversation' && (
  <SessionConversationView
    runVersion={selectedRunVersion}
    executions={selectedRunQuestions}
    onBack={() => setViewMode('table')}
  />
)}
```

## Styling

Die View nutzt ein dunkles, modernes Design:

- **Dark Mode**: Schwarz/Grau Theme
- **Farbige Badges**: Grün (gut) bis Rot (schlecht) für Scores
- **Smooth Animations**: Fade-in, Hover-Effekte
- **Responsive**: Sidebar collapsible (zukünftig)

## Keyboard Shortcuts

- **ESC**: Zurück zur Table View
- **Suche**: Live-Suche in Sessions

## Zukünftige Erweiterungen

- [ ] Multi-Message Conversations (mehrere User/Assistant Paare pro Session)
- [ ] Export als Chat-Protokoll
- [ ] Direkte Vergleiche zwischen Sessions
- [ ] Filter nach Metrics
- [ ] Sortierung der Sessions

## Dateien

- `src/views/SessionConversationView.jsx` - Haupt-Komponente
- `src/styles/SessionConversationView.css` - Styling
- `src/views/RunDetails.jsx` - Toggle-Button Integration
- `src/App.jsx` - View-Switching Logik
