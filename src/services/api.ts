const BASE_URL = 'http://127.0.0.1:8000';

export interface ControlActionPayload {
  call_id: string;
  current_risk_score: number;
  selected_action: 'BLOCK_GATEWAY' | 'DEPLOY_HONEYPOT' | 'MHA_DOCKET';
  target_profile?: Record<string, unknown>;
}

export interface ControlActionResponse {
  call_id: string;
  action_processed: string;
  status: string;
  honeypot_agent_id: string | null;
  adversary_isolated: boolean;
  routing_logs: string[];
}

export interface TelemetryPayload {
  sender: string;
  message_body: string;
  destination: string;
  source_ip: string;
}

export interface TelemetryResponse {
  is_threat: boolean;
  threat_score: number;
  fraud_cluster_size: number;
  primary_intent_vector: string;
  action_taken: string;
}

export async function postControlAction(payload: ControlActionPayload): Promise<ControlActionResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/control/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Control action failed: ${res.status}`);
  return res.json();
}

export async function postTelemetry(payload: TelemetryPayload): Promise<TelemetryResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/telemetry/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Telemetry ingest failed: ${res.status}`);
  return res.json();
}
