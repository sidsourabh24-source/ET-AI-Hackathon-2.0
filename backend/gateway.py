import asyncio

async def evaluate_sip_metadata(routing_path: list, carrier_signature: str) -> dict:
    foreign_regions = {"cambodia", "singapore", "myanmar", "vietnam", "thailand", "dubai", "proxy", "vpn"}
    path_lower = [hop.lower() for hop in routing_path]
    
    transit_detected = any(region in path_lower for region in foreign_regions)
    hop_count = len(routing_path)
    
    anomaly_score = 0.0
    if transit_detected:
        anomaly_score += 0.5 + (0.05 * hop_count)
        
    sig_lower = carrier_signature.lower()
    if "voip" in sig_lower or "cloud" in sig_lower or "proxy" in sig_lower:
        anomaly_score += 0.25
        
    anomaly_score = min(1.0, max(0.0, anomaly_score))
    is_spoofed = anomaly_score > 0.6
    
    return {
        "anomaly_index": round(anomaly_score, 4),
        "is_spoofed": is_spoofed,
        "international_transit_detected": transit_detected,
        "hop_count": hop_count
    }
