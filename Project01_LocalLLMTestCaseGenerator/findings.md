# Findings

## Research
- The application is a local AI Tester tool for generating test cases.
- It will exclusively process Jira requirements pasted or typed by the user.

## Discoveries
- **Target Audience**: Purely local tool for the user. Highly private.
- **Output Format**: AI must respond strictly with Jira formatted test cases (both functional and non-functional).
- **LLM Support**: System needs interchangeable adapters for Ollama, LM Studio, Grok, OpenAI, Claude, and Gemini.
- **UI Design**: The UI consists of a chat-like interface with a history sidebar, an input field for Jira requirements, and a dedicated settings screen to manage API keys and test connections.
- **Tech Stack**: Node.js backend (or local server) and React frontend, both using TypeScript.

## Constraints
- **Execution Halt**: Scripts or code cannot be written until the Blueprint in `task_plan.md` is approved.
- All tasks must be local and secure.
