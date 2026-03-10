# Rebuttal AI

Rebuttal AI is a specialized sales practice tool designed to help B2B sales professionals hone their pitching skills. Instead of practicing on a mirror or a colleague, users get face-to-face with a ruthless AI C-Suite Executive (CEO, CTO, or CFO) equipped to drill them on real-world objections like ROI, security, and team adoption.

Currently, it features a text-based chat interface where the AI actively evaluates pitches and updates an internal "Buy Readiness" score in real-time. Soon, the product will evolve into an ultra-low latency voice-call experience.

---

## 🏗 Monorepo Structure

This project uses a simple monorepo structure separated into backend and frontend directories:

```
rebuttal-ai/
├── rebuttal-backend/      # Python/FastAPI backend powering the agent logic
│   ├── .env               # Secrets (Groq API Key)
│   ├── main.py            # Main FastAPI application and WebSocket endpoint
│   ├── test_pitches.py    # Automated pitch testing script
│   └── requirements.txt
│
└── rebuttal-frontend/     # React/Vite frontend for the user interface
    ├── src/
    │   ├── components/    # Isolated UI components (ChatForm, MessageList, etc.)
    │   ├── App.tsx        # Main router combining Landing and Chat pages
    │   └── index.css      # Core styles (Teal light mode theme)
    ├── package.json
    └── vite.config.ts
```

---

## 🛠 Tech Stack

- **Backend:** [Python 3.13](https://www.python.org/) + [FastAPI](https://fastapi.tiangolo.com/) (WebSockets)
- **AI Model:** Llama 3.3 70B (via [Groq](https://groq.com/) for ultra-fast text generation)
- **Frontend:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling:** Vanilla CSS 

---

## 🚀 How to Run Locally

### 1. Start the Backend
1. Navigate to the backend directory:
   ```bash
   cd rebuttal-backend
   ```
2. Activate your virtual environment and install dependencies:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install fastapi "uvicorn[standard]" pydantic groq python-dotenv httpx
   ```
3. Create a `.env` file in the `rebuttal-backend` root and add your Groq key:
   ```env
   GROQ_API_KEY=your_api_key_here
   ```
4. Start the FastAPI dev server:
   ```bash
   fastapi dev main.py
   # Runs on http://localhost:8000
   ```

### 2. Start the Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd rebuttal-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   # Runs on http://localhost:5173
   ```

### 3. Testing the AI Logic
To run the automated suite of predefined sales pitches against the Groq model:
```bash
cd rebuttal-backend
source .venv/bin/activate
python test_pitches.py
```
This script tests 8 different scenarios (4 "good" pitches, 4 "bad" pitches) and verifies that the AI scores them appropriately based on its system prompt constraints.

---

## ⚖️ Tradeoffs & Production Considerations

This project was built quickly as a personal prototype. Several intentional tradeoffs were made in the interest of speed. If this were to transition into a production enterprise app, we would rethink the following:

### 1. State Management & Sessions
- **Current State:** The backend maintains conversation history purely in the active WebSocket connection's memory block. There is no session persistence. If a user refreshes, the session is lost forever.
- **Production Fix:** Implement a database (e.g., PostgreSQL or Redis) to store `session_id`, chat history, and evolving user scores over time. Enable users to review past practice sessions and transcripts.

### 2. Security & Rate Limiting
- **Current State:** The WebSocket endpoint is entirely open. Anyone can hit it and drain our Groq API credits.
- **Production Fix:** Implement JWT-based authentication on the WebSockets. Add strict rate-limiting (e.g., max concurrent connections, tokens per minute) using Redis to prevent abuse.

### 3. Frontend Architecture
- **Current State:** The frontend handles routing manually via a simple state toggle (`currentPage`) in `App.tsx` and uses plain CSS files.
- **Production Fix:** Integrate a proper router like React Router for deep-linking. Transition styling to CSS Modules or a utility framework like TailwindCSS (or a structured design system) as the application grows in complexity.

### 4. WebSocket Resiliency
- **Current State:** If the WebSocket disconnects randomly due to network drops, the app crashes/hangs and cannot recover the state.
- **Production Fix:** Implement robust reconnection strategies on the front end (e.g., exponential backoff) and state syncing upon reconnection to grab the last known message history from the backend DB.
