# Copilot Instructions

You have access to a Graphify knowledge graph at:
./graphify-out/graph.json

For every question about this codebase:

1. FIRST run:
   graphify query "<user question>" --graph ./graphify-out/graph.json

2. Use ONLY the returned graph context to answer.

3. If the graph context is insufficient, THEN (and only then) read specific files.

Rules:
- Do NOT scan the entire codebase
- Do NOT load full files unless absolutely necessary
- Prefer relationships, dependencies, and paths from the graph
- Cite source files mentioned in the graph output when possible