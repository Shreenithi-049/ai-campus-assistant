// ─── COLOR SYSTEM ────────────────────────────────────────────────────────────
// Academic blocks  → #1D4ED8 (blue)
// Admin/Special    → #1E3A8A (dark blue)
// Library          → #6D28D9 (purple)
// Food/Cafe        → #B45309 (amber)
// Sports/Green     → #15803D (green)
// Parking/Utility  → #475569 (slate)
// Convention/Hall  → #0E7490 (teal)

// ─── ROAD JUNCTION NODES ─────────────────────────────────────────────────────
export const nodes = {
  entrance:   { x: 160, y: 80  },
  parking:    { x: 100, y: 160 },
  jMain:      { x: 240, y: 220 },
  jCenter:    { x: 360, y: 220 },
  jRight:     { x: 540, y: 220 },
  jLeft:      { x: 80,  y: 220 },
  jLibrary:   { x: 240, y: 320 },
  jLibTop:    { x: 240, y: 80  },  // node near Library visual position (top area)
  jAdmin:     { x: 360, y: 320 },
  jCB12:      { x: 360, y: 410 },
  jCSE:       { x: 360, y: 490 },
  jMech:      { x: 360, y: 570 },
  jLeftMid:   { x: 120, y: 320 },
  jLeftLow:   { x: 120, y: 490 },
  jLeftBot:   { x: 120, y: 570 },
  jDiag:      { x: 480, y: 320 },
  jSKHall:    { x: 620, y: 160 },
  jFootball:  { x: 620, y: 320 },
  jFoodCourt: { x: 460, y: 80  },
  jConv:      { x: 460, y: 220 },
  jMBA:       { x: 80,  y: 320 },
};

function dist(a, b) {
  return Math.hypot(nodes[b].x - nodes[a].x, nodes[b].y - nodes[a].y);
}

const rawEdges = [
  ['entrance',   'jMain'],
  ['jMain',      'jCenter'],
  ['jCenter',    'jConv'],
  ['jConv',      'jRight'],
  ['jRight',     'jSKHall'],
  ['jSKHall',    'jFootball'],
  ['jLeft',      'jMain'],
  ['jCenter',    'jAdmin'],
  ['jAdmin',     'jCB12'],
  ['jCB12',      'jCSE'],
  ['jCSE',       'jMech'],
  ['jAdmin',     'jLibrary'],
  ['jLibrary',   'jLeftMid'],
  ['jLibrary',   'jMain'],
  ['jLeftMid',   'jLeft'],
  ['jLeftMid',   'jLeftLow'],
  ['jLeftLow',   'jLeftBot'],
  ['jLeftLow',   'jCSE'],
  ['jAdmin',     'jDiag'],
  ['jDiag',      'jFootball'],
  ['jConv',      'jFoodCourt'],
  ['jFoodCourt', 'entrance'],
  ['jCB12',      'jDiag'],
  ['parking',    'jMain'],
  ['parking',    'entrance'],
  ['jMBA',       'jLeft'],
  ['jMBA',       'jLeftMid'],
  // Library top node: connects entrance road up to Library visual area
  ['jLibTop',    'entrance'],   // along the diagonal road area
  ['jLibTop',    'jMain'],      // down to main horizontal road
];

export const graph = {};
for (const key of Object.keys(nodes)) graph[key] = [];
for (const [a, b] of rawEdges) {
  const w = dist(a, b);
  graph[a].push({ node: b, weight: w });
  graph[b].push({ node: a, weight: w });
}

// ─── BUILDINGS ───────────────────────────────────────────────────────────────
// Road zones (center ±11px): y=220, x=100, x=300, x=370
export const buildings = [
  // Top zone — all clear of roads
  { name: 'FOOD COURT',  emoji: '🍴', x: 385, y: 30,  w: 140, h: 60,  color: '#B45309', textColor: '#FFF', node: 'jFoodCourt', info: 'Canteen & Dining' },
  { name: 'CONVENTION',  emoji: '🏛️', x: 385, y: 130, w: 140, h: 65,  color: '#0E7490', textColor: '#FFF', node: 'jConv',      info: 'Convention Centre' },
  { name: 'SK HALL',     emoji: '🎭', x: 560, y: 30,  w: 150, h: 100, color: '#0E7490', textColor: '#FFF', node: 'jSKHall',    info: 'Seminar & Events Hall' },

  // Left zone — parking (left of x=100 road)
  { name: 'PARKING',     emoji: '🅿️', x: 30,  y: 130, w: 60,  h: 50,  color: '#475569', textColor: '#FFF', node: 'parking',    info: 'Vehicle Parking' },

  // Library — top center, node=jLibTop (routes via entrance/jMain correctly)
  { name: 'LIBRARY',     emoji: '📚', x: 225, y: 20,  w: 85,  h: 65,  color: '#6D28D9', textColor: '#FFF', node: 'jLibTop',    info: 'Central Library' },

  // Middle zone — admin (x=315, below y=220 so x=370 road only goes to y=220, safe to widen)
  { name: 'ADMIN',       emoji: '🏫', x: 315, y: 240, w: 120, h: 70,  color: '#1E3A8A', textColor: '#FFF', node: 'jAdmin',     info: 'Administrative Block' },

  // Right zone — football (x=560, clear of all vertical roads)
  { name: 'FOOTBALL',    emoji: '⚽', x: 560, y: 240, w: 160, h: 260, color: '#15803D', textColor: '#FFF', node: 'jFootball',  info: 'Sports Ground' },

  // Center column — CB blocks (x=315+, right of x=300 road)
  { name: 'CB-01',       emoji: '🏫', x: 315, y: 350, w: 40,  h: 50,  color: '#1D4ED8', textColor: '#FFF', node: 'jCB12',     info: 'Classroom Block 01' },
  { name: 'CB-02',       emoji: '🏫', x: 395, y: 350, w: 80,  h: 50,  color: '#1D4ED8', textColor: '#FFF', node: 'jDiag',     info: 'Classroom Block 02' },
  { name: 'CSE / IT',    emoji: '💻', x: 315, y: 420, w: 160, h: 60,  color: '#1D4ED8', textColor: '#FFF', node: 'jCSE',      info: 'CSE & IT Department' },
  { name: 'MECH',        emoji: '⚙️', x: 315, y: 500, w: 160, h: 60,  color: '#2563EB', textColor: '#FFF', node: 'jMech',     info: 'Mechanical Engineering' },

  // Left col A — x=30..90 (left of x=100 road)
  { name: 'MBA',         emoji: '📊', x: 30,  y: 300, w: 60,  h: 50,  color: '#1D4ED8', textColor: '#FFF', node: 'jMBA',      info: 'MBA Department' },
  { name: 'MCA',         emoji: '🖥️', x: 30,  y: 370, w: 60,  h: 50,  color: '#1D4ED8', textColor: '#FFF', node: 'jLeftMid', info: 'MCA Department' },
  { name: 'CB-03',       emoji: '🏫', x: 30,  y: 440, w: 60,  h: 50,  color: '#1D4ED8', textColor: '#FFF', node: 'jLeftLow', info: 'Classroom Block 03' },
  { name: 'CB-04',       emoji: '🏫', x: 30,  y: 510, w: 60,  h: 50,  color: '#1D4ED8', textColor: '#FFF', node: 'jLeftBot', info: 'Classroom Block 04' },

  // Left col B — x=120..240 (between x=100 and x=300 roads)
  { name: 'CB-05',       emoji: '🏫', x: 120, y: 300, w: 90,  h: 50,  color: '#1D4ED8', textColor: '#FFF', node: 'jLeft',    info: 'Classroom Block 05' },
  { name: 'CB-06',       emoji: '🏫', x: 120, y: 370, w: 90,  h: 50,  color: '#1D4ED8', textColor: '#FFF', node: 'jLeftMid', info: 'Classroom Block 06' },
  { name: 'CB-07',       emoji: '🏫', x: 120, y: 440, w: 90,  h: 50,  color: '#1D4ED8', textColor: '#FFF', node: 'jLeftLow', info: 'Classroom Block 07' },

  // Cafe — below y=220 road, left of x=100 road
  { name: 'CAFE',        emoji: '☕', x: 30,  y: 235, w: 60,  h: 45,  color: '#B45309', textColor: '#FFF', node: 'jLeft',    info: 'Coffee & Snacks' },
];

export const USER_NODE = 'jCenter';
