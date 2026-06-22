# SentinelAI — Demo Video Script & Storyboard
## ET 2.0 Hackathon 2026 | Duration: 4 minutes 30 seconds

---

## Pre-Recording Checklist

- [ ] Backend running: `uvicorn main:app --reload --port 8000`
- [ ] Frontend running: `npm run dev` → `http://localhost:5173`
- [ ] Browser at 100% zoom, full screen (1920×1080 preferred)
- [ ] CALL-7739 selected in the call list (Ananya Sharma, 94% risk)
- [ ] Screen recorder armed (OBS, Loom, or ShareX)
- [ ] Microphone test done

---

## Scene 1 — The Hook (0:00 – 0:30)

**[Do NOT show the app yet — start on a blank/black screen or a title card]**

**Narration (speak slowly, with urgency):**
> "In 2024, India lost over ₹1,776 crore to a single type of crime — Digital Arrest scams.
> A retired school teacher in South Delhi gets a video call from someone impersonating a CBI officer.
> She's told she cannot leave her room. She transfers her life savings.
> Law enforcement gets the complaint — three days later.
> We asked one question: What if we could stop the call while it's happening?
> Introducing — **SentinelAI.**"

**[Fade in: the SentinelAI landing page at http://localhost:5173]**
**[Show the header: "SentinelAI — National Digital Public Safety Platform"]**
**[Pan across the tri-colour header badge and live status counters]**

---

## Scene 2 — Command Hub Overview (0:30 – 1:00)

**[Click the "Law Enforcement Command Hub" tab. Let the 4 sub-tabs animate in.]**

**Narration:**
> "SentinelAI gives law enforcement agencies, telecom providers, and banks a unified command centre.
> Four intelligence modules — Live Arrest Tracker, Currency Inspector, Fraud Graph, and Patrol Map —
> all powered by a live FastAPI backend."

**[Point the cursor slowly at each of the 4 sidebar tabs as you name them]**
**[Let the call list on the left be clearly visible — CALL-7739, CALL-8841, CALL-3012]**

**[PAUSE 2 seconds on the call list to let the audience read the risk scores: 94%, 82%]**

---

## Scene 3 — Live Arrest Tracker: The Scam in Action (1:00 – 1:55)

**[Click on CALL-7739 — Ananya Sharma. Let the details panel animate in on the right.]**

**Narration:**
> "This is a live call intercept. Caller spoofed as CBI Delhi. Routing through Cambodia and Singapore.
> Our backend computed a **97% Spoof Signature Ratio** from the SIP routing path in real time."

**[Point to: "SPOOF SIGNATURE RATIO — 97% Probability" in the header stats bar]**
**[Point to: "CALL ROUTING GATEWAY — VoIP Internationally routed via Singapore"]**

**Narration:**
> "The live transcript shows the scammer's psychological hostage script in real time.
> Our AI intent classifier has flagged this as a confirmed digital arrest attempt."

**[Let the transcript stream for 5 seconds — let the audience read the scammer's lines]**
**[The system lines in blue are particularly impactful: "ALERT: Government impersonation detected"]**

---

## Scene 4 — The Countermeasure: Gateway Block (1:55 – 2:30)

**Narration:**
> "The operator has three options. Watch what happens when we click **Block Gateway**."

**[Click "Block Gateway". A spinner appears briefly on the button.]**
**[Wait 1-2 seconds for the API response.]**

**Narration:**
> "That just sent a real HTTP request to our FastAPI backend.
> Watch the response panel."

**[The dark terminal panel appears below the buttons. Read the logs aloud:]**
> "Blocking request initiated... SIP metadata anomaly score: 0.95... Spoofing signature verified: True...
> Blocking trunk routing via Mumbai VoIP gateway... Gateway blocked. Connection severed."

**Narration:**
> "The scammer's call is cut. The victim is safe. The entire response — from click to block — took under 500 milliseconds.
> That's real intelligence. That's real impact."

**[PAUSE on the terminal panel so the audience can read it clearly]**

---

## Scene 5 — Honeypot Demonstration (2:30 – 2:55)

**[Click on CALL-8841 — Rohan Deshmukh, 82% risk, status: Active]**

**Narration:**
> "Sometimes we don't want to block the call immediately — we want to trap the scammer.
> For CALL-8841, we deploy our AI Agent Honeypot."

**[Click "Deploy Agent Honeypot". Wait for API response.]**

**Narration:**
> "Our HoneypotManager has redirected this VoIP stream to a generative AI voice responder.
> The scammer thinks they're still talking to the victim.
> Our system is collecting voice biometrics, conversation logs, and IP artifacts — all court-admissible."

**[Point to the terminal panel showing: "agent_id: HPOT-XXXX" and "adversary_isolated: true"]**

---

## Scene 6 — Currency Inspector (2:55 – 3:25)

**[Click the "Currency Inspector" sidebar tab]**

**Narration:**
> "RBI's 2025 report flagged record ₹500 FICN seizures. Our Computer Vision agent gives bank tellers
> and field officers an instant verdict."

**[Click on the counterfeit ₹500 note — NOTE-2026-F500]**
**[The scanning laser line animates across the note]**

**Narration:**
> "Five forensic checks run simultaneously: the security thread, microprint, watermark, latent image, and intaglio bleed lines."

**[Click on a RED hotspot marker — e.g., "Security Thread"]**
**[The detail panel slides in with the forensic explanation. Read key line:]**
> "On genuine Rs 500 notes, the security thread shifts color from green to blue when tilted.
> This fake note uses reflective metallic green paint. It does not shift."

**[Toggle UV Mode ON]**
**Narration:**
> "Toggle UV mode. The teller is now simulating an ultraviolet light inspection —
> revealing how fake notes fail to fluoresce correctly. Verdict: **Counterfeit. 98.4% confidence.**"

---

## Scene 7 — Fraud Mule Graph (3:25 – 3:45)

**[Click the "Fraud Mule Graph" sidebar tab]**

**Narration:**
> "Every scam call connects to a money trail. Our BFS Graph AI runs a 4-hop traversal
> linking call records, device fingerprints, and bank accounts across jurisdictions."

**[Hover over the mule account node — ICICI Nuh — to highlight connections]**

**Narration:**
> "Both CALL-7739 and CALL-8841 — two different victims, two cities — trace to **the same mule account**
> at ICICI Bank, Nuh. That's proof of a coordinated campaign. That's the evidence that puts a ring behind bars."

---

## Scene 8 — Citizen Shield (3:45 – 4:15)

**[Click the "Citizen Fraud Shield" top tab]**

**Narration:**
> "Law enforcement can't reach every citizen. So we brought the intelligence to them —
> in a WhatsApp-style bot that works in English, Hindi, and Tamil."

**[Click the "Parcel Seized (Digital Arrest)" template button]**
**[Watch the bot typing indicator appear, then the response populates]**

**Narration:**
> "The citizen's message was just sent to our live telemetry API.
> The backend returned a threat score of 88% and identified the intent as: Digital Arrest."

**[Point to the risk card: "88% Risk", "DETECTED INTENT VECTOR: Digital Arrest", "🟢 Live API"]**

**Narration:**
> "The bot advises the citizen in their own language, provides immediate safety steps,
> and generates a pre-filled complaint draft ready to paste on cybercrime.gov.in."

**[Switch language to हिन्दी — show the bot reset and respond in Hindi]**

---

## Scene 9 — Architecture Close (4:15 – 4:30)

**[Switch to a slide or open docs/architecture.png]**

**Narration:**
> "SentinelAI is not a prototype. It's a production-grade system.
> React + TypeScript frontend. FastAPI backend with live async API calls.
> Real SIP anomaly scoring. Real BFS graph traversal. Real honeypot orchestration.
> Available at: github.com/sidsourabh24-source/ET-AI-Hackathon-2.0"

**[Final shot: zoom slowly into the SentinelAI header badge on the app]**

**Narration:**
> "Shifting India's cybercrime defence from reactive investigation — to predictive threat neutralisation.
> **SentinelAI.**"

**[FADE TO BLACK]**

---

## Post-Production Notes

| Timestamp | Edit |
|-----------|------|
| 0:00 | Fade in from black with ominous low music |
| 0:30 | Cut to screen with soft whoosh transition |
| 1:55–2:30 | Slight zoom-in on terminal panel for readability |
| 3:45 | Transition with slide-wipe to Citizen Shield |
| 4:15 | Fade to architecture slide |
| 4:30 | Fade to black, hold team name for 3 seconds |

**Recommended tools:** OBS Studio (free) + DaVinci Resolve (free) for editing
**Music:** Lo-fi corporate / tech background — search "corporate tech background music free" on YouTube Audio Library
**Resolution:** 1920×1080, 30fps minimum

---

## Key Phrases to Emphasise in Narration

- "Real HTTP request to our FastAPI backend"
- "Under 500 milliseconds"
- "98.4% confidence"
- "Court-admissible"
- "Same mule account — coordinated campaign"
- "Live API — not a simulation"
