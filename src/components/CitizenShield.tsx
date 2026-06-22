import React, { useState, useEffect } from 'react';
import { Send, Globe, ShieldAlert, PhoneCall, Copy, CheckCircle, Wifi } from 'lucide-react';
import { mockChatBotScript } from '../data/mockData';
import { postTelemetry } from '../services/api';

type LangCode = 'en' | 'hi' | 'ta';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export const CitizenShield: React.FC = () => {
  const [lang, setLang] = useState<LangCode>('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [riskAssessment, setRiskAssessment] = useState<{
    show: boolean;
    score: number;
    verdict: string;
    advice: string;
    draft: string;
  } | null>(null);

  // Pre-loaded templates for user convenience
  const templates = [
    {
      label: "Parcel Seized (Digital Arrest)",
      text: "URGENT WARNING: Your passport and 200g of MDMA drugs were seized in a packet at Mumbai Airport Customs. Your arrest warrant is issued under NDPS Act. Please contact CBI Deputy Director immediately on Skype: cbi-hq-clearance-desk."
    },
    {
      label: "KYC Block Link (Bank Phishing)",
      text: "Dear SBI customer, your banking account is blocked due to missing PAN update. To avoid suspension click to update credentials here: http://sbi-netbanking-verify.in/secure-portal."
    },
    {
      label: "YouTube Like Job (Mule Scam)",
      text: "Earn ₹5000 per day from home! Simply like YouTube videos and send screenshots to earn commission. Daily payout. Register now via WhatsApp link: wa.me/9188391024."
    }
  ];

  // Set initial welcome message based on language
  useEffect(() => {
    setMessages([
      {
        id: "m-welcome",
        sender: 'bot',
        text: mockChatBotScript.welcome[lang],
        timestamp: getFormattedTime()
      }
    ]);
    setRiskAssessment(null);
  }, [lang]);

  const getFormattedTime = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: getFormattedTime()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    setRiskAssessment(null);

    let apiThreatScore = 96;
    let apiIntentVector = 'digital_arrest';
    let apiIsLive = false;

    try {
      const telemetryResult = await postTelemetry({
        sender: '+91-CITIZEN-BOT',
        message_body: textToSend,
        destination: 'CITIZEN_SHIELD_PORTAL',
        source_ip: '127.0.0.1',
      });
      apiThreatScore = Math.round(telemetryResult.threat_score * 100);
      apiIntentVector = telemetryResult.primary_intent_vector;
      apiIsLive = true;
    } catch {
      apiIsLive = false;
    }

    setIsTyping(false);

    const script = mockChatBotScript.scamCheckResponse[lang];
    const intentLabel = apiIntentVector.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const botResponseText = `${script.alert}\n\n${script.verdict}\n\n${script.advice}${apiIsLive ? `\n\n🔌 Backend AI Analysis: Intent detected as "${intentLabel}" with ${apiThreatScore}% threat confidence.` : ''}`;

    const botMsg: Message = {
      id: `b-${Date.now()}`,
      sender: 'bot',
      text: botResponseText,
      timestamp: getFormattedTime()
    };

    setMessages(prev => [...prev, botMsg]);

    let customDraft = script.draftReport
      .replace('{number}', '+91 80 5039 2145')
      .replace('{date}', new Date().toLocaleDateString())
      .replace('{amount}', '50,000');

    setRiskAssessment({
      show: true,
      score: apiThreatScore,
      verdict: script.verdict,
      advice: script.advice,
      draft: customDraft,
      intentVector: intentLabel,
      isLiveApi: apiIsLive,
    } as any);
  };

  const handleCopyDraft = () => {
    if (!riskAssessment) return;
    navigator.clipboard.writeText(riskAssessment.draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="section-title">
        <Globe className="text-primary" />
        <div>
          <h2>Citizen Fraud Shield Portal</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--neutral-gray)', fontWeight: 500 }}>
            Instant safety audits in regional languages, verification checks, and guided NCRB incident reporting
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 450px', gap: '30px', alignItems: 'start' }}>
        {/* Left Side: Instructions & Risk Assessment Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Language Selection */}
          <div className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} />
              Choose Language / भाषा चुनें
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className={`nav-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                English
              </button>
              <button 
                className={`nav-btn ${lang === 'hi' ? 'active' : ''}`}
                onClick={() => setLang('hi')}
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                हिन्दी
              </button>
              <button 
                className={`nav-btn ${lang === 'ta' ? 'active' : ''}`}
                onClick={() => setLang('ta')}
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                தமிழ்
              </button>
            </div>
          </div>

          {/* Test Templates */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--primary-navy)', fontWeight: 700, marginBottom: '12px' }}>
              Select a Suspicious Message Template to Audit:
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {templates.map((tpl, idx) => (
                <button
                  key={idx}
                  className="sidebar-link"
                  style={{ textAlign: 'left', display: 'block', fontSize: '0.8rem', padding: '10px 14px' }}
                  onClick={() => {
                    setInputValue(tpl.text);
                    handleSend(tpl.text);
                  }}
                >
                  <strong>{tpl.label}</strong>
                  <p style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: 'var(--neutral-gray)', marginTop: '4px' }}>
                    {tpl.text}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Risk Assessment Action Plan Card */}
          {riskAssessment && riskAssessment.show && (
            <div className="glass-card" style={{ border: '2px solid var(--accent-red)', background: 'rgba(217, 56, 58, 0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-red)' }}>
                  <ShieldAlert size={24} />
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{riskAssessment.verdict}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--neutral-gray)' }}>AI Sentiment &amp; Context Verdict</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <span style={{ background: 'var(--accent-red)', color: 'white', fontWeight: 800, fontSize: '0.95rem', padding: '4px 14px', borderRadius: '20px' }}>
                    {riskAssessment.score}% Risk
                  </span>
                  {(riskAssessment as any).isLiveApi ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#22c55e', fontWeight: 700 }}>
                      <Wifi size={12} /> Live API
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.7rem', color: 'var(--neutral-gray)', fontWeight: 600 }}>Fallback Mode</span>
                  )}
                </div>
              </div>

              {(riskAssessment as any).intentVector && (
                <div style={{ background: 'rgba(0,102,204,0.06)', border: '1px solid rgba(0,102,204,0.15)', borderRadius: '8px', padding: '8px 14px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--neutral-gray)', fontWeight: 600 }}>DETECTED INTENT VECTOR</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-blue)' }}>{(riskAssessment as any).intentVector}</span>
                </div>
              )}

              <div style={{ fontSize: '0.85rem', color: 'var(--neutral-dark)', marginBottom: '16px', padding: '12px', background: '#ffffff', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong>Immediate Action Required:</strong>
                <pre style={{ whiteSpace: 'pre-line', fontFamily: 'inherit', marginTop: '6px', fontSize: '0.8rem', color: 'var(--neutral-dark)' }}>
                  {riskAssessment.advice}
                </pre>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Draft Complaint (NCRB Portal Ready)</span>
                  <button 
                    onClick={handleCopyDraft} 
                    style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}
                  >
                    {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copied!' : 'Copy Draft'}</span>
                  </button>
                </h4>
                <div style={{ background: '#f7fafc', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--neutral-dark)', whiteSpace: 'pre-wrap' }}>
                  {riskAssessment.draft}
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--neutral-gray)', marginTop: '8px' }}>
                  * Copy this text and paste it under the cybercrime reporting section on the official Portal at <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>cybercrime.gov.in</a>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Simulated WhatsApp Interface */}
        <div className="whatsapp-phone-mockup">
          {/* Header */}
          <div className="whatsapp-header">
            <div className="whatsapp-avatar">🛡️</div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>National Cyber Shield Bot</h4>
              <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>Official Ministry Verification Bot</span>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
              <PhoneCall size={16} />
            </div>
          </div>

          {/* Messages Body */}
          <div className="whatsapp-body">
            {messages.map(msg => (
              <div 
                key={msg.id}
                className={`whatsapp-message ${msg.sender === 'bot' ? 'incoming' : 'outgoing'}`}
              >
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--neutral-gray)', textAlign: 'right', marginTop: '4px' }}>
                  {msg.timestamp}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="whatsapp-message incoming" style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '10px 14px' }}>
                <span style={{ width: '6px', height: '6px', background: 'var(--neutral-gray)', borderRadius: '50%', display: 'inline-block', animation: 'wavePulse 0.8s infinite' }}></span>
                <span style={{ width: '6px', height: '6px', background: 'var(--neutral-gray)', borderRadius: '50%', display: 'inline-block', animation: 'wavePulse 0.8s infinite 0.2s' }}></span>
                <span style={{ width: '6px', height: '6px', background: 'var(--neutral-gray)', borderRadius: '50%', display: 'inline-block', animation: 'wavePulse 0.8s infinite 0.4s' }}></span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="whatsapp-footer">
            <input 
              type="text" 
              placeholder="Paste SMS / WhatsApp scam script here..."
              className="whatsapp-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend(inputValue);
              }}
            />
            <button className="whatsapp-send" onClick={() => handleSend(inputValue)}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
