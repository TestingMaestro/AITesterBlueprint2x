# Task Plan

## Phases
- **Phase 1: Discovery** - Completed.
- **Phase 2: Planning** - Active. Finalizing the Blueprint and gaining approval.
- **Phase 3: Setup & Configuration** - *Pending Approval*
- **Phase 4: Core Implementation** - *Pending Approval*
- **Phase 5: Testing & Refinement** - *Pending Approval*

## Goals
- Build a local Node.js + React (TypeScript) application.
- Generate functional and non-functional test cases in Jira format.
- Support multiple AI providers (Ollama, LM Studio, Grok, OpenAI, Claude, Gemini).
- Allow settings configuration and connection testing for these APIs.

## Blueprint (Draft - Pending Approval)
### 1. Architecture
- **Frontend**: React with TypeScript.
- **Backend / Core**: Node.js with TypeScript (run as a local server serving the React app).
- **State Management**: React state + local storage for settings (API keys, URLs).

### 2. UI Layout (Based on Design)
- **Main View**:
  - Left panel: History of generated test cases.
  - Chat Area: Messages showing generated test cases.
  - Input Box: "Ask here is here TC for Requirement" (User pastes Jira requirements).
- **Settings View**:
  - Provider configurations (Ollama URL, Groq API key, OpenAI API key, Claude, Gemini, LM Studio).
  - "Save Button" and "Test Connection" button.

### 3. Application Flow
1. User configures and tests API connections in Settings.
2. User pastes Jira requirement in the Main View.
3. System routes request to the selected LLM provider.
4. AI generates test cases (functional and non-functional) formatted specifically as Jira test tickets.
5. System displays the output in the Chat Area.

## Checklists
- [x] Ask and answer Discovery Questions.
- [x] Draft Initial Blueprint.
- [x] Review and Approve Blueprint (APPROVED).
