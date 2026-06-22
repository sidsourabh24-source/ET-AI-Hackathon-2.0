import re
import math
from typing import Dict, List, Tuple

TRUSTED_HEADERS = {"SBI-INB", "HDFCBK", "AD-AMAZON", "PAYTM", "GOV-ALERT", "NCRB-HQ"}
TRUSTED_DOMAINS = {"sbi.co.in", "hdfcbank.com", "amazon.in", "paytm.com", "gov.in", "cybercrime.gov.in"}
UNSECURED_PATTERNS = [
    r"wa\.me", r"t\.me", r"bit\.ly", r"tinyurl\.com",
    r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"
]

THREAT_PROFILES = {
    "digital_arrest": [
        "cbi", "ed", "customs", "police", "aadhaar", "arrest", "warrant",
        "drug", "narcotics", "skype", "video call", "ndps", "hostage",
        "verification account", "clearance", "investigation", "supreme court",
        "national agency", "suspicious packet"
    ],
    "bank_phishing": [
        "sbi", "blocked", "kyc", "pan card", "suspension", "credentials",
        "netbanking", "verify", "verification link", "login", "secure-portal",
        "deactivation", "otp", "password", "card block"
    ],
    "money_mule": [
        "commission", "task", "daily payout", "screenshots", "work-from-home",
        "wa.me", "earn", "salary", "telegram group", "deposit", "transfer",
        "part-time", "like videos", "agent wallet"
    ]
}

GRAPH_NODES = {
    "+918050392145": {"type": "phone", "malicious": True},
    "SBI-INB": {"type": "header", "malicious": False},
    "sbi-netbanking-verify.in": {"type": "domain", "malicious": True},
    "wa.me/9188391024": {"type": "link", "malicious": True},
    "192.168.4.12": {"type": "ip", "malicious": True},
    "103.24.12.8": {"type": "ip", "malicious": True},
    "Ramesh Enterprise": {"type": "account", "malicious": True},
    "Aman Traders": {"type": "account", "malicious": True},
    "Gold Distributors": {"type": "account", "malicious": True},
    "+919987345510": {"type": "phone", "malicious": True},
    "+918249108823": {"type": "phone", "malicious": True},
    "Ananya Sharma": {"type": "victim", "malicious": False},
    "Rohan Deshmukh": {"type": "victim", "malicious": False}
}

GRAPH_EDGES = {
    "+918050392145": ["103.24.12.8", "Ananya Sharma"],
    "103.24.12.8": ["+918050392145", "Ramesh Enterprise"],
    "Ramesh Enterprise": ["103.24.12.8", "Aman Traders"],
    "Aman Traders": ["Ramesh Enterprise", "Gold Distributors"],
    "Gold Distributors": ["Aman Traders"],
    "Ananya Sharma": ["+918050392145", "Ramesh Enterprise"],
    "+919987345510": ["192.168.4.12", "Rohan Deshmukh"],
    "192.168.4.12": ["+919987345510", "wa.me/9188391024"],
    "Rohan Deshmukh": ["+919987345510", "Ramesh Enterprise"],
    "wa.me/9188391024": ["192.168.4.12"]
}

def check_whitelist(sender: str, message_body: str) -> bool:
    is_trusted_sender = sender in TRUSTED_HEADERS
    
    extracted_domains = re.findall(r"https?://(?:www\.)?([^/\s]+)", message_body.lower())
    has_trusted_domain = any(domain in TRUSTED_DOMAINS for domain in extracted_domains)
    
    if not (is_trusted_sender or has_trusted_domain):
        return False
        
    for pattern in UNSECURED_PATTERNS:
        if re.search(pattern, message_body.lower()):
            return False
            
    return True

def analyze_scam_intent(message_body: str) -> Tuple[str, float]:
    body_lower = message_body.lower()
    intent_scores = {}
    
    for category, keywords in THREAT_PROFILES.items():
        match_count = 0
        for kw in keywords:
            if kw in body_lower:
                match_count += 1
        
        score = 1.0 - math.exp(-0.35 * match_count)
        intent_scores[category] = score
        
    primary_intent = max(intent_scores, key=intent_scores.get)
    max_score = intent_scores[primary_intent]
    
    return primary_intent, max_score

def eval_network_links(start_entity: str) -> int:
    if start_entity not in GRAPH_NODES:
        return 0
        
    visited = set()
    queue = [(start_entity, 0)]
    malicious_count = 0
    
    while queue:
        current, depth = queue.pop(0)
        
        if current in visited:
            continue
            
        visited.add(current)
        
        if GRAPH_NODES.get(current, {}).get("malicious", False):
            malicious_count += 1
            
        if depth < 4:
            neighbors = GRAPH_EDGES.get(current, [])
            for n in neighbors:
                if n not in visited:
                    queue.append((n, depth + 1))
                    
    return malicious_count

def process_telemetry(sender: str, message_body: str, destination: str, source_ip: str) -> Dict:
    whitelisted = check_whitelist(sender, message_body)
    if whitelisted:
        return {
            "is_threat": False,
            "threat_score": 0.0,
            "fraud_cluster_size": 0,
            "primary_intent_vector": "benign_transactional",
            "action_taken": "MONITOR"
        }
        
    intent_vector, base_score = analyze_scam_intent(message_body)
    
    cluster_size_sender = eval_network_links(sender)
    cluster_size_ip = eval_network_links(source_ip)
    max_cluster_size = max(cluster_size_sender, cluster_size_ip)
    
    final_score = base_score
    if max_cluster_size > 0:
        final_score = min(1.0, base_score + (0.08 * max_cluster_size))
        
    is_threat = final_score > 0.4
    
    if final_score >= 0.85:
        action = "INTERCEPT_AND_BLOCK"
    elif final_score > 0.4:
        action = "FLAG_FOR_AUDIT"
    else:
        action = "MONITOR"
        
    return {
        "is_threat": is_threat,
        "threat_score": round(final_score, 4),
        "fraud_cluster_size": max_cluster_size,
        "primary_intent_vector": intent_vector,
        "action_taken": action
    }
