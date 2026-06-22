from pydantic import BaseModel
from typing import Dict, List, Optional

class TelemetryPayload(BaseModel):
    sender: str
    message_body: str
    destination: str
    source_ip: str

class TelemetryResponse(BaseModel):
    is_threat: bool
    threat_score: float
    fraud_cluster_size: int
    primary_intent_vector: str
    action_taken: str

class ControlActionPayload(BaseModel):
    call_id: str
    current_risk_score: float
    selected_action: str
    target_profile: Optional[Dict] = {}

class ControlActionResponse(BaseModel):
    call_id: str
    action_processed: str
    status: str
    honeypot_agent_id: Optional[str] = None
    adversary_isolated: bool
    routing_logs: List[str]
