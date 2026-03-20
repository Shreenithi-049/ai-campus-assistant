import { graph, nodes } from './graph';

// Pre-compute cumulative segment data for smooth dot animation
export function buildRouteSegments(nodePath) {
  if (!nodePath || nodePath.length < 2) return [];
  const segments = [];
  let cumLen = 0;
  for (let i = 0; i < nodePath.length - 1; i++) {
    const a = nodes[nodePath[i]];
    const b = nodes[nodePath[i + 1]];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    segments.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, len, cumLen });
    cumLen += len;
  }
  // Attach total length to each segment for easy lookup
  segments.forEach(s => (s.totalLen = cumLen));
  return segments;
}

/**
 * Dijkstra's shortest path.
 * Returns array of node keys from `start` to `end`, or [] if unreachable.
 */
export function dijkstra(start, end) {
  if (start === end) return [start];

  const dist   = {};
  const prev   = {};
  const visited = new Set();

  for (const n of Object.keys(graph)) dist[n] = Infinity;
  dist[start] = 0;

  // Simple priority queue via sorted array (small graph — fine for campus scale)
  const queue = [start];

  while (queue.length) {
    queue.sort((a, b) => dist[a] - dist[b]);
    const u = queue.shift();
    if (visited.has(u)) continue;
    visited.add(u);
    if (u === end) break;

    for (const { node: v, weight } of graph[u]) {
      if (visited.has(v)) continue;
      const alt = dist[u] + weight;
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
        queue.push(v);
      }
    }
  }

  if (dist[end] === Infinity) return [];

  // Reconstruct path
  const path = [];
  let cur = end;
  while (cur !== undefined) {
    path.unshift(cur);
    cur = prev[cur];
  }
  return path;
}

/**
 * Convert a node-key path to an SVG path string "M x y L x y …"
 */
export function pathToSvgD(nodePath) {
  if (!nodePath || nodePath.length < 2) return '';
  return nodePath
    .map((key, i) => `${i === 0 ? 'M' : 'L'} ${nodes[key].x} ${nodes[key].y}`)
    .join(' ');
}

/**
 * Total distance of a node path (in SVG units).
 */
export function pathDistance(nodePath) {
  let total = 0;
  for (let i = 1; i < nodePath.length; i++) {
    const a = nodes[nodePath[i - 1]];
    const b = nodes[nodePath[i]];
    total += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return Math.round(total);
}
