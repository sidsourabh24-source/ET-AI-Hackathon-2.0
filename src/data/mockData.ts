export interface CallTranscriptLine {
  speaker: 'Scammer' | 'Victim' | 'System';
  text: string;
  timestamp: string;
}

export interface DigitalArrestCall {
  id: string;
  callerNumber: string;
  displayCallerId: string;
  carrier: string;
  routingPath: string[];
  spoofProbability: number;
  riskScore: number;
  status: 'Active' | 'Intercepted' | 'Blocked';
  victimName: string;
  victimAge: number;
  victimLocation: string;
  threatLevel: 'High' | 'Critical' | 'Medium';
  transcript: CallTranscriptLine[];
}

export interface CurrencyHotspot {
  id: string;
  name: string;
  x: number; // percentage
  y: number; // percentage
  status: 'Genuine' | 'Counterfeit';
  title: string;
  description: string;
  magnifiedSrc?: string; // simulation placeholder
}

export interface CurrencyNote {
  id: string;
  serialNumber: string;
  denomination: number;
  status: 'Genuine' | 'Counterfeit';
  confidenceScore: number;
  hotspots: CurrencyHotspot[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'account' | 'phone' | 'imei' | 'mule' | 'scammer' | 'victim';
  details: {
    name?: string;
    bankName?: string;
    balance?: string;
    location?: string;
    imei?: string;
    ipAddress?: string;
    reports?: number;
    phoneModel?: string;
  };
}

export interface GraphLink {
  source: string;
  target: string;
  relation: string;
  amount?: string;
  callDuration?: string;
}

export interface GeospatialHotspot {
  id: string;
  title: string;
  type: 'Digital Arrest' | 'Counterfeit Seizure' | 'Mule Account Activity';
  x: number; // custom SVG X coordinate (0-100)
  y: number; // custom SVG Y coordinate (0-100)
  state: string;
  severity: 'Critical' | 'Warning' | 'Moderate';
  reportedAt: string;
  details: string;
  assignedPatrol: string | null;
}

// ----------------------------------------------------
// Mock Data Generation
// ----------------------------------------------------

export const mockCalls: DigitalArrestCall[] = [
  {
    id: "CALL-7739",
    callerNumber: "+91 80 5039 2145 (Spoofed)",
    displayCallerId: "CBI HQ Delhi - Cyber Cell",
    carrier: "VoIP (Internationally routed via Singapore)",
    routingPath: ["Cambodia", "Singapore", "Mumbai VoIP Gateway", "Victim Handset"],
    spoofProbability: 97,
    riskScore: 94,
    status: 'Active',
    victimName: "Ananya Sharma",
    victimAge: 62,
    victimLocation: "South Delhi, Delhi",
    threatLevel: 'Critical',
    transcript: [
      { speaker: 'System', text: "Call Intercept Initiated. Analyzing voice signatures & text patterns...", timestamp: "16:15:02" },
      { speaker: 'Scammer', text: "Madam, I am Senior Inspector Ajay Kumar from the Central Bureau of Investigation, New Delhi Office. Your Aadhaar card has been linked to a money laundering case involving Jet Airways CEO. Do you understand the severity?", timestamp: "16:15:05" },
      { speaker: 'Victim', text: "But... how can that be? I have never been associated with Jet Airways. I am a retired school teacher!", timestamp: "16:15:15" },
      { speaker: 'Scammer', text: "Do not raise your voice. We have arrested a suspect named Naresh Goyal, and he has a bank account in Canara Bank under your name containing 2.5 Crore Rupees. We have issued a warrant of Digital Arrest for you.", timestamp: "16:15:24" },
      { speaker: 'Victim', text: "Digital Arrest? What does that mean? Should I come to the police station?", timestamp: "16:15:35" },
      { speaker: 'Scammer', text: "No! Under Supreme Court emergency orders, you cannot leave your room or contact anyone. You must keep the camera ON. If you drop this video call, our local team will break in and lock you in jail for 7 years.", timestamp: "16:15:42" },
      { speaker: 'System', text: "ALERT: Government impersonation detected (Canara Bank, CBI, Digital Arrest). Psychological hostage script triggered.", timestamp: "16:15:46" },
      { speaker: 'Scammer', text: "Now, I am transferring this call to our magistrate for a secret clearance check. You must transfer your savings to the RBI security verification account. If you are innocent, the money will be returned in 30 minutes.", timestamp: "16:15:58" },
      { speaker: 'Victim', text: "Okay, please, I will do whatever you say. I am very scared, my husband is not home. Please don't arrest me...", timestamp: "16:16:10" }
    ]
  },
  {
    id: "CALL-8841",
    callerNumber: "+91 99 8734 5510",
    displayCallerId: "Customs Department Mumbai Port",
    carrier: "Virtual SIM / Cloud PBX",
    routingPath: ["Myanmar", "Bangalore Gateway", "Victim Handset"],
    spoofProbability: 88,
    riskScore: 82,
    status: 'Active',
    victimName: "Rohan Deshmukh",
    victimAge: 29,
    victimLocation: "Pune, Maharashtra",
    threatLevel: 'High',
    transcript: [
      { speaker: 'System', text: "Call Intercept Initiated. Analyzing voice signatures & text patterns...", timestamp: "16:12:10" },
      { speaker: 'Scammer', text: "Yes Mr. Rohan, a parcel sent from Taiwan in your name has been detained at Mumbai Airport customs. Inside, we found 5 passports, 15 credit cards, and 200 grams of MDMA drugs.", timestamp: "16:12:15" },
      { speaker: 'Victim', text: "MDMA drugs? I didn't order any parcel! This must be a mistake.", timestamp: "16:12:28" },
      { speaker: 'Scammer', text: "We have already registered an FIR under the NDPS Act. The Mumbai Crime Branch is taking over. Keep this call active, we are connecting you to DCP Crime Branch via video conference.", timestamp: "16:12:35" },
      { speaker: 'System', text: "ALERT: Border Customs scam pattern detected. Narcotics trafficking claim.", timestamp: "16:12:40" },
      { speaker: 'Scammer', text: "To verify you are not part of the drug syndicate, you must submit a financial disclosure. Log into your banking app now.", timestamp: "16:12:55" }
    ]
  },
  {
    id: "CALL-3012",
    callerNumber: "+91 82 4910 8823",
    displayCallerId: "ED Officer - Special Cell",
    carrier: "Jio VoIP",
    routingPath: ["Local Routing", "Victim Handset"],
    spoofProbability: 15,
    riskScore: 92,
    status: 'Intercepted',
    victimName: "Dr. K. Raghavan",
    victimAge: 73,
    victimLocation: "Chennai, Tamil Nadu",
    threatLevel: 'High',
    transcript: [
      { speaker: 'System', text: "Call Intercepted. Automated AI Responder deployed to confuse scammer.", timestamp: "16:01:00" },
      { speaker: 'Scammer', text: "Hello, this is Enforcement Directorate officer. You are connected to Skype security line. Why is your camera off?", timestamp: "16:01:05" },
      { speaker: 'System', text: "Deploying Bot: 'I am trying to turn on my webcam, it is loading... Can you explain the charges again?'", timestamp: "16:01:18" },
      { speaker: 'Scammer', text: "Yes, you have illegal bank accounts linked to international human trafficking. You must transfer 15 Lakh rupees immediately to court custody.", timestamp: "16:01:30" }
    ]
  }
];

export const mockNotes: CurrencyNote[] = [
  {
    id: "NOTE-2026-F500",
    denomination: 500,
    serialNumber: "5AC 493012",
    status: 'Counterfeit',
    confidenceScore: 98.4,
    hotspots: [
      {
        id: "h-1",
        name: "Security Thread",
        x: 48,
        y: 45,
        status: 'Counterfeit',
        title: "Color-Shifting Security Thread",
        description: "FAKE: On genuine Rs 500 notes, the security thread shifts color from green to blue when tilted. This fake note uses reflective metallic green paint that does not shift color at all under different light angles."
      },
      {
        id: "h-2",
        name: "Microlettering",
        x: 32,
        y: 65,
        status: 'Counterfeit',
        title: "Microprint Quality ('RBI' and '500')",
        description: "FAKE: Genuine notes contain crisp microprinted letters 'RBI' and '500' legible under magnification. In this note, the print is smudged and bleeding, characteristic of high-quality inkjet or offset printing rather than security intaglio press."
      },
      {
        id: "h-3",
        name: "Latent Image",
        x: 18,
        y: 80,
        status: 'Genuine',
        title: "Latent Image of '500'",
        description: "GENUINE: The latent image of the numeral '500' in the band next to Gandhi's portrait is present and becomes visible when tilted at a 45-degree angle."
      },
      {
        id: "h-4",
        name: "Mahatma Gandhi Watermark",
        x: 75,
        y: 50,
        status: 'Counterfeit',
        title: "Watermark & Electrotype Portrait",
        description: "FAKE: The watermark portrait of Mahatma Gandhi is printed using white ink between paper layers, instead of being embedded in the paper pulp. It lacks the multi-tone depth, three-dimensionality, and the electrotype '500' watermark is poorly aligned."
      },
      {
        id: "h-5",
        name: "Bleed Lines",
        x: 93,
        y: 40,
        status: 'Counterfeit',
        title: "Intaglio Bleed Lines (Tactile Features)",
        description: "FAKE: The 5 angular bleed lines on the left and right borders are smooth. Genuine notes use raised intaglio printing so that visually impaired tellers can feel them tactilely. Here, it is completely flat."
      }
    ]
  },
  {
    id: "NOTE-2026-G500",
    denomination: 500,
    serialNumber: "9BE 882034",
    status: 'Genuine',
    confidenceScore: 99.8,
    hotspots: [
      {
        id: "g-1",
        name: "Security Thread",
        x: 48,
        y: 45,
        status: 'Genuine',
        title: "Color-Shifting Security Thread",
        description: "GENUINE: The security thread changes color perfectly from green to blue when tilted, and displays clear, sharp text 'भारत' (Bharat) and 'RBI'."
      },
      {
        id: "g-2",
        name: "Microlettering",
        x: 32,
        y: 65,
        status: 'Genuine',
        title: "Microprint Check",
        description: "GENUINE: Extremely clean and microprinted 'RBI' and '500' letters are visible under magnifying scan, indicating high-security intaglio press usage."
      },
      {
        id: "g-3",
        name: "Mahatma Gandhi Watermark",
        x: 75,
        y: 50,
        status: 'Genuine',
        title: "Gandhi Watermark",
        description: "GENUINE: True multi-directional watermark embedded in the cotton pulp, exhibiting three-dimensional depth and a sharp electrotype '500'."
      }
    ]
  }
];

export const mockGraphData: { nodes: GraphNode[]; links: GraphLink[] } = {
  nodes: [
    { id: "S-1", label: "Intermediary Mule Account (ICICI)", type: "mule", details: { name: "Ramesh Kumar Enterprise", bankName: "ICICI Bank, Nuh Branch", balance: "Rs. 45,30,000", location: "Nuh, Haryana", reports: 8 } },
    { id: "S-2", label: "Primary Receiver Account (SBI)", type: "mule", details: { name: "Aman Traders", bankName: "State Bank of India, Jamtara", balance: "Rs. 1,20,500", location: "Jamtara, Jharkhand", reports: 14 } },
    { id: "P-1", label: "+91 80 5039 2145", type: "phone", details: { location: "Cambodia/Poipet Proxy", imei: "IMEI-88301294819", reports: 34, phoneModel: "Redmi Note 12" } },
    { id: "P-2", label: "+91 99 8734 5510", type: "phone", details: { location: "Myanmar Border Router", imei: "IMEI-99201948201", reports: 12, phoneModel: "Samsung Galaxy M14" } },
    { id: "D-1", label: "IMEI: 88301294819", type: "imei", details: { phoneModel: "Redmi Note 12", location: "Jamtara Area", reports: 4 } },
    { id: "V-1", label: "Ananya Sharma (Victim)", type: "victim", details: { name: "Ananya Sharma", location: "South Delhi", balance: "Rs. 1,20,000" } },
    { id: "V-2", label: "Rohan Deshmukh (Victim)", type: "victim", details: { name: "Rohan Deshmukh", location: "Pune, MH", balance: "Rs. 8,40,000" } },
    { id: "C-1", label: "Shell Corp - Gold Distributors", type: "scammer", details: { name: "Gold Distributors Ltd", location: "Dubai, UAE", bankName: "Mashreq Bank" } }
  ],
  links: [
    { source: "V-1", target: "S-1", relation: "scammed_transfer", amount: "Rs. 12,50,000" },
    { source: "V-2", target: "S-1", relation: "scammed_transfer", amount: "Rs. 8,40,000" },
    { source: "P-1", target: "V-1", relation: "voip_call", callDuration: "42 min" },
    { source: "P-2", target: "V-2", relation: "voip_call", callDuration: "18 min" },
    { source: "P-1", target: "D-1", relation: "device_link" },
    { source: "S-1", target: "S-2", relation: "mule_layering", amount: "Rs. 18,00,000" },
    { source: "S-2", target: "C-1", relation: "hundi_outflow", amount: "Rs. 15,00,000" }
  ]
};

export const mockGeospatialHotspots: GeospatialHotspot[] = [
  {
    id: "HOT-1",
    title: "Coordinated Digital Arrest Campaign Active",
    type: "Digital Arrest",
    x: 48,
    y: 35, // NCR region
    state: "Delhi NCR",
    severity: "Critical",
    reportedAt: "16:14:00",
    details: "6 concurrent spoofed calls detected from Myanmar router tracing to IP range 103.24.12.8 targeting senior citizens in South Delhi and Noida.",
    assignedPatrol: "Cyber Cell Unit 3"
  },
  {
    id: "HOT-2",
    title: "Counterfeit Rs 500 Note Influx",
    type: "Counterfeit Seizure",
    x: 75,
    y: 50, // Bengal area
    state: "West Bengal (Malda Border)",
    severity: "Warning",
    reportedAt: "15:45:00",
    details: "Commercial banks in Malda reported 45 high-quality counterfeit notes matching the 'NOTE-2026-F500' serial series. Likely smuggled via cross-border channels.",
    assignedPatrol: "FICN Taskforce"
  },
  {
    id: "HOT-3",
    title: "Mule Account Withdrawal Spike",
    type: "Mule Account Activity",
    x: 35,
    y: 65, // Maharashtra/Gujarat border area
    state: "Mumbai Central",
    severity: "Moderate",
    reportedAt: "16:05:00",
    details: "Atm withdrawal spike on Canara Bank account Ramesh Kumar Enterprise. Total 12 Lakhs withdrawn in last 30 minutes in ATM kiosks near Mumbai Terminal 2.",
    assignedPatrol: null
  },
  {
    id: "HOT-4",
    title: "Telecom Spoof Gateway Blocked",
    type: "Digital Arrest",
    x: 42,
    y: 42, // Mewat region
    state: "Haryana (Nuh / Mewat)",
    severity: "Warning",
    reportedAt: "16:10:00",
    details: "Cooperation with Airtel Telecom blocked 22 virtual lines spoofing Delhi Police numbers operated out of Nuh district.",
    assignedPatrol: "Nuh Cyber Police"
  }
];

export const mockChatBotScript = {
  welcome: {
    en: "Welcome to Citizen Fraud Shield. I am Sentinel Bot from the National Cyber Crime Portal. How can I help you today? Please choose an option below:\n\n1. Check a suspicious call/message\n2. Report a digital scam or money loss\n3. Learn about Digital Arrest safety\n4. Select Language / भाषा चुनें",
    hi: "सिटिजन फ्रॉड शील्ड में आपका स्वागत है। मैं राष्ट्रीय साइबर अपराध पोर्टल से सेंटिनल बॉट हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?\n\n1. संदिग्ध कॉल/संदेश की जाँच करें\n2. डिजिटल घोटाले या पैसे के नुकसान की रिपोर्ट करें\n3. डिजिटल अरेस्ट सुरक्षा के बारे में जानें\n4. भाषा बदलें (English)",
    ta: "சிட்டிசன் ஃபிராடு ஷீல்டுக்கு உங்களை வரவேற்கிறோம். நான் தேசிய சைபர் குற்றப்பிரிவு போர்டலில் இருந்து சென்டினல் பாட் பேசுகிறேன். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?\n\n1. சந்தேகத்திற்கிடமான அழைப்பு/செய்தியைச் சரிபார்க்கவும்\n2. டிஜிட்டல் மோசடி அல்லது பண இழப்பைப் புகாரளிக்கவும்\n3. டிஜிட்டல் அரெஸ்ட் பாதுகாப்பு பற்றி அறியவும்\n4. மொழியைத் தேர்ந்தெடுக்கவும் (Language)"
  },
  scamCheckResponse: {
    en: {
      alert: "⚠️ CRITICAL ALERT! The text you pasted contains indicators of a DIGITAL ARREST SCAM.",
      verdict: "Verdict: 96% Scam Risk",
      advice: "Important Guidelines:\n1. Government agencies (CBI, ED, Customs, Police) NEVER arrest anyone over Skype, WhatsApp, or video calls.\n2. Do NOT transfer any money to 'verification accounts'. There is no such account.\n3. Do NOT disclose Aadhaar, OTPs, or financial details.\n4. Call 1930 immediately to block transaction outflows.",
      draftReport: "We have drafted a complaint draft for you. You can copy this and paste it on cybercrime.gov.in:\n\n'Complaint regarding digital arrest attempt. Caller impersonating CBI officer on number {number} threatened me with fake warrant on {date} and demanded Rs. {amount} to be sent to a verification account.'"
    },
    hi: {
      alert: "⚠️ गंभीर चेतावनी! आपके द्वारा भेजे गए संदेश में डिजिटल अरेस्ट घोटाले के संकेत हैं।",
      verdict: "निष्कर्ष: 96% घोटाला जोखिम",
      advice: "महत्वपूर्ण दिशानिर्देश:\n1. सरकारी एजेंसियां (CBI, ED, पुलिस) कभी भी स्काइप, व्हाट्सएप या वीडियो कॉल पर किसी को गिरफ्तार नहीं करती हैं।\n2. 'सत्यापन खातों' में कोई पैसा ट्रांसफर न करें। ऐसा कोई खाता नहीं होता।\n3. आधार, ओटीपी या बैंक विवरण साझा न करें।\n4. तुरंत 1930 पर कॉल करें ताकि आपके पैसे रोके जा सकें।",
      draftReport: "हमने आपके लिए एक शिकायत प्रारूप तैयार किया है। इसे कॉपी करके cybercrime.gov.in पर दर्ज कर सकते हैं:\n\n'डिजिटल अरेस्ट के प्रयास के संबंध में शिकायत। {number} नंबर से सीबीआई अधिकारी बनकर बात करने वाले व्यक्ति ने {date} को मुझे झूठे वारंट से डराया और सत्यापन खाते में {amount} रुपये भेजने की मांग की।'"
    },
    ta: {
      alert: "⚠️ அவசர எச்சரிக்கை! நீங்கள் பகிர்ந்த செய்தி டிஜிட்டல் அரெஸ்ட் மோசடிக்கான அறிகுறிகளைக் கொண்டுள்ளது.",
      verdict: "தீர்ப்பு: 96% மோசடி அபாயம்",
      advice: "முக்கிய வழிகாட்டுதல்கள்:\n1. அரசு முகமைகள் (சிபிஐ, ஈடி, போலீஸ்) ஒருபோதும் ஸ்கைப், வாட்ஸ்அப் அல்லது வீடியோ அழைப்பு மூலம் யாரையும் கைது செய்யாது.\n2. 'சரிபார்ப்பு கணக்குகள்' என்று கூறப்படும் எந்தவொரு கணக்கிற்கும் பணம் அனுப்ப வேண்டாம்.\n3. ஆதார், ஓடிபி அல்லது நிதி விவரங்களை வெளியிட வேண்டாம்.\n4. பண இழப்பைத் தடுக்க உடனே 1930 என்ற எண்ணை அழைக்கவும்.",
      draftReport: "உங்களுக்காக புகார் வரைவை நாங்கள் தயாரித்துள்ளோம். இதை நீங்கள் நகலெடுத்து cybercrime.gov.in இல் பதிவேற்றலாம்:\n\n'டிஜிட்டல் கைது முயற்சி தொடர்பான புகார். {number} என்ற எண்ணில் இருந்து சிபிஐ அதிகாரி போல் நடித்த நபர் {date} அன்று என்னை போலி வாரண்ட் மூலம் மிரட்டி, சரிபார்ப்புக் கணக்கிற்கு ரூ. {amount} அனுப்பக் கோரினார்.'"
    }
  }
};
