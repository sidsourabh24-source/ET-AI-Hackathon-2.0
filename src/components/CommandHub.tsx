import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, AlertTriangle, ShieldAlert, CheckCircle, Eye, RefreshCw, 
  Search, Download, MapPin, Navigation, Network, CreditCard, User, Shield, Loader2, Terminal
} from 'lucide-react';
import { 
  mockCalls, mockNotes, mockGraphData, mockGeospatialHotspots,
  type DigitalArrestCall, type GeospatialHotspot 
} from '../data/mockData';
import { postControlAction, type ControlActionResponse } from '../services/api';

export const CommandHub: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'calls' | 'currency' | 'graph' | 'map'>('calls');

  return (
    <div className="dashboard-grid">
      {/* Sidebar Nav */}
      <div className="sidebar-nav">
        <button 
          className={`sidebar-link ${activeSubTab === 'calls' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('calls')}
        >
          <Phone size={18} />
          <span>Live Arrest Tracker</span>
        </button>
        <button 
          className={`sidebar-link ${activeSubTab === 'currency' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('currency')}
        >
          <CreditCard size={18} />
          <span>Currency Inspector</span>
        </button>
        <button 
          className={`sidebar-link ${activeSubTab === 'graph' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('graph')}
        >
          <Network size={18} />
          <span>Fraud Mule Graph</span>
        </button>
        <button 
          className={`sidebar-link ${activeSubTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('map')}
        >
          <MapPin size={18} />
          <span>Patrol Optimizer</span>
        </button>

        <div className="glass-card" style={{ marginTop: 'auto', padding: '16px', fontSize: '0.8rem', color: 'var(--neutral-gray)', border: '1px dashed var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--primary-blue)', fontWeight: 700 }}>
            <Shield size={14} />
            <span>SECURE SYSTEM</span>
          </div>
          System connected to National Cyber Crime Reporting Portal (NCRB) and MHA gateway.
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="glass-card">
        {activeSubTab === 'calls' && <LiveArrestTracker />}
        {activeSubTab === 'currency' && <CurrencyInspector />}
        {activeSubTab === 'graph' && <FraudMuleGraph />}
        {activeSubTab === 'map' && <PatrolMap />}
      </div>
    </div>
  );
};

// ============================================================================
// SUB-TAB 1: LIVE ARREST TRACKER
// ============================================================================
const LiveArrestTracker: React.FC = () => {
  const [selectedCallId, setSelectedCallId] = useState<string>(mockCalls[0].id);
  const [calls, setCalls] = useState<DigitalArrestCall[]>(mockCalls);
  const [streamingTranscript, setStreamingTranscript] = useState<any[]>([]);
  const [actionResult, setActionResult] = useState<ControlActionResponse | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const activeCall = calls.find(c => c.id === selectedCallId) || calls[0];

  useEffect(() => {
    setStreamingTranscript([]);
    setActionResult(null);
    let currentIndex = 0;
    const initialLines = activeCall.transcript.slice(0, 2);
    setStreamingTranscript(initialLines);
    currentIndex = 2;
    const interval = setInterval(() => {
      if (currentIndex < activeCall.transcript.length) {
        setStreamingTranscript(prev => [...prev, activeCall.transcript[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedCallId, activeCall]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamingTranscript]);

  const handleBlockCall = async (id: string) => {
    setActionLoading(true);
    setActionResult(null);
    try {
      const result = await postControlAction({
        call_id: id,
        current_risk_score: activeCall.riskScore / 100,
        selected_action: 'BLOCK_GATEWAY',
        target_profile: {
          routingPath: activeCall.routingPath,
          carrier: activeCall.carrier,
        },
      });
      setActionResult(result);
      setCalls(prev => prev.map(c => c.id === id ? { ...c, status: 'Blocked', riskScore: 0 } : c));
    } catch {
      setCalls(prev => prev.map(c => c.id === id ? { ...c, status: 'Blocked', riskScore: 0 } : c));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeployResponder = async (id: string) => {
    setActionLoading(true);
    setActionResult(null);
    try {
      const result = await postControlAction({
        call_id: id,
        current_risk_score: activeCall.riskScore / 100,
        selected_action: 'DEPLOY_HONEYPOT',
        target_profile: {
          victimName: activeCall.victimName,
          callerNumber: activeCall.callerNumber,
        },
      });
      setActionResult(result);
      setCalls(prev => prev.map(c => c.id === id ? { ...c, status: 'Intercepted' } : c));
    } catch {
      setCalls(prev => prev.map(c => c.id === id ? { ...c, status: 'Intercepted' } : c));
    } finally {
      setActionLoading(false);
    }
  };

  const handleMhaDocket = async (id: string) => {
    setActionLoading(true);
    setActionResult(null);
    try {
      const result = await postControlAction({
        call_id: id,
        current_risk_score: activeCall.riskScore / 100,
        selected_action: 'MHA_DOCKET',
        target_profile: {},
      });
      setActionResult(result);
      const reportContent = `DIGITAL ARREST REPORT\nID: ${activeCall.id}\nCaller: ${activeCall.callerNumber}\nVictim: ${activeCall.victimName}\nVerdict: Verified Phishing Scam\nBackend Status: ${result.status}\nSubmit Time: ${new Date().toLocaleString()}`;
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MHA-Alert-${id}.txt`;
      a.click();
    } catch {
      const reportContent = `DIGITAL ARREST REPORT\nID: ${activeCall.id}\nCaller: ${activeCall.callerNumber}\nVictim: ${activeCall.victimName}\nVerdict: Verified Phishing Scam\nSubmit Time: ${new Date().toLocaleString()}`;
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MHA-Alert-${id}.txt`;
      a.click();
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div className="section-title">
        <Phone className="text-primary" />
        <div>
          <h2>Digital Arrest Interception Dashboard</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--neutral-gray)', fontWeight: 500 }}>
            Real-time acoustic analysis, script pattern classification and gateway blocking
          </p>
        </div>
      </div>

      <div className="call-monitor-layout">
        {/* Left Side: Call List */}
        <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--primary-navy)', fontWeight: 700 }}>
            Live Phone Connections
          </h3>
          {calls.map(call => (
            <div 
              key={call.id}
              className={`call-item ${call.id === selectedCallId ? 'active' : ''}`}
              onClick={() => setSelectedCallId(call.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-navy)' }}>{call.id}</span>
                <span className={`risk-tag ${
                  call.status === 'Blocked' ? 'risk-moderate' :
                  call.threatLevel === 'Critical' ? 'risk-critical' : 'risk-high'
                }`}>
                  {call.status === 'Blocked' ? 'Blocked' : `${call.riskScore}% Risk`}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--neutral-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {call.status === 'Active' && (
                  <div className="telephony-soundwave">
                    <div className="soundwave-bar"></div>
                    <div className="soundwave-bar"></div>
                    <div className="soundwave-bar"></div>
                  </div>
                )}
                <span style={{ wordBreak: 'break-all' }}>{call.callerNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--neutral-gray)', marginTop: '8px' }}>
                <span>Target: {call.victimName}</span>
                <span style={{ fontWeight: 600 }}>{call.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Investigation Pane */}
        <div>
          {/* Header Stats */}
          <div className="glass-card" style={{ background: 'var(--neutral-light)', padding: '16px', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--neutral-gray)', fontWeight: 600 }}>CALL ROUTING GATEWAY</span>
              <p style={{ fontWeight: 700, color: 'var(--primary-navy)', fontSize: '0.85rem' }}>{activeCall.carrier}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--neutral-gray)', fontWeight: 600 }}>SPOOF SIGNATURE RATIO</span>
              <p style={{ fontWeight: 700, color: activeCall.spoofProbability > 80 ? 'var(--accent-red)' : 'var(--accent-saffron)', fontSize: '0.85rem' }}>
                {activeCall.spoofProbability}% Probability
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--neutral-gray)', fontWeight: 600 }}>TARGET CITIZEN</span>
              <p style={{ fontWeight: 700, color: 'var(--primary-navy)', fontSize: '0.85rem' }}>{activeCall.victimName} ({activeCall.victimAge} yrs, {activeCall.victimLocation})</p>
            </div>
          </div>

          {/* Live transcript */}
          <h3 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--primary-navy)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', background: activeCall.status === 'Active' ? '#22c55e' : '#64748b', borderRadius: '50%', display: 'inline-block' }}></span>
            Live Transcription & Acoustic AI Audit
          </h3>
          <div className="transcript-box">
            {streamingTranscript.map((line, idx) => (
              <div key={idx} className={`transcript-line ${line.speaker.toLowerCase()}`}>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>[{line.timestamp}]</span>{' '}
                <strong>{line.speaker === 'System' ? 'System Audit' : line.speaker}:</strong>{' '}
                {line.text}
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>

          {/* Core Controls */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
            <button
              className="nav-btn"
              style={{ background: activeCall.status === 'Blocked' ? '#94a3b8' : 'var(--accent-red)', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '8px', padding: '12px 24px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
              disabled={activeCall.status === 'Blocked' || actionLoading}
              onClick={() => handleBlockCall(activeCall.id)}
            >
              {actionLoading ? <Loader2 size={16} className="spin-anim" /> : null}
              Block Gateway
            </button>
            <button
              className="nav-btn"
              style={{ background: activeCall.status !== 'Active' ? '#94a3b8' : 'var(--accent-saffron)', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '8px', padding: '12px 24px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
              disabled={activeCall.status !== 'Active' || actionLoading}
              onClick={() => handleDeployResponder(activeCall.id)}
            >
              {actionLoading ? <Loader2 size={16} className="spin-anim" /> : null}
              Deploy Agent Honeypot
            </button>
            <button
              className="nav-btn"
              style={{ background: 'rgba(0, 102, 204, 0.1)', color: 'var(--primary-blue)', border: 'none', borderRadius: '8px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
              disabled={actionLoading}
              onClick={() => handleMhaDocket(activeCall.id)}
            >
              {actionLoading ? <Loader2 size={16} className="spin-anim" /> : <Download size={16} />}
              <span>MHA Alert Docket</span>
            </button>
          </div>

          {/* Live API Response Panel */}
          {actionResult && (
            <div style={{ marginTop: '16px', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ background: actionResult.adversary_isolated ? 'rgba(0, 135, 90, 0.08)' : 'rgba(0, 102, 204, 0.08)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={16} style={{ color: actionResult.adversary_isolated ? 'var(--accent-green)' : 'var(--primary-blue)' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-navy)' }}>Backend Response — {actionResult.action_processed}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', fontWeight: 700 }}>
                  <span style={{ background: actionResult.adversary_isolated ? 'rgba(0,135,90,0.1)' : 'rgba(0,102,204,0.1)', color: actionResult.adversary_isolated ? 'var(--accent-green)' : 'var(--primary-blue)', padding: '2px 10px', borderRadius: '20px' }}>
                    {actionResult.status.toUpperCase().replace(/_/g, ' ')}
                  </span>
                  {actionResult.honeypot_agent_id && (
                    <span style={{ background: 'rgba(255,143,28,0.1)', color: 'var(--accent-saffron)', padding: '2px 10px', borderRadius: '20px' }}>
                      Agent: {actionResult.honeypot_agent_id}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ background: '#0d121c', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {actionResult.routing_logs.map((log, idx) => (
                  <div key={idx} style={{ fontSize: '0.8rem', color: idx === actionResult.routing_logs.length - 1 ? '#22c55e' : '#94a3b8', fontFamily: 'Courier New, monospace', display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#38bdf8', flexShrink: 0 }}>[{String(idx + 1).padStart(2, '0')}]</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-TAB 2: CURRENCY INSPECTOR
// ============================================================================
const CurrencyInspector: React.FC = () => {
  const [selectedNoteIdx, setSelectedNoteIdx] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [uvActive, setUvActive] = useState<boolean>(false);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);

  const activeNote = mockNotes[selectedNoteIdx];

  const handleScan = () => {
    setIsScanning(true);
    setSelectedHotspotId(null);
    setTimeout(() => {
      setIsScanning(false);
      // Auto highlight the first counterfeit checkpoint if exists
      const firstFake = activeNote.hotspots.find(h => h.status === 'Counterfeit');
      if (firstFake) {
        setSelectedHotspotId(firstFake.id);
      } else if (activeNote.hotspots.length > 0) {
        setSelectedHotspotId(activeNote.hotspots[0].id);
      }
    }, 2500);
  };

  const activeHotspot = activeNote.hotspots.find(h => h.id === selectedHotspotId);

  return (
    <div>
      <div className="section-title">
        <CreditCard className="text-primary" />
        <div>
          <h2>Counterfeit Currency Identification Hub</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--neutral-gray)', fontWeight: 500 }}>
            Computer vision microprint scanning, UV watermark simulation, and tactile verification
          </p>
        </div>
      </div>

      {/* Select Note Trigger */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button 
          className={`nav-btn ${selectedNoteIdx === 0 ? 'active' : ''}`}
          onClick={() => { setSelectedNoteIdx(0); setSelectedHotspotId(null); setUvActive(false); }}
        >
          Inspect Sample Banknote A (Rs. 500)
        </button>
        <button 
          className={`nav-btn ${selectedNoteIdx === 1 ? 'active' : ''}`}
          onClick={() => { setSelectedNoteIdx(1); setSelectedHotspotId(null); setUvActive(false); }}
        >
          Inspect Sample Banknote B (Rs. 500)
        </button>
      </div>

      <div className={`currency-scanner-workspace ${uvActive ? 'uv-active' : ''}`}>
        {/* Left: Canvas Area */}
        <div className="note-canvas-container">
          {isScanning && <div className="scanning-line"></div>}
          {uvActive && <div className="uv-watermark-overlay">₹500 RBI</div>}

          {/* Simple Vector mock Rs 500 note structure */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
            <svg viewBox="0 0 600 260" style={{ width: '100%', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
              {/* Note Base */}
              <rect x="0" y="0" width="600" height="260" fill={uvActive ? '#1c133a' : '#d2dbcb'} stroke={uvActive ? '#4b0082' : '#9bb29b'} strokeWidth="4" />
              
              {/* Note Details */}
              {/* Gandhi Portrait */}
              <circle cx="430" cy="130" r="45" fill={uvActive ? '#2c1e55' : '#b1c3b1'} opacity="0.8" />
              <path d="M 400 160 Q 430 110 460 160" stroke={uvActive ? '#6c4eb8' : '#688468'} strokeWidth="3" fill="none" />
              
              {/* Value Panel */}
              <text x="50" y="100" fontFamily="sans-serif" fontSize="48" fontWeight="bold" fill={uvActive ? '#4de6a6' : '#2d4734'}>₹५००</text>
              <text x="50" y="140" fontFamily="sans-serif" fontSize="16" letterSpacing="2" fill={uvActive ? '#6c4eb8' : '#476950'}>FIVE HUNDRED RUPEES</text>
              
              {/* Watermark area */}
              <rect x="100" y="50" width="120" height="150" fill={uvActive ? '#150f2b' : '#c8d3c2'} rx="10" opacity="0.6" />
              <text x="130" y="130" fontSize="14" fill={uvActive ? '#00ffd2' : '#8fa68a'} fontWeight="bold" opacity="0.5">WATERMARK</text>
              
              {/* Security Thread */}
              <line x1="300" y1="0" x2="300" y2="260" stroke={uvActive ? '#00ffd2' : '#1b874b'} strokeWidth="8" strokeDasharray={uvActive ? '20, 5' : '15, 8'} />
              
              {/* Bleed Lines */}
              <line x1="10" y1="90" x2="30" y2="70" stroke={uvActive ? '#6c4eb8' : '#2d4734'} strokeWidth="3" />
              <line x1="10" y1="110" x2="30" y2="90" stroke={uvActive ? '#6c4eb8' : '#2d4734'} strokeWidth="3" />
              <line x1="10" y1="130" x2="30" y2="110" stroke={uvActive ? '#6c4eb8' : '#2d4734'} strokeWidth="3" />
              <line x1="10" y1="150" x2="30" y2="130" stroke={uvActive ? '#6c4eb8' : '#2d4734'} strokeWidth="3" />
              <line x1="10" y1="170" x2="30" y2="150" stroke={uvActive ? '#6c4eb8' : '#2d4734'} strokeWidth="3" />
              
              <line x1="570" y1="90" x2="590" y2="70" stroke={uvActive ? '#6c4eb8' : '#2d4734'} strokeWidth="3" />
              <line x1="570" y1="110" x2="590" y2="90" stroke={uvActive ? '#6c4eb8' : '#2d4734'} strokeWidth="3" />
              <line x1="570" y1="130" x2="590" y2="110" stroke={uvActive ? '#6c4eb8' : '#2d4734'} strokeWidth="3" />
              <line x1="570" y1="150" x2="590" y2="130" stroke={uvActive ? '#6c4eb8' : '#2d4734'} strokeWidth="3" />
              <line x1="570" y1="170" x2="590" y2="150" stroke={uvActive ? '#6c4eb8' : '#2d4734'} strokeWidth="3" />

              {/* Serial Number */}
              <text x="430" y="230" fontSize="18" fontFamily="monospace" fontWeight="bold" fill={uvActive ? '#00ffd2' : '#a32a2a'}>{activeNote.serialNumber}</text>
            </svg>

            {/* Absolute Hotspot Triggers overlay */}
            {!isScanning && activeNote.hotspots.map(hotspot => (
              <div 
                key={hotspot.id}
                className={`hotspot-marker ${hotspot.status.toLowerCase()}`}
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                onClick={() => setSelectedHotspotId(hotspot.id)}
                title={hotspot.name}
              />
            ))}
          </div>
        </div>

        {/* Right: Inspection details panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div className="glass-card" style={{ background: 'var(--neutral-light)', padding: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--primary-navy)', fontWeight: 700, marginBottom: '10px' }}>
              Intelligence Analysis
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--neutral-gray)' }}>SERIAL NUMBER:</span>
              <strong style={{ fontSize: '0.85rem' }}>{activeNote.serialNumber}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--neutral-gray)' }}>VERDICT:</span>
              <strong style={{ fontSize: '0.85rem', color: activeNote.status === 'Counterfeit' ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                {activeNote.status.toUpperCase()}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--neutral-gray)' }}>CONFIDENCE INDEX:</span>
              <strong style={{ fontSize: '0.85rem' }}>{activeNote.confidenceScore}%</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="nav-btn" 
              style={{ flex: 1, background: 'var(--primary-blue)', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={handleScan}
              disabled={isScanning}
            >
              <RefreshCw size={16} className={isScanning ? 'spin-anim' : ''} />
              <span>{isScanning ? 'Analyzing...' : 'Run CV Scan'}</span>
            </button>
            <button 
              className="nav-btn"
              style={{ flex: 1, background: uvActive ? 'var(--accent-saffron)' : 'rgba(0,0,0,0.05)', color: uvActive ? 'white' : 'var(--neutral-dark)', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={() => setUvActive(!uvActive)}
            >
              <Eye size={16} />
              <span>UV Light {uvActive ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Details on clicked Hotspot */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', background: '#ffffff', minHeight: '180px' }}>
            {activeHotspot ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  {activeHotspot.status === 'Counterfeit' ? (
                    <AlertTriangle size={18} style={{ color: 'var(--accent-red)' }} />
                  ) : (
                    <CheckCircle size={18} style={{ color: 'var(--accent-green)' }} />
                  )}
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-navy)', fontWeight: 700 }}>
                    {activeHotspot.title}
                  </h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--neutral-dark)', lineHeight: 1.4 }}>
                  {activeHotspot.description}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--neutral-gray)', padding: '20px', textAlign: 'center' }}>
                <Search size={28} style={{ marginBottom: '10px', opacity: 0.5 }} />
                <p style={{ fontSize: '0.8rem' }}>
                  Click on the highlighted hotspots on the banknote to inspect security markers.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-TAB 3: FRAUD MULE GRAPH
// ============================================================================
const FraudMuleGraph: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("S-1");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleNodeClick = (id: string) => {
    setSelectedNodeId(id);
  };

  const selectedNode = mockGraphData.nodes.find(n => n.id === selectedNodeId);
  const relatedLinks = mockGraphData.links.filter(l => l.source === selectedNodeId || l.target === selectedNodeId);

  // SVG representation coordinate mapper for static mock nodes
  const nodePositions: Record<string, { x: number; y: number }> = {
    "S-1": { x: 300, y: 150 }, // Primary Mule
    "S-2": { x: 420, y: 180 }, // Layering Mule
    "P-1": { x: 180, y: 100 }, // Scammer Phone 1
    "P-2": { x: 180, y: 220 }, // Scammer Phone 2
    "D-1": { x: 80, y: 160 },  // Scammer Device
    "V-1": { x: 300, y: 50 },  // Victim 1
    "V-2": { x: 300, y: 250 }, // Victim 2
    "C-1": { x: 540, y: 180 }  // International Destination
  };

  const filteredNodes = mockGraphData.nodes.filter(n => 
    n.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="section-title">
        <Network className="text-primary" />
        <div>
          <h2>Fraud Network Graph Intelligence</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--neutral-gray)', fontWeight: 500 }}>
            Visualizing account layers, money mule clustering, and hardware association trails
          </p>
        </div>
      </div>

      <div className="currency-scanner-workspace">
        {/* Left: SVG Canvas Graph */}
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input 
                type="text" 
                placeholder="Search phone number, bank account or entity ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.85rem' }}
              />
            </div>
          </div>
          
          <div className="graph-container">
            <svg width="100%" height="100%" viewBox="0 0 620 320" style={{ background: '#f8fafc' }}>
              {/* Grid backdrop */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                </pattern>
                <marker id="arrow" viewBox="0 0 10 10" refX="20" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                </marker>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Render Connections */}
              {mockGraphData.links.map((link, idx) => {
                const start = nodePositions[link.source];
                const end = nodePositions[link.target];
                if (!start || !end) return null;

                const sourceExists = filteredNodes.some(n => n.id === link.source);
                const targetExists = filteredNodes.some(n => n.id === link.target);
                if (!sourceExists || !targetExists) return null;

                const isHighlighted = selectedNodeId === link.source || selectedNodeId === link.target;

                return (
                  <g key={idx}>
                    <line 
                      x1={start.x} 
                      y1={start.y} 
                      x2={end.x} 
                      y2={end.y} 
                      stroke={isHighlighted ? 'var(--primary-blue)' : '#cbd5e1'} 
                      strokeWidth={isHighlighted ? '2.5' : '1.5'}
                      strokeDasharray={link.relation.includes('hundi') ? '5,5' : 'none'}
                      markerEnd="url(#arrow)"
                    />
                    {link.amount && (
                      <text 
                        x={(start.x + end.x) / 2} 
                        y={(start.y + end.y) / 2 - 5}
                        fontSize="8" 
                        fill={isHighlighted ? 'var(--primary-blue)' : '#64748b'}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {link.amount}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Render Nodes */}
              {filteredNodes.map(node => {
                const pos = nodePositions[node.id];
                if (!pos) return null;

                const isSelected = selectedNodeId === node.id;
                const isSearchMatch = searchQuery !== "" && node.label.toLowerCase().includes(searchQuery.toLowerCase());
                
                let fillColor = '#ffffff';
                let strokeColor = '#94a3b8';

                if (node.type === 'mule') { fillColor = 'rgba(255, 143, 28, 0.1)'; strokeColor = 'var(--accent-saffron)'; }
                else if (node.type === 'scammer') { fillColor = 'rgba(217, 56, 58, 0.1)'; strokeColor = 'var(--accent-red)'; }
                else if (node.type === 'victim') { fillColor = 'rgba(0, 135, 90, 0.1)'; strokeColor = 'var(--accent-green)'; }
                else if (node.type === 'phone') { fillColor = 'rgba(0, 102, 204, 0.1)'; strokeColor = 'var(--primary-blue)'; }

                return (
                  <g 
                    key={node.id} 
                    transform={`translate(${pos.x}, ${pos.y})`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleNodeClick(node.id)}
                  >
                    <circle 
                      r={isSelected ? "18" : isSearchMatch ? "16" : "13"} 
                      fill={fillColor} 
                      stroke={isSelected ? 'var(--primary-navy)' : strokeColor} 
                      strokeWidth={isSelected ? '3' : '2'} 
                    />
                    <text 
                      y="26" 
                      fontSize="9" 
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      fill="var(--primary-navy)" 
                      textAnchor="middle"
                    >
                      {node.label}
                    </text>
                    {/* Tiny type indicator icon placeholder */}
                    <text y="3" fontSize="8" fill="#475569" textAnchor="middle" fontWeight="bold">
                      {node.type[0].toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right: Node Info Detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {selectedNode ? (
            <div className="glass-card" style={{ height: '100%', background: '#ffffff', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                {selectedNode.type === 'mule' && <CreditCard className="text-primary" />}
                {selectedNode.type === 'victim' && <User style={{ color: 'var(--accent-green)' }} />}
                {selectedNode.type === 'scammer' && <ShieldAlert style={{ color: 'var(--accent-red)' }} />}
                {selectedNode.type === 'phone' && <Phone style={{ color: 'var(--primary-blue)' }} />}
                
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-navy)' }}>{selectedNode.label}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--neutral-gray)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Entity Class: {selectedNode.type}
                  </span>
                </div>
              </div>

              {/* Entity Attributes */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(selectedNode.details).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--neutral-gray)', textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1')}:
                    </span>
                    <strong style={{ color: 'var(--neutral-dark)' }}>{val}</strong>
                  </div>
                ))}

                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed var(--border-color)' }}>
                  <h5 style={{ fontSize: '0.8rem', color: 'var(--neutral-gray)', fontWeight: 600, marginBottom: '6px' }}>
                    Active Network Links ({relatedLinks.length})
                  </h5>
                  {relatedLinks.map((link, idx) => (
                    <div 
                      key={idx} 
                      style={{ fontSize: '0.75rem', padding: '6px', background: 'var(--neutral-light)', borderRadius: '4px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}
                    >
                      <span>
                        {link.source === selectedNode.id ? 'Outgoing' : 'Incoming'} →{' '}
                        <strong>{link.relation}</strong>
                      </span>
                      <span>{link.amount || link.callDuration || ''}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dossier Download Action */}
              <button 
                className="nav-btn" 
                style={{ width: '100%', background: 'var(--primary-blue)', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: 600, marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={() => {
                  const dataStr = `COURT-ADMISSIBLE INTELLIGENCE DOCKET\nCase Ref: HACK-ET2.0-GRID\nTarget Entity: ${selectedNode.label} (${selectedNode.id})\nType: ${selectedNode.type}\nAudit Trails:\n${JSON.stringify(selectedNode.details, null, 2)}\nNetwork Links:\n${relatedLinks.map(l => `- ${l.source} connects to ${l.target} via ${l.relation} (${l.amount || 'N/A'})`).join('\n')}\nVerified By: National Digital Public Safety System\nSeal: CERTIFIED`;
                  const blob = new Blob([dataStr], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Evidence-Docket-${selectedNode.id}.txt`;
                  a.click();
                }}
              >
                <Download size={16} />
                <span>Export Evidence Dossier</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--neutral-gray)' }}>
              Select a node in the graph to view intelligence profiling data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-TAB 4: PATROL OPTIMIZER MAP
// ============================================================================
const PatrolMap: React.FC = () => {
  const [hotspots, setHotspots] = useState<GeospatialHotspot[]>(mockGeospatialHotspots);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>("HOT-1");

  const activeHotspot = hotspots.find(h => h.id === selectedHotspotId);

  const handleDispatch = (id: string) => {
    setHotspots(prev => prev.map(h => {
      if (h.id === id) {
        return {
          ...h,
          assignedPatrol: "Cyber Patrol Car-4 (Dispatched)"
        };
      }
      return h;
    }));
  };

  return (
    <div>
      <div className="section-title">
        <MapPin className="text-primary" />
        <div>
          <h2>Geospatial Crime Pattern Intelligence</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--neutral-gray)', fontWeight: 500 }}>
            Visualizing cybercrime reports, counterfeit note seizure nodes, and dispatch coordination
          </p>
        </div>
      </div>

      <div className="map-dashboard">
        {/* Left: Custom SVG India Outline Map */}
        <div className="vector-map-canvas">
          <svg className="svg-india-map" viewBox="0 0 400 450">
            {/* Custom abstract vector representation of India */}
            <path 
              d="M 200 40 L 230 70 L 250 110 L 290 140 L 320 180 L 300 200 L 270 210 L 250 250 L 220 330 L 200 390 L 190 390 L 170 300 L 140 260 L 110 240 L 90 220 L 70 200 L 80 180 L 120 170 L 140 140 L 150 100 L 180 60 Z" 
              className="india-state-shape"
            />
            {/* Outline grid lines for telemetry feel */}
            <line x1="0" y1="225" x2="400" y2="225" stroke="rgba(0,102,204,0.06)" />
            <line x1="200" y1="0" x2="200" y2="450" stroke="rgba(0,102,204,0.06)" />
          </svg>

          {/* Render overlay pins */}
          {hotspots.map(spot => (
            <div 
              key={spot.id}
              className={`map-hotspot-pin ${spot.severity}`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              onClick={() => setSelectedHotspotId(spot.id)}
              title={spot.title}
            />
          ))}
        </div>

        {/* Right Detail Pane */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {activeHotspot ? (
            <div className="glass-card" style={{ background: '#ffffff', border: '1px solid var(--border-color)', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <span className={`risk-tag ${
                activeHotspot.severity === 'Critical' ? 'risk-critical' : 'risk-high'
              }`} style={{ alignSelf: 'flex-start', marginBottom: '10px' }}>
                {activeHotspot.severity} Threat
              </span>
              
              <h3 style={{ fontSize: '1rem', color: 'var(--primary-navy)', fontWeight: 700, marginBottom: '8px' }}>
                {activeHotspot.title}
              </h3>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--neutral-gray)' }}>Location:</span>{' '}
                  <strong>{activeHotspot.state}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--neutral-gray)' }}>Type:</span>{' '}
                  <strong>{activeHotspot.type}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--neutral-gray)' }}>Reported Time:</span>{' '}
                  <strong>{activeHotspot.reportedAt}</strong>
                </div>
                
                <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '10px', marginTop: '5px' }}>
                  <span style={{ color: 'var(--neutral-gray)', display: 'block', marginBottom: '4px' }}>Incident Details:</span>
                  <p style={{ color: 'var(--neutral-dark)', lineHeight: 1.4, fontSize: '0.8rem' }}>
                    {activeHotspot.details}
                  </p>
                </div>

                <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '10px', marginTop: '5px' }}>
                  <span style={{ color: 'var(--neutral-gray)', display: 'block', marginBottom: '4px' }}>Assigned Unit:</span>
                  <strong style={{ color: activeHotspot.assignedPatrol ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                    {activeHotspot.assignedPatrol || 'Unassigned / Monitoring'}
                  </strong>
                </div>
              </div>

              <button 
                className="nav-btn" 
                style={{ width: '100%', background: activeHotspot.assignedPatrol ? '#475569' : 'var(--primary-blue)', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: 600, marginTop: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={() => handleDispatch(activeHotspot.id)}
                disabled={!!activeHotspot.assignedPatrol}
              >
                <Navigation size={16} />
                <span>{activeHotspot.assignedPatrol ? 'Unit Dispatched' : 'Dispatch Cyber Patrol Unit'}</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--neutral-gray)', textAlign: 'center', padding: '20px' }}>
              Click on a map hotspot to view incident response parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
