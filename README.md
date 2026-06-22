# SentinelAI — National Digital Public Safety Platform
> **ET 2.0 Hackathon 2026** | Theme: Smart Cities / Public Safety / Digital Trust

SentinelAI is an end-to-end AI-powered Digital Public Safety Intelligence platform that equips law enforcement agencies, financial institutions, and citizens with proactive tools to detect, disrupt, and respond to digital fraud networks, counterfeit currency circulation, and organised scam operations.

---

## Architecture

![SentinelAI Architecture](./docs/architecture.png)

```
React + TypeScript Frontend (Vite)
        │
        │  HTTP REST (fetch API)
        ▼
FastAPI Backend (Uvicorn)
  ├── /api/v1/telemetry/ingest   ← Semantic threat classifier
  └── /api/v1/control/action     ← Honeypot / Gateway / MHA dispatcher
        │
        ├── engine.py     — Dual-pass whitelist + zero-shot intent classifier + BFS graph
        ├── gateway.py    — SIP routing anomaly evaluator (Spoof Signature Ratio)
        └── honeypot.py   — HoneypotManager VoIP isolation orchestrator
```

---

## Features & Hackathon Coverage

| Hackathon Area | SentinelAI Feature |
|---|---|
| Digital Arrest Scam Detection | Live Arrest Tracker — real-time call interception, acoustic script classification, SIP spoof ratio, gateway block & honeypot actions |
| Counterfeit Currency Identification | Currency Inspector — UV simulation, intaglio bleed line detection, microprint & watermark hotspot analysis |
| Fraud Network Graph Intelligence | Fraud Mule Graph — BFS traversal linking mule accounts, IMEI, VoIP numbers, and shell corps into court-admissible packages |
| Geospatial Crime Pattern Intelligence | Patrol Map — live SVG India map with crime hotspot pins, severity classification, and patrol unit dispatch |
| Citizen Fraud Shield (Multi-channel) | WhatsApp Bot simulator — real-time message scanning in English/Hindi/Tamil, backed by live telemetry API with NCRB draft complaint generation |

---

## Running the Project

### Prerequisites
- Node.js 18+
- Python 3.10+

### Frontend
```bash
cd "d:\ET 2.0"
npm install
npm run dev
# App runs at http://localhost:5173
```

### Backend
```bash
cd "d:\ET 2.0\backend"
pip install fastapi uvicorn pydantic
uvicorn main:app --reload --port 8000
# API runs at http://localhost:8000
# Docs at http://localhost:8000/docs
```

---

## API Reference

### POST `/api/v1/telemetry/ingest`
Evaluates an incoming communication for fraud threat.

```json
{
  "sender": "+91-XXXX",
  "message_body": "Your Aadhaar is linked to money laundering...",
  "destination": "CITIZEN_SHIELD_PORTAL",
  "source_ip": "103.24.12.8"
}
```

Response includes: `is_threat`, `threat_score`, `fraud_cluster_size`, `primary_intent_vector`, `action_taken`

### POST `/api/v1/control/action`
Triggers an active countermeasure against a live threat.

```json
{
  "call_id": "CALL-7739",
  "current_risk_score": 0.94,
  "selected_action": "BLOCK_GATEWAY",
  "target_profile": { "routingPath": ["Cambodia", "Singapore", "Mumbai Gateway"] }
}
```

Actions: `BLOCK_GATEWAY` | `DEPLOY_HONEYPOT` | `MHA_DOCKET`

---

## Judging Criteria Mapping

| Criteria | Weight | How SentinelAI Addresses It |
|---|---|---|
| Innovation | 25% | Agentic honeypot VoIP isolation, real-time SIP spoof signature computation, multi-agency intelligence fusion in one platform |
| Business Impact | 25% | Covers all 5 problem areas; dual-portal (law enforcement + citizen); NCRB complaint generation |
| Technical Excellence | 20% | Live FastAPI backend with semantic classifier, BFS graph traversal, SIP metadata evaluator, real HTTP API calls from UI |
| Scalability | 15% | Stateless FastAPI microservices, async handlers throughout, modular backend per concern |
| User Experience | 15% | Tactical HUD aesthetic, real-time transcript streaming, live API response terminal panel, 3-language bot |

---

## Team
ET 2.0 Hackathon 2026 Submission
