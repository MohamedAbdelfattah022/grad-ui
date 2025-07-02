# GradUi

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Chat Feature with LLM Streaming

This project includes a chat feature that connects to Llama 3.2 through Ollama API. The implementation uses:

- FastAPI backend for communicating with Ollama
- Server-Sent Events (SSE) for streaming tokens in real-time
- Angular frontend for displaying the chat interface

### Setup

1. Backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```

2. Frontend:
   ```bash
   npm install
   ng serve
   ```

3. Ollama:
   - Ensure Ollama is running with Llama 3.2 model
   - If using ngrok to expose Ollama API, update the `OLLAMA_API_URL` in `backend/main.py`

### Environment Variables

Backend environment variables (optional):
- `OLLAMA_API_URL`: URL of the Ollama API (default: http://localhost:11434/api/generate)
- `CORS_ORIGINS`: Comma-separated list of allowed origins for CORS (default: http://localhost:4200)
- `PORT`: Port for the backend server (default: 8000)
- `HOST`: Host for the backend server (default: 0.0.0.0)
