import { useState, useEffect, useRef, useCallback } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const C = {
  dark:       "#0B0F19",
  darkMid:    "#111827",
  darkCard:   "#111827",
  darkBorder: "#1F2937",
  cyan:       "#22D3EE",
  blue:       "#2563EB",
  purple:     "#8B5CF6",
  pink:       "#EC4899",
  white:      "#F0F4FF",
  silver:     "#9CA3AF",
  text:       "#F0F4FF",
  muted:      "#6B7280",
  gold:       "#F59E0B",
  green:      "#10B981",
  red:        "#EF4444",
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: #0B0F19;
    color: #F0F4FF;
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
    width: 100%;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #111827; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#2563EB,#8B5CF6); border-radius: 3px; }
  input, select, textarea, button { font-family: 'Inter', sans-serif; }
  a { text-decoration: none; color: inherit; }

  @keyframes fadeInUp    { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn      { from { opacity:0; } to { opacity:1; } }
  @keyframes slideDown   { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse       { 0%,100%{opacity:1;} 50%{opacity:0.35;} }
  @keyframes shimmer     { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
  @keyframes cartBounce  { 0%{transform:scale(1);} 30%{transform:scale(1.3);} 60%{transform:scale(0.92);} 100%{transform:scale(1);} }
  @keyframes successPop  { 0%{transform:scale(0.5);opacity:0;} 70%{transform:scale(1.08);} 100%{transform:scale(1);opacity:1;} }
  @keyframes float       { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
  @keyframes glowPulse   { 0%,100%{box-shadow:0 0 16px rgba(37,99,235,0.3);} 50%{box-shadow:0 0 36px rgba(37,99,235,0.55),0 0 60px rgba(100,87,255,0.2);} }
  @keyframes gradMove    { 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }
  @keyframes popupIn     { from{opacity:0;transform:translateX(100px) scale(0.85);} to{opacity:1;transform:translateX(0) scale(1);} }
  @keyframes countUp     { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }
  @keyframes megaSlide   { from{opacity:0;transform:translateY(-6px);} to{opacity:1;transform:translateY(0);} }
  @keyframes waPulse     { 0%,100%{transform:scale(1); box-shadow:0 4px 20px rgba(37,211,102,0.4);} 50%{transform:scale(1.04); box-shadow:0 8px 32px rgba(37,211,102,0.65);} }

  .page-enter { animation: fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }

  /* ── BUTTONS ── */
  .btn-primary {
    background: linear-gradient(135deg,#2563EB,#8B5CF6);
    background-size: 200% 200%;
    color:#fff; border:none; padding:10px 22px; border-radius:10px;
    font-weight:600; font-size:14px; cursor:pointer;
    transition:all 0.3s cubic-bezier(0.22,1,0.36,1); position:relative; overflow:hidden;
    box-shadow:0 3px 14px rgba(37,99,235,0.3);
    letter-spacing: 0.02em;
  }
  .btn-primary:hover { transform:translateY(-2px) scale(1.03); box-shadow:0 8px 28px rgba(37,99,235,0.5), 0 0 20px rgba(139,92,246,0.2); }
  .btn-primary:active { transform:translateY(0) scale(0.98); }

  .btn-secondary {
    background:transparent; color:#9CA3AF; border:1px solid #1F2937;
    padding:10px 22px; border-radius:10px; font-weight:500; font-size:14px;
    cursor:pointer; transition:all 0.25s ease;
  }
  .btn-secondary:hover { border-color:#2563EB; color:#22D3EE; background:rgba(37,99,235,0.07); }

  /* ── WHATSAPP BUTTON ── */
  .btn-whatsapp {
    display:inline-flex; align-items:center; gap:9px;
    background:#25D366; color:#fff;
    border:none; padding:12px 22px; border-radius:12px;
    font-weight:700; font-size:14px; cursor:pointer;
    animation: waPulse 2.5s ease-in-out infinite;
    transition:all 0.25s ease; text-decoration:none;
  }
  .btn-whatsapp:hover { transform:translateY(-3px) scale(1.03); box-shadow:0 14px 40px rgba(37,211,102,0.5); animation:none; }
  .btn-whatsapp svg { width:20px; height:20px; fill:#fff; flex-shrink:0; }

  /* ── SKELETON ── */
  .skeleton {
    background:linear-gradient(90deg,#111827 25%,#1a2235 50%,#111827 75%);
    background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:6px;
  }

  /* ── NAV ── */
  .nav-link {
    color:#9CA3AF; font-size:14px; font-weight:500; padding:6px 0;
    border-radius:0; transition:all 0.2s; cursor:pointer; position:relative;
    white-space:nowrap; background:none; letter-spacing:0.01em;
  }
  .nav-link::after {
    content:''; position:absolute; bottom:-2px; left:0; right:0; height:2px;
    background:linear-gradient(90deg,#22D3EE,#8B5CF6); border-radius:2px;
    transform:scaleX(0); transition:transform 0.25s ease;
  }
  .nav-link:hover, .nav-link.active { color:#F0F4FF; }
  .nav-link:hover::after, .nav-link.active::after { transform:scaleX(1); }

  /* ── RESPONSIVE GRID ── */
  @media(max-width:768px) {
    .grid-mobile-1 { grid-template-columns:1fr !important; }
  }

  /* ── MEGA MENU ── */
  .mega-menu {
    position:absolute; top:calc(100% + 8px); left:50%; transform:translateX(-50%);
    background:#0F1628; border:1px solid rgba(37,99,235,0.18);
    border-radius:18px; padding:24px; width:700px; max-width:calc(100vw - 32px);
    z-index:1200; box-shadow:0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(37,99,235,0.06);
    animation:megaSlide 0.2s cubic-bezier(0.22,1,0.36,1);
    display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px;
  }
  .mega-menu-title {
    font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px;
    color:#6B7280; margin-bottom:10px; padding-bottom:8px;
    border-bottom:1px solid #1F2937;
  }
  .mega-item {
    display:flex; align-items:center; gap:8px; padding:8px 10px;
    border-radius:9px; cursor:pointer; transition:all 0.15s;
    font-size:13px; color:#9CA3AF; font-weight:500;
  }
  .mega-item:hover { background:rgba(37,99,235,0.1); color:#22D3EE; }

  /* ── CARDS ── */
  .card-product {
    background:#111827; border:1px solid #1F2937; border-radius:16px;
    overflow:hidden; transition:all 0.35s cubic-bezier(0.22,1,0.36,1);
    display:flex; flex-direction:column; height:100%;
    box-shadow:0 4px 20px rgba(0,0,0,0.3);
  }
  .card-product:hover {
    border-color:rgba(37,99,235,0.45);
    transform:translateY(-6px);
    box-shadow:0 16px 40px rgba(0,0,0,0.4), 0 0 32px rgba(37,99,235,0.14), 0 0 60px rgba(139,92,246,0.06);
  }
  .card-img-wrap {
    position:relative; overflow:hidden; background:#060A16;
    height:200px; flex-shrink:0;
  }
  .card-img-wrap img {
    width:100%; height:100%; object-fit:contain; display:block; padding:8px;
    transition:transform 0.45s cubic-bezier(0.22,1,0.36,1);
  }
  .card-product:hover .card-img-wrap img { transform:scale(1.06); }
  .card-body {
    padding:14px 16px 16px; display:flex; flex-direction:column; flex:1;
  }
  .card-footer { margin-top:auto; padding-top:12px; }

  /* ── BADGES ── */
  .badge {
    display:inline-block; padding:3px 8px; border-radius:6px;
    font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.4px;
  }
  .badge-blue   { background:rgba(37,99,235,0.14); color:#22D3EE; border:1px solid rgba(37,99,235,0.25); }
  .badge-green  { background:rgba(16,185,129,0.1);  color:#10B981; border:1px solid rgba(16,185,129,0.2); }
  .badge-red    { background:rgba(239,68,68,0.1);   color:#EF4444; border:1px solid rgba(239,68,68,0.2); }
  .badge-gold   { background:rgba(245,158,11,0.1);  color:#F59E0B; border:1px solid rgba(245,158,11,0.2); }
  .badge-purple { background:rgba(139,92,246,0.12); color:#A78BFA; border:1px solid rgba(139,92,246,0.25); }

  /* ── TYPOGRAPHY ── */
  .gradient-text {
    background: linear-gradient(135deg,#22D3EE,#2563EB,#8B5CF6);
    background-size:200% 200%; animation:gradMove 4s ease infinite;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }
  .gradient-text-warm {
    background:linear-gradient(135deg,#EC4899,#F59E0B);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }
  .section-title {
    font-family:'Outfit',sans-serif; font-size:28px; font-weight:800; letter-spacing:-0.5px;
  }
  .price-tag { font-family:'Outfit',sans-serif; font-weight:700; letter-spacing:-0.3px; }
  .star-filled { color:#F59E0B; }
  .star-empty  { color:#1E2D45; }

  /* ── LAYOUT ── */
  .section-wrap {
    width:100%;
    max-width:100%;
    padding-left:clamp(16px,3.5vw,56px);
    padding-right:clamp(16px,3.5vw,56px);
  }

  /* ── PRODUCT GRID ── */
  .product-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill, minmax(260px,1fr));
    gap:24px;
    align-items:stretch;
    width:100%;
  }
  @media(min-width:1280px) { .product-grid { grid-template-columns:repeat(4,1fr); } }
  @media(min-width:1600px) { .product-grid { grid-template-columns:repeat(5,1fr); } }
  @media(max-width:1024px) { .product-grid { grid-template-columns:repeat(3,1fr); gap:18px; } }
  @media(max-width:768px)  {
    .product-grid { grid-template-columns:repeat(2,1fr); gap:14px; }
    .hide-mobile  { display:none !important; }
    .section-wrap { padding-left:14px; padding-right:14px; }
  }
  @media(max-width:480px)  { .product-grid { grid-template-columns:1fr; } }
  @media(min-width:769px)  { .hide-desktop { display:none !important; } }

  /* ── INPUTS ── */
  .input-premium {
    background:rgba(17,24,39,0.95); border:1.5px solid #1F2937;
    color:#F0F4FF; padding:10px 14px 10px 40px; border-radius:10px;
    font-size:14px; width:100%; transition:all 0.25s; outline:none;
    font-family:'Inter',sans-serif;
  }
  .input-premium:focus { border-color:#2563EB; background:rgba(37,99,235,0.05); box-shadow:0 0 0 3px rgba(37,99,235,0.12); }
  .input-premium::placeholder { color:#374151; }

  /* ── GLASS ── */
  .glass-card {
    background:rgba(17,24,39,0.85); backdrop-filter:blur(18px);
    border:1px solid rgba(31,41,55,0.95); border-radius:15px;
  }

  /* ── POPUP ── */
  .popup-glass {
    position:fixed; top:82px; right:22px; z-index:9999;
    background:rgba(11,15,25,0.96); backdrop-filter:blur(24px);
    border:1px solid rgba(37,99,235,0.28); border-radius:16px;
    padding:14px 20px; min-width:240px; max-width:320px;
    box-shadow:0 8px 36px rgba(0,0,0,0.55), 0 0 20px rgba(37,99,235,0.1);
    animation:popupIn 0.35s cubic-bezier(0.22,1,0.36,1);
    display:flex; align-items:center; gap:12px;
  }

  /* ── HERO ── */
  .hero-bg {
    background:linear-gradient(135deg,#0B0F19 0%,#111827 40%,#0D1130 70%,#0B0F19 100%);
    position:relative; overflow:hidden; width:100%;
  }
  .hero-bg::before {
    content:''; position:absolute; inset:0; pointer-events:none;
    background:
      radial-gradient(ellipse at 12% 50%, rgba(37,99,235,0.15) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 25%, rgba(139,92,246,0.12) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 100%, rgba(34,211,238,0.05) 0%, transparent 40%);
  }

  /* ── FLASH DEALS SECTION ── */
  .deals-bg {
    background:linear-gradient(135deg,#0E0814,#130A14,#0E0814);
    border-top:1px solid rgba(239,68,68,0.1);
    border-bottom:1px solid rgba(239,68,68,0.1);
  }

  /* ── CATEGORY GRID ── */
  .cat-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill, minmax(110px,1fr));
    gap:12px;
  }
  @media(min-width:768px) { .cat-grid { grid-template-columns:repeat(8,1fr); } }
  @media(max-width:480px) { .cat-grid { grid-template-columns:repeat(4,1fr); } }

  /* ── CHAT ── */
  .chat-window {
    position:fixed; bottom:86px; right:22px; z-index:1500;
    width:330px; background:#060A18; border:1px solid rgba(37,99,235,0.22);
    border-radius:18px; overflow:hidden;
    animation:slideDown 0.28s cubic-bezier(0.22,1,0.36,1);
    box-shadow:0 20px 70px rgba(0,0,0,0.65), 0 0 40px rgba(37,99,235,0.1);
  }
  @media(max-width:480px) { .chat-window { width:calc(100vw - 28px); right:14px; } }
  .chat-bot-bubble { background:#0D1427; border:1px solid #18243E; border-radius:12px 12px 12px 3px; padding:9px 13px; max-width:80%; font-size:13px; color:#A8BCDA; line-height:1.5; }
  .chat-user-bubble { background:linear-gradient(135deg,#2563EB,#8B5CF6); border-radius:12px 12px 3px 12px; padding:9px 13px; max-width:80%; font-size:13px; color:#fff; margin-left:auto; line-height:1.5; }

  /* ── SEARCH OVERLAY (REMOVED — now inline in navbar) ── */
  /* Inline navbar search */
  .nav-search-wrap {
    position: relative; flex: 1; max-width: 480px; margin: 0 32px;
  }
  .nav-search-input {
    width: 100%;
    background: rgba(15,20,40,0.9);
    border: 1.5px solid rgba(37,99,235,0.18);
    color: #F0F4FF;
    padding: 10px 40px 10px 42px;
    border-radius: 12px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    outline: none;
    transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
    letter-spacing: 0.01em;
  }
  .nav-search-input:focus {
    border-color: #2563EB;
    background: rgba(37,99,235,0.06);
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12), 0 4px 16px rgba(37,99,235,0.1);
    width: 100%;
  }
  .nav-search-input::placeholder { color: #3A4E68; font-weight: 400; }
  .nav-search-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    pointer-events: none; transition: opacity 0.2s;
  }
  .nav-search-clear {
    position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.08);
    color: #9CA3AF; border-radius: 6px; width: 22px; height: 22px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-size: 13px;
    transition: all 0.18s; line-height: 1;
  }
  .nav-search-clear:hover { background: rgba(240,48,96,0.15); border-color: rgba(240,48,96,0.3); color: #EF4444; }
  /* Inline dropdown results */
  .nav-search-dropdown {
    position: absolute; top: calc(100% + 8px); left: 0; right: 0;
    background: rgba(8,11,24,0.99); border: 1px solid rgba(37,99,235,0.2);
    border-radius: 14px; overflow: hidden; z-index: 1100;
    box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 24px rgba(37,99,235,0.08);
    animation: slideDown 0.18s cubic-bezier(0.22,1,0.36,1);
  }
  .nav-search-item {
    padding: 10px 14px; display: flex; align-items: center; gap: 11px;
    cursor: pointer; border-bottom: 1px solid #0D1524; transition: background 0.12s;
  }
  .nav-search-item:last-child { border-bottom: none; }
  .nav-search-item:hover { background: rgba(37,99,235,0.09); }
  .nav-search-footer {
    padding: 10px 14px; background: rgba(37,99,235,0.04);
    border-top: 1px solid rgba(37,99,235,0.1);
    text-align: center; font-size: 11px; color: #3A4E68; letter-spacing: 0.03em;
  }

  /* ── SCROLL TOP ── */
  .scrolltop {
    position:fixed; bottom:26px; right:26px; z-index:999;
    width:44px; height:44px; background:linear-gradient(135deg,#2563EB,#8B5CF6);
    border:none; border-radius:50%; color:#fff; font-size:17px;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 18px rgba(37,99,235,0.45); cursor:pointer;
    animation:glowPulse 2.2s ease-in-out infinite; transition:transform 0.2s;
  }
  .scrolltop:hover { transform:translateY(-3px) scale(1.07); }

  /* ── FULL-WIDTH OVERRIDES ── */
  body, #root { width:100%; max-width:100%; overflow-x:hidden; }
  @media(max-width:640px) {
    .nav-link { font-size:13px; }
  }

  /* ── FAQ ── */
  .faq-item { border-bottom:1px solid #1F2937; }

  /* ── BRAND CARD ── */
  .brand-card {
    background:#111827; border:1px solid #1F2937; border-radius:14px;
    padding:20px 14px; text-align:center; cursor:pointer; transition:all 0.28s ease;
  }
  .brand-card:hover {
    border-color:rgba(37,99,235,0.38); transform:translateY(-4px);
    box-shadow:0 14px 40px rgba(0,0,0,0.35), 0 0 22px rgba(37,99,235,0.09);
  }

  /* ── NEON BTN ── */
  .neon-glow-btn {
    position:relative; overflow:hidden;
    background:linear-gradient(135deg,#2563EB,#2563EB,#8B5CF6);
    background-size:200% 200%; animation:gradMove 3s ease infinite;
    border:none; border-radius:12px; color:#fff; font-weight:700;
    cursor:pointer; transition:all 0.28s ease;
    box-shadow:0 4px 20px rgba(37,99,235,0.35);
  }
  .neon-glow-btn:hover { transform:translateY(-2px) scale(1.015); box-shadow:0 12px 36px rgba(37,99,235,0.5), 0 0 24px rgba(139,92,246,0.2); }
`;

// ─── STATIC DATA ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id:"mobiles",     name:"Mobiles",      icon:"📱", color:"#22D3EE" },
  { id:"laptops",     name:"Laptops",      icon:"💻", color:"#2563EB" },
  { id:"tablets",     name:"Tablets",      icon:"📟", color:"#8B5CF6" },
  { id:"headphones",  name:"Headphones",   icon:"🎧", color:"#22D3EE" },
  { id:"speakers",    name:"Speakers",     icon:"🔊", color:"#10B981" },
  { id:"smartwatch",  name:"Smartwatches", icon:"⌚", color:"#F59E0B" },
  { id:"cameras",     name:"Cameras",      icon:"📷", color:"#FF6B35" },
  { id:"accessories", name:"Accessories",  icon:"🔌", color:"#EF4444" },
];

const BRANDS = [
  { id:"apple",       name:"Apple",      logo:"🍎", country:"USA",         color:"#636366" },
  { id:"samsung",     name:"Samsung",    logo:"S",  country:"South Korea", color:"#1428A0" },
  { id:"sony",        name:"Sony",       logo:"S.", country:"Japan",       color:"#003087" },
  { id:"oneplus",     name:"OnePlus",    logo:"1+", country:"China",       color:"#EB0028" },
  { id:"hp",          name:"HP",         logo:"hp", country:"USA",         color:"#0096D6" },
  { id:"dell",        name:"Dell",       logo:"D",  country:"USA",         color:"#007DB8" },
  { id:"lenovo",      name:"Lenovo",     logo:"Lv", country:"China",       color:"#E2231A" },
  { id:"boat",        name:"boAt",       logo:"bO", country:"India",       color:"#E8001D" },
  { id:"noise",       name:"Noise",      logo:"No", country:"India",       color:"#FF6B00" },
  { id:"realme",      name:"Realme",     logo:"Re", country:"India",       color:"#FFCB00" },
  { id:"redmi",       name:"Redmi",      logo:"Rd", country:"India",       color:"#FF6900" },
  { id:"portronics",  name:"Portronics", logo:"Pt", country:"India",       color:"#0066CC" },
  { id:"zebronics",   name:"Zebronics",  logo:"Zb", country:"India",       color:"#E31E24" },
  { id:"lava",        name:"Lava",       logo:"Lv", country:"India",       color:"#FF2D20" },
  { id:"jbl",         name:"JBL",        logo:"JL", country:"USA",         color:"#F37021" },
];

const FAQ_DATA = [
  { q:"How to place an order?", a:"Browse products, add them to cart, and proceed to checkout. Fill in your delivery details, choose payment method (UPI or COD), and confirm your order." },
  { q:"What payment methods are accepted?", a:"We accept UPI payments (PhonePe, GPay, Paytm, BHIM) and Cash on Delivery (COD). Both options are secure." },
  { q:"How long does delivery take?", a:"Standard delivery: 3–5 business days. Express delivery: 1–2 business days. Times may vary for remote locations." },
  { q:"What is the return policy?", a:"We offer hassle-free 7-day returns from delivery date. Products must be unused, in original packaging with all accessories." },
  { q:"How does the refund process work?", a:"Refunds are processed within 3–5 business days after we receive the returned product. COD refunds are via bank transfer; UPI refunds go to your UPI account." },
  { q:"What are the warranty details?", a:"All products carry manufacturer warranty: 1-year for electronics, 6 months for accessories. Warranty covers manufacturing defects." },
  { q:"How to contact customer support?", a:"Call 111 1234 5555 (Mon–Sat, 9AM–7PM), email electronicstore@gmail.com, or use the live chat for instant help." },
  { q:"Can I cancel my order?", a:"Orders can be cancelled within 24 hours of placement for free. After 24 hours, a 5% processing fee applies if not yet shipped." },
  { q:"How do I check product availability?", a:"Availability is shown in real-time. 'In Stock' means immediate dispatch; 'Low Stock' means limited units available." },
  { q:"How to track my shipment?", a:"Once shipped, you'll receive an SMS with a tracking link. You can also track under 'My Orders' in the Profile section." },
];

// ─── CATEGORY-ACCURATE IMAGE MAP ──────────────────────────────────────────────
// Each category gets visually accurate images. Product-specific mappings take priority.
const IMG = {
  // ── MOBILES ──
  "iPhone 15 Pro Max":           "https://images.unsplash.com/photo-1695048132697-4af48b42fc58?w=600&q=80",
  "iPhone 15":                   "https://images.unsplash.com/photo-1696446702183-079bc9c5d490?w=600&q=80",
  "iPhone 14 Pro":               "https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=600&q=80",
  "iPhone 13":                   "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600&q=80",
  "iPhone SE 3rd Gen":           "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600&q=80",
  "Samsung Galaxy S24 Ultra":    "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
  "Samsung Galaxy S24+":         "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=600&q=80",
  "Samsung Galaxy S23 FE":       "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80",
  "Samsung Galaxy A55":          "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=600&q=80",
  "Samsung Galaxy M55":          "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80",
  "OnePlus 12":                  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
  "OnePlus 12R":                 "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80",
  "OnePlus Nord CE 4":           "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80",
  "Realme GT 5 Pro":             "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80",
  "Realme Narzo 70 Pro":         "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80",
  "Realme 12 Pro+":              "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80",
  "Redmi Note 13 Pro+":          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
  "Redmi Note 13 Pro":           "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80",
  "Redmi 13C":                   "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=600&q=80",

  // ── LAPTOPS ──
  'MacBook Pro 16" M3 Max':      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
  "MacBook Air M2":              "https://images.unsplash.com/photo-1611186871525-c9c1c3c8d44a?w=600&q=80",
  "Dell XPS 15":                 "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
  "Dell Inspiron 15 3520":       "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=600&q=80",
  "HP Spectre x360 14":          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
  "HP Pavilion 15":              "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80",
  "Lenovo ThinkPad X1 Carbon":   "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=600&q=80",
  "Lenovo IdeaPad Slim 5":       "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
  "Asus ROG Strix G16":          "https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?w=600&q=80",
  "Asus VivoBook 15":            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80",
  "HP Victus 15 Gaming":         "https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?w=600&q=80",
  "Lenovo Legion 5i Pro":        "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
  "Dell Vostro 14 3420":         "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=600&q=80",
  "Asus ZenBook 14 OLED":        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
  "HP EliteBook 840 G10":        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",

  // ── TABLETS ──
  'iPad Pro 13" M4':             "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
  "iPad Air M2":                 "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&q=80",
  "Samsung Galaxy Tab S9 Ultra": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80",
  "Samsung Galaxy Tab S9 FE":    "https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=600&q=80",
  "Samsung Galaxy Tab A9+":      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
  "Lenovo Tab P12 Pro":          "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&q=80",
  "Lenovo Tab M10 FHD Plus":     "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80",
  "Redmi Pad Pro":               "https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=600&q=80",
  "Realme Pad 2":                "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
  "Samsung Galaxy Tab S6 Lite":  "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&q=80",

  // ── HEADPHONES ──
  "Sony WH-1000XM5":             "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  "Sony WF-1000XM5":             "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
  "Apple AirPods Pro 2nd Gen":   "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80",
  "Apple AirPods Max":           "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  "boAt Rockerz 550 Pro":        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80",
  "boAt Airdopes 311 Pro":       "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
  "boAt Rockerz 255 Pro+":       "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80",
  "Noise Buds VS404":            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
  "Noise Shots X5 Pro":          "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80",
  "Noise Cancellation Plus":     "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  "OnePlus Nord Buds 2":         "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
  "Realme Buds Air 5 Pro":       "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80",
  "Redmi Buds 5 Pro":            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
  "Samsung Galaxy Buds2 Pro":    "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80",
  "JBL Tune 760NC":              "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80",
  "JBL Tune Beam":               "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",

  // ── SPEAKERS ──
  "JBL PartyBox 310":            "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80",
  "JBL Charge 5":                "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&q=80",
  "JBL Flip 6":                  "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
  "Sony SRS-XB43":               "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&q=80",
  "Sony SRS-XE200":              "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80",
  "boAt Stone 1000":             "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
  "boAt Aavante Bar 2000D":      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80",
  "Zebronics Zeb-County":        "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&q=80",
  "Zebronics Zeb-Action Pro":    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
  "Samsung Sound Tower MX-T40":  "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80",

  // ── SMARTWATCHES ──
  "Apple Watch Ultra 2":            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80",
  "Apple Watch Series 9":           "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  "Samsung Galaxy Watch 6 Classic": "https://images.unsplash.com/photo-1617043983671-a033fc0d24c5?w=600&q=80",
  "Samsung Galaxy Watch 6":         "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  "OnePlus Watch 2":                "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80",
  "Noise ColorFit Ultra 3":         "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&q=80",
  "Noise Icon 3":                   "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&q=80",
  "Realme Watch S2":                "https://images.unsplash.com/photo-1617043983671-a033fc0d24c5?w=600&q=80",
  "Redmi Watch 4":                  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  "Samsung Galaxy Fit3":            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80",

  // ── CAMERAS ──
  "Sony Alpha A7 IV":        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
  "Sony ZV-E10":             "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80",
  "GoPro HERO12 Black":      "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=600&q=80",
  "GoPro HERO11 Black":      "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=600&q=80",
  "Canon EOS M50 Mark II":   "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
  "Nikon Z30":               "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80",
  "Canon PowerShot G7X III": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80",
  "Canon EOS 200D II":       "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
  "Sony Cyber-shot W800":    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80",
  "Samsung Galaxy Camera FE":"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",

  // ── ACCESSORIES ──
  "Anker 100W GaN Charger":            "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80",
  "Portronics Mport 3C Hub":           "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&q=80",
  "Zebronics Zeb-Zap Wireless Charger":"https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80",
  "boAt BassHeads 900":                "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80",
  "Portronics Charge Mate":            "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&q=80",
  "Zebronics ZEB-Shield Laptop Stand": "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=600&q=80",
  "Realme Power Bank 20000mAh":        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80",
  "Noise Power 10000mAh":              "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80",
  "boAt Rugged V3 Cable":              "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&q=80",
  "Lava ProMouse Wireless":            "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&q=80",
};

// Category fallback images — used when product name not found in IMG map
const CAT_FALLBACK = {
  mobiles:     "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
  laptops:     "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
  tablets:     "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
  headphones:  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  speakers:    "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80",
  smartwatch:  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  cameras:     "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
  accessories: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80",
};

function getImg(name, category) {
  return IMG[name] || CAT_FALLBACK[category] || `https://placehold.co/600x600/0B0F1E/00C8F0?text=${encodeURIComponent(name)}`;
}

// ─── PRODUCT FACTORY ──────────────────────────────────────────────────────────
function makeProducts() {
  const items = [];
  const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // MOBILES
  const mobilesData = [
    { name:"iPhone 15 Pro Max", brand:"Apple",   price:134900, rating:4.8, desc:"Titanium design, A17 Pro chip, 48MP ProRAW camera, ProRes video.", specs:{ ram:"8GB", storage:"256GB", processor:"A17 Pro", display:'6.7" OLED', battery:"4422mAh" } },
    { name:"iPhone 15",          brand:"Apple",   price:79900,  rating:4.7, desc:"Dynamic Island, 48MP main camera, A16 Bionic chip, USB-C.", specs:{ ram:"6GB", storage:"128GB", processor:"A16 Bionic", display:'6.1" OLED', battery:"3877mAh" } },
    { name:"iPhone 14 Pro",      brand:"Apple",   price:109900, rating:4.7, desc:"Always-On display, 48MP camera, Dynamic Island, A16 Bionic.", specs:{ ram:"6GB", storage:"128GB", processor:"A16 Bionic", display:'6.1" OLED', battery:"3200mAh" } },
    { name:"iPhone 13",          brand:"Apple",   price:59900,  rating:4.6, desc:"Dual 12MP cameras, A15 Bionic chip, 5G ready, compact design.", specs:{ ram:"4GB", storage:"128GB", processor:"A15 Bionic", display:'6.1" OLED', battery:"3227mAh" } },
    { name:"iPhone SE 3rd Gen",  brand:"Apple",   price:49900,  rating:4.4, desc:"Compact powerhouse with A15 Bionic chip, 5G, Touch ID.", specs:{ ram:"4GB", storage:"64GB", processor:"A15 Bionic", display:'4.7" Retina', battery:"2018mAh" } },
    { name:"Samsung Galaxy S24 Ultra", brand:"Samsung", price:129999, rating:4.7, desc:"Titanium-framed Galaxy AI powerhouse with built-in S Pen.", specs:{ ram:"12GB", storage:"256GB", processor:"Snapdragon 8 Gen 3", display:'6.8" QHD+ AMOLED', battery:"5000mAh" } },
    { name:"Samsung Galaxy S24+", brand:"Samsung", price:99999, rating:4.6, desc:"Galaxy AI features, Snapdragon 8 Gen 3, 50MP camera.", specs:{ ram:"12GB", storage:"256GB", processor:"Snapdragon 8 Gen 3", display:'6.7" Dynamic AMOLED 2X', battery:"4900mAh" } },
    { name:"Samsung Galaxy S23 FE", brand:"Samsung", price:54999, rating:4.4, desc:"Fan Edition with 50MP camera, Snapdragon 8 Gen 1, IP68.", specs:{ ram:"8GB", storage:"128GB", processor:"Snapdragon 8 Gen 1", display:'6.4" Dynamic AMOLED 2X', battery:"4500mAh" } },
    { name:"Samsung Galaxy A55",  brand:"Samsung", price:38999, rating:4.3, desc:"50MP OIS camera, 5000mAh battery, IP67, Galaxy AI features.", specs:{ ram:"8GB", storage:"128GB", processor:"Exynos 1480", display:'6.6" Super AMOLED', battery:"5000mAh" } },
    { name:"Samsung Galaxy M55",  brand:"Samsung", price:29999, rating:4.2, desc:"200MP camera, 5000mAh with 45W fast charge, 5G ready.", specs:{ ram:"8GB", storage:"128GB", processor:"Snapdragon 7 Gen 1", display:'6.7" sAMOLED+', battery:"5000mAh" } },
    { name:"OnePlus 12",          brand:"OnePlus", price:64999, rating:4.5, desc:"Hasselblad triple camera, 100W SuperVOOC, Snapdragon 8 Gen 3.", specs:{ ram:"12GB", storage:"256GB", processor:"Snapdragon 8 Gen 3", display:'6.82" LTPO AMOLED', battery:"5400mAh" } },
    { name:"OnePlus 12R",         brand:"OnePlus", price:39999, rating:4.4, desc:"50MP Sony camera, 100W SUPERVOOC, 5500mAh battery.", specs:{ ram:"8GB", storage:"128GB", processor:"Snapdragon 8 Gen 1", display:'6.78" AMOLED 120Hz', battery:"5500mAh" } },
    { name:"OnePlus Nord CE 4",   brand:"OnePlus", price:24999, rating:4.3, desc:"Snapdragon 7s Gen 3, 100W charging, 50MP Sony camera.", specs:{ ram:"8GB", storage:"128GB", processor:"Snapdragon 7s Gen 3", display:'6.7" AMOLED 120Hz', battery:"5500mAh" } },
    { name:"Realme GT 5 Pro",     brand:"Realme",  price:37999, rating:4.4, desc:"Flagship killer with 144Hz AMOLED display and 240W fast charging.", specs:{ ram:"12GB", storage:"256GB", processor:"Snapdragon 8 Gen 3", display:'6.78" AMOLED 144Hz', battery:"5400mAh" } },
    { name:"Realme Narzo 70 Pro", brand:"Realme",  price:22999, rating:4.2, desc:"MediaTek Dimensity 7050, 50MP Sony camera, 67W charging.", specs:{ ram:"8GB", storage:"128GB", processor:"Dimensity 7050", display:'6.67" Super AMOLED', battery:"5000mAh" } },
    { name:"Realme 12 Pro+",      brand:"Realme",  price:29999, rating:4.3, desc:"Periscope 64MP camera, Snapdragon 7s Gen 2, 67W charging.", specs:{ ram:"8GB", storage:"256GB", processor:"Snapdragon 7s Gen 2", display:'6.7" AMOLED 120Hz', battery:"5000mAh" } },
    { name:"Redmi Note 13 Pro+",  brand:"Redmi",   price:31999, rating:4.4, desc:"200MP camera, curved OLED display, 120W HyperCharge.", specs:{ ram:"8GB", storage:"256GB", processor:"Dimensity 7200 Ultra", display:'6.67" AMOLED 120Hz', battery:"5000mAh" } },
    { name:"Redmi Note 13 Pro",   brand:"Redmi",   price:26999, rating:4.3, desc:"200MP camera, Snapdragon 7s Gen 2, AMOLED 120Hz display.", specs:{ ram:"8GB", storage:"256GB", processor:"Snapdragon 7s Gen 2", display:'6.67" AMOLED 120Hz', battery:"5100mAh" } },
    { name:"Redmi 13C",           brand:"Redmi",   price:10999, rating:4.1, desc:"50MP AI triple camera, 5000mAh battery, 90Hz FHD+ display.", specs:{ ram:"4GB", storage:"128GB", processor:"Helio G85", display:'6.74" FHD+ IPS', battery:"5000mAh" } },
  ];
  mobilesData.forEach((p,i) => items.push({ id:`mob_${i}`, ...p, image:getImg(p.name,"mobiles"), category:"mobiles", stock:rnd(3,50), reviews:rnd(200,2000), discount:rnd(5,18) }));

  // LAPTOPS
  const laptopsData = [
    { name:'MacBook Pro 16" M3 Max', brand:"Apple",  price:349900, rating:4.9, desc:"Professional laptop with 22hr battery, Liquid Retina XDR display.", specs:{ ram:"36GB", storage:"1TB SSD", processor:"Apple M3 Max", display:'16.2" Liquid Retina XDR', battery:"22hr" } },
    { name:"MacBook Air M2",    brand:"Apple",  price:114900, rating:4.8, desc:"Ultra-thin, fanless design with M2 chip, MagSafe charging.", specs:{ ram:"8GB", storage:"256GB SSD", processor:"Apple M2", display:'13.6" Liquid Retina', battery:"18hr" } },
    { name:"Dell XPS 15",       brand:"Dell",   price:169900, rating:4.7, desc:"Thin bezel OLED masterpiece with Core i9 and RTX 4070.", specs:{ ram:"32GB", storage:"1TB SSD", processor:"Intel Core i9", display:'15.6" OLED 3.5K', battery:"13hr" } },
    { name:"Dell Inspiron 15 3520", brand:"Dell", price:54999, rating:4.3, desc:"Intel Core i5-1235U, reliable everyday laptop.", specs:{ ram:"8GB", storage:"512GB SSD", processor:"Intel Core i5-1235U", display:'15.6" FHD IPS', battery:"8hr" } },
    { name:"HP Spectre x360 14", brand:"HP",    price:154900, rating:4.6, desc:"360° convertible with OLED touch display and Intel Evo.", specs:{ ram:"16GB", storage:"512GB SSD", processor:"Intel Core i7", display:'14" 2.8K OLED Touch', battery:"17hr" } },
    { name:"HP Pavilion 15",    brand:"HP",     price:62999,  rating:4.2, desc:"Ryzen 7 7730U, 512GB SSD, micro-edge display.", specs:{ ram:"16GB", storage:"512GB SSD", processor:"AMD Ryzen 7 7730U", display:'15.6" FHD IPS', battery:"9hr" } },
    { name:"Lenovo ThinkPad X1 Carbon", brand:"Lenovo", price:144900, rating:4.7, desc:"Ultra-light business powerhouse with MIL-SPEC durability.", specs:{ ram:"16GB", storage:"512GB SSD", processor:"Intel Core i7", display:'14" IPS 2.8K', battery:"15hr" } },
    { name:"Lenovo IdeaPad Slim 5", brand:"Lenovo", price:54999, rating:4.4, desc:"AMD Ryzen 7, 16GB RAM, 512GB SSD, thin & light.", specs:{ ram:"16GB", storage:"512GB SSD", processor:"AMD Ryzen 7", display:'14" FHD IPS', battery:"10hr" } },
    { name:"Asus ROG Strix G16", brand:"Asus",  price:139900, rating:4.5, desc:"240Hz QHD display, Core i9 + RTX 4080 gaming beast.", specs:{ ram:"16GB DDR5", storage:"1TB SSD", processor:"Intel Core i9", display:'16" 240Hz QHD', battery:"9hr" } },
    { name:"Asus VivoBook 15",  brand:"Asus",   price:48999,  rating:4.2, desc:"Intel Core i5, 8GB RAM, NanoEdge 15.6\" FHD display.", specs:{ ram:"8GB", storage:"512GB SSD", processor:"Intel Core i5", display:'15.6" FHD IPS', battery:"8hr" } },
    { name:"HP Victus 15 Gaming", brand:"HP",   price:74999,  rating:4.3, desc:"Intel Core i5-12500H + RTX 3050, 144Hz FHD gaming laptop.", specs:{ ram:"8GB DDR4", storage:"512GB SSD", processor:"Intel Core i5", display:'15.6" FHD 144Hz', battery:"7hr" } },
    { name:"Lenovo Legion 5i Pro", brand:"Lenovo", price:119999, rating:4.5, desc:"Intel Core i7 + RTX 4060, 2560×1600 165Hz display.", specs:{ ram:"16GB DDR5", storage:"512GB SSD", processor:"Intel Core i7", display:'16" WQXGA 165Hz', battery:"8hr" } },
    { name:"Dell Vostro 14 3420", brand:"Dell", price:47999,  rating:4.1, desc:"Business laptop with Intel i5-1235U, ideal for professionals.", specs:{ ram:"8GB", storage:"512GB SSD", processor:"Intel Core i5", display:'14" FHD IPS', battery:"9hr" } },
    { name:"Asus ZenBook 14 OLED", brand:"Asus", price:84999, rating:4.5, desc:"Ryzen 9 + 2.8K OLED display, ultra-thin premium design.", specs:{ ram:"16GB", storage:"1TB SSD", processor:"AMD Ryzen 9", display:'14" 2.8K OLED 90Hz', battery:"10hr" } },
    { name:"HP EliteBook 840 G10", brand:"HP",  price:134999, rating:4.6, desc:"Enterprise security, Intel Core i7 vPro, WUXGA IPS.", specs:{ ram:"16GB", storage:"512GB SSD", processor:"Intel Core i7 vPro", display:'14" WUXGA IPS', battery:"14hr" } },
  ];
  laptopsData.forEach((p,i) => items.push({ id:`lap_${i}`, ...p, image:getImg(p.name,"laptops"), category:"laptops", stock:rnd(2,25), reviews:rnd(50,800), discount:rnd(3,12) }));

  // TABLETS
  const tabletsData = [
    { name:'iPad Pro 13" M4',          brand:"Apple",   price:109900, rating:4.9, desc:"Ultra-thin OLED display with Apple M4 chip, Apple Pencil Pro support.", specs:{ ram:"8GB", storage:"256GB", processor:"Apple M4", display:'13" Ultra Retina XDR OLED', battery:"10hr" } },
    { name:"iPad Air M2",              brand:"Apple",   price:59900,  rating:4.7, desc:"M2 chip, 11\" Liquid Retina display, USB-C, 5G option.", specs:{ ram:"8GB", storage:"128GB", processor:"Apple M2", display:'11" Liquid Retina', battery:"10hr" } },
    { name:"Samsung Galaxy Tab S9 Ultra", brand:"Samsung", price:109999, rating:4.7, desc:"14.6\" Dynamic AMOLED 2X display, S-Pen included, IP68.", specs:{ ram:"12GB", storage:"256GB", processor:"Snapdragon 8 Gen 2", display:'14.6" Dynamic AMOLED 2X', battery:"11200mAh" } },
    { name:"Samsung Galaxy Tab S9 FE", brand:"Samsung", price:44999, rating:4.4, desc:"10.9\" TFT LCD, Exynos 1380, S Pen included, IP68.", specs:{ ram:"6GB", storage:"128GB", processor:"Exynos 1380", display:'10.9" TFT LCD 90Hz', battery:"8000mAh" } },
    { name:"Samsung Galaxy Tab A9+",   brand:"Samsung", price:29999, rating:4.3, desc:"Slim 11\" display tablet with Dolby Atmos speakers.", specs:{ ram:"8GB", storage:"128GB", processor:"Snapdragon 695", display:'11" TFT LCD', battery:"7040mAh" } },
    { name:"Lenovo Tab P12 Pro",       brand:"Lenovo",  price:59999, rating:4.5, desc:"12.6\" AMOLED display, Snapdragon 870, 8600mAh battery.", specs:{ ram:"8GB", storage:"256GB", processor:"Snapdragon 870", display:'12.6" AMOLED 2K', battery:"8600mAh" } },
    { name:"Lenovo Tab M10 FHD Plus",  brand:"Lenovo",  price:16999, rating:4.1, desc:"10.6\" FHD display with Helio G80 and clean Android 12.", specs:{ ram:"4GB", storage:"128GB", processor:"Helio G80", display:'10.6" FHD IPS', battery:"7700mAh" } },
    { name:"Redmi Pad Pro",            brand:"Redmi",   price:24999, rating:4.4, desc:"12.1\" IPS LCD, Snapdragon 7s Gen 2, 10000mAh battery.", specs:{ ram:"6GB", storage:"128GB", processor:"Snapdragon 7s Gen 2", display:'12.1" IPS LCD 144Hz', battery:"10000mAh" } },
    { name:"Realme Pad 2",             brand:"Realme",  price:21999, rating:4.2, desc:"11\" 2K display, 8-speaker Dolby Atmos audio, Helio G99.", specs:{ ram:"6GB", storage:"128GB", processor:"Helio G99", display:'11" 2K IPS LCD', battery:"8360mAh" } },
    { name:"Samsung Galaxy Tab S6 Lite", brand:"Samsung", price:26999, rating:4.3, desc:"Compact 10.4\" tablet with S Pen and Oxford Grey design.", specs:{ ram:"4GB", storage:"128GB", processor:"Exynos 1280", display:'10.4" TFT LCD', battery:"7040mAh" } },
  ];
  tabletsData.forEach((p,i) => items.push({ id:`tab_${i}`, ...p, image:getImg(p.name,"tablets"), category:"tablets", stock:rnd(2,30), reviews:rnd(50,600), discount:rnd(5,20) }));

  // HEADPHONES
  const headphonesData = [
    { name:"Sony WH-1000XM5",        brand:"Sony",    price:29990, rating:4.9, desc:"Industry-leading noise cancellation with 30hr battery and Speak-to-Chat.", specs:{ type:"Over-ear", anc:"Yes", battery:"30hr", connectivity:"BT 5.2", driver:"30mm" } },
    { name:"Sony WF-1000XM5",        brand:"Sony",    price:24990, rating:4.8, desc:"True wireless, best-in-class ANC, 8hr battery + 16hr case.", specs:{ type:"In-ear TWS", anc:"Yes", battery:"8hr+16hr", connectivity:"BT 5.3", driver:"8.4mm" } },
    { name:"Apple AirPods Pro 2nd Gen", brand:"Apple", price:24900, rating:4.8, desc:"Adaptive ANC, Spatial Audio, H2 chip, MagSafe charging.", specs:{ type:"In-ear TWS", anc:"Adaptive ANC", battery:"6hr+30hr", connectivity:"BT 5.3", driver:"Custom" } },
    { name:"Apple AirPods Max",      brand:"Apple",   price:59900, rating:4.7, desc:"Over-ear premium ANC headphones with Spatial Audio and H1 chip.", specs:{ type:"Over-ear", anc:"Yes", battery:"20hr", connectivity:"BT 5.0", driver:"40mm" } },
    { name:"boAt Rockerz 550 Pro",   brand:"boAt",    price:2499,  rating:4.2, desc:"40mm drivers, 80hr playback, foldable design with deep bass.", specs:{ type:"Over-ear", anc:"No", battery:"80hr", connectivity:"BT 5.2", driver:"40mm" } },
    { name:"boAt Airdopes 311 Pro",  brand:"boAt",    price:1299,  rating:4.0, desc:"TWS earbuds, 35hr total battery, ENx mic, IPX4 water resistant.", specs:{ type:"In-ear TWS", anc:"No", battery:"7hr+28hr", connectivity:"BT 5.3", driver:"10mm" } },
    { name:"boAt Rockerz 255 Pro+",  brand:"boAt",    price:1499,  rating:4.1, desc:"Neckband style, ASAP charging, 40hr battery, magnetic earbuds.", specs:{ type:"Neckband", anc:"No", battery:"40hr", connectivity:"BT 5.0", driver:"10mm" } },
    { name:"Noise Buds VS404",       brand:"Noise",   price:1499,  rating:4.0, desc:"ANC TWS earbuds with 50hr total battery and quad mic.", specs:{ type:"In-ear TWS", anc:"Yes", battery:"8hr+42hr", connectivity:"BT 5.3", driver:"13mm" } },
    { name:"Noise Shots X5 Pro",     brand:"Noise",   price:1999,  rating:4.1, desc:"TWS earbuds with 30hr playback, 13mm drivers, IPX5.", specs:{ type:"In-ear TWS", anc:"No", battery:"6hr+24hr", connectivity:"BT 5.3", driver:"13mm" } },
    { name:"Noise Cancellation Plus", brand:"Noise",  price:2999,  rating:4.2, desc:"ENC for calls, 45hr playtime, foldable over-ear headphone.", specs:{ type:"Over-ear", anc:"No", battery:"45hr", connectivity:"BT 5.0", driver:"40mm" } },
    { name:"OnePlus Nord Buds 2",    brand:"OnePlus", price:2299,  rating:4.2, desc:"ANC, 36hr total battery, 12.4mm drivers, IP55 water resistant.", specs:{ type:"In-ear TWS", anc:"Yes", battery:"7hr+29hr", connectivity:"BT 5.3", driver:"12.4mm" } },
    { name:"Realme Buds Air 5 Pro",  brand:"Realme",  price:2999,  rating:4.2, desc:"50dB ANC, LDAC, 38hr battery, fast charge.", specs:{ type:"In-ear TWS", anc:"Yes", battery:"9hr+29hr", connectivity:"BT 5.3", driver:"11mm" } },
    { name:"Redmi Buds 5 Pro",       brand:"Redmi",   price:1999,  rating:4.1, desc:"52dB ANC, LHDC, 38hr total playtime, dual connectivity.", specs:{ type:"In-ear TWS", anc:"Yes", battery:"9hr+29hr", connectivity:"BT 5.3", driver:"10mm" } },
    { name:"Samsung Galaxy Buds2 Pro", brand:"Samsung", price:12999, rating:4.5, desc:"360° Audio, intelligent ANC, 29hr total, IPX7 waterproof.", specs:{ type:"In-ear TWS", anc:"Yes", battery:"5hr+24hr", connectivity:"BT 5.3", driver:"10mm" } },
    { name:"JBL Tune 760NC",         brand:"JBL",     price:4499,  rating:4.3, desc:"50hr battery, ANC, foldable headphone with JBL Pure Bass sound.", specs:{ type:"Over-ear", anc:"Yes", battery:"50hr", connectivity:"BT 5.0", driver:"40mm" } },
    { name:"JBL Tune Beam",          brand:"JBL",     price:4999,  rating:4.3, desc:"True ANC earbuds, Beam-forming mics, 48hr total battery.", specs:{ type:"In-ear TWS", anc:"Yes", battery:"8hr+40hr", connectivity:"BT 5.3", driver:"10mm" } },
  ];
  headphonesData.forEach((p,i) => items.push({ id:`hp_${i}`, ...p, image:getImg(p.name,"headphones"), category:"headphones", stock:rnd(5,80), reviews:rnd(500,3000), discount:rnd(8,30) }));

  // SPEAKERS
  const speakersData = [
    { name:"JBL PartyBox 310",    brand:"JBL",       price:29990, rating:4.7, desc:"240W portable party speaker, 18hr battery, LED light show.", specs:{ power:"240W", battery:"18hr", connectivity:"BT 5.1", waterproof:"IPX4", features:"LED Light Show" } },
    { name:"JBL Charge 5",        brand:"JBL",       price:14999, rating:4.5, desc:"30W portable speaker, IP67, 20hr battery, power bank feature.", specs:{ power:"30W", battery:"20hr", connectivity:"BT 5.1", waterproof:"IP67", features:"Power Bank" } },
    { name:"JBL Flip 6",          brand:"JBL",       price:10999, rating:4.4, desc:"30W portable speaker, IP67, 12hr battery, PartyBoost.", specs:{ power:"30W", battery:"12hr", connectivity:"BT 5.1", waterproof:"IP67", features:"PartyBoost" } },
    { name:"Sony SRS-XB43",       brand:"Sony",      price:14999, rating:4.5, desc:"Extra Bass, IP67, 24hr battery, Light & Sound party speaker.", specs:{ power:"32W", battery:"24hr", connectivity:"BT 5.0", waterproof:"IP67", features:"Party Connect" } },
    { name:"Sony SRS-XE200",      brand:"Sony",      price:9999,  rating:4.3, desc:"360° omnidirectional sound, IP67, 16hr battery.", specs:{ power:"20W", battery:"16hr", connectivity:"BT 5.2", waterproof:"IP67", features:"Line Shape Diffuser" } },
    { name:"boAt Stone 1000",     brand:"boAt",      price:2499,  rating:4.1, desc:"10W portable speaker with 8hr battery and waterproof design.", specs:{ power:"10W", battery:"8hr", connectivity:"BT 5.0", waterproof:"IPX7", features:"TWS Pairing" } },
    { name:"boAt Aavante Bar 2000D", brand:"boAt",   price:4999,  rating:4.2, desc:"80W soundbar with Dolby Audio, HDMI ARC, 2.1 channel.", specs:{ power:"80W", battery:"N/A", connectivity:"BT+HDMI+Optical", waterproof:"No", features:"Dolby Audio+DSP" } },
    { name:"Zebronics Zeb-County", brand:"Zebronics", price:999,  rating:4.1, desc:"Budget-friendly Bluetooth speaker with USB/TF card support.", specs:{ power:"6W", battery:"4hr", connectivity:"BT 5.0", waterproof:"No", features:"USB+TF+AUX" } },
    { name:"Zebronics Zeb-Action Pro", brand:"Zebronics", price:1799, rating:4.0, desc:"14W portable speaker, IPX5, 8hr battery, dual pairing.", specs:{ power:"14W", battery:"8hr", connectivity:"BT 5.3", waterproof:"IPX5", features:"TWS Pairing" } },
    { name:"Samsung Sound Tower MX-T40", brand:"Samsung", price:19990, rating:4.4, desc:"160W mega sound with LED lighting and Karaoke mode.", specs:{ power:"160W", battery:"N/A", connectivity:"BT+USB+AUX", waterproof:"IP56", features:"Karaoke+LED" } },
  ];
  speakersData.forEach((p,i) => items.push({ id:`spk_${i}`, ...p, image:getImg(p.name,"speakers"), category:"speakers", stock:rnd(3,40), reviews:rnd(100,1500), discount:rnd(5,25) }));

  // SMARTWATCHES
  const watchData = [
    { name:"Apple Watch Ultra 2",         brand:"Apple",   price:89900, rating:4.9, desc:"Titanium case, 60hr battery, precision dual-frequency GPS.", specs:{ display:"49mm LTPO OLED", battery:"60hr", gps:"Dual-frequency", water:"100m", os:"watchOS 10" } },
    { name:"Apple Watch Series 9",        brand:"Apple",   price:41900, rating:4.8, desc:"Double tap gesture, Crash Detection, Carbon Neutral, S9 chip.", specs:{ display:"45mm Retina OLED", battery:"18hr", gps:"GPS+GLONASS", water:"50m", os:"watchOS 10" } },
    { name:"Samsung Galaxy Watch 6 Classic", brand:"Samsung", price:39999, rating:4.6, desc:"Iconic rotating bezel, 3-day battery, advanced health tracking.", specs:{ display:"47mm Super AMOLED", battery:"3 days", gps:"GPS+GLONASS", water:"5ATM", os:"Wear OS 4" } },
    { name:"Samsung Galaxy Watch 6",      brand:"Samsung", price:27999, rating:4.5, desc:"Sapphire glass, body composition sensor, 40hr battery.", specs:{ display:"44mm Super AMOLED", battery:"40hr", gps:"GPS+GLONASS", water:"5ATM", os:"Wear OS 4" } },
    { name:"OnePlus Watch 2",             brand:"OnePlus", price:24999, rating:4.4, desc:"Wear OS 4, 100hr battery mode, dual-chipset architecture.", specs:{ display:"1.43\" AMOLED", battery:"100hr eco", gps:"GPS+GLONASS", water:"IP68", os:"Wear OS 4" } },
    { name:"Noise ColorFit Ultra 3",      brand:"Noise",   price:4499,  rating:4.3, desc:"1.96\" AMOLED, Bluetooth calling, 100+ sports modes.", specs:{ display:"1.96\" AMOLED", battery:"7 days", gps:"No", water:"IP68", os:"Proprietary" } },
    { name:"Noise Icon 3",               brand:"Noise",   price:1999,  rating:4.0, desc:"Bluetooth calling, 1.8\" display, 100 sports modes, 7-day battery.", specs:{ display:"1.8\" TFT", battery:"7 days", gps:"No", water:"IP68", os:"Proprietary" } },
    { name:"Realme Watch S2",            brand:"Realme",  price:3499,  rating:4.1, desc:"1.4\" AMOLED display, 12-day battery, 110 workout modes.", specs:{ display:"1.4\" AMOLED", battery:"12 days", gps:"No", water:"IP68", os:"Proprietary" } },
    { name:"Redmi Watch 4",              brand:"Redmi",   price:3999,  rating:4.2, desc:"1.75\" AMOLED, Bluetooth calling, 20 days battery, GPS.", specs:{ display:"1.75\" AMOLED", battery:"20 days", gps:"Standalone GPS", water:"5ATM", os:"Proprietary" } },
    { name:"Samsung Galaxy Fit3",        brand:"Samsung", price:5999,  rating:4.1, desc:"Fitness band with 1.6\" AMOLED, 13-day battery, auto workout.", specs:{ display:"1.6\" AMOLED", battery:"13 days", gps:"No", water:"5ATM", os:"Proprietary" } },
  ];
  watchData.forEach((p,i) => items.push({ id:`wtch_${i}`, ...p, image:getImg(p.name,"smartwatch"), category:"smartwatch", stock:rnd(2,35), reviews:rnd(150,1200), discount:rnd(5,20) }));

  // CAMERAS
  const camData = [
    { name:"Sony Alpha A7 IV",      brand:"Sony",   price:219990, rating:4.9, desc:"33MP full-frame mirrorless with 5-axis IBIS and 4K 60fps video.", specs:{ sensor:"33MP Full Frame", video:"4K 60fps", iso:"100-51200", stabilization:"5-axis IBIS", weight:"657g" } },
    { name:"Sony ZV-E10",           brand:"Sony",   price:61990,  rating:4.5, desc:"APS-C mirrorless vlog camera with flip screen and 4K video.", specs:{ sensor:"24.2MP APS-C", video:"4K", iso:"100-32000", stabilization:"OIS on lens", weight:"343g" } },
    { name:"GoPro HERO12 Black",    brand:"GoPro",  price:44990,  rating:4.7, desc:"5.3K 60fps action camera, HyperSmooth 6.0, 10m waterproof.", specs:{ sensor:"27MP", video:"5.3K 60fps", waterproof:"10m", stabilization:"HyperSmooth 6.0", battery:"155min" } },
    { name:"GoPro HERO11 Black",    brand:"GoPro",  price:34990,  rating:4.6, desc:"5.3K60 + 24.7MP with new 1/1.9\" sensor, waterproof to 10m.", specs:{ sensor:"24.7MP", video:"5.3K 60fps", waterproof:"10m", stabilization:"HyperSmooth 5.0", battery:"158min" } },
    { name:"Canon EOS M50 Mark II", brand:"Canon",  price:62990,  rating:4.4, desc:"Dual Pixel AF, 4K video, flip touchscreen, Wi-Fi/BT.", specs:{ sensor:"24.1MP APS-C", video:"4K 25fps", iso:"100-25600", stabilization:"OIS on lens", weight:"387g" } },
    { name:"Nikon Z30",             brand:"Nikon",  price:59990,  rating:4.4, desc:"Vlogging mirrorless camera, 20.9MP, flip-out touchscreen.", specs:{ sensor:"20.9MP APS-C", video:"4K 30fps", iso:"100-51200", stabilization:"OIS on lens", weight:"405g" } },
    { name:"Canon PowerShot G7X III", brand:"Canon", price:54990, rating:4.5, desc:"Compact vlog camera with flip screen, 4K, built-in ND filter.", specs:{ sensor:"20.1MP 1-inch", video:"4K", iso:"125-12800", stabilization:"OIS", weight:"304g" } },
    { name:"Samsung Galaxy Camera FE", brand:"Samsung", price:29990, rating:4.0, desc:"Compact point-and-shoot with 16MP, f/2.2 lens.", specs:{ sensor:"16MP", video:"4K", iso:"100-6400", stabilization:"OIS", weight:"218g" } },
    { name:"Sony Cyber-shot W800", brand:"Sony",    price:8490,   rating:4.0, desc:"20.1MP compact camera, 5× optical zoom, affordable photography.", specs:{ sensor:"20.1MP CCD", video:"HD 720p", iso:"80-3200", stabilization:"OIS", weight:"157g" } },
    { name:"Canon EOS 200D II",    brand:"Canon",   price:49990,  rating:4.6, desc:"DSLR with Dual Pixel AF, 24.1MP, 4K video, flip touchscreen.", specs:{ sensor:"24.1MP APS-C", video:"4K", iso:"100-25600", stabilization:"Lens-based", weight:"449g" } },
  ];
  camData.forEach((p,i) => items.push({ id:`cam_${i}`, ...p, image:getImg(p.name,"cameras"), category:"cameras", stock:rnd(1,15), reviews:rnd(30,400), discount:rnd(3,10) }));

  // ACCESSORIES
  const accData = [
    { name:"Anker 100W GaN Charger",            brand:"Anker",      price:3999, rating:4.6, desc:"3-port GaN charger with 100W output, compact travel-ready.", specs:{ type:"Charger", ports:"3 USB-C+1 USB-A", wattage:"100W", technology:"GaN", size:"Compact" } },
    { name:"Portronics Mport 3C Hub",           brand:"Portronics", price:1499, rating:4.2, desc:"7-in-1 USB-C hub with HDMI 4K, USB 3.0, SD card reader.", specs:{ type:"USB Hub", ports:"7-in-1", video:"HDMI 4K", usb:"USB 3.0 x3", extra:"SD+MicroSD" } },
    { name:"Zebronics Zeb-Zap Wireless Charger", brand:"Zebronics", price:999,  rating:4.0, desc:"15W Qi wireless pad with fast charge for Android and iOS.", specs:{ type:"Wireless Charger", output:"15W", compatibility:"Qi Universal", indicator:"LED", size:"100mm" } },
    { name:"boAt BassHeads 900",                brand:"boAt",       price:1499, rating:4.1, desc:"Super Extra Bass wired headphone, 40mm drivers, foldable.", specs:{ type:"Wired Headphone", driver:"40mm", impedance:"32Ω", frequency:"20Hz-20KHz", connector:"3.5mm" } },
    { name:"Portronics Charge Mate",            brand:"Portronics", price:799,  rating:4.0, desc:"5-in-1 USB charging hub with fast charge and surge protection.", specs:{ type:"USB Hub Charger", ports:"5 USB-A", wattage:"30W total", technology:"Smart IC", extra:"Surge Protection" } },
    { name:"Zebronics ZEB-Shield Laptop Stand", brand:"Zebronics",  price:1299, rating:4.1, desc:"Foldable ergonomic laptop stand, height-adjustable, all-metal.", specs:{ type:"Laptop Stand", material:"Aluminum Alloy", compatibility:"10-17\" laptops", folds:"Yes", weight:"650g" } },
    { name:"Realme Power Bank 20000mAh",        brand:"Realme",     price:1499, rating:4.3, desc:"20000mAh power bank, 33W fast charge, dual output ports.", specs:{ type:"Power Bank", capacity:"20000mAh", input:"USB-C 33W", output:"USB-A+USB-C 33W", size:"Compact" } },
    { name:"Noise Power 10000mAh",              brand:"Noise",      price:999,  rating:4.0, desc:"Lightweight 10000mAh power bank, 18W PD fast charge.", specs:{ type:"Power Bank", capacity:"10000mAh", input:"USB-C 18W", output:"USB-A 18W", size:"Ultra Slim" } },
    { name:"boAt Rugged V3 Cable",              brand:"boAt",       price:399,  rating:4.2, desc:"3-in-1 nylon braided fast charging cable, 65W, 1.5m length.", specs:{ type:"Charging Cable", length:"1.5m", connectors:"USB-A+C+Lightning+Micro", wattage:"65W", material:"Nylon Braided" } },
    { name:"Lava ProMouse Wireless",            brand:"Lava",       price:699,  rating:3.9, desc:"Wireless ergonomic mouse with 3-DPI, 2.4GHz, 12-month battery.", specs:{ type:"Wireless Mouse", dpi:"800/1200/1600", battery:"12 months", connectivity:"2.4GHz", weight:"90g" } },
  ];
  accData.forEach((p,i) => items.push({ id:`acc_${i}`, ...p, image:getImg(p.name,"accessories"), category:"accessories", stock:rnd(5,100), reviews:rnd(200,2000), discount:rnd(8,30) }));

  return items;
}

const ALL_PRODUCTS = makeProducts();

const DEALS_DATA = [
  ALL_PRODUCTS[0], ALL_PRODUCTS[5], ALL_PRODUCTS[10],
  ALL_PRODUCTS[19], ALL_PRODUCTS[34], ALL_PRODUCTS[50],
].filter(Boolean).map((p,i) => ({
  ...p,
  dealPrice: Math.round(p.price * (1 - (p.discount + 5) / 100)),
  endTime: Date.now() + (i + 1) * 3600000 * 7,
}));

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fp = p => "₹" + p.toLocaleString("en-IN");

function Stars({ rating, size = 13 }) {
  return (
    <span style={{ fontSize: size }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} className={s <= Math.round(rating) ? "star-filled" : "star-empty"}>★</span>
      ))}
    </span>
  );
}

function CountdownTimer({ endTime }) {
  const [time, setTime] = useState({ h:0, m:0, s:0 });
  useEffect(() => {
    const calc = () => {
      const d = Math.max(0, endTime - Date.now());
      setTime({ h: Math.floor(d/3600000), m: Math.floor((d%3600000)/60000), s: Math.floor((d%60000)/1000) });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [endTime]);

  const Block = ({ v, l }) => (
    <span style={{ background:"rgba(240,48,96,0.12)", border:"1px solid rgba(240,48,96,0.22)", borderRadius:7, padding:"4px 8px", minWidth:36, display:"inline-block", textAlign:"center", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:14, color:"#EF4444" }}>
      {String(v).padStart(2,"0")}
      <span style={{ display:"block", fontSize:8, color:"#6B7280", fontFamily:"'Inter',sans-serif", fontWeight:400 }}>{l}</span>
    </span>
  );
  return (
    <div style={{ display:"flex", gap:4, alignItems:"center" }}>
      <Block v={time.h} l="HRS" /><span style={{ color:"#EF4444", fontWeight:700, fontSize:13 }}>:</span>
      <Block v={time.m} l="MIN" /><span style={{ color:"#EF4444", fontWeight:700, fontSize:13 }}>:</span>
      <Block v={time.s} l="SEC" />
    </div>
  );
}

function Popup({ msg, icon, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="popup-glass">
      <div style={{ width:38, height:38, background:"rgba(37,99,235,0.12)", border:"1px solid rgba(37,99,235,0.25)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{icon}</div>
      <div style={{ flex:1 }}>
        <p style={{ fontSize:13, fontWeight:600, color:"#F0F4FF" }}>{msg}</p>
        <p style={{ fontSize:11, color:"#6B7280", marginTop:2 }}>Electronic Store</p>
      </div>
      <button onClick={onClose} style={{ background:"none", border:"none", color:"#6B7280", fontSize:16, cursor:"pointer", padding:"2px 4px", flexShrink:0 }}>×</button>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background:"#111827", border:"1px solid #1F2937", borderRadius:16, overflow:"hidden" }}>
      <div className="skeleton" style={{ aspectRatio:"1/1" }} />
      <div style={{ padding:14 }}>
        <div className="skeleton" style={{ height:13, marginBottom:9 }} />
        <div className="skeleton" style={{ height:11, width:"60%", marginBottom:12 }} />
        <div className="skeleton" style={{ height:20, width:"42%" }} />
      </div>
    </div>
  );
}

function InputField({ icon, type="text", value, onChange, placeholder, required=false, style={} }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position:"relative", ...style }}>
      <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:15, zIndex:1, opacity:focused?1:0.45, transition:"opacity 0.2s" }}>{icon}</span>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} className="input-premium" />
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, onAddCart, onWishlist, onCompare, onView, wishlisted, inCompare }) {
  const [adding, setAdding] = useState(false);
  const dp = Math.round(product.price * (1 - product.discount / 100));
  const savings = product.price - dp;

  const handleAdd = e => {
    e.stopPropagation();
    setAdding(true);
    onAddCart(product);
    setTimeout(() => setAdding(false), 700);
  };

  return (
    <div className="card-product" onClick={() => onView(product)} style={{ cursor:"pointer" }}>
      {/* Image */}
      <div className="card-img-wrap">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={e => { e.target.src = CAT_FALLBACK[product.category] || `https://placehold.co/600x600/0B0F1E/00C8F0?text=${encodeURIComponent(product.name)}`; }}
        />
        {/* Overlay gradient */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(5,7,15,0.7) 0%, transparent 50%)", pointerEvents:"none" }} />
        {/* Discount badge */}
        <span className="badge badge-red" style={{ position:"absolute", top:10, left:10 }}>-{product.discount}%</span>
        {/* Wishlist */}
        <button onClick={e => { e.stopPropagation(); onWishlist(product); }}
          style={{ position:"absolute", top:10, right:10, background:"rgba(5,7,15,0.72)", backdropFilter:"blur(8px)", border:`1px solid ${wishlisted?"#EF4444":"rgba(255,255,255,0.1)"}`, borderRadius:"50%", width:32, height:32, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s", cursor:"pointer" }}>
          {wishlisted ? "❤️" : "🤍"}
        </button>
        {/* Brand overlay */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"6px 12px" }}>
          <p style={{ fontSize:10, fontWeight:700, color:"#22D3EE", textTransform:"uppercase", letterSpacing:1.2 }}>{product.brand}</p>
        </div>
        {product.stock < 5 && (
          <span className="badge badge-red" style={{ position:"absolute", bottom:28, left:10 }}>Low Stock</span>
        )}
      </div>

      {/* Body */}
      <div className="card-body">
        <h3 style={{ fontSize:13, fontWeight:600, color:"#E8EEFF", lineHeight:1.45, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", minHeight:38, marginBottom:7 }}>
          {product.name}
        </h3>
        <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:9 }}>
          <Stars rating={product.rating} size={12} />
          <span style={{ fontSize:11, color:"#6B7280" }}>{product.rating} ({product.reviews})</span>
        </div>
        <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:4 }}>
          <span className="price-tag" style={{ fontSize:18, color:"#22D3EE" }}>{fp(dp)}</span>
          <span style={{ fontSize:11, color:"#2E4060", textDecoration:"line-through" }}>{fp(product.price)}</span>
        </div>
        <p style={{ fontSize:11, color:"#10B981", marginBottom:0 }}>Save {fp(savings)}</p>

        {/* Footer buttons */}
        <div className="card-footer" style={{ display:"flex", gap:7 }}>
          <button className="btn-primary"
            style={{ flex:1, fontSize:12, padding:"8px 10px", animation:adding?"cartBounce 0.6s ease":"none" }}
            onClick={handleAdd}>
            {adding ? "✓ Added!" : "Add to Cart"}
          </button>
          <button onClick={e => { e.stopPropagation(); onCompare(product); }}
            style={{ background:inCompare?"rgba(37,99,235,0.14)":"#090D1C", border:`1px solid ${inCompare?"#22D3EE":"#1F2937"}`, color:inCompare?"#22D3EE":"#6B7280", borderRadius:9, padding:"8px 10px", fontSize:13, transition:"all 0.2s", cursor:"pointer", flexShrink:0 }}>⊞</button>
        </div>
      </div>
    </div>
  );
}

// ─── CHATBOT ──────────────────────────────────────────────────────────────────
function Chatbot({ user, cart, orders, onClose }) {
  const [msgs, setMsgs] = useState([{ from:"bot", text:"Hi! I'm your Electronic Store assistant. How can I help? 👋" }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, typing]);

  const reply = msg => {
    const l = msg.toLowerCase();
    if (l.match(/hi|hello|hey/))           return "Hello! Ask me anything about orders, products, payments or shipping! 🚀";
    if (l.includes("name") || l.includes("who am i")) return user ? `You're logged in as ${user.name} 😊` : "Please save your profile to see your details.";
    if (l.includes("order"))               return orders.length > 0 ? `You have ${orders.length} order(s). Latest: ${orders[orders.length-1].items[0]?.name||"N/A"}.` : "No orders yet. Start shopping!";
    if (l.includes("cart"))                return cart.length > 0 ? `${cart.length} item(s) in cart worth ${fp(cart.reduce((s,i)=>s+i.price*i.qty,0))}.` : "Your cart is empty.";
    if (l.includes("payment") || l.includes("pay")) return "We accept UPI (GPay, PhonePe, Paytm) and Cash on Delivery (COD).";
    if (l.includes("return") || l.includes("refund")) return "7-day hassle-free returns! Refunds in 3–5 business days.";
    if (l.includes("deliver") || l.includes("ship")) return "Standard: 3–5 days. Express: 1–2 days. Free shipping across India!";
    if (l.includes("warranty"))            return "All products carry 1-year manufacturer warranty. Accessories: 6 months.";
    if (l.includes("contact"))             return "📍 Electronic Store, Sirsi, Karnataka\n📞 111 1234 5555\n📧 electronicstore@gmail.com";
    return "I'll connect you to a human agent. Call 111 1234 5555 or email electronicstore@gmail.com.";
  };

  const send = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setMsgs(p => [...p, { from:"user", text }]);
    setTyping(true);
    setTimeout(() => { setTyping(false); setMsgs(p => [...p, { from:"bot", text:reply(text) }]); }, 850);
  };

  return (
    <div className="chat-window">
      <div style={{ background:"linear-gradient(135deg,#050D1A,#091528)", padding:"13px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid rgba(37,99,235,0.12)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:36, height:36, background:"linear-gradient(135deg,#2563EB,#8B5CF6)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>🤖</div>
          <div>
            <p style={{ fontWeight:600, fontSize:13, color:"#fff" }}>AI Assistant</p>
            <p style={{ fontSize:10, color:"rgba(255,255,255,0.5)", display:"flex", alignItems:"center", gap:3 }}>
              <span style={{ width:5, height:5, background:"#10B981", borderRadius:"50%", display:"inline-block" }} /> Online
            </p>
          </div>
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.5)", fontSize:20, cursor:"pointer" }}>×</button>
      </div>
      <div style={{ height:280, overflowY:"auto", padding:14, display:"flex", flexDirection:"column", gap:9 }}>
        {msgs.map((m,i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.from==="user"?"flex-end":"flex-start" }}>
            <div className={m.from==="bot"?"chat-bot-bubble":"chat-user-bubble"} style={{ whiteSpace:"pre-line" }}>{m.text}</div>
          </div>
        ))}
        {typing && (
          <div style={{ display:"flex" }}>
            <div className="chat-bot-bubble" style={{ display:"flex", gap:3, alignItems:"center", padding:"10px 14px" }}>
              {[0,1,2].map(i => <span key={i} style={{ width:7, height:7, background:"#3A4E68", borderRadius:"50%", animation:"pulse 1s infinite", animationDelay:`${i*0.2}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding:"10px 14px", borderTop:"1px solid #1F2937", display:"flex", gap:7 }}>
        <input className="input-premium" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask anything…" style={{ flex:1, paddingLeft:13 }} />
        <button className="btn-primary" onClick={send} style={{ padding:"9px 12px", flexShrink:0 }}>➤</button>
      </div>
    </div>
  );
}

// ─── MOBILE SEARCH BAR ───────────────────────────────────────────────────────
function MobileSearchBar({ onNavigate, onClose }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 80); }, []);

  const handle = v => {
    setQ(v);
    if (v.trim()) {
      setResults(ALL_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(v.toLowerCase()) || p.brand.toLowerCase().includes(v.toLowerCase())
      ).slice(0, 6));
    } else setResults([]);
  };

  const pick = p => { onNavigate("product", { product: p }); onClose(); };

  return (
    <div>
      <div style={{ position:"relative" }}>
        <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <input ref={inputRef} value={q} onChange={e => handle(e.target.value)}
          onKeyDown={e => e.key === "Escape" && onClose()}
          placeholder="Search products, brands…"
          style={{ width:"100%", background:"rgba(17,24,39,0.9)", border:"1.5px solid #1F2937", color:"#F0F4FF",
            padding:"10px 36px 10px 38px", borderRadius:10, fontSize:14, outline:"none",
            fontFamily:"'Inter',sans-serif", transition:"border-color 0.2s" }}
          onFocus={e => e.target.style.borderColor="#2563EB"}
          onBlur={e => e.target.style.borderColor="#1F2937"}
        />
        {q && (
          <button onClick={() => { setQ(""); setResults([]); inputRef.current?.focus(); }}
            style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)",
              background:"rgba(255,255,255,0.07)", border:"none", color:"#9CA3AF", borderRadius:5,
              width:20, height:20, cursor:"pointer", display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:13 }}>×</button>
        )}
      </div>
      {results.length > 0 && (
        <div style={{ background:"#0F1628", border:"1px solid rgba(37,99,235,0.18)", borderRadius:12,
          overflow:"hidden", marginTop:8, boxShadow:"0 12px 36px rgba(0,0,0,0.5)" }}>
          {results.map(p => (
            <div key={p.id} onClick={() => pick(p)}
              style={{ padding:"9px 12px", display:"flex", alignItems:"center", gap:10, cursor:"pointer",
                borderBottom:"1px solid #1A2235", transition:"background 0.12s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(37,99,235,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <img src={p.image} alt="" style={{ width:38, height:38, objectFit:"contain",
                borderRadius:7, border:"1px solid #1F2937", background:"#0B0F19", padding:2, flexShrink:0 }}
                onError={e => { e.target.src = CAT_FALLBACK[p.category] || "https://placehold.co/80x80/111827/22D3EE?text=P"; }} />
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:13, fontWeight:500, color:"#F0F4FF", overflow:"hidden",
                  textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</p>
                <p style={{ fontSize:11, color:"#6B7280" }}>{p.brand}</p>
              </div>
              <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:13, color:"#22D3EE", flexShrink:0 }}>
                {fp(Math.round(p.price * (1 - p.discount / 100)))}
              </span>
            </div>
          ))}
        </div>
      )}
      {q && results.length === 0 && (
        <div style={{ background:"#0F1628", border:"1px solid #1F2937", borderRadius:10,
          padding:"16px", textAlign:"center", color:"#6B7280", fontSize:13, marginTop:8 }}>
          No results for &ldquo;<span style={{ color:"#22D3EE" }}>{q}</span>&rdquo;
        </div>
      )}
    </div>
  );
}

// ─── INLINE NAVBAR SEARCH BAR ────────────────────────────────────────────────
function NavSearchBar({ onNavigate }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const handle = v => {
    setQ(v);
    if (v.trim().length > 0) {
      setResults(
        ALL_PRODUCTS.filter(p =>
          p.name.toLowerCase().includes(v.toLowerCase()) ||
          p.brand.toLowerCase().includes(v.toLowerCase())
        ).slice(0, 8)
      );
    } else {
      setResults([]);
    }
  };

  const clear = () => { setQ(""); setResults([]); inputRef.current?.focus(); };

  const pick = p => { onNavigate("product", { product: p }); setQ(""); setResults([]); setFocused(false); };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setFocused(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showDropdown = focused && (results.length > 0 || (q.trim().length > 0 && results.length === 0));

  return (
    <div className="nav-search-wrap hide-mobile" ref={wrapRef}>
      {/* Search icon */}
      <span className="nav-search-icon">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke={focused ? "#22D3EE" : "#6B7280"} strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ transition:"stroke 0.25s" }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </span>

      <input
        ref={inputRef}
        className="nav-search-input"
        value={q}
        onChange={e => handle(e.target.value)}
        onFocus={() => setFocused(true)}
        onKeyDown={e => { if (e.key === "Escape") { setFocused(false); setQ(""); setResults([]); } }}
        placeholder="Search products, brands…"
        autoComplete="off"
      />

      {/* Clear button */}
      {q && (
        <button className="nav-search-clear" onClick={clear} title="Clear">×</button>
      )}

      {/* Inline dropdown */}
      {showDropdown && (
        <div className="nav-search-dropdown">
          {results.length > 0 ? (
            <>
              {results.map(p => (
                <div key={p.id} className="nav-search-item" onClick={() => pick(p)}>
                  <img
                    src={p.image} alt=""
                    style={{ width:42, height:42, objectFit:"contain", borderRadius:8,
                      border:"1px solid #1F2937", flexShrink:0, background:"#0B0F19", padding:3 }}
                    onError={e => { e.target.src = CAT_FALLBACK[p.category] || "https://placehold.co/100x100/111827/22D3EE?text=P"; }}
                  />
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:13, fontWeight:500, color:"#F0F4FF",
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {p.name}
                    </p>
                    <p style={{ fontSize:11, color:"#6B7280", marginTop:2 }}>
                      {p.brand} &bull; {CATEGORIES.find(c => c.id === p.category)?.name}
                    </p>
                  </div>
                  <span className="price-tag" style={{ fontSize:14, color:"#22D3EE", flexShrink:0 }}>
                    {fp(Math.round(p.price * (1 - p.discount / 100)))}
                  </span>
                </div>
              ))}
              <div className="nav-search-footer">
                {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;
              </div>
            </>
          ) : (
            <div style={{ padding:"20px 16px", textAlign:"center", color:"#6B7280", fontSize:13 }}>
              No results for &ldquo;<span style={{ color:"#22D3EE" }}>{q}</span>&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MEGA MENU ────────────────────────────────────────────────────────────────
function MegaMenu({ onNavigate }) {
  const featuredBrands = BRANDS.slice(0,8);
  return (
    <div className="mega-menu">
      {/* Column 1: Categories */}
      <div>
        <p className="mega-menu-title">Shop by Category</p>
        {CATEGORIES.map(c => (
          <div key={c.id} className="mega-item" onClick={() => onNavigate("category",{cat:c.id})}>
            <span style={{ fontSize:17 }}>{c.icon}</span>
            <span>{c.name}</span>
          </div>
        ))}
      </div>
      {/* Column 2: Brands */}
      <div>
        <p className="mega-menu-title">Top Brands</p>
        {featuredBrands.map(b => (
          <div key={b.id} className="mega-item" onClick={() => onNavigate("brands")}>
            <span style={{ width:22, height:22, background:`${b.color}20`, border:`1px solid ${b.color}40`, borderRadius:"50%", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:b.color, flexShrink:0 }}>{b.logo}</span>
            <span>{b.name}</span>
            <span style={{ marginLeft:"auto", fontSize:10, color:"#6B7280" }}>{b.country}</span>
          </div>
        ))}
      </div>
      {/* Column 3: Featured */}
      <div>
        <p className="mega-menu-title">Featured</p>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {[
            { label:"⚡ Flash Deals", desc:"Up to 40% off", page:"deals", badge:"HOT", color:"#EF4444" },
            { label:"📱 New Mobiles", desc:"Latest launches", page:"category", cat:"mobiles", badge:"NEW", color:"#22D3EE" },
            { label:"💻 Gaming Laptops", desc:"High performance", page:"category", cat:"laptops", badge:"TOP", color:"#8B5CF6" },
            { label:"🎧 Best Earbuds", desc:"ANC & premium", page:"category", cat:"headphones", badge:"PICK", color:"#10B981" },
          ].map(item => (
            <div key={item.label}
              onClick={() => item.cat ? onNavigate(item.page,{cat:item.cat}) : onNavigate(item.page)}
              style={{ background:"rgba(37,99,235,0.06)", border:"1px solid #1F2937", borderRadius:10, padding:"10px 12px", cursor:"pointer", transition:"all 0.18s", display:"flex", alignItems:"center", gap:10 }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(37,99,235,0.12)"; e.currentTarget.style.borderColor="rgba(37,99,235,0.2)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(37,99,235,0.06)"; e.currentTarget.style.borderColor="#1F2937";}}>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:12, fontWeight:600, color:"#E8EEFF" }}>{item.label}</p>
                <p style={{ fontSize:10, color:"#6B7280" }}>{item.desc}</p>
              </div>
              <span className="badge" style={{ background:`${item.color}18`, color:item.color, border:`1px solid ${item.color}30` }}>{item.badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ products, onAddCart, onWishlist, onCompare, onView, wishlist, compareList, onCategoryClick, onDealsPage, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [heroVis, setHeroVis] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const topSelling = products.slice(0,8);

  useEffect(() => {
    setHeroVis(true);
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Brand-filtered products
  const brandProducts = selectedBrand
    ? products.filter(p => p.brand === selectedBrand).slice(0,8)
    : [];

  const featuredBrands = BRANDS.slice(0,10);

  return (
    <div className="page-enter" style={{ width:"100%" }}>
      {/* ── HERO ── */}
      <div className="hero-bg" style={{ padding:"90px 0 72px" }}>
        <div className="section-wrap" style={{ textAlign:"center" }}>
          <div style={{ maxWidth:680, margin:"0 auto" }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:5, color:"#2563EB", textTransform:"uppercase", marginBottom:18, opacity:heroVis?1:0, transition:"opacity 0.6s ease 0.1s" }}>
              ⚡ Karnataka's #1 Electronics Store
            </p>
            <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:"clamp(38px,7.5vw,82px)", fontWeight:800, lineHeight:1.03, marginBottom:22, opacity:heroVis?1:0, transform:heroVis?"translateY(0)":"translateY(28px)", transition:"all 0.85s cubic-bezier(0.22,1,0.36,1) 0.2s" }}>
              <span className="gradient-text">Power Up</span>
              <br /><span style={{ color:"#F0F4FF" }}>Your World</span>
            </h1>
            <p style={{ fontSize:17, color:"#6B7280", maxWidth:480, margin:"0 auto 36px", lineHeight:1.7, opacity:heroVis?1:0, transition:"opacity 0.8s ease 0.4s" }}>
              Premium electronics, unbeatable prices. Smartphones to Smart TVs — everything tech, all in one place.
            </p>
            <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", opacity:heroVis?1:0, transition:"opacity 0.8s ease 0.5s" }}>
              <button className="neon-glow-btn" style={{ padding:"14px 32px", fontSize:15, fontFamily:"'Outfit',sans-serif" }} onClick={() => onCategoryClick("mobiles")}>Shop Now →</button>
              <button className="btn-secondary" style={{ padding:"14px 32px", fontSize:15 }} onClick={onDealsPage}>View Deals ⚡</button>
            </div>
            <div style={{ display:"flex", gap:40, justifyContent:"center", marginTop:56, flexWrap:"wrap", opacity:heroVis?1:0, transition:"opacity 0.9s ease 0.6s" }}>
              {[["10K+","Products"],["50K+","Customers"],["5 ★","Avg Rating"],["Free","Delivery"]].map(([v,l]) => (
                <div key={l} style={{ textAlign:"center", animation:heroVis?"countUp 0.8s ease both":"none" }}>
                  <p className="price-tag" style={{ fontSize:26, background:"linear-gradient(135deg,#22D3EE,#8B5CF6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{v}</p>
                  <p style={{ fontSize:11, color:"#2E3E58", marginTop:3 }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Decorative orbs */}
        {[...Array(5)].map((_,i) => (
          <div key={i} style={{ position:"absolute", width:6+i*3, height:6+i*3, borderRadius:"50%", background:`rgba(${i%2===0?"37,99,235":"100,87,255"},0.3)`, top:`${12+i*14}%`, left:`${5+i*16}%`, animation:`float ${3+i*0.4}s ease-in-out infinite`, animationDelay:`${i*0.4}s`, pointerEvents:"none" }} />
        ))}
      </div>

      {/* ── CATEGORIES ── */}
      <div style={{ padding:"56px 0 44px", width:"100%" }}>
        <div className="section-wrap">
          <h2 className="section-title" style={{ marginBottom:6 }}>Shop by <span className="gradient-text">Category</span></h2>
          <p style={{ color:"#6B7280", fontSize:13, marginBottom:28 }}>Browse our wide range of premium electronics</p>
          <div className="cat-grid">
            {CATEGORIES.map((c,idx) => (
              <div key={c.id} onClick={() => onCategoryClick(c.id)}
                style={{ background:"#111827", border:"1px solid #1F2937", borderRadius:14, padding:"20px 10px", textAlign:"center", cursor:"pointer", transition:"all 0.3s ease" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=c.color; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.background=`${c.color}0D`; e.currentTarget.style.boxShadow=`0 12px 32px ${c.color}1A`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="#1F2937"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.background="#111827"; e.currentTarget.style.boxShadow="none"; }}>
                <div style={{ fontSize:28, marginBottom:10, animation:`float ${3+idx*0.2}s ease-in-out infinite`, animationDelay:`${idx*0.2}s` }}>{c.icon}</div>
                <p style={{ fontSize:11, fontWeight:600, color:"#9CA3AF" }}>{c.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FLASH DEALS ── */}
      <div className="deals-bg" style={{ padding:"52px 0", width:"100%" }}>
        <div className="section-wrap">
          <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap", marginBottom:26 }}>
            <div>
              <h2 className="section-title"><span className="gradient-text-warm">⚡ Flash</span> Deals</h2>
              <p style={{ fontSize:12, color:"#6B7280", marginTop:4 }}>Limited-time offers — grab them before they expire!</p>
            </div>
            <button className="btn-secondary" onClick={onDealsPage} style={{ marginLeft:"auto" }}>See All Deals →</button>
          </div>
          <div className="product-grid">
            {loading ? [0,1,2,3,4,5].map(i => <SkeletonCard key={i} />) : DEALS_DATA.map(p => (
              <div key={p.id} className="card-product" onClick={() => onView(p)} style={{ cursor:"pointer", borderColor:"rgba(240,48,96,0.18)" }}>
                <div className="card-img-wrap">
                  <img src={p.image} alt={p.name} loading="lazy"
                    onError={e=>{e.target.src=CAT_FALLBACK[p.category]||`https://placehold.co/600x600/0B0F1E/F03060?text=Deal`;}} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(5,7,15,0.65) 0%, transparent 50%)", pointerEvents:"none" }} />
                  <div style={{ position:"absolute", top:10, left:10, background:"linear-gradient(135deg,#EF4444,#FF6B35)", color:"#fff", borderRadius:7, padding:"4px 10px", fontSize:11, fontWeight:800 }}>DEAL -{p.discount+5}%</div>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"5px 12px" }}>
                    <p style={{ fontSize:10, fontWeight:700, color:"#EF4444", textTransform:"uppercase", letterSpacing:1.2 }}>{p.brand}</p>
                  </div>
                </div>
                <div className="card-body">
                  <p style={{ fontSize:13, fontWeight:600, color:"#E8EEFF", marginBottom:6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{p.name}</p>
                  <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:6 }}>
                    <span className="price-tag" style={{ fontSize:18, color:"#EF4444" }}>{fp(p.dealPrice)}</span>
                    <span style={{ fontSize:11, color:"#2E4060", textDecoration:"line-through" }}>{fp(p.price)}</span>
                  </div>
                  <div style={{ marginTop:"auto" }}>
                    <p style={{ fontSize:10, color:"#6B7280", marginBottom:6 }}>Ends in:</p>
                    <CountdownTimer endTime={p.endTime} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BRANDS FILTER SECTION ── */}
      <div style={{ padding:"52px 0", width:"100%", background:"#060912" }}>
        <div className="section-wrap">
          <h2 className="section-title" style={{ marginBottom:6 }}>Shop by <span className="gradient-text">Brand</span></h2>
          <p style={{ color:"#6B7280", fontSize:13, marginBottom:26 }}>Click a brand to explore their products</p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:28 }}>
            {selectedBrand && (
              <button onClick={() => setSelectedBrand(null)}
                className="btn-secondary" style={{ fontSize:12, padding:"6px 14px" }}>
                ✕ Show All
              </button>
            )}
            {featuredBrands.map(b => (
              <button key={b.id} onClick={() => setSelectedBrand(selectedBrand===b.name ? null : b.name)}
                style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 15px", background:selectedBrand===b.name?`${b.color}18`:"#111827", border:`1px solid ${selectedBrand===b.name?b.color:"#1F2937"}`, borderRadius:9, cursor:"pointer", transition:"all 0.22s", color:selectedBrand===b.name?b.color:"#9CA3AF", fontSize:13, fontWeight:500 }}
                onMouseEnter={e=>{if(selectedBrand!==b.name){e.currentTarget.style.borderColor=`${b.color}60`;e.currentTarget.style.color="#E8EEFF";}}}
                onMouseLeave={e=>{if(selectedBrand!==b.name){e.currentTarget.style.borderColor="#1F2937";e.currentTarget.style.color="#9CA3AF";}}}>
                <span style={{ width:20, height:20, background:`${b.color}20`, border:`1px solid ${b.color}35`, borderRadius:"50%", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, color:b.color }}>{b.logo}</span>
                {b.name}
              </button>
            ))}
          </div>
          {selectedBrand && brandProducts.length > 0 && (
            <div style={{ animation:"fadeInUp 0.35s ease" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:18, fontWeight:700 }}>
                  <span className="gradient-text">{selectedBrand}</span> Products
                </h3>
                <span className="badge badge-blue">{brandProducts.length} shown</span>
                <button onClick={() => onNavigate("brands")} className="btn-secondary" style={{ marginLeft:"auto", fontSize:11, padding:"5px 12px" }}>View All →</button>
              </div>
              <div className="product-grid">
                {brandProducts.map(p => (
                  <ProductCard key={p.id} product={p} onAddCart={onAddCart} onWishlist={onWishlist} onCompare={onCompare} onView={onView} wishlisted={wishlist.some(w=>w.id===p.id)} inCompare={compareList.some(c=>c.id===p.id)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── TOP SELLING ── */}
      <div style={{ padding:"52px 0 72px", width:"100%" }}>
        <div className="section-wrap">
          <h2 className="section-title" style={{ marginBottom:6 }}>Top <span className="gradient-text">Selling</span></h2>
          <p style={{ color:"#6B7280", fontSize:13, marginBottom:28 }}>Most popular picks this week</p>
          <div className="product-grid">
            {loading ? [0,1,2,3,4,5,6,7].map(i=><SkeletonCard key={i} />) : topSelling.map(p=>(
              <ProductCard key={p.id} product={p} onAddCart={onAddCart} onWishlist={onWishlist} onCompare={onCompare} onView={onView} wishlisted={wishlist.some(w=>w.id===p.id)} inCompare={compareList.some(c=>c.id===p.id)} />
            ))}
          </div>
        </div>
      </div>

      {/* ── WHY CHOOSE US ── */}
      <div style={{ background:"linear-gradient(135deg,#060A14,#080C1C,#060A12)", borderTop:"1px solid #0E1420", borderBottom:"1px solid #0E1420", padding:"52px 0", width:"100%" }}>
        <div className="section-wrap">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:24 }}>
            {[["🚚","Free Delivery","Free shipping on all orders across India"],["🔒","Secure Payment","100% safe & encrypted transactions"],["🔄","Easy Returns","Hassle-free 7-day return policy"],["⚡","Fast Support","24/7 customer care team"],["🏷️","Best Prices","Price match guarantee on all products"],["✅","100% Genuine","Authorized dealer for all brands"]].map(([ic,t,d]) => (
              <div key={t} style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:10 }}>
                <div style={{ width:50, height:50, background:"rgba(37,99,235,0.09)", border:"1px solid rgba(37,99,235,0.18)", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, transition:"all 0.25s" }}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(37,99,235,0.16)"; e.currentTarget.style.transform="scale(1.08)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(37,99,235,0.09)"; e.currentTarget.style.transform="scale(1)";}}>{ic}</div>
                <p style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:14, color:"#D5E4F5" }}>{t}</p>
                <p style={{ fontSize:11, color:"#2E3E58", lineHeight:1.55 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CATEGORY PAGE ────────────────────────────────────────────────────────────
function CategoryPage({ category, products, onAddCart, onWishlist, onCompare, onView, wishlist, compareList }) {
  const [filters, setFilters] = useState({ brand:"", sort:"default", search:"" });
  const catProducts = products.filter(p => p.category === category);
  const brands = [...new Set(catProducts.map(p => p.brand))];
  const catInfo = CATEGORIES.find(c => c.id === category);

  const filtered = catProducts
    .filter(p =>
      (!filters.brand || p.brand === filters.brand) &&
      (!filters.search || p.name.toLowerCase().includes(filters.search.toLowerCase()) || p.brand.toLowerCase().includes(filters.search.toLowerCase()))
    )
    .sort((a,b) => {
      if (filters.sort === "price_asc")  return a.price - b.price;
      if (filters.sort === "price_desc") return b.price - a.price;
      if (filters.sort === "rating")     return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="page-enter" style={{ width:"100%", padding:"36px 0" }}>
      <div className="section-wrap">
        <div style={{ marginBottom:24 }}>
          <h1 className="section-title" style={{ fontSize:32 }}>{catInfo?.icon} <span className="gradient-text">{catInfo?.name || category}</span></h1>
          <p style={{ color:"#6B7280", fontSize:13, marginTop:5 }}>{filtered.length} products found</p>
        </div>
        <div style={{ display:"flex", gap:10, marginBottom:24, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ position:"relative", flex:"1 1 200px", maxWidth:300 }}>
            <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#6B7280", fontSize:13 }}>🔍</span>
            <input className="input-premium" placeholder="Search products…" value={filters.search} onChange={e=>setFilters(f=>({...f,search:e.target.value}))} style={{ paddingLeft:34 }} />
          </div>
          <select className="input-premium" value={filters.brand} onChange={e=>setFilters(f=>({...f,brand:e.target.value}))} style={{ width:"auto", paddingLeft:13 }}>
            <option value="">All Brands</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select className="input-premium" value={filters.sort} onChange={e=>setFilters(f=>({...f,sort:e.target.value}))} style={{ width:"auto", paddingLeft:13 }}>
            <option value="default">Default Sort</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"72px 0" }}>
            <div style={{ fontSize:52, marginBottom:14 }}>😕</div>
            <p style={{ color:"#6B7280" }}>No products found. Try adjusting filters.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onAddCart={onAddCart} onWishlist={onWishlist} onCompare={onCompare} onView={onView} wishlisted={wishlist.some(w=>w.id===p.id)} inCompare={compareList.some(c=>c.id===p.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRODUCT DETAIL ───────────────────────────────────────────────────────────
function ProductDetailPage({ product, onAddCart, onWishlist, wishlisted, onBack, onCompare, inCompare }) {
  const [qty, setQty] = useState(1);
  const dp = Math.round(product.price * (1 - product.discount / 100));

  return (
    <div className="page-enter" style={{ width:"100%", padding:"36px 0" }}>
      <div className="section-wrap">
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#6B7280", fontSize:13, cursor:"pointer", marginBottom:24, display:"flex", alignItems:"center", gap:5, transition:"color 0.2s" }} onMouseEnter={e=>e.currentTarget.style.color="#22D3EE"} onMouseLeave={e=>e.currentTarget.style.color="#6B7280"}>← Back</button>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:42 }} className="grid-mobile-1">
          <div>
            <div style={{ background:"#08101E", borderRadius:18, overflow:"hidden", border:"1px solid #1F2937", aspectRatio:"4/3" }}>
              <img src={product.image} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"contain", padding:12 }}
                onError={e=>{e.target.src=CAT_FALLBACK[product.category]||`https://placehold.co/600x450/0B0F1E/00C8F0?text=${encodeURIComponent(product.name)}`;}} />
            </div>
            <div style={{ display:"flex", gap:9, marginTop:12 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ flex:1, background:"#08101E", border:"1px solid #1F2937", borderRadius:12, overflow:"hidden", opacity:i===0?1:0.45, cursor:"pointer", aspectRatio:"1", transition:"opacity 0.2s" }} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=i===0?1:0.45}>
                  <img src={product.image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>{e.target.src=`https://placehold.co/200x200/0B0F1E/00C8F0?text=IMG`;}} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize:11, color:"#6B7280", textTransform:"uppercase", letterSpacing:1.5, marginBottom:9 }}>{product.brand} • {CATEGORIES.find(c=>c.id===product.category)?.name}</p>
            <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:26, fontWeight:800, lineHeight:1.22, marginBottom:13, color:"#F0F4FF" }}>{product.name}</h1>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:14 }}>
              <Stars rating={product.rating} size={15} />
              <span style={{ fontSize:13, color:"#6B7280" }}>{product.rating} ({product.reviews} reviews)</span>
            </div>
            <p style={{ fontSize:13, color:"#5A6A80", lineHeight:1.7, marginBottom:18 }}>{product.desc}</p>
            <div className="glass-card" style={{ padding:18, marginBottom:18, borderColor:"rgba(37,99,235,0.12)" }}>
              <span className="badge badge-red" style={{ marginBottom:10, display:"inline-block" }}>-{product.discount}% OFF</span>
              <div style={{ display:"flex", alignItems:"baseline", gap:12 }}>
                <span className="price-tag" style={{ fontSize:35, background:"linear-gradient(135deg,#22D3EE,#8B5CF6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{fp(dp)}</span>
                <span style={{ fontSize:14, color:"#2E4060", textDecoration:"line-through" }}>{fp(product.price)}</span>
              </div>
              <p style={{ fontSize:12, color:"#10B981", marginTop:6 }}>You save {fp(product.price - dp)}</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
              <p style={{ fontSize:13, color:"#6B7280" }}>Qty:</p>
              <div style={{ display:"flex", alignItems:"center", background:"#090D1C", border:"1px solid #1F2937", borderRadius:9, overflow:"hidden" }}>
                <button onClick={() => setQty(Math.max(1,qty-1))} style={{ background:"none", border:"none", color:"#F0F4FF", padding:"8px 14px", fontSize:17, cursor:"pointer" }}>−</button>
                <span style={{ padding:"0 12px", fontSize:14, fontWeight:700, color:"#22D3EE" }}>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock,qty+1))} style={{ background:"none", border:"none", color:"#F0F4FF", padding:"8px 14px", fontSize:17, cursor:"pointer" }}>+</button>
              </div>
              <span className={`badge ${product.stock>5?"badge-green":"badge-red"}`}>{product.stock>5?"✓ In Stock":`Only ${product.stock} left`}</span>
            </div>
            <div style={{ display:"flex", gap:9, marginBottom:18, flexWrap:"wrap" }}>
              <button className="btn-primary" style={{ flex:"1 1 140px", padding:13, fontSize:14 }} onClick={() => onAddCart({...product,qty})}>🛒 Add to Cart</button>
              <button onClick={() => onWishlist(product)} style={{ padding:"13px 16px", background:"#090D1C", border:`1px solid ${wishlisted?"#EF4444":"#1F2937"}`, borderRadius:10, color:wishlisted?"#EF4444":"#6B7280", fontSize:19, transition:"all 0.2s", cursor:"pointer" }}>{wishlisted?"❤️":"🤍"}</button>
              <button onClick={() => onCompare(product)} style={{ padding:"13px 16px", background:inCompare?"rgba(37,99,235,0.1)":"#090D1C", border:`1px solid ${inCompare?"#22D3EE":"#1F2937"}`, borderRadius:10, color:inCompare?"#22D3EE":"#6B7280", fontSize:13, fontWeight:500, transition:"all 0.2s", cursor:"pointer" }}>⊞ Compare</button>
            </div>
            <div style={{ background:"#070B18", border:"1px solid #1F2937", borderRadius:13, padding:16 }}>
              <p style={{ fontSize:11, fontWeight:700, color:"#6B7280", textTransform:"uppercase", letterSpacing:1.2, marginBottom:13 }}>Specifications</p>
              {Object.entries(product.specs).map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #0C1220" }}>
                  <span style={{ fontSize:12, color:"#6B7280", textTransform:"capitalize" }}>{k}</span>
                  <span style={{ fontSize:12, fontWeight:500, color:"#D5E4F5" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CART PAGE ────────────────────────────────────────────────────────────────
function CartPage({ cart, onUpdateQty, onRemove, onCheckout, isLoggedIn, onLoginRequired }) {
  const total = cart.reduce((s,i) => s + Math.round(i.price*(1-i.discount/100))*i.qty, 0);

  if (!isLoggedIn) return (
    <div style={{ textAlign:"center", padding:"80px 24px" }}>
      <div style={{ fontSize:60, marginBottom:18 }}>🔐</div>
      <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:24, marginBottom:12 }}>Login Required</h2>
      <p style={{ color:"#6B7280", marginBottom:24 }}>Please save your profile to view cart and place orders</p>
      <button className="btn-primary" onClick={onLoginRequired} style={{ padding:"12px 32px" }}>Save Profile Now</button>
    </div>
  );

  if (cart.length === 0) return (
    <div style={{ textAlign:"center", padding:"80px 24px" }}>
      <div style={{ fontSize:60, marginBottom:18 }}>🛒</div>
      <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:24, marginBottom:12 }}>Your Cart is Empty</h2>
      <p style={{ color:"#6B7280" }}>Add some awesome products to get started!</p>
    </div>
  );

  return (
    <div className="page-enter" style={{ width:"100%", padding:"36px 0" }}>
      <div className="section-wrap">
        <h1 className="section-title" style={{ marginBottom:26 }}>Shopping <span className="gradient-text">Cart</span></h1>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 270px", gap:22, alignItems:"start" }} className="grid-mobile-1">
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {cart.map(item => {
              const dp = Math.round(item.price*(1-item.discount/100));
              return (
                <div key={item.id} className="glass-card" style={{ padding:14, display:"flex", gap:13, alignItems:"center" }}>
                  <img src={item.image} alt={item.name} style={{ width:80, height:80, objectFit:"contain", borderRadius:10, border:"1px solid #1F2937", flexShrink:0, background:"#060A16", padding:4 }}
                    onError={e=>{e.target.src=CAT_FALLBACK[item.category]||`https://placehold.co/200x200/0B0F1E/00C8F0?text=IMG`;}} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:13, fontWeight:500, color:"#D5E4F5", marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</p>
                    <p style={{ fontSize:11, color:"#6B7280", marginBottom:8 }}>{item.brand}</p>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ display:"flex", alignItems:"center", background:"#070B18", border:"1px solid #1F2937", borderRadius:7, overflow:"hidden" }}>
                        <button onClick={()=>onUpdateQty(item.id,item.qty-1)} style={{ background:"none", border:"none", color:"#F0F4FF", padding:"4px 10px", cursor:"pointer", fontSize:15 }}>−</button>
                        <span style={{ padding:"0 9px", fontSize:13, fontWeight:700, color:"#22D3EE" }}>{item.qty}</span>
                        <button onClick={()=>onUpdateQty(item.id,item.qty+1)} style={{ background:"none", border:"none", color:"#F0F4FF", padding:"4px 10px", cursor:"pointer", fontSize:15 }}>+</button>
                      </div>
                      <span className="price-tag" style={{ fontSize:15, color:"#22D3EE" }}>{fp(dp*item.qty)}</span>
                    </div>
                  </div>
                  <button onClick={()=>onRemove(item.id)} style={{ background:"none", border:"none", color:"#6B7280", fontSize:18, cursor:"pointer", transition:"color 0.2s", flexShrink:0 }} onMouseEnter={e=>e.currentTarget.style.color="#EF4444"} onMouseLeave={e=>e.currentTarget.style.color="#6B7280"}>✕</button>
                </div>
              );
            })}
          </div>
          <div className="glass-card" style={{ padding:20, borderColor:"rgba(37,99,235,0.12)" }}>
            <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:17, fontWeight:700, marginBottom:16 }}>Order Summary</h3>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ color:"#6B7280", fontSize:13 }}>Items ({cart.reduce((s,i)=>s+i.qty,0)})</span>
              <span style={{ fontSize:13 }}>{fp(total)}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ color:"#6B7280", fontSize:13 }}>Delivery</span>
              <span style={{ fontSize:13, color:"#10B981" }}>FREE</span>
            </div>
            <div style={{ borderTop:"1px solid #1F2937", paddingTop:12, marginTop:8, marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontWeight:600 }}>Total</span>
                <span className="price-tag gradient-text" style={{ fontSize:20 }}>{fp(total)}</span>
              </div>
            </div>
            <button className="btn-primary" style={{ width:"100%", padding:12, fontSize:14 }} onClick={onCheckout}>Proceed to Checkout →</button>
            <div style={{ display:"flex", gap:6, justifyContent:"center", marginTop:12 }}>
              {["🔒 Secure","📦 Free","↩️ 7-Day"].map(t=><span key={t} style={{ fontSize:10, color:"#2E3E58" }}>{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CHECKOUT ─────────────────────────────────────────────────────────────────
function CheckoutPage({ cart, onPlaceOrder, onBack }) {
  const [address, setAddress] = useState({ name:"", phone:"", line1:"", city:"Sirsi", state:"Karnataka", pin:"" });
  const [payment, setPayment] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const total = cart.reduce((s,i)=>s+Math.round(i.price*(1-i.discount/100))*i.qty, 0);

  const handle = () => {
    if (!address.name||!address.phone||!address.line1||!address.pin) { alert("Please fill all address fields"); return; }
    if (payment==="upi"&&!upiId) { alert("Please enter UPI ID"); return; }
    onPlaceOrder({ address, payment, total });
  };

  return (
    <div className="page-enter" style={{ width:"100%", padding:"36px 0" }}>
      <div className="section-wrap">
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#6B7280", fontSize:13, cursor:"pointer", marginBottom:22, display:"flex", alignItems:"center", gap:5 }} onMouseEnter={e=>e.currentTarget.style.color="#22D3EE"} onMouseLeave={e=>e.currentTarget.style.color="#6B7280"}>← Back to Cart</button>
        <h1 className="section-title" style={{ marginBottom:26 }}>Checkout</h1>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:22, alignItems:"start" }} className="grid-mobile-1">
          <div>
            <div className="glass-card" style={{ padding:20, marginBottom:14 }}>
              <h3 style={{ fontSize:14, fontWeight:700, marginBottom:16, color:"#D5E4F5" }}>📍 Delivery Address</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:9 }}>
                <InputField icon="👤" placeholder="Full Name" value={address.name} onChange={e=>setAddress(a=>({...a,name:e.target.value}))} />
                <InputField icon="📞" placeholder="Phone Number" value={address.phone} onChange={e=>setAddress(a=>({...a,phone:e.target.value}))} />
              </div>
              <InputField icon="🏠" placeholder="Address Line" value={address.line1} onChange={e=>setAddress(a=>({...a,line1:e.target.value}))} style={{ marginBottom:9 }} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:9 }}>
                <InputField icon="🏙️" placeholder="City" value={address.city} onChange={e=>setAddress(a=>({...a,city:e.target.value}))} />
                <InputField icon="🗺️" placeholder="State" value={address.state} onChange={e=>setAddress(a=>({...a,state:e.target.value}))} />
                <InputField icon="📌" placeholder="PIN Code" value={address.pin} onChange={e=>setAddress(a=>({...a,pin:e.target.value}))} />
              </div>
            </div>
            <div className="glass-card" style={{ padding:20 }}>
              <h3 style={{ fontSize:14, fontWeight:700, marginBottom:16, color:"#D5E4F5" }}>💳 Payment Method</h3>
              {[{id:"upi",label:"UPI Payment",icon:"📲",desc:"GPay, PhonePe, Paytm, BHIM"},{id:"cod",label:"Cash on Delivery",icon:"💵",desc:"Pay when order arrives"}].map(m => (
                <div key={m.id} onClick={()=>setPayment(m.id)}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px", background:payment===m.id?"rgba(37,99,235,0.07)":"#070B18", border:`1px solid ${payment===m.id?"#22D3EE":"#1F2937"}`, borderRadius:11, marginBottom:9, cursor:"pointer", transition:"all 0.2s" }}>
                  <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${payment===m.id?"#22D3EE":"#3A4A60"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {payment===m.id && <div style={{ width:9, height:9, background:"#22D3EE", borderRadius:"50%" }} />}
                  </div>
                  <span style={{ fontSize:18 }}>{m.icon}</span>
                  <div>
                    <p style={{ fontSize:13, fontWeight:600 }}>{m.label}</p>
                    <p style={{ fontSize:11, color:"#6B7280" }}>{m.desc}</p>
                  </div>
                </div>
              ))}
              {payment==="upi" && <InputField icon="💸" placeholder="Enter UPI ID (e.g. name@upi)" value={upiId} onChange={e=>setUpiId(e.target.value)} style={{ marginTop:4 }} />}
            </div>
          </div>
          <div className="glass-card" style={{ padding:20 }}>
            <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:17, fontWeight:700, marginBottom:16 }}>Order Summary</h3>
            {cart.map(i => (
              <div key={i.id} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:12, color:"#6B7280", maxWidth:130, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{i.name} ×{i.qty}</span>
                <span style={{ fontSize:12 }}>{fp(Math.round(i.price*(1-i.discount/100))*i.qty)}</span>
              </div>
            ))}
            <div style={{ borderTop:"1px solid #1F2937", paddingTop:12, marginTop:8, marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontWeight:600 }}>Total</span>
                <span className="price-tag gradient-text" style={{ fontSize:19 }}>{fp(total)}</span>
              </div>
            </div>
            <button className="btn-primary" style={{ width:"100%", padding:12, fontSize:14 }} onClick={handle}>Place Order ✓</button>
            <p style={{ fontSize:10, color:"#2E3E58", textAlign:"center", marginTop:9 }}>🔒 Secure & encrypted checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ORDER SUCCESS ─────────────────────────────────────────────────────────────
function OrderSuccess({ order, onHome }) {
  return (
    <div className="page-enter" style={{ padding:"72px 24px", width:"100%" }}>
      <div style={{ textAlign:"center", maxWidth:560, margin:"0 auto" }}>
      <div style={{ width:90, height:90, background:"rgba(0,217,122,0.1)", border:"1px solid rgba(0,217,122,0.28)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", fontSize:42, animation:"successPop 0.5s cubic-bezier(0.22,1,0.36,1)" }}>✅</div>
      <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:32, fontWeight:800, marginBottom:9 }}><span className="gradient-text">Order Placed!</span></h2>
      <p style={{ color:"#6B7280", fontSize:15, marginBottom:5 }}>Thank you for shopping with Electronic Store 🎉</p>
      <p style={{ color:"#6B7280", fontSize:13, marginBottom:32 }}>Total: <span style={{ color:"#22D3EE", fontWeight:700 }}>{fp(order.total)}</span> via <span style={{ color:"#F59E0B", fontWeight:700 }}>{order.payment==="upi"?"UPI":"Cash on Delivery"}</span></p>
      <div className="glass-card" style={{ padding:22, marginBottom:32, textAlign:"left" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
          <div>
            <p style={{ fontSize:11, color:"#6B7280", textTransform:"uppercase", letterSpacing:1, marginBottom:3 }}>Order ID</p>
            <p style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, color:"#22D3EE" }}>#{String(order.id).slice(-8)}</p>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ fontSize:11, color:"#6B7280", textTransform:"uppercase", letterSpacing:1, marginBottom:3 }}>Est. Delivery</p>
            <p style={{ fontWeight:600, color:"#10B981" }}>3–5 Business Days</p>
          </div>
        </div>
        <div style={{ borderTop:"1px solid #1F2937", paddingTop:12 }}>
          <p style={{ fontSize:11, color:"#6B7280", marginBottom:5 }}>Delivering to:</p>
          <p style={{ fontWeight:500, color:"#D5E4F5" }}>{order.address.name}</p>
          <p style={{ color:"#6B7280", fontSize:12 }}>{order.address.line1}, {order.address.city}, {order.address.state} — {order.address.pin}</p>
        </div>
      </div>
      <button className="btn-primary" onClick={onHome} style={{ padding:"13px 34px", fontSize:15 }}>Continue Shopping →</button>
      </div>
    </div>
  );
}

// ─── COMPARE ──────────────────────────────────────────────────────────────────
function ComparePage({ compareList, onRemove, onAddCart }) {
  if (compareList.length === 0) return (
    <div style={{ textAlign:"center", padding:"72px 24px" }}>
      <div style={{ fontSize:60, marginBottom:14 }}>⊞</div>
      <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:24, marginBottom:10 }}>Nothing to Compare</h2>
      <p style={{ color:"#6B7280" }}>Add products using the compare button on product cards</p>
    </div>
  );
  const allKeys = [...new Set(compareList.flatMap(p => Object.keys(p.specs)))];
  return (
    <div className="page-enter" style={{ width:"100%", padding:"36px 0", overflowX:"auto" }}>
      <div className="section-wrap">
        <h1 className="section-title" style={{ marginBottom:26 }}>Compare <span className="gradient-text">Products</span></h1>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:480 }}>
          <thead>
            <tr>
              <th style={{ padding:"12px 16px", background:"#070B18", color:"#6B7280", fontSize:12, textAlign:"left", width:140 }}>Feature</th>
              {compareList.map(p => (
                <th key={p.id} style={{ padding:"12px 16px", background:"#111827", border:"1px solid #1F2937", textAlign:"center" }}>
                  <img src={p.image} alt={p.name} style={{ width:"100%", maxWidth:120, height:82, objectFit:"contain", borderRadius:9, marginBottom:9, background:"#060A16", padding:4 }} onError={e=>{e.target.src=CAT_FALLBACK[p.category]||`https://placehold.co/200x150/0B0F1E/00C8F0?text=IMG`;}} />
                  <p style={{ fontSize:12, fontWeight:500, marginBottom:4, color:"#D5E4F5" }}>{p.name}</p>
                  <p className="price-tag gradient-text" style={{ fontSize:15, marginBottom:7 }}>{fp(Math.round(p.price*(1-p.discount/100)))}</p>
                  <div style={{ display:"flex", gap:5, justifyContent:"center" }}>
                    <button className="btn-primary" style={{ fontSize:10, padding:"6px 10px" }} onClick={()=>onAddCart(p)}>Add to Cart</button>
                    <button onClick={()=>onRemove(p.id)} style={{ background:"#070B18", border:"1px solid #1F2937", color:"#6B7280", fontSize:10, padding:"6px 9px", borderRadius:7, cursor:"pointer" }}>Remove</button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[["Brand",p=>p.brand],["Rating",p=>`${p.rating} ⭐ (${p.reviews})`],["Stock",p=>p.stock>5?"In Stock":`${p.stock} left`],
              ...allKeys.map(k=>[k.charAt(0).toUpperCase()+k.slice(1), p=>p.specs[k]||"—"])
            ].map(([label,fn],ri) => (
              <tr key={label} style={{ background:ri%2===0?"#070B18":"transparent" }}>
                <td style={{ padding:"10px 16px", color:"#6B7280", fontSize:12 }}>{label}</td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding:"10px 16px", border:"1px solid #0D1420", fontSize:12, textAlign:"center", color:"#D5E4F5" }}>{fn(p)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── DEALS PAGE ───────────────────────────────────────────────────────────────
function DealsPage({ products, onAddCart, onView }) {
  return (
    <div className="page-enter" style={{ width:"100%", padding:"36px 0" }}>
      <div className="section-wrap">
        <h1 className="section-title" style={{ marginBottom:7 }}>⚡ Flash <span className="gradient-text">Deals</span></h1>
        <p style={{ color:"#6B7280", fontSize:13, marginBottom:34 }}>Limited-time offers — prices drop at midnight!</p>
        <div className="product-grid">
          {DEALS_DATA.map(deal => {
            const savings = deal.price - deal.dealPrice;
            return (
              <div key={deal.id} className="card-product" onClick={()=>onView(deal)} style={{ cursor:"pointer", borderColor:"rgba(240,48,96,0.2)" }}>
                <div className="card-img-wrap">
                  <img src={deal.image} alt={deal.name} loading="lazy"
                    onError={e=>{e.target.src=CAT_FALLBACK[deal.category]||`https://placehold.co/600x600/0B0F1E/F03060?text=Deal`;}} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(5,7,15,0.65) 0%, transparent 50%)", pointerEvents:"none" }} />
                  <div style={{ position:"absolute", top:10, left:10, background:"linear-gradient(135deg,#EF4444,#FF6B35)", color:"#fff", borderRadius:7, padding:"4px 10px", fontSize:11, fontWeight:800 }}>-{deal.discount+5}% OFF</div>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"5px 12px" }}>
                    <p style={{ fontSize:10, fontWeight:700, color:"#EF4444", textTransform:"uppercase", letterSpacing:1.2 }}>{deal.brand}</p>
                  </div>
                </div>
                <div className="card-body">
                  <p style={{ fontSize:13, fontWeight:600, color:"#D5E4F5", marginBottom:7, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{deal.name}</p>
                  <div style={{ display:"flex", alignItems:"baseline", gap:9, marginBottom:7 }}>
                    <span className="price-tag" style={{ fontSize:22, color:"#EF4444" }}>{fp(deal.dealPrice)}</span>
                    <span style={{ fontSize:11, color:"#2E4060", textDecoration:"line-through" }}>{fp(deal.price)}</span>
                  </div>
                  <p style={{ fontSize:11, color:"#10B981", marginBottom:10 }}>You save {fp(savings)}!</p>
                  <div style={{ marginTop:"auto" }}>
                    <p style={{ fontSize:10, color:"#6B7280", marginBottom:6 }}>Offer ends in:</p>
                    <CountdownTimer endTime={deal.endTime} />
                  </div>
                  <button className="btn-primary" style={{ width:"100%", padding:10, marginTop:12, fontSize:13 }} onClick={e=>{e.stopPropagation();onAddCart(deal);}}>Add to Cart</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── BRANDS PAGE ──────────────────────────────────────────────────────────────
function BrandsPage({ products, onCategoryClick }) {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [filter, setFilter] = useState("All");
  const countries = ["All","India","USA","South Korea","Japan","China"];
  const filteredBrands = filter === "All" ? BRANDS : BRANDS.filter(b => b.country === filter);
  const brandProducts = selectedBrand ? products.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase()) : [];

  return (
    <div className="page-enter" style={{ width:"100%", padding:"36px 0" }}>
      <div className="section-wrap">
        <h1 className="section-title" style={{ marginBottom:7 }}>Our <span className="gradient-text">Brands</span></h1>
        <p style={{ color:"#6B7280", fontSize:13, marginBottom:22 }}>Authorized dealer for world's best electronics brands</p>
        <div style={{ display:"flex", gap:8, marginBottom:26, flexWrap:"wrap" }}>
          {countries.map(c => (
            <button key={c} onClick={()=>{ setFilter(c); setSelectedBrand(null); }}
              style={{ padding:"6px 15px", background:filter===c?"linear-gradient(135deg,#2563EB,#8B5CF6)":"#111827", border:`1px solid ${filter===c?"transparent":"#1F2937"}`, color:filter===c?"#fff":"#6A7E9C", borderRadius:8, fontSize:12, fontWeight:500, cursor:"pointer", transition:"all 0.2s", boxShadow:filter===c?"0 3px 12px rgba(37,99,235,0.28)":"none" }}>
              {c}
            </button>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:12, marginBottom:selectedBrand?32:0 }}>
          {filteredBrands.map(brand => {
            const count = products.filter(p => p.brand === brand.name).length;
            const isSel = selectedBrand === brand.name;
            return (
              <div key={brand.id} className="brand-card" onClick={() => setSelectedBrand(isSel?null:brand.name)}
                style={{ border:`1px solid ${isSel?brand.color:"#1F2937"}`, background:isSel?`${brand.color}0D`:"#111827" }}>
                <div style={{ width:50, height:50, background:`${brand.color}18`, border:`1px solid ${brand.color}30`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px", fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:14, color:brand.color }}>{brand.logo}</div>
                <p style={{ fontWeight:700, fontSize:13, marginBottom:3, color:"#D5E4F5" }}>{brand.name}</p>
                <p style={{ fontSize:10, color:"#6B7280", marginBottom:6 }}>{brand.country}</p>
                {count > 0 && <span className="badge badge-blue" style={{ fontSize:9 }}>{count} products</span>}
                {isSel && <p style={{ fontSize:10, color:"#22D3EE", marginTop:7, fontWeight:600 }}>▲ Viewing</p>}
              </div>
            );
          })}
        </div>
        {selectedBrand && brandProducts.length > 0 && (
          <div style={{ animation:"fadeInUp 0.35s ease" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
              <h2 className="section-title" style={{ fontSize:22 }}><span className="gradient-text">{selectedBrand}</span> Products</h2>
              <span className="badge badge-blue">{brandProducts.length} items</span>
              <button onClick={()=>setSelectedBrand(null)} className="btn-secondary" style={{ marginLeft:"auto", fontSize:11, padding:"6px 12px" }}>✕ Close</button>
            </div>
            <div className="product-grid">
              {brandProducts.map(p => (
                <div key={p.id} className="card-product">
                  <div className="card-img-wrap">
                    <img src={p.image} alt={p.name} onError={e=>{e.target.src=CAT_FALLBACK[p.category]||`https://placehold.co/600x600/0B0F1E/00C8F0?text=IMG`;}} />
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(5,7,15,0.65) 0%, transparent 50%)", pointerEvents:"none" }} />
                    <span className="badge badge-purple" style={{ position:"absolute", top:10, left:10 }}>-{p.discount}%</span>
                  </div>
                  <div className="card-body">
                    <p style={{ fontSize:10, fontWeight:700, color:"#22D3EE", textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>{p.brand}</p>
                    <p style={{ fontSize:13, fontWeight:600, color:"#D5E4F5", marginBottom:5, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{p.name}</p>
                    <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:8 }}>
                      <Stars rating={p.rating} size={11} />
                      <span style={{ fontSize:10, color:"#6B7280" }}>{p.rating}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"baseline", gap:7 }}>
                      <span className="price-tag" style={{ fontSize:16, color:"#22D3EE" }}>{fp(Math.round(p.price*(1-p.discount/100)))}</span>
                      <span style={{ fontSize:10, color:"#2E4060", textDecoration:"line-through" }}>{fp(p.price)}</span>
                    </div>
                    <span className={`badge ${p.stock>5?"badge-green":"badge-red"}`} style={{ marginTop:8, display:"inline-block" }}>{p.stock>5?"In Stock":`${p.stock} left`}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {selectedBrand && brandProducts.length === 0 && (
          <div style={{ textAlign:"center", padding:"36px", color:"#6B7280" }}>No products found for {selectedBrand}.</div>
        )}
      </div>
    </div>
  );
}

// ─── HELP PAGE ────────────────────────────────────────────────────────────────
function HelpPage() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div className="page-enter" style={{ width:"100%", padding:"36px 0" }}>
      <div className="section-wrap">
        <h1 className="section-title" style={{ marginBottom:7 }}>Help & <span className="gradient-text">FAQ</span></h1>
        <p style={{ color:"#6B7280", fontSize:13, marginBottom:32 }}>Find answers to commonly asked questions</p>
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {FAQ_DATA.map((faq,i) => (
            <div key={i} className="faq-item" style={{ background:openIdx===i?"rgba(37,99,235,0.04)":"transparent", borderRadius:openIdx===i?11:0 }}>
              <button onClick={() => setOpenIdx(openIdx===i?null:i)}
                style={{ width:"100%", background:"none", border:"none", padding:"16px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", color:openIdx===i?"#22D3EE":"#D5E4F5", textAlign:"left", gap:14 }}>
                <span style={{ fontSize:14, fontWeight:600, flex:1 }}>{faq.q}</span>
                <span style={{ fontSize:18, color:openIdx===i?"#2563EB":"#6B7280", transition:"transform 0.28s", transform:openIdx===i?"rotate(180deg)":"rotate(0deg)", flexShrink:0 }}>⌄</span>
              </button>
              <div style={{ maxHeight:openIdx===i?"400px":0, opacity:openIdx===i?1:0, overflow:"hidden", transition:"max-height 0.35s ease, opacity 0.28s ease" }}>
                <p style={{ padding:"0 18px 16px", fontSize:13, color:"#5A6A80", lineHeight:1.75 }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="glass-card" style={{ padding:26, marginTop:36, textAlign:"center" }}>
          <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:19, fontWeight:700, marginBottom:9 }}>Still need help?</h3>
          <p style={{ color:"#6B7280", marginBottom:18, fontSize:13 }}>Our support team is available Mon–Sat, 9AM–7PM</p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <a href="tel:11112345555" style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 18px", background:"rgba(37,99,235,0.09)", border:"1px solid rgba(37,99,235,0.22)", borderRadius:9, color:"#22D3EE", fontSize:13, fontWeight:500 }}>📞 111 1234 5555</a>
            <a href="mailto:electronicstore@gmail.com" style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 18px", background:"rgba(37,99,235,0.09)", border:"1px solid rgba(37,99,235,0.22)", borderRadius:9, color:"#22D3EE", fontSize:13, fontWeight:500 }}>✉️ Email Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({ name:"", email:"", message:"" });
  const [sent, setSent] = useState(false);
  const handle = () => {
    if (form.name && form.email && form.message) {
      setSent(true);
      setTimeout(() => { setSent(false); setForm({ name:"", email:"", message:"" }); }, 4000);
    }
  };
  return (
    <div className="page-enter" style={{ width:"100%", padding:"36px 0" }}>
      <div className="section-wrap">
        <h1 className="section-title" style={{ marginBottom:7 }}>Get in <span className="gradient-text">Touch</span></h1>
        <p style={{ color:"#6B7280", fontSize:13, marginBottom:32 }}>We'd love to hear from you. Send us a message!</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:28 }} className="grid-mobile-1">
          <div>
            <div className="glass-card" style={{ padding:26, marginBottom:18 }}>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:20, color:"#D5E4F5" }}>Send a Message</h3>
              <InputField icon="👤" placeholder="Your Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={{ marginBottom:10 }} />
              <InputField icon="✉️" type="email" placeholder="Email Address" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} style={{ marginBottom:10 }} />
              <div style={{ position:"relative", marginBottom:14 }}>
                <span style={{ position:"absolute", left:12, top:12, fontSize:14, opacity:0.4, zIndex:1 }}>💬</span>
                <textarea className="input-premium" placeholder="Your message…" rows={4} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} style={{ resize:"vertical", paddingTop:10 }} />
              </div>
              {sent ? (
                <div style={{ padding:"12px 16px", background:"rgba(0,217,122,0.08)", border:"1px solid rgba(0,217,122,0.22)", borderRadius:9, color:"#10B981", fontSize:13, fontWeight:600 }}>✓ Message sent! We'll reply within 24 hours.</div>
              ) : (
                <button className="btn-primary" style={{ width:"100%", padding:12, fontSize:14 }} onClick={handle}>Send Message →</button>
              )}
            </div>
            <div className="glass-card" style={{ padding:20 }}>
              <h3 style={{ fontSize:14, fontWeight:700, marginBottom:16, color:"#D5E4F5" }}>Store Information</h3>
              {[["📍","Address","Electronic Store, Sirsi, Uttara Kannada, Karnataka, 581355"],["📞","Phone","111 1234 5555"],["📧","Email","electronicstore@gmail.com"],["🕐","Hours","Mon–Sat: 9:00 AM – 7:00 PM"]].map(([ic,label,val]) => (
                <div key={label} style={{ display:"flex", gap:10, marginBottom:12, alignItems:"flex-start" }}>
                  <div style={{ width:34, height:34, background:"rgba(37,99,235,0.09)", border:"1px solid rgba(37,99,235,0.18)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{ic}</div>
                  <div>
                    <p style={{ fontSize:10, color:"#6B7280", marginBottom:1, fontWeight:600, textTransform:"uppercase", letterSpacing:0.8 }}>{label}</p>
                    <p style={{ fontSize:12, color:"#B0C4DE" }}>{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div className="glass-card" style={{ overflow:"hidden", flex:1 }}>
              <div style={{ background:"linear-gradient(135deg,#050D1A,#091525)", padding:"13px 16px", display:"flex", alignItems:"center", gap:9 }}>
                <span style={{ fontSize:15 }}>🗺️</span>
                <span style={{ fontSize:12, fontWeight:700, color:"#D5E4F5" }}>Store Location — Sirsi, Karnataka</span>
              </div>
              <iframe src="https://maps.google.com/maps?q=Sirsi,Karnataka,India&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%" height="300" style={{ border:0, display:"block" }}
                allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Store Location" />
              <div style={{ padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <p style={{ fontSize:12, color:"#6B7280" }}>Sirsi, Uttara Kannada, Karnataka</p>
                <a href="https://maps.google.com/?q=Sirsi,Karnataka" target="_blank" rel="noreferrer" style={{ fontSize:11, color:"#22D3EE", fontWeight:600 }}>Open Maps →</a>
              </div>
            </div>
            <div className="glass-card" style={{ padding:20 }}>
              <h3 style={{ fontSize:14, fontWeight:700, marginBottom:14, color:"#D5E4F5" }}>Quick Feedback</h3>
              <textarea className="input-premium" rows={3} placeholder="Share your feedback…" style={{ marginBottom:10, paddingLeft:13 }} />
              <button className="btn-primary" style={{ width:"100%", padding:10 }}>Submit Feedback</button>
            </div>

            {/* ── WHATSAPP CONTACT ── */}
            <div className="glass-card" style={{ padding:22, border:"1px solid rgba(37,211,102,0.18)", background:"rgba(37,211,102,0.03)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:40, height:40, background:"rgba(37,211,102,0.12)", border:"1px solid rgba(37,211,102,0.25)", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg viewBox="0 0 32 32" width="22" height="22" fill="#25D366"><path d="M16 2.9A13.1 13.1 0 0 0 2.9 16c0 2.3.6 4.5 1.8 6.5L2.9 29.1l6.8-1.8A13.1 13.1 0 1 0 16 2.9zm0 24A10.9 10.9 0 0 1 9.2 24l-.4-.3-4 1 1-3.9-.3-.4A10.9 10.9 0 1 1 16 26.9zm6-8.1c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6l.6-.7c.2-.2.2-.3.3-.5 0-.2 0-.4-.1-.6-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.2 2.8 1.1 2.8.7 3.3.7.5 0 1.7-.7 2-1.3.2-.6.2-1.2.1-1.3z"/></svg>
                </div>
                <div>
                  <p style={{ fontSize:14, fontWeight:700, color:"#D5E4F5", marginBottom:2 }}>Chat on WhatsApp</p>
                  <p style={{ fontSize:12, color:"#6B7280" }}>Instant support — typically replies in minutes</p>
                </div>
              </div>
              <a href="https://wa.me/919480592784" target="_blank" rel="noreferrer" className="btn-whatsapp" style={{ width:"100%", justifyContent:"center", marginTop:4, borderRadius:10, fontSize:14, fontWeight:700, padding:"11px 20px" }}>
                <svg viewBox="0 0 32 32"><path d="M16 2.9A13.1 13.1 0 0 0 2.9 16c0 2.3.6 4.5 1.8 6.5L2.9 29.1l6.8-1.8A13.1 13.1 0 1 0 16 2.9zm0 24A10.9 10.9 0 0 1 9.2 24l-.4-.3-4 1 1-3.9-.3-.4A10.9 10.9 0 1 1 16 26.9zm6-8.1c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6l.6-.7c.2-.2.2-.3.3-.5 0-.2 0-.4-.1-.6-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.2 2.8 1.1 2.8.7 3.3.7.5 0 1.7-.7 2-1.3.2-.6.2-1.2.1-1.3z"/></svg>
                WhatsApp Us: +91 9480592784
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WISHLIST ─────────────────────────────────────────────────────────────────
function WishlistPage({ wishlist, onRemove, onAddCart, onView }) {
  if (wishlist.length === 0) return (
    <div style={{ textAlign:"center", padding:"72px 24px" }}>
      <div style={{ fontSize:58, marginBottom:14 }}>🤍</div>
      <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:24, marginBottom:10 }}>Wishlist is Empty</h2>
      <p style={{ color:"#6B7280" }}>Save your favourite products here!</p>
    </div>
  );
  return (
    <div className="page-enter" style={{ width:"100%", padding:"36px 0" }}>
      <div className="section-wrap">
        <h1 className="section-title" style={{ marginBottom:26 }}>My <span className="gradient-text">Wishlist</span> ({wishlist.length})</h1>
        <div className="product-grid">
          {wishlist.map(p => <ProductCard key={p.id} product={p} onAddCart={onAddCart} onWishlist={onRemove} onCompare={()=>{}} onView={onView} wishlisted={true} inCompare={false} />)}
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfilePage({ user, onSave, orders }) {
  const [form, setForm] = useState({ fullName:user?.name||"", address:user?.address||"", mobile:user?.mobile||"", email:user?.email||"", pincode:user?.pincode||"", state:user?.state||"", mobile2:user?.mobile2||"" });
  const [saved, setSaved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const confirmSave = () => {
    onSave({ ...form, name:form.fullName });
    setShowConfirm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const fields = [
    { icon:"👤", key:"fullName",  label:"Full Name",                type:"text",  required:true  },
    { icon:"🏠", key:"address",   label:"Full Address",             type:"text",  required:true  },
    { icon:"📞", key:"mobile",    label:"Mobile Number",            type:"tel",   required:true  },
    { icon:"✉️", key:"email",     label:"Email Address",            type:"email", required:true  },
    { icon:"📌", key:"pincode",   label:"Pin Code",                 type:"text",  required:true  },
    { icon:"🗺️", key:"state",     label:"State",                    type:"text",  required:true  },
    { icon:"📱", key:"mobile2",   label:"Second Mobile (Optional)", type:"tel",   required:false },
  ];

  return (
    <div className="page-enter" style={{ width:"100%", padding:"36px 0" }}>
      <div className="section-wrap">
        <h1 className="section-title" style={{ marginBottom:26 }}>My <span className="gradient-text">Profile</span></h1>
        <div className="glass-card" style={{ padding:22, marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:18, marginBottom:20 }}>
            <div style={{ width:68, height:68, background:"linear-gradient(135deg,#2563EB,#8B5CF6)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontWeight:800, flexShrink:0 }}>
              {form.fullName ? form.fullName[0].toUpperCase() : "?"}
            </div>
            <div>
              <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:20, fontWeight:800, color:"#F0F4FF" }}>{form.fullName||"Your Name"}</h2>
              <p style={{ color:"#6B7280", fontSize:13, marginTop:2 }}>📞 {form.mobile||"Add mobile number"}</p>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {[["📦",orders.length,"Orders"],["❤️","—","Wishlist"],["⭐","4.8","Rating"]].map(([ic,val,label]) => (
              <div key={label} style={{ background:"#070B18", borderRadius:11, padding:"12px 14px", textAlign:"center" }}>
                <span style={{ fontSize:18 }}>{ic}</span>
                <p className="price-tag" style={{ fontSize:20, marginTop:5, color:"#22D3EE" }}>{val}</p>
                <p style={{ fontSize:11, color:"#6B7280" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card" style={{ padding:26, marginBottom:22 }}>
          <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:17, fontWeight:700, marginBottom:22, color:"#D5E4F5" }}>Profile Details</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {fields.map(f => (
              <InputField key={f.key} icon={f.icon} type={f.type} placeholder={f.label}
                value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]:e.target.value }))}
                required={f.required} style={{ gridColumn:f.key==="address"?"1 / -1":"auto" }} />
            ))}
          </div>
          <div style={{ marginTop:20 }}>
            {saved ? (
              <div style={{ padding:"12px 16px", background:"rgba(0,217,122,0.08)", border:"1px solid rgba(0,217,122,0.22)", borderRadius:9, color:"#10B981", fontSize:13, fontWeight:600 }}>✓ Profile saved successfully!</div>
            ) : (
              <button className="btn-primary" style={{ padding:"12px 26px", fontSize:14, minWidth:180 }} onClick={() => setShowConfirm(true)}>💾 Save Profile</button>
            )}
          </div>
        </div>
        {orders.length > 0 && (
          <div>
            <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:19, fontWeight:700, marginBottom:16, color:"#D5E4F5" }}>Recent Orders</h3>
            {orders.map((o,i) => (
              <div key={i} className="glass-card" style={{ padding:16, marginBottom:9 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                  <span style={{ fontSize:12, color:"#6B7280" }}>Order #{String(i+1).padStart(4,"0")}</span>
                  <span className="badge badge-green">✓ Placed</span>
                </div>
                <p style={{ fontSize:13, fontWeight:500, marginBottom:4, color:"#D5E4F5" }}>{o.items?.length||0} item(s)</p>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:12, color:"#6B7280" }}>{o.payment==="upi"?"UPI":"Cash on Delivery"}</span>
                  <span className="price-tag" style={{ fontSize:15, color:"#22D3EE" }}>{fp(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {showConfirm && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:5000, display:"flex", alignItems:"center", justifyContent:"center", animation:"fadeIn 0.2s ease" }} onClick={() => setShowConfirm(false)}>
            <div onClick={e=>e.stopPropagation()} className="glass-card" style={{ padding:30, maxWidth:360, width:"calc(100% - 32px)", textAlign:"center", animation:"successPop 0.28s ease", border:"1px solid rgba(37,99,235,0.22)" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>💾</div>
              <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:20, fontWeight:800, marginBottom:9 }}>Save Profile?</h3>
              <p style={{ color:"#6B7280", fontSize:13, marginBottom:22, lineHeight:1.6 }}>Confirm updating your profile details. This will be used for future orders.</p>
              <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                <button className="btn-primary" style={{ padding:"10px 26px" }} onClick={confirmSave}>✓ Confirm</button>
                <button className="btn-secondary" style={{ padding:"10px 22px" }} onClick={() => setShowConfirm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page,           setPage]           = useState("home");
  const [activeCat,      setActiveCat]      = useState("mobiles");
  const [selectedProduct,setSelectedProduct] = useState(null);
  const [cart,           setCart]           = useState([]);
  const [wishlist,       setWishlist]       = useState([]);
  const [compareList,    setCompareList]    = useState([]);
  const [orders,         setOrders]         = useState([]);
  const [user,           setUser]           = useState(null);
  const [popup,          setPopup]          = useState(null);
  const [chatOpen,       setChatOpen]       = useState(false);
  const [showScrollTop,  setShowScrollTop]  = useState(false);
  const [prevPage,       setPrevPage]       = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen,     setSearchOpen]     = useState(false);
  const [megaOpen,       setMegaOpen]       = useState(false);
  const megaRef = useRef(null);

  useEffect(() => {
    const onScroll  = () => setShowScrollTop(window.scrollY > 260);
    const onKey     = e  => { if (e.key==="Escape") { setSearchOpen(false); setMegaOpen(false); } };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); };
  }, []);

  // Close mega menu on outside click
  useEffect(() => {
    const handler = e => { if (megaRef.current && !megaRef.current.contains(e.target)) setMegaOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showPopup = useCallback((msg, icon="✅") => setPopup({ msg, icon }), []);

  const navigate = (p, extra={}) => {
    setPrevPage(page);
    setPage(p);
    if (extra.cat)     setActiveCat(extra.cat);
    if (extra.product) setSelectedProduct(extra.product);
    window.scrollTo({ top:0, behavior:"smooth" });
    setMobileMenuOpen(false);
    setMegaOpen(false);
  };

  const addToCart = product => {
    if (!user) { navigate("profile"); showPopup("Please save your profile first","👤"); return; }
    setCart(prev => {
      const ex = prev.find(i => i.id===product.id);
      if (ex) return prev.map(i => i.id===product.id ? {...i, qty:i.qty+(product.qty||1)} : i);
      return [...prev, { ...product, qty:product.qty||1 }];
    });
    showPopup("Added to cart! 🛒","🛒");
  };

  const toggleWishlist = product => {
    setWishlist(prev => prev.some(w=>w.id===product.id) ? prev.filter(w=>w.id!==product.id) : [...prev, product]);
  };

  const toggleCompare = product => {
    setCompareList(prev => {
      if (prev.some(c=>c.id===product.id)) return prev.filter(c=>c.id!==product.id);
      if (prev.length >= 4) { showPopup("Max 4 products to compare","⚠️"); return prev; }
      return [...prev, product];
    });
  };

  const handleSaveProfile = u => {
    setUser({ ...user, ...u, name:u.fullName||u.name });
    showPopup("Profile saved! 🎉","✅");
  };

  const placeOrder = details => {
    const order = { ...details, items:cart, id:Date.now(), date:new Date().toLocaleDateString() };
    setOrders(prev => [...prev, order]);
    setCart([]);
    setSelectedProduct(order);
    navigate("order_success", { product:order });
    showPopup("Order placed! 🎉","🎉");
  };

  const cartCount = cart.reduce((s,i) => s+i.qty, 0);
  const NAV_LINKS = [["home","Home"],["deals","Deals"],["brands","Brands"],["categories","Categories"],["contact","Contact"],["help","Help"]];

  return (
    <>
      <style>{css}</style>

      {/* ── NAVBAR ── */}
      <nav style={{ position:"sticky", top:0, zIndex:1000, background:"rgba(5,7,15,0.94)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(37,99,235,0.12)", width:"100%", boxShadow:"0 1px 30px rgba(0,0,0,0.4)" }}>
        <div style={{ width:"100%", padding:"0 clamp(14px,2.5vw,40px)", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          {/* LEFT — Logo */}
          <div onClick={() => navigate("home")} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:10, minWidth:"fit-content", marginRight:20, flexShrink:0 }}>
            <div style={{ width:38, height:38, background:"linear-gradient(135deg,#2563EB,#2563EB)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 3px 14px rgba(37,99,235,0.45)", animation:"glowPulse 3s ease-in-out infinite", flexShrink:0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ lineHeight:1 }}>
              <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:18, letterSpacing:-0.5 }}><span className="gradient-text">Electronic</span><span style={{ color:"#F0F4FF" }}> Store</span></span>
              <p style={{ fontSize:9, color:"#6B7280", fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", marginTop:1 }}>Karnataka's Best</p>
            </div>
          </div>

          {/* CENTER — Inline Search Bar (desktop) */}
          <NavSearchBar onNavigate={navigate} />

          {/* RIGHT — Nav links + Icons */}
          <div style={{ display:"flex", alignItems:"center", gap:0, flexShrink:0 }}>
            {/* Nav links (desktop) */}
            <div className="hide-mobile" style={{ display:"flex", gap:24, alignItems:"center", marginRight:20, fontSize:14, color:"#ccc" }}>
              {NAV_LINKS.map(([p,l]) =>
                p === "categories" ? (
                  <div key={p} ref={megaRef} style={{ position:"relative" }}>
                    <span className={`nav-link ${page==="category"?"active":""}`}
                      style={{ display:"flex", alignItems:"center", gap:4, userSelect:"none" }}
                      onClick={() => setMegaOpen(!megaOpen)}>
                      Categories
                      <span style={{ fontSize:10, transition:"transform 0.2s", transform:megaOpen?"rotate(180deg)":"none" }}>▾</span>
                    </span>
                    {megaOpen && <MegaMenu onNavigate={navigate} />}
                  </div>
                ) : (
                  <span key={p} className={`nav-link ${page===p?"active":""}`} onClick={() => navigate(p)}>{l}</span>
                )
              )}
            </div>

            {/* Icons */}
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              {/* Mobile search */}
              <button className="hide-desktop" onClick={() => setSearchOpen(!searchOpen)}
                style={{ background:searchOpen?"rgba(37,99,235,0.12)":"none", border:searchOpen?"1px solid rgba(37,99,235,0.3)":"none", color:searchOpen?"#22D3EE":"#6B7280", fontSize:19, cursor:"pointer", padding:"6px 7px", transition:"all 0.2s", borderRadius:8 }}
                onMouseEnter={e=>e.currentTarget.style.color="#22D3EE"} onMouseLeave={e=>{ if(!searchOpen) e.currentTarget.style.color="#6B7280"; }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </button>
              <button onClick={() => navigate("wishlist")}
                style={{ background:"none", border:"none", color:page==="wishlist"?"#EF4444":"#6B7280", fontSize:19, cursor:"pointer", transition:"all 0.2s", padding:"4px 5px" }}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.15)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>🤍</button>
              <button onClick={() => navigate("compare")}
                style={{ background:"none", border:"none", color:page==="compare"?"#F59E0B":"#6B7280", fontSize:19, cursor:"pointer", position:"relative", padding:"4px 5px", transition:"color 0.2s" }}>
                ⊞{compareList.length>0 && <span style={{ position:"absolute", top:-2, right:-2, background:"#F59E0B", color:"#000", borderRadius:"50%", width:14, height:14, fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{compareList.length}</span>}
              </button>
              <button onClick={() => navigate("cart")}
                style={{ background:"none", border:"none", color:page==="cart"?"#22D3EE":"#6B7280", fontSize:19, cursor:"pointer", position:"relative", padding:"4px 5px", transition:"color 0.2s" }}>
                🛒{cartCount>0 && <span style={{ position:"absolute", top:-2, right:-2, background:"linear-gradient(135deg,#2563EB,#8B5CF6)", color:"#fff", borderRadius:"50%", width:14, height:14, fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{cartCount}</span>}
              </button>
              <button onClick={() => navigate("profile")}
                style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(37,99,235,0.07)", border:"1px solid rgba(37,99,235,0.18)", borderRadius:9, padding:"5px 12px", cursor:"pointer", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(37,99,235,0.15)"; e.currentTarget.style.borderColor="rgba(37,99,235,0.38)"; e.currentTarget.style.transform="scale(1.04)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(37,99,235,0.07)"; e.currentTarget.style.borderColor="rgba(37,99,235,0.18)"; e.currentTarget.style.transform="scale(1)";}}>
                <div style={{ width:24, height:24, background:"linear-gradient(135deg,#2563EB,#8B5CF6)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800 }}>{user?.name?user.name[0].toUpperCase():"👤"}</div>
                <span className="hide-mobile" style={{ fontSize:12, fontWeight:500, color:"#9CA3AF" }}>{user?.name?user.name.split(" ")[0]:"Profile"}</span>
              </button>
              <button className="hide-desktop" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, color:"#9CA3AF", fontSize:18, cursor:"pointer", padding:"6px 9px", marginLeft:4 }}>☰</button>
            </div>
          </div>
        </div>

        {/* Mobile search row */}
        {searchOpen && (
          <div className="hide-desktop" style={{ background:"rgba(11,15,25,0.98)", borderTop:"1px solid rgba(37,99,235,0.1)", padding:"10px 14px", animation:"slideDown 0.2s ease" }}>
            <MobileSearchBar onNavigate={navigate} onClose={() => setSearchOpen(false)} />
          </div>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div style={{ background:"#090E1C", borderTop:"1px solid rgba(37,99,235,0.1)", padding:"10px 14px 14px", animation:"slideDown 0.2s ease" }}>
            {NAV_LINKS.filter(([p])=>p!=="categories").map(([p,l]) => (
              <div key={p} onClick={() => navigate(p)}
                style={{ padding:"10px 11px", color:page===p?"#22D3EE":"#9CA3AF", fontWeight:page===p?600:400, fontSize:14, cursor:"pointer", borderRadius:7, transition:"background 0.12s" }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(37,99,235,0.07)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{l}</div>
            ))}
            <div style={{ borderTop:"1px solid #1F2937", paddingTop:10, marginTop:6, display:"flex", flexWrap:"wrap", gap:6 }}>
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => navigate("category",{cat:c.id})}
                  style={{ background:"#111827", border:`1px solid #1F2937`, color:"#9CA3AF", borderRadius:7, padding:"5px 10px", fontSize:11, cursor:"pointer" }}>
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ── PAGES ── */}
      <main style={{ minHeight:"calc(100vh - 64px)", width:"100%", maxWidth:"100%" }}>
        {page==="home"         && <HomePage products={ALL_PRODUCTS} onAddCart={addToCart} onWishlist={toggleWishlist} onCompare={toggleCompare} onView={p=>navigate("product",{product:p})} wishlist={wishlist} compareList={compareList} onCategoryClick={c=>navigate("category",{cat:c})} onDealsPage={()=>navigate("deals")} onNavigate={navigate} />}
        {page==="category"     && <CategoryPage category={activeCat} products={ALL_PRODUCTS} onAddCart={addToCart} onWishlist={toggleWishlist} onCompare={toggleCompare} onView={p=>navigate("product",{product:p})} wishlist={wishlist} compareList={compareList} />}
        {page==="product"      && selectedProduct?.name && <ProductDetailPage product={selectedProduct} onAddCart={addToCart} onWishlist={toggleWishlist} wishlisted={wishlist.some(w=>w.id===selectedProduct.id)} onBack={()=>navigate(prevPage||"home")} onCompare={toggleCompare} inCompare={compareList.some(c=>c.id===selectedProduct.id)} />}
        {page==="cart"         && <CartPage cart={cart} onUpdateQty={(id,qty)=>{ if(qty<1){setCart(p=>p.filter(i=>i.id!==id));}else{setCart(p=>p.map(i=>i.id===id?{...i,qty}:i));}}} onRemove={id=>setCart(p=>p.filter(i=>i.id!==id))} onCheckout={()=>navigate("checkout")} isLoggedIn={!!user} onLoginRequired={()=>navigate("profile")} />}
        {page==="checkout"     && <CheckoutPage cart={cart} onPlaceOrder={placeOrder} onBack={()=>navigate("cart")} />}
        {page==="order_success"&& selectedProduct?.address && <OrderSuccess order={selectedProduct} onHome={()=>navigate("home")} />}
        {page==="compare"      && <ComparePage compareList={compareList} onRemove={id=>setCompareList(p=>p.filter(c=>c.id!==id))} onAddCart={addToCart} />}
        {page==="deals"        && <DealsPage products={ALL_PRODUCTS} onAddCart={addToCart} onView={p=>navigate("product",{product:p})} />}
        {page==="brands"       && <BrandsPage products={ALL_PRODUCTS} onCategoryClick={c=>navigate("category",{cat:c})} />}
        {page==="contact"      && <ContactPage />}
        {page==="help"         && <HelpPage />}
        {page==="wishlist"     && <WishlistPage wishlist={wishlist} onRemove={toggleWishlist} onAddCart={addToCart} onView={p=>navigate("product",{product:p})} />}
        {page==="profile"      && <ProfilePage user={user} onSave={handleSaveProfile} orders={orders} />}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background:"#060A14", borderTop:"1px solid rgba(37,99,235,0.09)", padding:"52px 0 26px", width:"100%" }}>
        <div style={{ width:"100%", padding:"0 clamp(14px,3.5vw,56px)" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:44, marginBottom:44 }} className="grid-mobile-1">
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:14 }}>
                <div style={{ width:34, height:34, background:"linear-gradient(135deg,#2563EB,#2563EB)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 3px 10px rgba(37,99,235,0.35)" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:19 }}><span className="gradient-text">Electronic</span> <span style={{ color:"#F0F4FF" }}>Store</span></span>
              </div>
              <p style={{ fontSize:13, color:"#6B7280", lineHeight:1.75, maxWidth:300, marginBottom:20 }}>Karnataka's most trusted electronics destination. Premium quality, best prices, authorized dealership for all major brands.</p>
              <div style={{ display:"flex", gap:9 }}>
                {[["📸","Instagram"],["📘","Facebook"],["🐦","Twitter"],["▶️","YouTube"]].map(([icon,name]) => (
                  <div key={name} title={name} style={{ width:38, height:38, background:"rgba(37,99,235,0.07)", border:"1px solid rgba(37,99,235,0.15)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:15, transition:"all 0.22s" }}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(37,99,235,0.18)"; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.borderColor="rgba(37,99,235,0.4)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(37,99,235,0.07)"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.borderColor="rgba(37,99,235,0.15)";}}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:14, marginBottom:16, color:"#D0DFF0" }}>Contact Us</p>
              {[["📍","Sirsi, Uttara Kannada, Karnataka 581355"],["📞","111 1234 5555"],["✉️","electronicstore@gmail.com"],["🕐","Mon–Sat: 9AM – 7PM"]].map(([ic,val]) => (
                <div key={val} style={{ display:"flex", gap:9, marginBottom:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:13, marginTop:1 }}>{ic}</span>
                  <span style={{ fontSize:12, color:"#6B7280", lineHeight:1.5 }}>{val}</span>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:14, marginBottom:16, color:"#D0DFF0" }}>Quick Feedback</p>
              <p style={{ fontSize:12, color:"#6B7280", marginBottom:12, lineHeight:1.6 }}>Share your experience with us</p>
              <textarea style={{ background:"rgba(8,12,24,0.95)", border:"1.5px solid #1A2440", color:"#F0F4FF", padding:"9px 12px", borderRadius:9, fontSize:12, width:"100%", resize:"vertical", outline:"none", marginBottom:9, minHeight:72, fontFamily:"'Inter',sans-serif" }} placeholder="Your feedback…" />
              <button className="btn-primary" style={{ width:"100%", padding:10, fontSize:12 }}>Submit Feedback</button>
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(37,99,235,0.07)", paddingTop:22, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:9 }}>
            <p style={{ fontSize:11, color:"#3A5070" }}>© 2025 Electronic Store, Sirsi. All rights reserved.</p>
            <p style={{ fontSize:11, color:"#3A5070" }}>Made with ❤️ in Karnataka, India</p>
          </div>
        </div>
      </footer>

      {/* ── OVERLAYS ── */}
      {popup && <Popup msg={popup.msg} icon={popup.icon} onClose={() => setPopup(null)} />}

      {/* Chatbot toggle */}
      {page === "home" && (
        <button onClick={() => setChatOpen(!chatOpen)}
          style={{ position:"fixed", bottom:chatOpen?488:26, right:78, zIndex:1500, width:52, height:52, background:"linear-gradient(135deg,#2563EB,#8B5CF6)", border:"none", borderRadius:"50%", fontSize:20, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 24px rgba(37,99,235,0.5)", transition:"bottom 0.3s cubic-bezier(0.22,1,0.36,1)", cursor:"pointer", animation:"glowPulse 2.5s ease-in-out infinite" }}>
          {chatOpen ? "✕" : "🤖"}
        </button>
      )}
      {chatOpen && page==="home" && <Chatbot user={user} cart={cart} orders={orders} onClose={() => setChatOpen(false)} />}

      {/* Scroll to top */}
      {showScrollTop && (
        <button className="scrolltop" onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}>↑</button>
      )}
    </>
  );
}