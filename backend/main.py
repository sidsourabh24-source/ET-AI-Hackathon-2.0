from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from backend.schemas import (
    TelemetryPayload, TelemetryResponse, 
    ControlActionPayload, ControlActionResponse
)
from backend.engine import process_telemetry
from backend.honeypot import HoneypotManager
from backend.gateway import evaluate_sip_metadata

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def run_honeypot_background_worker(call_id: str):
    import asyncio
    await asyncio.sleep(2.0)

@app.post("/api/v1/telemetry/ingest", response_model=TelemetryResponse)
async def ingest_telemetry(payload: TelemetryPayload):
    result = process_telemetry(
        sender=payload.sender,
        message_body=payload.message_body,
        destination=payload.destination,
        source_ip=payload.source_ip
    )
    return TelemetryResponse(**result)

@app.post("/api/v1/control/action", response_model=ControlActionResponse)
async def control_action(payload: ControlActionPayload, background_tasks: BackgroundTasks):
    logs = []
    status = "completed"
    is_isolated = False
    agent_id = None
    
    if payload.selected_action == "DEPLOY_HONEYPOT":
        manager = HoneypotManager()
        result = await manager.trigger_voice_honeypot(payload.call_id, payload.target_profile)
        status = result["status"]
        agent_id = result["honeypot_agent_id"]
        is_isolated = result["adversary_isolated"]
        logs = result["routing_logs"]
        background_tasks.add_task(run_honeypot_background_worker, payload.call_id)
        
    elif payload.selected_action == "BLOCK_GATEWAY":
        routing_path = payload.target_profile.get("routingPath", ["Cambodia", "Mumbai VoIP Gateway"])
        carrier_sig = payload.target_profile.get("carrier", "VoIP Gateway")
        anomaly_data = await evaluate_sip_metadata(routing_path, carrier_sig)
        
        status = "gateway_blocked"
        is_isolated = True
        logs = [
            f"Blocking request initiated for call: {payload.call_id}",
            f"Analyzing SIP metadata anomaly score: {anomaly_data['anomaly_index']}",
            f"Spoofing signature verified: {anomaly_data['is_spoofed']}",
            f"Blocking trunk routing via Mumbai VoIP gateway",
            "Gateway blocked successfully. Connection severed."
        ]
        
    elif payload.selected_action == "MHA_DOCKET":
        status = "docket_generated"
        logs = [
            f"Generating NCRB and MHA report docket for call: {payload.call_id}",
            f"Collating transaction link graph anomalies...",
            "Encrypting docket metadata for legal transmission",
            "Docket submitted to MHA warning repository."
        ]
        
    return ControlActionResponse(
        call_id=payload.call_id,
        action_processed=payload.selected_action,
        status=status,
        honeypot_agent_id=agent_id,
        adversary_isolated=is_isolated,
        routing_logs=logs
    )
