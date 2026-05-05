// SVG sprite strings — DBZ era character designs (body only, arms animated separately in canvas)

// Chi-Chi — DBZ era: black hair bun, pink headband, yellow qipao dress
export const CHICHI_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 115">
  <!-- Dark boots -->
  <ellipse cx="24" cy="113" rx="13" ry="5" fill="#1a1a44"/>
  <ellipse cx="41" cy="113" rx="13" ry="5" fill="#1a1a44"/>
  <!-- Dark blue pants/leggings -->
  <rect x="18" y="86" width="11" height="28" rx="3" fill="#1a2055"/>
  <rect x="36" y="86" width="11" height="28" rx="3" fill="#1a2055"/>
  <!-- Yellow/gold qipao dress (long, DBZ era) -->
  <path d="M13,52 L52,52 L47,90 L18,90 Z" fill="#E8A800"/>
  <!-- Dress bodice -->
  <path d="M18,35 L47,35 L52,52 L13,52 Z" fill="#D49500"/>
  <!-- Dark black sash/belt -->
  <rect x="13" y="55" width="39" height="7" rx="2" fill="#1a1a1a"/>
  <!-- Red/dark trim at hem -->
  <path d="M13,52 L52,52" stroke="#CC2200" stroke-width="3"/>
  <!-- Black collar details -->
  <path d="M29,35 L32,48 L35,35" fill="none" stroke="#1a1a1a" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- Neck -->
  <rect x="28" y="26" width="9" height="11" rx="3" fill="#F5C5A3"/>
  <!-- Head -->
  <ellipse cx="32" cy="18" rx="19" ry="19" fill="#F5C5A3"/>
  <!-- Black hair — pulled back tight, sides visible -->
  <path d="M14,17 C13,6 20,0 32,0 C44,0 51,6 50,17 L47,21 C46,17 38,15 32,15 C26,15 18,17 17,21 Z" fill="#111"/>
  <!-- Hair bun on top-back -->
  <circle cx="32" cy="2" r="10" fill="#111"/>
  <circle cx="32" cy="2" r="7" fill="#1a1a1a"/>
  <!-- PINK headband — the key distinguishing feature for DBZ Chi-Chi -->
  <rect x="14" y="15" width="36" height="6" rx="3" fill="#FF55AA"/>
  <rect x="14" y="15" width="36" height="3" rx="1.5" fill="#FF88CC" opacity="0.5"/>
  <!-- Eyes (gentle, motherly) -->
  <ellipse cx="26" cy="21" rx="4.5" ry="4.5" fill="white"/>
  <ellipse cx="38" cy="21" rx="4.5" ry="4.5" fill="white"/>
  <circle cx="27" cy="22" r="3" fill="#1a1a1a"/>
  <circle cx="39" cy="22" r="3" fill="#1a1a1a"/>
  <circle cx="28" cy="20" r="1.2" fill="white"/>
  <circle cx="40" cy="20" r="1.2" fill="white"/>
  <!-- Soft eyebrows -->
  <path d="M21,16 Q26,14 30,16" stroke="#1a1a1a" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M34,16 Q38,14 43,16" stroke="#1a1a1a" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <!-- Warm smile -->
  <path d="M25,28 Q32,35 39,28" stroke="#BB3333" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Rosy cheeks -->
  <ellipse cx="19" cy="26" rx="6" ry="3.5" fill="#FFB0B0" opacity="0.65"/>
  <ellipse cx="45" cy="26" rx="6" ry="3.5" fill="#FFB0B0" opacity="0.65"/>
  <!-- Small earring -->
  <circle cx="13" cy="22" r="3" fill="#FF55AA"/>
</svg>`;

// Kid Trunks — SILVER/WHITE hair, orange headband, dark navy outfit
export const TRUNKS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 58 90">
  <!-- Brown boots -->
  <ellipse cx="20" cy="87" rx="13" ry="5" fill="#7A5230"/>
  <ellipse cx="38" cy="87" rx="13" ry="5" fill="#7A5230"/>
  <!-- Dark navy pants -->
  <rect x="15" y="62" width="11" height="27" rx="3" fill="#1a2060"/>
  <rect x="32" y="62" width="11" height="27" rx="3" fill="#1a2060"/>
  <!-- Dark navy jacket -->
  <path d="M11,42 L47,42 L43,66 L15,66 Z" fill="#1E2D7A"/>
  <!-- Jacket lapels -->
  <path d="M27,42 L29,58 L17,52 Z" fill="#162268"/>
  <path d="M31,42 L29,58 L41,52 Z" fill="#162268"/>
  <!-- Orange scarf/collar hanging down — very distinctive for kid Trunks -->
  <path d="M22,42 C20,50 18,58 20,68" stroke="#FF6600" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M36,42 C38,50 40,58 38,68" stroke="#FF6600" stroke-width="6" fill="none" stroke-linecap="round"/>
  <!-- Belt -->
  <rect x="15" y="60" width="28" height="5" rx="2" fill="#FF6600"/>
  <!-- Neck -->
  <rect x="25" y="32" width="8" height="12" rx="3" fill="#F5C5A3"/>
  <!-- Head -->
  <circle cx="29" cy="23" r="18" fill="#F5C5A3"/>
  <!-- SILVER/WHITE hair — Trunks' most distinctive feature -->
  <!-- Hair base -->
  <path d="M12,22 C11,9 17,2 29,2 C41,2 47,9 46,22 L43,26 C42,21 36,19 29,19 C22,19 16,21 15,26 Z" fill="#D8D8E8"/>
  <!-- Hair swept slightly right -->
  <path d="M24,9 C26,2 31,-1 37,2 C41,5 43,11 41,18 C37,14 33,12 28,13 Z" fill="#E8E8F4"/>
  <!-- Right side extra volume -->
  <path d="M37,3 C43,0 48,4 47,13 C44,9 40,7 37,8 Z" fill="#CCCCDD"/>
  <!-- Left side drape -->
  <path d="M12,22 C10,14 11,7 15,4 C13,8 12,14 13,21 Z" fill="#CCCCDD"/>
  <!-- Silver highlight -->
  <path d="M26,6 C30,3 35,4 39,8" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.8"/>
  <!-- ORANGE HEADBAND — very distinctive -->
  <rect x="12" y="20" width="34" height="6" rx="3" fill="#FF6600"/>
  <rect x="12" y="20" width="34" height="3" rx="1.5" fill="#FF8833" opacity="0.6"/>
  <!-- Eyes (determined, slightly like Vegeta) -->
  <ellipse cx="23" cy="25" rx="4.5" ry="4.5" fill="white"/>
  <ellipse cx="35" cy="25" rx="4.5" ry="4.5" fill="white"/>
  <circle cx="24" cy="26" r="3" fill="#334466"/>
  <circle cx="36" cy="26" r="3" fill="#334466"/>
  <circle cx="25" cy="24" r="1.2" fill="white"/>
  <circle cx="37" cy="24" r="1.2" fill="white"/>
  <!-- Vegeta-gene eyebrows (angled, determined) -->
  <path d="M19,20 Q23,17 27,19" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M31,19 Q35,17 39,20" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Smile -->
  <path d="M22,32 Q29,39 36,32" stroke="#BB3333" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <!-- Kid blush -->
  <ellipse cx="17" cy="29" rx="5" ry="3" fill="#FFB0B0" opacity="0.55"/>
  <ellipse cx="41" cy="29" rx="5" ry="3" fill="#FFB0B0" opacity="0.55"/>
</svg>`;

// Bulma — teal/cyan-green short hair, dark green outfit, gold hoop earrings
export const BULMA_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 118">
  <!-- Gold ankle boots -->
  <ellipse cx="24" cy="115" rx="13" ry="5" fill="#8B6914"/>
  <ellipse cx="41" cy="115" rx="13" ry="5" fill="#8B6914"/>
  <!-- Slim white legs (she wears a short dress) -->
  <rect x="19" y="80" width="10" height="36" rx="4" fill="#F0E8D8"/>
  <rect x="36" y="80" width="10" height="36" rx="4" fill="#F0E8D8"/>
  <!-- Dark green dress (sleeveless, DBZ era) -->
  <path d="M13,46 L52,46 L47,84 L18,84 Z" fill="#2C5018"/>
  <path d="M18,32 L47,32 L52,46 L13,46 Z" fill="#3A6820"/>
  <!-- High collar -->
  <rect x="27" y="32" width="11" height="8" rx="3" fill="#2C5018"/>
  <!-- Red wristband detail -->
  <rect x="9" y="56" width="9" height="5" rx="2" fill="#CC2200"/>
  <!-- Neck (slim, elegant) -->
  <rect x="28" y="23" width="9" height="11" rx="4" fill="#F5C5A3"/>
  <!-- Head -->
  <ellipse cx="32" cy="15" rx="20" ry="19" fill="#F5C5A3"/>
  <!-- TEAL hair — Bulma's most iconic feature, short bob style -->
  <!-- Hair base layer (darker teal) -->
  <path d="M12,15 C12,4 19,-2 32,-2 C45,-2 52,4 52,15 L50,20 C48,14 40,11 32,11 C24,11 16,14 14,20 Z" fill="#009988"/>
  <!-- Main teal hair (lighter, fills the shape) -->
  <path d="M13,15 C13,5 19,0 32,0 C45,0 51,5 51,15 L48,18 C47,13 40,10 32,10 C24,10 17,13 16,18 Z" fill="#00BBAA"/>
  <!-- Upswept tuft at top (distinctive Bulma shape) -->
  <path d="M26,8 C27,1 31,-3 32,-3 C33,-3 37,0 39,7 C36,5 32,4 29,5 Z" fill="#11CCBB"/>
  <!-- Right side upward wing -->
  <path d="M38,7 C43,2 50,5 49,13 C46,10 42,8 38,9 Z" fill="#00AAAA"/>
  <!-- Left side flick -->
  <path d="M12,15 C10,9 11,4 14,2 C13,6 12,11 13,15 Z" fill="#00AAAA"/>
  <!-- Teal highlight -->
  <path d="M22,5 C26,1 32,0 36,3" stroke="#44EEDD" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.7"/>
  <!-- Eyes — large, round, expressive (Bulma's signature) -->
  <ellipse cx="25" cy="18" rx="5.5" ry="5.5" fill="white"/>
  <ellipse cx="39" cy="18" rx="5.5" ry="5.5" fill="white"/>
  <ellipse cx="26" cy="19" rx="3.8" ry="3.8" fill="#1144AA"/>
  <ellipse cx="40" cy="19" rx="3.8" ry="3.8" fill="#1144AA"/>
  <circle cx="25" cy="17" r="1.5" fill="white"/>
  <circle cx="39" cy="17" r="1.5" fill="white"/>
  <!-- Eyelashes (Bulma is fashionable) -->
  <line x1="20" y1="14" x2="19" y2="11" stroke="#111" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="23" y1="13" x2="22" y2="10" stroke="#111" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="27" y1="13" x2="27" y2="10" stroke="#111" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="37" y1="13" x2="37" y2="10" stroke="#111" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="41" y1="13" x2="41" y2="10" stroke="#111" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="44" y1="14" x2="45" y2="11" stroke="#111" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Arched eyebrows -->
  <path d="M20,12 Q25,9 30,11" stroke="#1a1a1a" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M34,11 Q39,9 44,12" stroke="#1a1a1a" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- Smile -->
  <path d="M24,26 Q32,33 40,26" stroke="#BB3333" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- GOLD HOOP EARRINGS — very distinctive for Bulma -->
  <circle cx="12" cy="20" r="4" fill="none" stroke="#FFD700" stroke-width="2.5"/>
  <circle cx="52" cy="20" r="4" fill="none" stroke="#FFD700" stroke-width="2.5"/>
</svg>`;

// Goten — mini Goku: very spiky black hair, orange gi
export const GOTEN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 58 90">
  <!-- Black shoes -->
  <ellipse cx="20" cy="87" rx="11" ry="4.5" fill="#111"/>
  <ellipse cx="38" cy="87" rx="11" ry="4.5" fill="#111"/>
  <!-- Dark blue gi pants -->
  <rect x="15" y="64" width="11" height="25" rx="3" fill="#2255AA"/>
  <rect x="32" y="64" width="11" height="25" rx="3" fill="#2255AA"/>
  <!-- Orange gi body -->
  <path d="M11,44 L47,44 L43,68 L15,68 Z" fill="#FF6600"/>
  <!-- Black belt -->
  <rect x="11" y="60" width="36" height="6" rx="2" fill="#111"/>
  <!-- Blue undershirt center stripe -->
  <rect x="26" y="44" width="6" height="16" fill="#2255AA"/>
  <!-- Gi collar V -->
  <path d="M22,44 L29,56 L36,44" fill="none" stroke="#CC4400" stroke-width="3" stroke-linejoin="round"/>
  <!-- Neck -->
  <rect x="25" y="34" width="8" height="12" rx="3" fill="#F5C5A3"/>
  <!-- Head -->
  <circle cx="29" cy="25" r="18" fill="#F5C5A3"/>
  <!-- GOKU-STYLE SPIKY HAIR — very sharp triangular spikes, this is the key -->
  <!-- Hair base wrapping head -->
  <path d="M12,23 C11,10 17,2 29,2 C41,2 47,10 46,23 L43,27 C42,21 36,19 29,19 C22,19 16,21 15,27 Z" fill="#111"/>
  <!-- Spike 1 — far left, sweeps outward -->
  <path d="M12,22 L3,7 L19,17 Z" fill="#111"/>
  <!-- Spike 2 — left of center -->
  <path d="M17,14 L13,0 L25,11 Z" fill="#111"/>
  <!-- Spike 3 — center, tallest spike -->
  <path d="M26,9 L27,-5 L35,8 Z" fill="#111"/>
  <!-- Spike 4 — right of center -->
  <path d="M35,10 L39,-3 L44,12 Z" fill="#111"/>
  <!-- Spike 5 — far right -->
  <path d="M43,17 L51,5 L48,20 Z" fill="#111"/>
  <!-- Eyes -->
  <ellipse cx="23" cy="27" rx="4.5" ry="4.5" fill="white"/>
  <ellipse cx="35" cy="27" rx="4.5" ry="4.5" fill="white"/>
  <circle cx="24" cy="28" r="3" fill="#1a1a1a"/>
  <circle cx="36" cy="28" r="3" fill="#1a1a1a"/>
  <circle cx="25" cy="26" r="1.2" fill="white"/>
  <circle cx="37" cy="26" r="1.2" fill="white"/>
  <!-- Eyebrows -->
  <path d="M18,22 Q23,20 27,22" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M31,22 Q35,20 40,22" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Big wide smile (Goku's cheerful energy) -->
  <path d="M20,35 Q29,44 38,35" stroke="#BB3333" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Blush marks (Goten is a sweet kid) -->
  <ellipse cx="16" cy="32" rx="5" ry="3" fill="#FFB0B0" opacity="0.65"/>
  <ellipse cx="42" cy="32" rx="5" ry="3" fill="#FFB0B0" opacity="0.65"/>
</svg>`;
