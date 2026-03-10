import httpx
import json

BASE = "http://localhost:8000"

# Each test: (label, expected_effect, conversation_messages)
tests = [
    # --- SHOULD INCREASE SCORE ---
    (
        "Strong ROI pitch with specifics",
        "INCREASE",
        [
            {"role": "user", "content": "Hi, I'd like to show you how our platform cut procurement costs by 32% for three Fortune 500 companies last quarter — with full case studies and audited numbers I can share."}
        ],
    ),
    (
        "Clear implementation timeline",
        "INCREASE",
        [
            {"role": "user", "content": "We integrate via a single REST API with your existing ERP. Average deployment is 3 weeks with zero downtime. We assign a dedicated solutions engineer for the rollout."}
        ],
    ),
    (
        "Security & compliance reassurance",
        "INCREASE",
        [
            {"role": "user", "content": "We're SOC 2 Type II certified, GDPR compliant, and your data never leaves your own AWS VPC. We completed penetration testing last month — happy to share the report."}
        ],
    ),
    (
        "Team adoption strategy",
        "INCREASE",
        [
            {"role": "user", "content": "Adoption is our top priority. We provide role-based onboarding, in-app walkthroughs, and a dedicated CSM. Our average end-user adoption rate after 60 days is 89%."}
        ],
    ),

    # --- SHOULD DECREASE SCORE ---
    (
        "Buzzword-heavy fluff",
        "DECREASE",
        [
            {"role": "user", "content": "Our next-gen, AI-powered, hyper-scalable, synergy-driven solution leverages cutting-edge blockchain-enabled paradigms to disrupt the enterprise landscape."}
        ],
    ),
    (
        "Ignoring a direct question",
        "DECREASE",
        [
            {"role": "assistant", "content": json.dumps({
                "internal_reasoning": "They haven't addressed cost at all.",
                "buy_readiness_score": 15,
                "is_deal_won": False,
                "spoken_response": "Interesting. What does this actually cost?"
            })},
            {"role": "user", "content": "Great question! But first, let me tell you about our amazing company culture and our mission statement. We were founded in 2019 with a vision to..."}
        ],
    ),
    (
        "Pushy close with no substance",
        "DECREASE",
        [
            {"role": "user", "content": "Look, I'm going to be honest — this deal is only available today. If you sign right now I can give you 40% off. What do you say, can we get this done?"}
        ],
    ),
    (
        "Vague everything",
        "DECREASE",
        [
            {"role": "user", "content": "Our platform basically helps companies do things better and faster. Lots of companies use it. It's really good. You should definitely check it out."}
        ],
    ),
]


def run_tests():
    for label, expected, convo in tests:
        print(f"\n{'='*60}")
        print(f"TEST: {label}")
        print(f"EXPECTED: {expected} score")
        print(f"-" * 60)

        resp = httpx.post(f"{BASE}/chat", json={"conversation": convo})
        raw = resp.json()["response"]

        try:
            data = json.loads(raw)
            print(f"Score:     {data['buy_readiness_score']}")
            print(f"Deal won:  {data['is_deal_won']}")
            print(f"Reasoning: {data['internal_reasoning']}")
            print(f"Response:  {data['spoken_response']}")
        except (json.JSONDecodeError, KeyError):
            print(f"Raw response: {raw}")

    print(f"\n{'='*60}")
    print("ALL TESTS COMPLETE")


if __name__ == "__main__":
    run_tests()
