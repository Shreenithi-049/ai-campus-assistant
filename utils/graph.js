// ─── ROAD JUNCTION NODES ────────────────────────────────────────────────────
export const nodes = {
  entrance:   { x: 135, y: 100 },
  parking:    { x: 125, y: 175 },
  jMain:      { x: 220, y: 220 }, // main horizontal road meets entrance road
  jCenter:    { x: 300, y: 220 }, // center crossroads
  jRight:     { x: 520, y: 220 }, // right end of horizontal road
  jLeft:      { x: 60,  y: 220 }, // left end of horizontal road
  jLibrary:   { x: 200, y: 310 }, // left vertical road top
  jAdmin:     { x: 300, y: 310 }, // center vertical — admin zone
  jCB12:      { x: 300, y: 390 }, // CB-01 / CB-02 row
  jCSE:       { x: 300, y: 465 }, // CSE/IT row
  jMech:      { x: 300, y: 545 }, // MECH row
  jLeftMid:   { x: 100, y: 310 }, // left vertical road mid
  jLeftLow:   { x: 100, y: 465 }, // left vertical road lower
  jLeftBot:   { x: 100, y: 545 }, // left vertical road bottom
  jDiag:      { x: 430, y: 310 }, // diagonal road meets right zone
  jSKHall:    { x: 590, y: 180 }, // SK Hall junction
  jFootball:  { x: 590, y: 310 }, // football field junction
  jFoodCourt: { x: 370, y: 100 }, // food court top road
  jConv:      { x: 370, y: 220 }, // convention junction
};

// ─── ROAD EDGES (bidirectional) ──────────────────────────────────────────────
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
];

// Build weighted adjacency list
export const graph = {};
for (const key of Object.keys(nodes)) graph[key] = [];

for (const [a, b] of rawEdges) {
  const w = dist(a, b);
  graph[a].push({ node: b, weight: w });
  graph[b].push({ node: a, weight: w });
}

// ─── BUILDINGS → nearest node ────────────────────────────────────────────────
export const buildings = [
  { name: 'LIBRARY',     x: 155, y: 240, w: 130, h: 90,  color: '#C084D1', node: 'jLibrary'   },
  { name: 'FOOD COURT',  x: 310, y: 50,  w: 130, h: 55,  color: '#F97316', node: 'jFoodCourt' },
  { name: 'CONVENTION',  x: 310, y: 140, w: 140, h: 70,  color: '#A3E635', node: 'jConv'      },
  { name: 'SK HALL',     x: 520, y: 80,  w: 140, h: 100, color: '#A3E635', node: 'jSKHall'    },
  { name: 'ADMIN',       x: 310, y: 240, w: 120, h: 75,  color: '#4F46E5', node: 'jAdmin'     },
  { name: 'CB-01',       x: 310, y: 355, w: 95,  h: 55,  color: '#5CC0C6', node: 'jCB12'      },
  { name: 'CB-02',       x: 415, y: 355, w: 95,  h: 55,  color: '#5CC0C6', node: 'jDiag'      },
  { name: 'CSE / IT',    x: 310, y: 430, w: 190, h: 65,  color: '#38BDF8', node: 'jCSE'       },
  { name: 'MECH',        x: 310, y: 510, w: 190, h: 65,  color: '#38BDF8', node: 'jMech'      },
  { name: 'MBA',         x: 145, y: 310, w: 95,  h: 55,  color: '#5CC0C6', node: 'jLibrary'   },
  { name: 'MCA',         x: 145, y: 375, w: 95,  h: 55,  color: '#5CC0C6', node: 'jLeftMid'   },
  { name: 'CB-03',       x: 145, y: 440, w: 95,  h: 55,  color: '#5CC0C6', node: 'jLeftLow'   },
  { name: 'CB-04',       x: 145, y: 510, w: 95,  h: 55,  color: '#5CC0C6', node: 'jLeftBot'   },
  { name: 'CB-05',       x: 40,  y: 240, w: 95,  h: 55,  color: '#5CC0C6', node: 'jLeft'      },
  { name: 'CB-06',       x: 40,  y: 375, w: 95,  h: 55,  color: '#5CC0C6', node: 'jLeftMid'   },
  { name: 'CB-07',       x: 40,  y: 475, w: 95,  h: 55,  color: '#5CC0C6', node: 'jLeftLow'   },
  { name: 'FOOTBALL',    x: 510, y: 260, w: 170, h: 240, color: '#10B981', node: 'jFootball'   },
  { name: 'PARKING',     x: 70,  y: 150, w: 110, h: 50,  color: '#D1D5DB', node: 'parking'    },
  { name: 'CAFE',        x: 0,   y: 240, w: 75,  h: 50,  color: '#FB923C', node: 'jLeft'      },
];

export const USER_NODE = 'jCenter';
