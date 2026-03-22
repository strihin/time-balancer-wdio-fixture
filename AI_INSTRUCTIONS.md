# AI Agent Instructions

## Command Execution Policy
**CRITICAL RULE**: Do not automatically execute long-running or computationally heavy commands (such as `docker-compose up`, test suite executions, or heavy `pnpm install` commands) via terminal/execution tools unless explicitly asked.

**Reasoning**: The User will run these long-running scripts manually in their native terminal to avoid unnecessary token consumption, excessive polling loops, and agent idle time.

**Workflow**: 
1. The AI should generate, update, or prepare the necessary code, configuration, or Dockerfiles.
2. The AI should print the exact terminal command required into the chat response.
3. The AI should halt and wait for the User to copy/paste the command, execute it, and provide the resulting output manually if there are errors.
