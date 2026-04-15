import { useState, useEffect, useRef, useCallback } from "react";

const COLORS = {
  primary: "#E63946",
  gold: "#F4A300",
  dark: "#0A0A0A",
  darker: "#060606",
  cream: "#FAF7F2",
  cardBg: "#111111",
  cardBorder: "#222222",
  text: "#F0EDE8",
  muted: "#888888",
  white: "#FFFFFF",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #0A0A0A; color: #F0EDE8; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #111; }
  ::-webkit-scrollbar-thumb { background: #E63946; border-radius: 3px; }
  input, select, textarea { font-family: 'DM Sans', sans-serif; }
  button { cursor: pointer; font-family: 'DM Sans', sans-serif; }
  a { text-decoration: none; color: inherit; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes cartBounce {
    0% { transform: scale(1); }
    30% { transform: scale(1.3); }
    60% { transform: scale(0.9); }
    100% { transform: scale(1); }
  }
  @keyframes successPop {
    0% { transform: scale(0.5); opacity: 0; }
    70% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes ripple {
    0% { transform: scale(0); opacity: 0.6; }
    100% { transform: scale(4); opacity: 0; }
  }

  .page-enter { animation: fadeIn 0.3s ease forwards; }
  .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(230,57,70,0.2); }
  .btn-primary {
    background: linear-gradient(135deg, #E63946, #F4A300);
    background-size: 200% 200%;
    color: #fff; border: none; padding: 10px 22px; border-radius: 8px;
    font-weight: 600; font-size: 14px; transition: all 0.2s ease;
    position: relative; overflow: hidden;
  }
  .btn-primary:hover { background-position: right center; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(230,57,70,0.4); }
  .btn-secondary {
    background: transparent; color: #F0EDE8; border: 1px solid #333;
    padding: 10px 22px; border-radius: 8px; font-weight: 500; font-size: 14px;
    transition: all 0.2s ease;
  }
  .btn-secondary:hover { border-color: #E63946; color: #E63946; }
  .skeleton {
    background: linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 6px;
  }
  .nav-link {
    color: #aaa; font-size: 14px; font-weight: 500; padding: 6px 12px;
    border-radius: 6px; transition: all 0.2s ease; cursor: pointer;
  }
  .nav-link:hover, .nav-link.active { color: #F0EDE8; background: #1a1a1a; }
  .star-filled { color: #F4A300; }
  .star-empty { color: #333; }
  .badge {
    display: inline-block; padding: 3px 8px; border-radius: 4px;
    font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .badge-red { background: rgba(230,57,70,0.15); color: #E63946; }
  .badge-green { background: rgba(34,197,94,0.15); color: #22c55e; }
  .badge-gold { background: rgba(244,163,0,0.15); color: #F4A300; }
  .price-tag { font-family: 'Rajdhani', sans-serif; font-weight: 700; }
  .gradient-text {
    background: linear-gradient(135deg, #E63946, #F4A300);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .section-title {
    font-family: 'Rajdhani', sans-serif; font-size: 28px; font-weight: 700;
    letter-spacing: 1px; text-transform: uppercase;
  }
  .scrolltop {
    position: fixed; bottom: 24px; right: 24px; z-index: 999;
    width: 44px; height: 44px; background: linear-gradient(135deg,#E63946,#F4A300);
    border: none; border-radius: 50%; color: #fff; font-size: 20px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(230,57,70,0.4); transition: transform 0.2s ease;
  }
  .scrolltop:hover { transform: translateY(-3px); }
  .input-field {
    background: #1a1a1a; border: 1px solid #2a2a2a; color: #F0EDE8;
    padding: 10px 14px; border-radius: 8px; font-size: 14px; width: 100%;
    transition: border-color 0.2s ease; outline: none;
  }
  .input-field:focus { border-color: #E63946; }
  .input-field::placeholder { color: #555; }
  .card-product {
    background: #111; border: 1px solid #222; border-radius: 12px;
    overflow: hidden; transition: all 0.2s ease; position: relative;
  }
  .card-product:hover { border-color: #333; transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.5); }
  .overlay-login {
    position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 2000;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  .popup {
    position: fixed; top: 80px; right: 24px; z-index: 3000;
    background: #1a1a1a; border: 1px solid #333; border-radius: 12px;
    padding: 16px 22px; min-width: 240px;
    animation: slideDown 0.3s ease;
    display: flex; align-items: center; gap: 12px;
  }
  .chat-window {
    position: fixed; bottom: 80px; right: 24px; z-index: 1500;
    width: 340px; background: #111; border: 1px solid #222;
    border-radius: 16px; overflow: hidden;
    animation: slideDown 0.3s ease;
    box-shadow: 0 24px 64px rgba(0,0,0,0.6);
  }
  .chat-bubble-bot {
    background: #1a1a1a; border-radius: 14px 14px 14px 4px;
    padding: 10px 14px; max-width: 80%; font-size: 13px; color: #ddd;
  }
  .chat-bubble-user {
    background: linear-gradient(135deg,#E63946,#F4A300);
    border-radius: 14px 14px 4px 14px;
    padding: 10px 14px; max-width: 80%; font-size: 13px; color: #fff;
    margin-left: auto;
  }
  @media (max-width: 768px) {
    .hide-mobile { display: none !important; }
    .nav-categories { display: none; }
  }
  @media (max-width: 480px) {
    .chat-window { width: calc(100vw - 32px); right: 16px; }
  }
`;

// ─── DATA ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "mobiles", name: "Mobiles", icon: "📱", color: "#E63946" },
  { id: "laptops", name: "Laptops", icon: "💻", color: "#F4A300" },
  { id: "tablets", name: "Tablets", icon: "📟", color: "#7C3AED" },
  { id: "tvs", name: "Smart TVs", icon: "📺", color: "#0EA5E9" },
  { id: "accessories", name: "Accessories", icon: "🎧", color: "#10B981" },
  { id: "cameras", name: "Cameras", icon: "📷", color: "#F59E0B" },
  { id: "gaming", name: "Gaming", icon: "🎮", color: "#EF4444" },
  { id: "audio", name: "Audio", icon: "🔊", color: "#8B5CF6" },
];

const BRANDS = [
  { id: "apple", name: "Apple", logo: "🍎", country: "USA" },
  { id: "samsung", name: "Samsung", logo: "S", country: "South Korea" },
  { id: "oneplus", name: "OnePlus", logo: "1+", country: "China" },
  { id: "sony", name: "Sony", logo: "S.", country: "Japan" },
  { id: "lg", name: "LG", logo: "LG", country: "South Korea" },
  { id: "xiaomi", name: "Xiaomi", logo: "Mi", country: "China" },
  { id: "dell", name: "Dell", logo: "D", country: "USA" },
  { id: "hp", name: "HP", logo: "hp", country: "USA" },
  { id: "lenovo", name: "Lenovo", logo: "Lv", country: "China" },
  { id: "asus", name: "Asus", logo: "As", country: "Taiwan" },
  { id: "bose", name: "Bose", logo: "Bo", country: "USA" },
  { id: "jbl", name: "JBL", logo: "JBL", country: "USA" },
];

function makeProducts() {
  const items = [];
  const mobilesData = [
    { name: "iPhone 15 Pro Max", brand: "Apple", price: 134900, rating: 4.8, specs: { ram: "8GB", storage: "256GB", processor: "A17 Pro", display: '6.7" OLED', battery: "4422mAh" }, image: "https://images.unsplash.com/photo-1696426026186-f3cc60c4e458?w=400&q=80" },
    { name: "iPhone 15", brand: "Apple", price: 79900, rating: 4.6, specs: { ram: "6GB", storage: "128GB", processor: "A16 Bionic", display: '6.1" OLED', battery: "3279mAh" }, image: "https://images.unsplash.com/photo-1695048132697-4af48b42fc58?w=400&q=80" },
    { name: "Samsung Galaxy S24 Ultra", brand: "Samsung", price: 129999, rating: 4.7, specs: { ram: "12GB", storage: "256GB", processor: "Snapdragon 8 Gen 3", display: '6.8" QHD+ AMOLED', battery: "5000mAh" }, image: "https://images.unsplash.com/photo-1706187896011-ee1a4a24b2e7?w=400&q=80" },
    { name: "Samsung Galaxy S24+", brand: "Samsung", price: 99999, rating: 4.6, specs: { ram: "12GB", storage: "256GB", processor: "Snapdragon 8 Gen 3", display: '6.7" Dynamic AMOLED', battery: "4900mAh" }, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80" },
    { name: "OnePlus 12", brand: "OnePlus", price: 64999, rating: 4.5, specs: { ram: "12GB", storage: "256GB", processor: "Snapdragon 8 Gen 3", display: '6.82" LTPO AMOLED', battery: "5400mAh" }, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80" },
    { name: "Xiaomi 14 Ultra", brand: "Xiaomi", price: 89999, rating: 4.5, specs: { ram: "16GB", storage: "512GB", processor: "Snapdragon 8 Gen 3", display: '6.73" LTPO AMOLED', battery: "5000mAh" }, image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&q=80" },
    { name: "Google Pixel 8 Pro", brand: "Google", price: 106999, rating: 4.7, specs: { ram: "12GB", storage: "128GB", processor: "Google Tensor G3", display: '6.7" OLED', battery: "5050mAh" }, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80" },
    { name: "OnePlus 11R", brand: "OnePlus", price: 39999, rating: 4.4, specs: { ram: "8GB", storage: "128GB", processor: "Snapdragon 8+ Gen 1", display: '6.74" AMOLED', battery: "5000mAh" }, image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80" },
    { name: "Samsung Galaxy A55", brand: "Samsung", price: 34999, rating: 4.3, specs: { ram: "8GB", storage: "128GB", processor: "Exynos 1480", display: '6.6" Super AMOLED', battery: "5000mAh" }, image: "https://images.unsplash.com/photo-1555744896-0ad01f7e9bce?w=400&q=80" },
    { name: "Xiaomi Redmi Note 13 Pro+", brand: "Xiaomi", price: 31999, rating: 4.4, specs: { ram: "8GB", storage: "256GB", processor: "Dimensity 7200 Ultra", display: '6.67" AMOLED', battery: "5000mAh" }, image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&q=80" },
  ];
  mobilesData.forEach((p, i) => {
    items.push({ id: `mob_${i}`, ...p, category: "mobiles", stock: Math.floor(Math.random() * 50) + 1, reviews: Math.floor(Math.random() * 1000) + 100, discount: Math.floor(Math.random() * 20) + 5 });
  });

  const laptopsData = [
    { name: 'MacBook Pro 16" M3 Max', brand: "Apple", price: 349900, rating: 4.9, specs: { ram: "36GB", storage: "1TB SSD", processor: "Apple M3 Max", display: '16.2" Liquid Retina XDR', battery: "22hr" }, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80" },
    { name: 'MacBook Air 15" M3', brand: "Apple", price: 134900, rating: 4.8, specs: { ram: "8GB", storage: "256GB SSD", processor: "Apple M3", display: '15.3" Liquid Retina', battery: "18hr" }, image: "https://images.unsplash.com/photo-1611186871525-12af756c19f7?w=400&q=80" },
    { name: "Dell XPS 15", brand: "Dell", price: 169900, rating: 4.7, specs: { ram: "32GB", storage: "1TB SSD", processor: "Intel Core i9-13900H", display: '15.6" OLED 3.5K', battery: "13hr" }, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80" },
    { name: "HP Spectre x360 14", brand: "HP", price: 154900, rating: 4.6, specs: { ram: "16GB", storage: "512GB SSD", processor: "Intel Core i7-1355U", display: '14" 2.8K OLED Touch', battery: "17hr" }, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80" },
    { name: "Lenovo ThinkPad X1 Carbon", brand: "Lenovo", price: 144900, rating: 4.7, specs: { ram: "16GB", storage: "512GB SSD", processor: "Intel Core i7-1365U", display: '14" IPS 2.8K', battery: "15hr" }, image: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=400&q=80" },
    { name: "Asus ROG Strix G16", brand: "Asus", price: 139900, rating: 4.5, specs: { ram: "16GB DDR5", storage: "1TB SSD", processor: "Intel Core i9-13980HX", display: '16" 240Hz QHD', battery: "9hr" }, image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&q=80" },
    { name: "Samsung Galaxy Book4 Pro", brand: "Samsung", price: 124990, rating: 4.5, specs: { ram: "16GB", storage: "512GB SSD", processor: "Intel Core Ultra 7", display: '14" Dynamic AMOLED 2X', battery: "22hr" }, image: "https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=400&q=80" },
    { name: "Dell Inspiron 15 3000", brand: "Dell", price: 54990, rating: 4.2, specs: { ram: "8GB", storage: "512GB SSD", processor: "Intel Core i5-1235U", display: '15.6" FHD Anti-Glare', battery: "7hr" }, image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&q=80" },
    { name: "HP Pavilion 15", brand: "HP", price: 62990, rating: 4.3, specs: { ram: "8GB", storage: "512GB SSD", processor: "AMD Ryzen 5 7530U", display: '15.6" FHD IPS', battery: "8hr" }, image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&q=80" },
    { name: "Lenovo IdeaPad Slim 5", brand: "Lenovo", price: 58990, rating: 4.3, specs: { ram: "16GB", storage: "512GB SSD", processor: "AMD Ryzen 7 7730U", display: '14" 2.8K OLED', battery: "12hr" }, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80" },
  ];
  laptopsData.forEach((p, i) => {
    items.push({ id: `lap_${i}`, ...p, category: "laptops", stock: Math.floor(Math.random() * 30) + 1, reviews: Math.floor(Math.random() * 800) + 50, discount: Math.floor(Math.random() * 15) + 3 });
  });

  const tvData = [
    { name: 'Samsung 65" Neo QLED 8K', brand: "Samsung", price: 299900, rating: 4.8, specs: { resolution: "8K (7680×4320)", panel: "Mini LED QLED", refresh: "120Hz", smart: "Tizen OS", hdr: "HDR10+" }, image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&q=80" },
    { name: 'LG 55" OLED C3', brand: "LG", price: 139900, rating: 4.9, specs: { resolution: "4K (3840×2160)", panel: "OLED evo", refresh: "120Hz", smart: "webOS 23", hdr: "Dolby Vision IQ" }, image: "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&q=80" },
    { name: 'Sony 65" Bravia XR A95L', brand: "Sony", price: 319900, rating: 4.8, specs: { resolution: "4K", panel: "QD-OLED", refresh: "120Hz", smart: "Google TV", hdr: "Dolby Vision" }, image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400&q=80" },
    { name: 'Samsung 43" Crystal UHD', brand: "Samsung", price: 38990, rating: 4.3, specs: { resolution: "4K", panel: "Crystal UHD", refresh: "60Hz", smart: "Tizen", hdr: "HDR10+" }, image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&q=80" },
    { name: 'OnePlus 55" Q2 Pro', brand: "OnePlus", price: 64999, rating: 4.4, specs: { resolution: "4K", panel: "QLED", refresh: "144Hz", smart: "OxygenOS", hdr: "Dolby Vision" }, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
    { name: 'Xiaomi 50" X Series', brand: "Xiaomi", price: 42999, rating: 4.3, specs: { resolution: "4K", panel: "IPS LCD", refresh: "60Hz", smart: "Android TV 11", hdr: "Dolby Vision" }, image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&q=80" },
  ];
  tvData.forEach((p, i) => {
    items.push({ id: `tv_${i}`, ...p, category: "tvs", stock: Math.floor(Math.random() * 20) + 1, reviews: Math.floor(Math.random() * 500) + 30, discount: Math.floor(Math.random() * 25) + 5 });
  });

  const accessoriesData = [
    { name: "Sony WH-1000XM5", brand: "Sony", price: 29990, rating: 4.9, specs: { type: "Over-ear", connectivity: "Bluetooth 5.2", anc: "Yes", battery: "30hr", driver: "30mm" }, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" },
    { name: "Apple AirPods Pro 2nd Gen", brand: "Apple", price: 24900, rating: 4.8, specs: { type: "In-ear", connectivity: "Bluetooth 5.3", anc: "Adaptive ANC", battery: "6hr+30hr", driver: "Custom" }, image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80" },
    { name: "Samsung Galaxy Buds3 Pro", brand: "Samsung", price: 17999, rating: 4.6, specs: { type: "In-ear", connectivity: "Bluetooth 5.4", anc: "Intelligent ANC", battery: "6hr+24hr", driver: "10.5mm" }, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80" },
    { name: "Logitech MX Master 3S", brand: "Logitech", price: 9995, rating: 4.8, specs: { type: "Mouse", connectivity: "USB-C+Bluetooth", dpi: "8000", battery: "70 days", buttons: "7" }, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80" },
    { name: "Apple Magic Keyboard", brand: "Apple", price: 11900, rating: 4.7, specs: { type: "Keyboard", connectivity: "Bluetooth", layout: "Full-size", battery: "1 month", backlit: "No" }, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80" },
    { name: "Samsung 27\" Odyssey G7", brand: "Samsung", price: 49999, rating: 4.7, specs: { type: "Monitor", resolution: "QHD 1440p", refresh: "240Hz", panel: "Curved VA", hdr: "HDR600" }, image: "https://images.unsplash.com/photo-1547119957-637f8679db1e?w=400&q=80" },
    { name: "Anker 100W GaN Charger", brand: "Anker", price: 3999, rating: 4.6, specs: { type: "Charger", ports: "3 USB-C + 1 USB-A", wattage: "100W", technology: "GaN", size: "Compact" }, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80" },
    { name: "Seagate 4TB Portable HDD", brand: "Seagate", price: 8999, rating: 4.4, specs: { type: "Storage", capacity: "4TB", interface: "USB 3.0", speed: "120MB/s", size: "2.5\"" }, image: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400&q=80" },
  ];
  accessoriesData.forEach((p, i) => {
    items.push({ id: `acc_${i}`, ...p, category: "accessories", stock: Math.floor(Math.random() * 100) + 5, reviews: Math.floor(Math.random() * 1200) + 200, discount: Math.floor(Math.random() * 30) + 5 });
  });

  const camerasData = [
    { name: "Sony Alpha A7 IV", brand: "Sony", price: 219990, rating: 4.9, specs: { sensor: "33MP Full Frame", video: "4K 60fps", iso: "100-51200", stabilization: "5-axis IBIS", weight: "657g" }, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80" },
    { name: "Canon EOS R6 Mark II", brand: "Canon", price: 214990, rating: 4.8, specs: { sensor: "24.2MP Full Frame", video: "4K 60fps", iso: "100-102400", stabilization: "8-stop IBIS", weight: "670g" }, image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80" },
    { name: "Nikon Z8", brand: "Nikon", price: 349990, rating: 4.9, specs: { sensor: "45.7MP Full Frame", video: "8K 60fps", iso: "64-25600", stabilization: "6-stop VR", weight: "820g" }, image: "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=400&q=80" },
    { name: "GoPro HERO12 Black", brand: "GoPro", price: 44990, rating: 4.7, specs: { sensor: "27MP", video: "5.3K 60fps", waterproof: "10m", stabilization: "HyperSmooth 6.0", battery: "155min" }, image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80" },
    { name: "DJI Osmo Pocket 3", brand: "DJI", price: 59990, rating: 4.8, specs: { sensor: "1-inch CMOS", video: "4K 120fps", stabilization: "3-axis Gimbal", display: '2" Touchscreen', battery: "166min" }, image: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=400&q=80" },
  ];
  camerasData.forEach((p, i) => {
    items.push({ id: `cam_${i}`, ...p, category: "cameras", stock: Math.floor(Math.random() * 15) + 1, reviews: Math.floor(Math.random() * 400) + 30, discount: Math.floor(Math.random() * 12) + 3 });
  });

  const gamingData = [
    { name: "PlayStation 5 Slim", brand: "Sony", price: 54990, rating: 4.9, specs: { processor: "AMD Zen 2 8-core", gpu: "AMD RDNA 2 10.3TF", storage: "1TB SSD", resolution: "8K capable", fps: "120fps" }, image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&q=80" },
    { name: "Xbox Series X", brand: "Microsoft", price: 54990, rating: 4.8, specs: { processor: "AMD Zen 2 8-core", gpu: "AMD RDNA 2 12TF", storage: "1TB NVMe SSD", resolution: "4K native", fps: "120fps" }, image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&q=80" },
    { name: "Nintendo Switch OLED", brand: "Nintendo", price: 34999, rating: 4.7, specs: { display: '7" OLED', processor: "Nvidia Tegra X1+", storage: "64GB", battery: "9hr", modes: "3-in-1" }, image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&q=80" },
    { name: "Razer DeathAdder V3 HyperSpeed", brand: "Razer", price: 8499, rating: 4.8, specs: { type: "Gaming Mouse", dpi: "30000", sensor: "Focus Pro 30K", battery: "285hr", weight: "77g" }, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
    { name: "SteelSeries Arctis Nova Pro", brand: "SteelSeries", price: 29999, rating: 4.7, specs: { type: "Gaming Headset", connectivity: "USB + 2.4GHz", anc: "Active Noise Cancellation", battery: "22hr", surround: "360° Audio" }, image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&q=80" },
    { name: "Asus ROG Swift 27\" OLED", brand: "Asus", price: 89999, rating: 4.9, specs: { type: "Gaming Monitor", resolution: "2560×1440", refresh: "360Hz", panel: "OLED", response: "0.03ms" }, image: "https://images.unsplash.com/photo-1547119957-637f8679db1e?w=400&q=80" },
  ];
  gamingData.forEach((p, i) => {
    items.push({ id: `gam_${i}`, ...p, category: "gaming", stock: Math.floor(Math.random() * 25) + 1, reviews: Math.floor(Math.random() * 900) + 100, discount: Math.floor(Math.random() * 18) + 5 });
  });

  const audioData = [
    { name: "Bose QuietComfort Ultra", brand: "Bose", price: 32490, rating: 4.9, specs: { type: "Over-ear", anc: "CustomTune", battery: "24hr", connectivity: "Bluetooth 5.3", audio: "Spatial" }, image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&q=80" },
    { name: "JBL PartyBox 310", brand: "JBL", price: 29990, rating: 4.7, specs: { type: "Party Speaker", power: "240W", battery: "18hr", connectivity: "BT 5.1 + USB", features: "LED Light Show" }, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80" },
    { name: "Sonos Era 300", brand: "Sonos", price: 39999, rating: 4.8, specs: { type: "Smart Speaker", channels: "4.1.2", connectivity: "WiFi 6 + BT", audio: "Spatial / Dolby Atmos", voice: "Amazon / Google" }, image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&q=80" },
    { name: "Apple HomePod 2nd Gen", brand: "Apple", price: 32900, rating: 4.6, specs: { type: "Smart Speaker", chip: "S9", connectivity: "WiFi 6 + BT 5.0", audio: "Spatial + Atmos", voice: "Siri" }, image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&q=80" },
    { name: "Marshall Emberton III", brand: "Marshall", price: 14999, rating: 4.7, specs: { type: "Portable Speaker", power: "20W", battery: "30hr", waterproof: "IP67", connectivity: "BT 5.3" }, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80" },
    { name: "Sennheiser HD 660S2", brand: "Sennheiser", price: 39990, rating: 4.9, specs: { type: "Audiophile Headphones", impedance: "150Ω", driver: "40mm", frequency: "8-41500Hz", connectivity: "3.5mm / 6.3mm" }, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80" },
  ];
  audioData.forEach((p, i) => {
    items.push({ id: `aud_${i}`, ...p, category: "audio", stock: Math.floor(Math.random() * 40) + 2, reviews: Math.floor(Math.random() * 600) + 80, discount: Math.floor(Math.random() * 22) + 5 });
  });

  return items;
}

const ALL_PRODUCTS = makeProducts();

const DEALS = ALL_PRODUCTS.slice(0, 5).map((p, i) => ({
  ...p,
  dealPrice: Math.round(p.price * (1 - p.discount / 100)),
  endTime: Date.now() + (i + 1) * 3600000 * 6,
}));

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Stars({ rating }) {
  return (
    <span style={{ fontSize: 13 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? "star-filled" : "star-empty"}>★</span>
      ))}
    </span>
  );
}

function formatPrice(p) {
  return "₹" + p.toLocaleString("en-IN");
}

function CountdownTimer({ endTime }) {
  const [time, setTime] = useState({});
  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, endTime - Date.now());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [endTime]);

  const block = (v, l) => (
    <span style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, padding: "4px 8px", minWidth: 36, display: "inline-block", textAlign: "center", fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 16 }}>
      {String(v).padStart(2, "0")} <span style={{ display: "block", fontSize: 9, color: "#888", fontFamily: "'DM Sans',sans-serif", fontWeight: 400 }}>{l}</span>
    </span>
  );

  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {block(time.h, "HRS")}
      <span style={{ color: "#E63946", fontWeight: 700 }}>:</span>
      {block(time.m, "MIN")}
      <span style={{ color: "#E63946", fontWeight: 700 }}>:</span>
      {block(time.s, "SEC")}
    </div>
  );
}

function Popup({ msg, icon, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="popup">
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ fontSize: 14, fontWeight: 500 }}>{msg}</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, overflow: "hidden", padding: 0 }}>
      <div className="skeleton" style={{ height: 200 }} />
      <div style={{ padding: 14 }}>
        <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 12, width: "60%", marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 20, width: "40%" }} />
      </div>
    </div>
  );
}

function ProductCard({ product, onAddCart, onWishlist, onCompare, onView, wishlisted, inCompare }) {
  const [adding, setAdding] = useState(false);
  const discountedPrice = Math.round(product.price * (1 - product.discount / 100));

  const handleAdd = (e) => {
    e.stopPropagation();
    setAdding(true);
    onAddCart(product);
    setTimeout(() => setAdding(false), 600);
  };

  return (
    <div className="card-product" onClick={() => onView(product)} style={{ cursor: "pointer" }}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{ width: "100%", height: 200, objectFit: "cover", display: "block", transition: "transform 0.3s ease" }}
          onError={(e) => { e.target.src = `https://via.placeholder.com/400x300/111/333?text=${encodeURIComponent(product.name)}`; }}
          onMouseEnter={(e) => { e.target.style.transform = "scale(1.05)"; }}
          onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; }}
        />
        <span className="badge badge-red" style={{ position: "absolute", top: 10, left: 10 }}>-{product.discount}%</span>
        <button
          onClick={(e) => { e.stopPropagation(); onWishlist(product); }}
          style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 32, height: 32, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.15)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>
        {product.stock < 5 && (
          <span className="badge badge-red" style={{ position: "absolute", bottom: 10, right: 10 }}>Low Stock</span>
        )}
      </div>
      <div style={{ padding: "14px 14px 16px" }}>
        <p style={{ fontSize: 11, color: "#888", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{product.brand}</p>
        <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, color: "#F0EDE8", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.name}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <Stars rating={product.rating} />
          <span style={{ fontSize: 12, color: "#888" }}>{product.rating} ({product.reviews})</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
          <span className="price-tag" style={{ fontSize: 20, color: "#F0EDE8" }}>{formatPrice(discountedPrice)}</span>
          <span style={{ fontSize: 13, color: "#555", textDecoration: "line-through" }}>{formatPrice(product.price)}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn-primary"
            style={{ flex: 1, fontSize: 13, padding: "8px 12px", animation: adding ? "cartBounce 0.5s ease" : "none" }}
            onClick={handleAdd}
          >
            {adding ? "✓ Added" : "Add to Cart"}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onCompare(product); }}
            style={{ background: inCompare ? "rgba(244,163,0,0.15)" : "#1a1a1a", border: `1px solid ${inCompare ? "#F4A300" : "#2a2a2a"}`, color: inCompare ? "#F4A300" : "#888", borderRadius: 8, padding: "8px 10px", fontSize: 12, transition: "all 0.2s" }}
          >
            ⊞
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CHATBOT ─────────────────────────────────────────────────────────────────

function Chatbot({ user, cart, orders, onClose }) {
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "Hi! I'm your Electronic Store assistant. How can I help you today? 👋" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const reply = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.includes("name") || lower.includes("who am i")) {
      return user ? `You are logged in as ${user.name} 😊` : "Please login to see your profile details.";
    }
    if (lower.includes("mobile") || lower.includes("number") || lower.includes("phone")) {
      return user ? `Your registered mobile number is ${user.mobile}.` : "Please login first to access account details.";
    }
    if (lower.includes("order")) {
      return orders.length > 0 ? `You have ${orders.length} order(s). Most recent: ${orders[orders.length - 1].items[0]?.name || "N/A"}.` : "You haven't placed any orders yet.";
    }
    if (lower.includes("cart")) {
      return cart.length > 0 ? `You have ${cart.length} item(s) in your cart worth ${formatPrice(cart.reduce((s, i) => s + i.price * i.qty, 0))}.` : "Your cart is empty.";
    }
    if (lower.includes("payment") || lower.includes("pay")) {
      return "We accept UPI and Cash on Delivery (COD). Simply choose your preferred method at checkout!";
    }
    if (lower.includes("return") || lower.includes("refund")) {
      return "We offer 7-day easy returns! Contact our support team for a hassle-free refund process.";
    }
    if (lower.includes("delivery") || lower.includes("shipping")) {
      return "We deliver across India! Standard delivery: 3-5 days. Express delivery: 1-2 days.";
    }
    if (lower.includes("contact") || lower.includes("address")) {
      return "📍 Electronic Store, Sirsi, Uttara Kannada, Karnataka - 581355\n📞 111 1234 5555\n📧 electronicstore@gmail.com";
    }
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      return "Hello! How can I assist you today? Ask me about orders, products, payments, or anything else!";
    }
    return "Connecting to support… Please hold while a human agent joins. For immediate help, call 111 1234 5555.";
  };

  const send = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setMsgs((prev) => [...prev, { from: "user", text }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((prev) => [...prev, { from: "bot", text: reply(text) }]);
    }, 1000);
  };

  return (
    <div className="chat-window">
      <div style={{ background: "linear-gradient(135deg,#E63946,#c8102e)", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14 }}>AI Assistant</p>
            <p style={{ fontSize: 11, opacity: 0.8, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, background: "#4ade80", borderRadius: "50%", display: "inline-block" }} />Online
            </p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: 20, lineHeight: 1 }}>×</button>
      </div>
      <div style={{ height: 300, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
            <div className={m.from === "bot" ? "chat-bubble-bot" : "chat-bubble-user"}>{m.text}</div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex" }}>
            <div className="chat-bubble-bot" style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: 8, height: 8, background: "#555", borderRadius: "50%", animation: "pulse 1s infinite", animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "12px 16px", borderTop: "1px solid #1a1a1a", display: "flex", gap: 8 }}>
        <input
          className="input-field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask anything…"
          style={{ flex: 1 }}
        />
        <button className="btn-primary" onClick={send} style={{ padding: "8px 14px" }}>➤</button>
      </div>
    </div>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────

function LoginPage({ onLogin, onClose }) {
  const [form, setForm] = useState({ mobile: "", password: "", name: "" });
  const [mode, setMode] = useState("login");
  const [err, setErr] = useState("");

  const handle = () => {
    if (!form.mobile || form.mobile.length < 10) { setErr("Enter valid 10-digit mobile number"); return; }
    if (!form.password || form.password.length < 4) { setErr("Password must be at least 4 characters"); return; }
    if (mode === "register" && !form.name) { setErr("Enter your name"); return; }
    onLogin({ mobile: form.mobile, name: mode === "register" ? form.name : "User_" + form.mobile.slice(-4), password: form.password });
  };

  return (
    <div className="overlay-login" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#111", border: "1px solid #222", borderRadius: 16, padding: 32, width: "100%", maxWidth: 400, animation: "successPop 0.3s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>⚡</div>
          <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 26, fontWeight: 700 }}>
            <span className="gradient-text">Electronic Store</span>
          </h2>
          <p style={{ color: "#888", fontSize: 14, marginTop: 4 }}>{mode === "login" ? "Welcome back!" : "Create your account"}</p>
        </div>
        <div style={{ display: "flex", background: "#1a1a1a", borderRadius: 8, padding: 4, marginBottom: 24 }}>
          {["login", "register"].map((m) => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "8px", background: mode === m ? "linear-gradient(135deg,#E63946,#F4A300)" : "transparent", border: "none", color: mode === m ? "#fff" : "#888", borderRadius: 6, fontWeight: 600, fontSize: 14, textTransform: "capitalize", transition: "all 0.2s" }}>{m}</button>
          ))}
        </div>
        {mode === "register" && (
          <input className="input-field" placeholder="Your name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={{ marginBottom: 12 }} />
        )}
        <input className="input-field" placeholder="Mobile number" type="tel" maxLength={10} value={form.mobile} onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))} style={{ marginBottom: 12 }} />
        <input className="input-field" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} style={{ marginBottom: 8 }} onKeyDown={(e) => e.key === "Enter" && handle()} />
        {err && <p style={{ color: "#E63946", fontSize: 13, marginBottom: 8 }}>{err}</p>}
        <button className="btn-primary" style={{ width: "100%", marginTop: 8, padding: 12 }} onClick={handle}>
          {mode === "login" ? "Login" : "Create Account"}
        </button>
        <p style={{ textAlign: "center", color: "#555", fontSize: 12, marginTop: 16 }}>By continuing, you agree to our Terms & Privacy Policy</p>
      </div>
    </div>
  );
}

function HomePage({ products, onAddCart, onWishlist, onCompare, onView, wishlist, compareList, onCategoryClick, onDealsPage }) {
  const [loading, setLoading] = useState(true);
  const topSelling = products.slice(0, 5);
  const flashDeals = DEALS;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const heroRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    setHeroVisible(true);
  }, []);

  return (
    <div className="page-enter">
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#0d0d0d 0%,#1a0a0a 50%,#0d0d0d 100%)", padding: "80px 24px 64px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(230,57,70,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(244,163,0,0.06) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, background: "radial-gradient(circle, rgba(230,57,70,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <p ref={heroRef} style={{ fontSize: 13, fontWeight: 600, letterSpacing: 4, color: "#E63946", textTransform: "uppercase", marginBottom: 16, opacity: heroVisible ? 1 : 0, transition: "opacity 0.6s ease 0.1s" }}>⚡ Karnataka's #1 Electronics Destination</p>
        <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(36px,7vw,80px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 20, opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(30px)", transition: "all 0.7s ease 0.2s" }}>
          <span className="gradient-text">Power Up</span>{" "}
          <span style={{ color: "#F0EDE8" }}>Your World</span>
        </h1>
        <p style={{ fontSize: 16, color: "#888", maxWidth: 480, margin: "0 auto 32px", opacity: heroVisible ? 1 : 0, transition: "opacity 0.7s ease 0.4s" }}>Premium electronics, unbeatable prices. From smartphones to smart TVs — everything tech, all in one place.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", opacity: heroVisible ? 1 : 0, transition: "opacity 0.7s ease 0.5s" }}>
          <button className="btn-primary" style={{ padding: "13px 28px", fontSize: 15 }} onClick={() => onCategoryClick("mobiles")}>Shop Now →</button>
          <button className="btn-secondary" style={{ padding: "13px 28px", fontSize: 15 }} onClick={onDealsPage}>View Deals</button>
        </div>
        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}>
          {[["10K+", "Products"], ["50K+", "Happy Customers"], ["5★", "Rating"], ["Free", "Delivery"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <p className="price-tag" style={{ fontSize: 22, fontWeight: 700 }}>{v}</p>
              <p style={{ fontSize: 12, color: "#888" }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: "48px 24px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 className="section-title" style={{ marginBottom: 8 }}>Shop by <span className="gradient-text">Category</span></h2>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 28 }}>Browse our wide range of electronics</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 12 }}>
          {CATEGORIES.map((c) => (
            <div key={c.id} onClick={() => onCategoryClick(c.id)} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: "20px 12px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${c.color}22`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1a1a1a"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ fontSize: 28, marginBottom: 8, animation: "float 3s ease-in-out infinite", animationDelay: `${CATEGORIES.indexOf(c) * 0.3}s` }}>{c.icon}</div>
              <p style={{ fontSize: 12, fontWeight: 500, color: "#ccc" }}>{c.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Flash Deals */}
      <div style={{ padding: "0 24px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
          <div>
            <h2 className="section-title"><span style={{ color: "#E63946" }}>⚡ Flash</span> Deals</h2>
            <p style={{ fontSize: 13, color: "#888" }}>Limited time — grab them fast!</p>
          </div>
          <button className="btn-secondary" onClick={onDealsPage} style={{ marginLeft: "auto" }}>See All Deals →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
          {loading ? [0, 1, 2, 3, 4].map((i) => <SkeletonCard key={i} />) : flashDeals.map((p) => (
            <div key={p.id} className="card-product" onClick={() => onView(p)} style={{ cursor: "pointer" }}>
              <div style={{ position: "relative" }}>
                <img src={p.image} alt={p.name} loading="lazy" style={{ width: "100%", height: 180, objectFit: "cover" }} onError={(e) => { e.target.src = `https://via.placeholder.com/400x300/111/333?text=${encodeURIComponent(p.name)}`; }} />
                <div style={{ position: "absolute", top: 10, left: 10, background: "linear-gradient(135deg,#E63946,#F4A300)", color: "#fff", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 700 }}>DEAL -{p.discount}%</div>
              </div>
              <div style={{ padding: "12px 14px 14px" }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: "#F0EDE8", marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
                  <span className="price-tag" style={{ fontSize: 18, color: "#E63946" }}>{formatPrice(p.dealPrice)}</span>
                  <span style={{ fontSize: 12, color: "#555", textDecoration: "line-through" }}>{formatPrice(p.price)}</span>
                </div>
                <CountdownTimer endTime={p.endTime} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Selling */}
      <div style={{ padding: "0 24px 64px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 className="section-title" style={{ marginBottom: 4 }}>Top <span className="gradient-text">Selling</span></h2>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 28 }}>Most popular picks this week</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 16 }}>
          {loading ? [0, 1, 2, 3, 4].map((i) => <SkeletonCard key={i} />) : topSelling.map((p) => (
            <ProductCard key={p.id} product={p} onAddCart={onAddCart} onWishlist={onWishlist} onCompare={onCompare} onView={onView} wishlisted={wishlist.some((w) => w.id === p.id)} inCompare={compareList.some((c) => c.id === p.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryPage({ category, products, onAddCart, onWishlist, onCompare, onView, wishlist, compareList }) {
  const [filters, setFilters] = useState({ brand: "", minPrice: 0, maxPrice: 1000000, sort: "default", search: "" });
  const [showFilters, setShowFilters] = useState(false);
  const catProducts = products.filter((p) => p.category === category);
  const brands = [...new Set(catProducts.map((p) => p.brand))];

  const filtered = catProducts
    .filter((p) => (!filters.brand || p.brand === filters.brand) && p.price >= filters.minPrice && p.price <= filters.maxPrice && (!filters.search || p.name.toLowerCase().includes(filters.search.toLowerCase())))
    .sort((a, b) => {
      if (filters.sort === "price_asc") return a.price - b.price;
      if (filters.sort === "price_desc") return b.price - a.price;
      if (filters.sort === "rating") return b.rating - a.rating;
      return 0;
    });

  const catInfo = CATEGORIES.find((c) => c.id === category);

  return (
    <div className="page-enter" style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 className="section-title" style={{ fontSize: 32 }}>{catInfo?.icon} <span className="gradient-text">{catInfo?.name || category}</span></h1>
        <p style={{ color: "#888", fontSize: 14 }}>{filtered.length} products found</p>
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <input className="input-field" placeholder="🔍 Search products…" value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} style={{ flex: "1 1 200px", maxWidth: 300 }} />
        <select className="input-field" value={filters.brand} onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value }))} style={{ width: "auto" }}>
          <option value="">All Brands</option>
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select className="input-field" value={filters.sort} onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))} style={{ width: "auto" }}>
          <option value="default">Sort: Default</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
        </select>
        <button className="btn-secondary" onClick={() => setShowFilters(!showFilters)} style={{ whiteSpace: "nowrap" }}>⚙ Filters</button>
      </div>
      {showFilters && (
        <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: 20, marginBottom: 24, animation: "slideDown 0.2s ease" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Price Range</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <input type="number" className="input-field" placeholder="Min price" value={filters.minPrice || ""} onChange={(e) => setFilters((f) => ({ ...f, minPrice: +e.target.value || 0 }))} style={{ width: 140 }} />
            <input type="number" className="input-field" placeholder="Max price" value={filters.maxPrice === 1000000 ? "" : filters.maxPrice} onChange={(e) => setFilters((f) => ({ ...f, maxPrice: +e.target.value || 1000000 }))} style={{ width: 140 }} />
          </div>
        </div>
      )}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
          <p style={{ color: "#888" }}>No products found. Try adjusting filters.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 16 }}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onAddCart={onAddCart} onWishlist={onWishlist} onCompare={onCompare} onView={onView} wishlisted={wishlist.some((w) => w.id === p.id)} inCompare={compareList.some((c) => c.id === p.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductDetailPage({ product, onAddCart, onWishlist, wishlisted, onBack, onCompare, inCompare }) {
  const [qty, setQty] = useState(1);
  const discountedPrice = Math.round(product.price * (1 - product.discount / 100));

  return (
    <div className="page-enter" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#888", fontSize: 14, cursor: "pointer", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>← Back</button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        <div>
          <div style={{ background: "#111", borderRadius: 16, overflow: "hidden", border: "1px solid #222" }}>
            <img src={product.image} alt={product.name} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} onError={(e) => { e.target.src = `https://via.placeholder.com/600x450/111/333?text=${encodeURIComponent(product.name)}`; }} />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ flex: 1, background: "#111", border: "1px solid #222", borderRadius: 8, overflow: "hidden", opacity: 0.6, cursor: "pointer" }}>
                <img src={product.image} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} onError={(e) => { e.target.src = `https://via.placeholder.com/200x200/111/333?text=IMG`; }} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 12, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{product.brand} • {CATEGORIES.find((c) => c.id === product.category)?.name}</p>
          <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 28, fontWeight: 700, lineHeight: 1.2, marginBottom: 12 }}>{product.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Stars rating={product.rating} />
            <span style={{ fontSize: 14, color: "#888" }}>{product.rating} ({product.reviews} reviews)</span>
          </div>
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <span className="badge badge-red" style={{ marginBottom: 12, display: "inline-block" }}>-{product.discount}% OFF</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span className="price-tag gradient-text" style={{ fontSize: 36 }}>{formatPrice(discountedPrice)}</span>
              <span style={{ fontSize: 16, color: "#555", textDecoration: "line-through" }}>{formatPrice(product.price)}</span>
            </div>
            <p style={{ fontSize: 13, color: "#22c55e", marginTop: 6 }}>You save {formatPrice(product.price - discountedPrice)}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <p style={{ fontSize: 14, color: "#888" }}>Qty:</p>
            <div style={{ display: "flex", alignItems: "center", gap: 0, background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, overflow: "hidden" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: "none", border: "none", color: "#F0EDE8", padding: "8px 14px", fontSize: 16, cursor: "pointer" }}>−</button>
              <span style={{ padding: "0 12px", fontSize: 15, fontWeight: 600 }}>{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ background: "none", border: "none", color: "#F0EDE8", padding: "8px 14px", fontSize: 16, cursor: "pointer" }}>+</button>
            </div>
            <span className={`badge ${product.stock > 5 ? "badge-green" : "badge-red"}`}>{product.stock > 5 ? "In Stock" : `Only ${product.stock} left`}</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ flex: "1 1 150px", padding: 14, fontSize: 15 }} onClick={() => onAddCart({ ...product, qty })}>🛒 Add to Cart</button>
            <button onClick={() => onWishlist(product)} style={{ padding: "14px 18px", background: "#1a1a1a", border: `1px solid ${wishlisted ? "#E63946" : "#2a2a2a"}`, borderRadius: 8, color: wishlisted ? "#E63946" : "#888", fontSize: 20, transition: "all 0.2s" }}>{wishlisted ? "❤️" : "🤍"}</button>
            <button onClick={() => onCompare(product)} style={{ padding: "14px 18px", background: inCompare ? "rgba(244,163,0,0.1)" : "#1a1a1a", border: `1px solid ${inCompare ? "#F4A300" : "#2a2a2a"}`, borderRadius: 8, color: inCompare ? "#F4A300" : "#888", fontSize: 14, fontWeight: 500, transition: "all 0.2s" }}>⊞ Compare</button>
          </div>
          <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Specifications</p>
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #1a1a1a" }}>
                <span style={{ fontSize: 13, color: "#888", textTransform: "capitalize" }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CartPage({ cart, onUpdateQty, onRemove, onCheckout, isLoggedIn, onLoginRequired }) {
  const total = cart.reduce((s, i) => s + Math.round(i.price * (1 - i.discount / 100)) * i.qty, 0);

  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🔐</div>
        <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 24, marginBottom: 12 }}>Login Required</h2>
        <p style={{ color: "#888", marginBottom: 24 }}>Please login to view your cart and place orders</p>
        <button className="btn-primary" onClick={onLoginRequired} style={{ padding: "12px 32px" }}>Login Now</button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🛒</div>
        <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 24, marginBottom: 12 }}>Your Cart is Empty</h2>
        <p style={{ color: "#888" }}>Add some awesome products to get started!</p>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
      <h1 className="section-title" style={{ marginBottom: 28 }}>Shopping <span className="gradient-text">Cart</span></h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {cart.map((item) => {
            const dp = Math.round(item.price * (1 - item.discount / 100));
            return (
              <div key={item.id + item.qty} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: 16, display: "flex", gap: 14, alignItems: "center" }}>
                <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} onError={(e) => { e.target.src = `https://via.placeholder.com/200x200/111/333?text=IMG`; }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>{item.brand}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, overflow: "hidden" }}>
                      <button onClick={() => onUpdateQty(item.id, item.qty - 1)} style={{ background: "none", border: "none", color: "#F0EDE8", padding: "4px 10px", cursor: "pointer" }}>−</button>
                      <span style={{ padding: "0 8px", fontSize: 14 }}>{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.id, item.qty + 1)} style={{ background: "none", border: "none", color: "#F0EDE8", padding: "4px 10px", cursor: "pointer" }}>+</button>
                    </div>
                    <span className="price-tag" style={{ fontSize: 16 }}>{formatPrice(dp * item.qty)}</span>
                  </div>
                </div>
                <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", color: "#888", fontSize: 18, cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#E63946"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#888"; }}>✕</button>
              </div>
            );
          })}
        </div>
        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: 20, minWidth: 240 }}>
          <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#888", fontSize: 14 }}>Items ({cart.reduce((s, i) => s + i.qty, 0)})</span>
            <span style={{ fontSize: 14 }}>{formatPrice(total)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#888", fontSize: 14 }}>Delivery</span>
            <span style={{ fontSize: 14, color: "#22c55e" }}>FREE</span>
          </div>
          <div style={{ borderTop: "1px solid #222", paddingTop: 12, marginTop: 8, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600 }}>Total</span>
              <span className="price-tag gradient-text" style={{ fontSize: 20 }}>{formatPrice(total)}</span>
            </div>
          </div>
          <button className="btn-primary" style={{ width: "100%", padding: 13 }} onClick={onCheckout}>Proceed to Checkout →</button>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage({ cart, onPlaceOrder, onBack }) {
  const [address, setAddress] = useState({ name: "", phone: "", line1: "", city: "Sirsi", state: "Karnataka", pin: "" });
  const [payment, setPayment] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const total = cart.reduce((s, i) => s + Math.round(i.price * (1 - i.discount / 100)) * i.qty, 0);

  const handle = () => {
    if (!address.name || !address.phone || !address.line1 || !address.pin) { alert("Please fill all address fields"); return; }
    if (payment === "upi" && !upiId) { alert("Please enter UPI ID"); return; }
    onPlaceOrder({ address, payment, total });
  };

  return (
    <div className="page-enter" style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#888", fontSize: 14, cursor: "pointer", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>← Back to Cart</button>
      <h1 className="section-title" style={{ marginBottom: 28 }}>Checkout</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start" }}>
        <div>
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>📍 Delivery Address</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input className="input-field" placeholder="Full name" value={address.name} onChange={(e) => setAddress((a) => ({ ...a, name: e.target.value }))} />
              <input className="input-field" placeholder="Phone number" value={address.phone} onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))} />
            </div>
            <input className="input-field" placeholder="Address line 1" value={address.line1} onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))} style={{ marginTop: 10 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 10 }}>
              <input className="input-field" value={address.city} onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))} placeholder="City" />
              <input className="input-field" value={address.state} onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))} placeholder="State" />
              <input className="input-field" placeholder="PIN code" value={address.pin} onChange={(e) => setAddress((a) => ({ ...a, pin: e.target.value }))} />
            </div>
          </div>
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>💳 Payment Method</h3>
            {[{ id: "upi", label: "UPI Payment", icon: "📲", desc: "Pay via PhonePe, GPay, Paytm, etc." }, { id: "cod", label: "Cash on Delivery", icon: "💵", desc: "Pay when your order arrives" }].map((m) => (
              <div key={m.id} onClick={() => setPayment(m.id)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: payment === m.id ? "rgba(230,57,70,0.08)" : "#0d0d0d", border: `1px solid ${payment === m.id ? "#E63946" : "#1a1a1a"}`, borderRadius: 10, marginBottom: 10, cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${payment === m.id ? "#E63946" : "#444"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {payment === m.id && <div style={{ width: 10, height: 10, background: "#E63946", borderRadius: "50%" }} />}
                </div>
                <span style={{ fontSize: 18 }}>{m.icon}</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{m.label}</p>
                  <p style={{ fontSize: 12, color: "#888" }}>{m.desc}</p>
                </div>
              </div>
            ))}
            {payment === "upi" && (
              <input className="input-field" placeholder="Enter UPI ID (e.g. name@upi)" value={upiId} onChange={(e) => setUpiId(e.target.value)} style={{ marginTop: 4 }} />
            )}
          </div>
        </div>
        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: 20, minWidth: 240 }}>
          <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
          {cart.map((i) => (
            <div key={i.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#888", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.name} ×{i.qty}</span>
              <span style={{ fontSize: 13 }}>{formatPrice(Math.round(i.price * (1 - i.discount / 100)) * i.qty)}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #222", paddingTop: 12, marginTop: 8, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600 }}>Total</span>
              <span className="price-tag gradient-text" style={{ fontSize: 20 }}>{formatPrice(total)}</span>
            </div>
          </div>
          <button className="btn-primary" style={{ width: "100%", padding: 13, fontSize: 15 }} onClick={handle}>Place Order ✓</button>
          <p style={{ fontSize: 11, color: "#555", textAlign: "center", marginTop: 10 }}>Secure & encrypted checkout</p>
        </div>
      </div>
    </div>
  );
}

function OrderSuccess({ order, onHome }) {
  return (
    <div className="page-enter" style={{ textAlign: "center", padding: "80px 24px" }}>
      <div style={{ fontSize: 80, animation: "successPop 0.5s ease", marginBottom: 20 }}>✅</div>
      <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
        <span className="gradient-text">Order Placed Successfully!</span>
      </h2>
      <p style={{ color: "#888", fontSize: 16, marginBottom: 8 }}>Thank you for shopping with Electronic Store</p>
      <p style={{ color: "#888", fontSize: 14, marginBottom: 32 }}>Order Total: <span style={{ color: "#F0EDE8", fontWeight: 600 }}>{formatPrice(order.total)}</span> via <span style={{ color: "#F4A300", fontWeight: 600 }}>{order.payment === "upi" ? "UPI" : "Cash on Delivery"}</span></p>
      <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: 20, maxWidth: 400, margin: "0 auto 32px", textAlign: "left" }}>
        <p style={{ fontSize: 12, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Delivery Address</p>
        <p style={{ fontWeight: 500 }}>{order.address.name}</p>
        <p style={{ color: "#888", fontSize: 14 }}>{order.address.line1}, {order.address.city}, {order.address.state} - {order.address.pin}</p>
        <p style={{ color: "#888", fontSize: 14 }}>{order.address.phone}</p>
      </div>
      <button className="btn-primary" onClick={onHome} style={{ padding: "14px 32px", fontSize: 15 }}>Continue Shopping →</button>
    </div>
  );
}

function ComparePage({ compareList, onRemove, onAddCart }) {
  if (compareList.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>⊞</div>
        <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 24, marginBottom: 12 }}>Nothing to Compare</h2>
        <p style={{ color: "#888" }}>Add products using the compare button on product cards</p>
      </div>
    );
  }
  const allSpecKeys = [...new Set(compareList.flatMap((p) => Object.keys(p.specs)))];
  return (
    <div className="page-enter" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", overflowX: "auto" }}>
      <h1 className="section-title" style={{ marginBottom: 28 }}>Compare <span className="gradient-text">Products</span></h1>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
        <thead>
          <tr>
            <th style={{ padding: "12px 16px", background: "#0d0d0d", color: "#888", fontSize: 13, textAlign: "left", width: 140 }}>Feature</th>
            {compareList.map((p) => (
              <th key={p.id} style={{ padding: "12px 16px", background: "#111", border: "1px solid #1a1a1a", textAlign: "center" }}>
                <img src={p.image} alt={p.name} style={{ width: "100%", maxWidth: 120, height: 90, objectFit: "cover", borderRadius: 8, marginBottom: 8 }} onError={(e) => { e.target.src = `https://via.placeholder.com/200x150/111/333?text=IMG`; }} />
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{p.name}</p>
                <p className="price-tag gradient-text" style={{ fontSize: 16 }}>{formatPrice(Math.round(p.price * (1 - p.discount / 100)))}</p>
                <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 8 }}>
                  <button className="btn-primary" style={{ fontSize: 11, padding: "6px 12px" }} onClick={() => onAddCart(p)}>Add to Cart</button>
                  <button onClick={() => onRemove(p.id)} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#888", fontSize: 11, padding: "6px 10px", borderRadius: 6, cursor: "pointer" }}>Remove</button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ["Brand", (p) => p.brand],
            ["Rating", (p) => `${p.rating} ⭐ (${p.reviews} reviews)`],
            ["Stock", (p) => p.stock > 5 ? "In Stock" : `${p.stock} left`],
            ...allSpecKeys.map((k) => [k.charAt(0).toUpperCase() + k.slice(1), (p) => p.specs[k] || "—"]),
          ].map(([label, fn], ri) => (
            <tr key={label} style={{ background: ri % 2 === 0 ? "#0d0d0d" : "transparent" }}>
              <td style={{ padding: "11px 16px", color: "#888", fontSize: 13 }}>{label}</td>
              {compareList.map((p) => (
                <td key={p.id} style={{ padding: "11px 16px", border: "1px solid #1a1a1a", fontSize: 13, textAlign: "center" }}>{fn(p)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DealsPage({ products, onAddCart, onView }) {
  return (
    <div className="page-enter" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      <h1 className="section-title" style={{ marginBottom: 8 }}>⚡ Flash <span className="gradient-text">Deals</span></h1>
      <p style={{ color: "#888", fontSize: 14, marginBottom: 32 }}>Limited-time offers — don't miss out!</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {DEALS.map((deal) => {
          const savings = deal.price - deal.dealPrice;
          return (
            <div key={deal.id} className="card-product" onClick={() => onView(deal)} style={{ cursor: "pointer" }}>
              <div style={{ position: "relative" }}>
                <img src={deal.image} alt={deal.name} style={{ width: "100%", height: 200, objectFit: "cover" }} onError={(e) => { e.target.src = `https://via.placeholder.com/400x300/111/333?text=IMG`; }} />
                <div style={{ position: "absolute", top: 10, left: 10, background: "linear-gradient(135deg,#E63946,#F4A300)", color: "#fff", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 700 }}>-{deal.discount}% OFF</div>
              </div>
              <div style={{ padding: "16px 16px 18px" }}>
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{deal.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
                  <span className="price-tag" style={{ fontSize: 22, color: "#E63946" }}>{formatPrice(deal.dealPrice)}</span>
                  <span style={{ fontSize: 13, color: "#555", textDecoration: "line-through" }}>{formatPrice(deal.price)}</span>
                </div>
                <p style={{ fontSize: 12, color: "#22c55e", marginBottom: 12 }}>Save {formatPrice(savings)}!</p>
                <div style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>Offer ends in:</p>
                  <CountdownTimer endTime={deal.endTime} />
                </div>
                <button className="btn-primary" style={{ width: "100%" }} onClick={(e) => { e.stopPropagation(); onAddCart(deal); }}>Add to Cart</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BrandsPage({ products, onCategoryClick }) {
  const [filter, setFilter] = useState("");
  const filtered = BRANDS.filter((b) => !filter || b.country === filter);
  const countries = [...new Set(BRANDS.map((b) => b.country))];

  return (
    <div className="page-enter" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      <h1 className="section-title" style={{ marginBottom: 8 }}>Our <span className="gradient-text">Brands</span></h1>
      <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>We carry the world's best electronics brands</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        <button onClick={() => setFilter("")} className="badge" style={{ padding: "6px 14px", cursor: "pointer", background: !filter ? "linear-gradient(135deg,#E63946,#F4A300)" : "#1a1a1a", color: !filter ? "#fff" : "#888", border: `1px solid ${!filter ? "transparent" : "#2a2a2a"}`, borderRadius: 6, fontSize: 13 }}>All</button>
        {countries.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className="badge" style={{ padding: "6px 14px", cursor: "pointer", background: filter === c ? "linear-gradient(135deg,#E63946,#F4A300)" : "#1a1a1a", color: filter === c ? "#fff" : "#888", border: `1px solid ${filter === c ? "transparent" : "#2a2a2a"}`, borderRadius: 6, fontSize: 13 }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 14 }}>
        {filtered.map((brand) => {
          const count = products.filter((p) => p.brand === brand.name).length;
          return (
            <div key={brand.id} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: "24px 16px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#E63946"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1a1a1a"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ width: 56, height: 56, background: "linear-gradient(135deg,#1a1a1a,#222)", border: "1px solid #2a2a2a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 16, color: "#F0EDE8" }}>{brand.logo}</div>
              <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{brand.name}</p>
              <p style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{brand.country}</p>
              {count > 0 && <span className="badge badge-gold">{count} products</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const handle = () => { if (form.name && form.email && form.message) { setSent(true); setTimeout(() => setSent(false), 3000); setForm({ name: "", email: "", message: "" }); } };

  return (
    <div className="page-enter" style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
      <h1 className="section-title" style={{ marginBottom: 8 }}>Get in <span className="gradient-text">Touch</span></h1>
      <p style={{ color: "#888", fontSize: 14, marginBottom: 36 }}>We'd love to hear from you. Send us a message!</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div>
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Send a Message</h3>
            <input className="input-field" placeholder="Your name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={{ marginBottom: 12 }} />
            <input className="input-field" placeholder="Email address" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} style={{ marginBottom: 12 }} />
            <textarea className="input-field" placeholder="Your message…" rows={4} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} style={{ resize: "vertical", marginBottom: 14 }} />
            {sent ? (
              <div style={{ padding: "12px 16px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 8, color: "#22c55e", fontSize: 14, fontWeight: 500 }}>✓ Message sent! We'll reply soon.</div>
            ) : (
              <button className="btn-primary" style={{ width: "100%", padding: 13 }} onClick={handle}>Send Message →</button>
            )}
          </div>
        </div>
        <div>
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: 24, marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Store Information</h3>
            {[
              ["📍", "Address", "Electronic Store, Sirsi, Uttara Kannada, Karnataka, 581355"],
              ["📞", "Phone", "111 1234 5555"],
              ["📧", "Email", "electronicstore@gmail.com"],
              ["📸", "Instagram", "@electronic_store"],
              ["📘", "Facebook", "Electronic Store"],
            ].map(([icon, label, value]) => (
              <div key={label} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18, minWidth: 24 }}>{icon}</span>
                <div>
                  <p style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: 14 }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ background: "#0d0d0d", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <span>🗺️</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>Store Location — Sirsi, Karnataka</span>
            </div>
            <div style={{ height: 200, background: "linear-gradient(135deg,#0d0d0d,#111)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, border: "1px solid #1a1a1a" }}>
              <span style={{ fontSize: 36 }}>📍</span>
              <p style={{ fontSize: 13, color: "#888" }}>Sirsi, Uttara Kannada, Karnataka</p>
              <a href="https://maps.google.com/?q=Sirsi,+Karnataka" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#E63946", textDecoration: "underline" }}>Open in Google Maps →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WishlistPage({ wishlist, onRemove, onAddCart, onView }) {
  if (wishlist.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🤍</div>
        <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 24, marginBottom: 12 }}>Wishlist is Empty</h2>
        <p style={{ color: "#888" }}>Save your favourite products here!</p>
      </div>
    );
  }
  return (
    <div className="page-enter" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      <h1 className="section-title" style={{ marginBottom: 28 }}>My <span className="gradient-text">Wishlist</span> ({wishlist.length})</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 16 }}>
        {wishlist.map((p) => (
          <ProductCard key={p.id} product={p} onAddCart={onAddCart} onWishlist={onRemove} onCompare={() => {}} onView={onView} wishlisted={true} inCompare={false} />
        ))}
      </div>
    </div>
  );
}

function ProfilePage({ user, orders }) {
  return (
    <div className="page-enter" style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <h1 className="section-title" style={{ marginBottom: 28 }}>My <span className="gradient-text">Profile</span></h1>
      <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 16, padding: 28, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          <div style={{ width: 68, height: 68, background: "linear-gradient(135deg,#E63946,#F4A300)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700 }}>{user.name[0].toUpperCase()}</div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600 }}>{user.name}</h2>
            <p style={{ color: "#888", fontSize: 14 }}>📞 {user.mobile}</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {[["📦", orders.length, "Orders"], ["❤️", "—", "Wishlist"], ["⭐", "4.8", "Rating"]].map(([icon, val, label]) => (
            <div key={label} style={{ background: "#0d0d0d", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <p className="price-tag" style={{ fontSize: 22, marginTop: 6 }}>{val}</p>
              <p style={{ fontSize: 12, color: "#888" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
      {orders.length > 0 && (
        <div>
          <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Recent Orders</h3>
          {orders.map((o, i) => (
            <div key={i} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: 16, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#888" }}>Order #{String(i + 1).padStart(4, "0")}</span>
                <span className="badge badge-green">Placed</span>
              </div>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{o.items?.length || 0} item(s)</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "#888" }}>Payment: {o.payment === "upi" ? "UPI" : "COD"}</span>
                <span className="price-tag" style={{ fontSize: 16 }}>{formatPrice(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [activeCat, setActiveCat] = useState("mobiles");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [popup, setPopup] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [prevPage, setPrevPage] = useState(null);

  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const showPopup = useCallback((msg, icon = "✅") => {
    setPopup({ msg, icon });
  }, []);

  const navigate = (p, extra = {}) => {
    setPrevPage(page);
    setPage(p);
    if (extra.cat) setActiveCat(extra.cat);
    if (extra.product) setSelectedProduct(extra.product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product) => {
    if (!user) { setShowLogin(true); return; }
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + (product.qty || 1) } : i);
      return [...prev, { ...product, qty: product.qty || 1 }];
    });
    showPopup("Added to cart!", "🛒");
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => prev.some((w) => w.id === product.id) ? prev.filter((w) => w.id !== product.id) : [...prev, product]);
  };

  const toggleCompare = (product) => {
    setCompareList((prev) => {
      if (prev.some((c) => c.id === product.id)) return prev.filter((c) => c.id !== product.id);
      if (prev.length >= 4) { showPopup("Max 4 products to compare", "⚠️"); return prev; }
      return [...prev, product];
    });
  };

  const handleLogin = (u) => {
    setUser(u);
    setShowLogin(false);
    showPopup("Login Successful! Welcome back!", "🎉");
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setOrders([]);
    showPopup("Logged out successfully", "👋");
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q.trim()) {
      const r = ALL_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase()));
      setSearchResults(r);
    } else {
      setSearchResults([]);
    }
  };

  const placeOrder = (details) => {
    const order = { ...details, items: cart, id: Date.now(), date: new Date().toLocaleDateString() };
    setOrders((prev) => [...prev, order]);
    setCart([]);
    navigate("order_success", { product: order });
    setSelectedProduct(order);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <style>{css}</style>

      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 1000, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid #1a1a1a", padding: "0 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, height: 60 }}>
          <div onClick={() => navigate("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8, minWidth: "fit-content" }}>
            <span style={{ fontSize: 22 }}>⚡</span>
            <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 20 }}><span className="gradient-text">Electronic</span> <span style={{ color: "#F0EDE8" }}>Store</span></span>
          </div>
          <div style={{ flex: 1, position: "relative", maxWidth: 400 }}>
            <input
              className="input-field"
              placeholder="Search products, brands…"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ padding: "7px 14px 7px 36px", fontSize: 13 }}
            />
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#555", fontSize: 14 }}>🔍</span>
            {searchResults.length > 0 && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#111", border: "1px solid #222", borderRadius: 10, maxHeight: 300, overflowY: "auto", zIndex: 999, animation: "slideDown 0.2s ease" }}>
                {searchResults.slice(0, 8).map((p) => (
                  <div key={p.id} onClick={() => { navigate("product", { product: p }); setSearchQuery(""); setSearchResults([]); }} style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "background 0.1s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#1a1a1a"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                    <img src={p.image} alt="" style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 6 }} onError={(e) => { e.target.src = "https://via.placeholder.com/100x100/111/333?text=P"; }} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</p>
                      <p style={{ fontSize: 12, color: "#E63946" }}>{formatPrice(Math.round(p.price * (1 - p.discount / 100)))}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="nav-categories hide-mobile" style={{ display: "flex", gap: 2, flex: 1, justifyContent: "center" }}>
            {[["home", "Home"], ["deals", "Deals"], ["brands", "Brands"], ["contact", "Contact"]].map(([p, l]) => (
              <span key={p} className={`nav-link ${page === p ? "active" : ""}`} onClick={() => navigate(p)}>{l}</span>
            ))}
            <div style={{ position: "relative" }}>
              <span className="nav-link" style={{ cursor: "pointer" }} onMouseEnter={(e) => { e.currentTarget.nextSibling.style.display = "block"; }} onMouseLeave={(e) => { setTimeout(() => { if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = "none"; }, 200); }}>Categories ▾</span>
              <div style={{ display: "none", position: "absolute", top: "100%", left: 0, background: "#111", border: "1px solid #222", borderRadius: 10, padding: 8, minWidth: 180, zIndex: 999 }} onMouseEnter={(e) => { e.currentTarget.style.display = "block"; }} onMouseLeave={(e) => { e.currentTarget.style.display = "none"; }}>
                {CATEGORIES.map((c) => (
                  <div key={c.id} onClick={() => navigate("category", { cat: c.id })} style={{ padding: "8px 12px", borderRadius: 6, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 8, transition: "background 0.1s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#1a1a1a"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                    <span>{c.icon}</span> {c.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {user && (
              <button onClick={() => navigate("wishlist")} style={{ background: "none", border: "none", color: page === "wishlist" ? "#E63946" : "#888", fontSize: 20, cursor: "pointer", position: "relative" }}>🤍</button>
            )}
            {user && (
              <button onClick={() => navigate("compare")} style={{ background: "none", border: "none", color: page === "compare" ? "#F4A300" : "#888", fontSize: 20, cursor: "pointer", position: "relative" }}>
                ⊞
                {compareList.length > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: "#F4A300", color: "#000", borderRadius: "50%", width: 16, height: 16, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{compareList.length}</span>}
              </button>
            )}
            {user ? (
              <>
                <button onClick={() => navigate("cart")} style={{ background: "none", border: "none", color: page === "cart" ? "#E63946" : "#888", fontSize: 20, cursor: "pointer", position: "relative" }}>
                  🛒
                  {cartCount > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: "#E63946", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
                </button>
                <button onClick={() => navigate("profile")} style={{ background: "linear-gradient(135deg,#E63946,#F4A300)", border: "none", borderRadius: "50%", width: 34, height: 34, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>{user.name[0].toUpperCase()}</button>
                <button onClick={handleLogout} className="btn-secondary" style={{ fontSize: 12, padding: "6px 12px" }}>Logout</button>
              </>
            ) : (
              <button className="btn-primary" onClick={() => setShowLogin(true)} style={{ fontSize: 13, padding: "8px 16px" }}>Login</button>
            )}
          </div>
        </div>
      </nav>

      {/* Pages */}
      <main style={{ minHeight: "calc(100vh - 60px)" }}>
        {page === "home" && (
          <HomePage products={ALL_PRODUCTS} onAddCart={addToCart} onWishlist={toggleWishlist} onCompare={toggleCompare} onView={(p) => navigate("product", { product: p })} wishlist={wishlist} compareList={compareList} onCategoryClick={(c) => navigate("category", { cat: c })} onDealsPage={() => navigate("deals")} />
        )}
        {page === "category" && (
          <CategoryPage category={activeCat} products={ALL_PRODUCTS} onAddCart={addToCart} onWishlist={toggleWishlist} onCompare={toggleCompare} onView={(p) => navigate("product", { product: p })} wishlist={wishlist} compareList={compareList} />
        )}
        {page === "product" && selectedProduct && (
          <ProductDetailPage product={selectedProduct} onAddCart={addToCart} onWishlist={toggleWishlist} wishlisted={wishlist.some((w) => w.id === selectedProduct.id)} onBack={() => navigate(prevPage || "home")} onCompare={toggleCompare} inCompare={compareList.some((c) => c.id === selectedProduct.id)} />
        )}
        {page === "cart" && (
          <CartPage cart={cart} onUpdateQty={(id, qty) => { if (qty < 1) { setCart((prev) => prev.filter((i) => i.id !== id)); } else { setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i)); } }} onRemove={(id) => setCart((prev) => prev.filter((i) => i.id !== id))} onCheckout={() => navigate("checkout")} isLoggedIn={!!user} onLoginRequired={() => setShowLogin(true)} />
        )}
        {page === "checkout" && (
          <CheckoutPage cart={cart} onPlaceOrder={placeOrder} onBack={() => navigate("cart")} />
        )}
        {page === "order_success" && selectedProduct && (
          <OrderSuccess order={selectedProduct} onHome={() => navigate("home")} />
        )}
        {page === "compare" && (
          <ComparePage compareList={compareList} onRemove={(id) => setCompareList((prev) => prev.filter((c) => c.id !== id))} onAddCart={addToCart} />
        )}
        {page === "deals" && (
          <DealsPage products={ALL_PRODUCTS} onAddCart={addToCart} onView={(p) => navigate("product", { product: p })} />
        )}
        {page === "brands" && (
          <BrandsPage products={ALL_PRODUCTS} onCategoryClick={(c) => navigate("category", { cat: c })} />
        )}
        {page === "contact" && <ContactPage />}
        {page === "wishlist" && (
          <WishlistPage wishlist={wishlist} onRemove={toggleWishlist} onAddCart={addToCart} onView={(p) => navigate("product", { product: p })} />
        )}
        {page === "profile" && user && (
          <ProfilePage user={user} orders={orders} />
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: "#060606", borderTop: "1px solid #1a1a1a", padding: "48px 24px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 32, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 22 }}>⚡</span>
                <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 18 }}><span className="gradient-text">Electronic</span> Store</span>
              </div>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }}>Karnataka's most trusted electronics destination. Premium quality, best prices.</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Quick Links</p>
              {[["home", "Home"], ["deals", "Deals & Offers"], ["brands", "Brands"], ["contact", "Contact Us"]].map(([p, l]) => (
                <p key={p} onClick={() => navigate(p)} style={{ fontSize: 13, color: "#666", marginBottom: 8, cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#E63946"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#666"; }}>{l}</p>
              ))}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Categories</p>
              {CATEGORIES.slice(0, 5).map((c) => (
                <p key={c.id} onClick={() => navigate("category", { cat: c.id })} style={{ fontSize: 13, color: "#666", marginBottom: 8, cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#E63946"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#666"; }}>{c.icon} {c.name}</p>
              ))}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Contact</p>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>📍 Sirsi, Uttara Kannada, KA 581355</p>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>📞 111 1234 5555</p>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>📧 electronicstore@gmail.com</p>
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                {["📸", "📘", "🐦"].map((icon, i) => (
                  <div key={i} style={{ width: 36, height: 36, background: "#1a1a1a", border: "1px solid #222", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, transition: "transform 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}>{icon}</div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <p style={{ fontSize: 12, color: "#555" }}>© 2024 Electronic Store, Sirsi. All rights reserved.</p>
            <p style={{ fontSize: 12, color: "#555" }}>Made with ❤️ in Karnataka, India</p>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      {showLogin && <LoginPage onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
      {popup && <Popup msg={popup.msg} icon={popup.icon} onClose={() => setPopup(null)} />}

      {/* Chatbot */}
      {page === "home" && (
        <button onClick={() => setChatOpen(!chatOpen)} style={{ position: "fixed", bottom: chatOpen ? 468 : 24, right: 24, zIndex: 1500, width: 52, height: 52, background: "linear-gradient(135deg,#E63946,#F4A300)", border: "none", borderRadius: "50%", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(230,57,70,0.4)", transition: "bottom 0.3s ease", cursor: "pointer" }}>
          {chatOpen ? "✕" : "🤖"}
        </button>
      )}
      {chatOpen && page === "home" && <Chatbot user={user} cart={cart} orders={orders} onClose={() => setChatOpen(false)} />}

      {/* Scroll to top */}
      {showScrollTop && (
        <button className="scrolltop" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>
      )}
    </>
  );
}