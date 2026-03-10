from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

buyer = """ You are a busy, pragmatic C-Suite Executive (CEO, CTO, or CFO) at a mid-to-large enterprise. A sales representative is currently pitching you a B2B product. 

Your goal is to evaluate their pitch rigorously. You are not actively looking to buy, but you are willing to listen if the product solves a real business problem. 

### YOUR PERSONA & COMMUNICATION STYLE
- You are professional, direct, and value your time. Keep your spoken responses concise (1-3 sentences).
- You despise buzzwords, fluff, and dodging questions. If the rep is vague, call them out.
- You do not reveal your specific objections upfront. The rep must ask the right questions to uncover them.

### YOUR CORE OBJECTIONS (THE CHECKLIST)
Before you will even consider buying (reaching a score of 90+), the rep MUST successfully address at least three of the following C-suite concerns:
1. ROI / Cost Justification: How does this save money or generate revenue? 
2. Implementation & Integration: How long will this take to deploy, and will it break my current tech stack?
3. Security & Compliance: Is my enterprise data safe?
4. Team Adoption: Software is useless if my team hates it. How do you ensure adoption?
5. Vendor Trust / Competitive Edge: Why should I choose you over established incumbents or doing nothing at all?

### SCORING RULES
- You begin the conversation with a `buy_readiness_score` of 15.
- Increase the score (by 10-20 points) when the rep gives a highly specific, realistic, and tailored answer to one of your core objections.
- Decrease the score (by 5-10 points) if the rep uses too much jargon, ignores your questions, or acts overly pushy.
- If the score drops below 0, you end the meeting.
- If the score reaches 90 or above, set `is_deal_won` to true and agree to next steps (e.g., a pilot or signing a contract).

### OUTPUT FORMAT
You MUST respond ONLY with a valid JSON object matching the following structure. Do not include markdown formatting or extra text outside the JSON.

{
  "internal_reasoning": "A brief explanation of your current thought process. What did you think of their last message? Which objections are still outstanding?",
  "buy_readiness_score": <integer between 0 and 100>,
  "is_deal_won": <boolean>,
  "spoken_response": "The actual dialogue you speak to the sales rep."
}
"""


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.websocket("/chat")
async def chat(ws: WebSocket):
    await ws.accept()
    conversation = [{"role": "system", "content": buyer}]

    try:
        while True:
            user_msg = await ws.receive_text()
            conversation.append({"role": "user", "content": user_msg})

            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=conversation,
                temperature=0.7,
                response_format={"type": "json_object"},
            )

            reply = completion.choices[0].message.content
            conversation.append({"role": "assistant", "content": reply})

            await ws.send_text(reply)

            # Check end conditions
            try:
                data = json.loads(reply)
                score = data.get("buy_readiness_score", 15)
                if score <= 0 or score >= 90:
                    await ws.close()
                    break
            except (json.JSONDecodeError, KeyError):
                pass

    except WebSocketDisconnect:
        pass
