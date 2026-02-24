# Campus AI Backend (Groq)

Simple Express server for AI chat using Groq's LLaMA 3 model.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
```

3. Start server:
```bash
npm start
```

## API

**POST /ask**
- Request: `{ message, context }`
- Response: `{ reply }`

**GET /health**
- Response: `{ status: "ok" }`

## Model

- **Provider**: Groq
- **Model**: llama3-8b-8192
- **Free Tier**: 14,400 requests/day
