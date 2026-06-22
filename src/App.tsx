import { useState } from 'react';
import { Shield, ShieldAlert, UserCheck, CheckCircle } from 'lucide-react';
import { CommandHub } from './components/CommandHub';
import { CitizenShield } from './components/CitizenShield';

function App() {
  const [activeTab, setActiveTab] = useState<'hub' | 'citizen'>('hub');

  return (
    <div className="app-container">
      {/* Official Government Header */}
      <header className="gov-header">
        <div className="gov-branding">
          <div className="gov-emblem">
            🇮🇳
          </div>
          <div className="gov-title-block">
            <h1>SentinelAI</h1>
            <p>National Digital Public Safety & Cyber Trust Hub</p>
          </div>
        </div>

        {/* Live System Stats */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--neutral-gray)', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>
              Scam Calls Intercepted
            </span>
            <strong style={{ fontSize: '1rem', color: 'var(--accent-red)', fontWeight: 800 }}>1,482 Active</strong>
          </div>
          
          <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }}></div>

          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--neutral-gray)', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>
              FICN Counterfeit Seized
            </span>
            <strong style={{ fontSize: '1rem', color: 'var(--accent-green)', fontWeight: 800 }}>₹4,82,500</strong>
          </div>
          
          <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }}></div>

          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--neutral-gray)', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>
              Mule accounts frozen
            </span>
            <strong style={{ fontSize: '1rem', color: 'var(--primary-blue)', fontWeight: 800 }}>384 Accounts</strong>
          </div>
        </div>

        {/* Top-Level Portal Navigation */}
        <div className="nav-links">
          <button 
            className={`nav-btn ${activeTab === 'hub' ? 'active' : ''}`}
            onClick={() => setActiveTab('hub')}
          >
            <Shield size={16} />
            <span>Command & Control</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'citizen' ? 'active' : ''}`}
            onClick={() => setActiveTab('citizen')}
          >
            <UserCheck size={16} />
            <span>Citizen Shield</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="main-content">
        {/* Banner with National Seal Motif & Quick Intro */}
        <div className="glass-card" style={{ 
          marginBottom: '25px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(227,238,255,0.9) 100%)',
          borderLeft: '5px solid var(--primary-blue)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShieldAlert size={20} style={{ color: 'var(--primary-blue)' }} />
              <span style={{ fontStyle: 'italic', fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-blue)', letterSpacing: '0.5px' }}>
                Under National Cybersecurity Initiative (ET 2.0 Hackathon Entry)
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
              Integrated Threat Intelligence & Fraud Prevention Console
            </h2>
            <p style={{ color: 'var(--neutral-gray)', fontSize: '0.9rem', marginTop: '4px', maxWidth: '850px' }}>
              An unified platform that connects citizen reports with law enforcement dispatch, telecom blocks, 
              and bank teller currency scanners to defeat Digital Arrest scams, Money Mule accounts, and Counterfeit Currency networks.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--neutral-gray)', fontWeight: 600 }}>SYSTEM LEVEL</span>
              <span style={{ background: 'rgba(0,135,90,0.1)', color: 'var(--accent-green)', padding: '4px 10px', borderRadius: '20px', fontWeight: 800, fontSize: '0.8rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={12} /> SECURE
              </span>
            </div>
          </div>
        </div>

        {/* Tab views rendering */}
        {activeTab === 'hub' ? <CommandHub /> : <CitizenShield />}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '20px', fontSize: '0.8rem', color: 'var(--neutral-gray)', borderTop: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.4)', marginTop: '40px' }}>
        <strong>SentinelAI Platform</strong> — Built for ET 2.0 Hackathon. Equipped with Automated Telephony Blockers, Computer Vision Note Scanners, and Graph Fraud Mapping Engines.
      </footer>
    </div>
  );
}

export default App;
