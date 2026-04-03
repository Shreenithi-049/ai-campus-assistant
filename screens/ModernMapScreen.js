import React, {
  useState, useRef, useEffect, useCallback,
} from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, Animated, PanResponder, Dimensions, Platform,
  ScrollView, StatusBar,
} from 'react-native';
import Svg, {
  Rect, Path, Circle, G, Text as SvgText,
} from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { buildings, nodes, USER_NODE } from '../utils/graph';
import {
  dijkstra, pathToSvgD, pathDistance, buildRouteSegments,
} from '../utils/dijkstra';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, spacing, typography, borderRadius, shadows } from '../constants/modernTheme';

// ─── Constants ───────────────────────────────────────────────────────────────
const { width: SW, height: SH } = Dimensions.get('window');
const VB_W = 800;
const VB_H = 640;
const SVG_TO_M = 0.5;
const STEPS_PER_M = 1.3;
const NAV_DURATION = 8000; // ms for full route animation

// ─── Road visual paths ────────────────────────────────────────────────────────
const ROADS = [
  'M 30 220 L 770 220',
  'M 300 100 L 300 590',
  'M 100 220 L 100 590',
  'M 135 100 L 220 220',
  'M 300 220 Q 430 265 520 220',
  'M 520 220 L 590 180 L 590 320',
  'M 300 390 L 430 390 L 430 310',
  'M 370 100 L 370 220',
];

// ─── Turn-by-turn label helper ────────────────────────────────────────────────
function nodeLabel(key) {
  return key
    .replace(/^j/, '')
    .replace(/([A-Z])/g, ' $1')
    .trim() || key;
}

function getTurnInstructions(path) {
  if (!path || path.length < 2) return [];
  const steps = [];
  steps.push({ icon: 'radio-button-on', color: '#2563EB', text: `Start at ${nodeLabel(path[0])}` });
  for (let i = 1; i < path.length - 1; i++) {
    const prev = nodes[path[i - 1]];
    const curr = nodes[path[i]];
    const next = nodes[path[i + 1]];
    const d1x = curr.x - prev.x; const d1y = curr.y - prev.y;
    const d2x = next.x - curr.x; const d2y = next.y - curr.y;
    const cross = d1x * d2y - d1y * d2x;
    let turn = 'Continue straight';
    let icon = 'arrow-up-outline';
    if (cross > 500)       { turn = 'Turn right'; icon = 'arrow-forward-outline'; }
    else if (cross < -500) { turn = 'Turn left';  icon = 'arrow-back-outline'; }
    steps.push({ icon, color: '#374151', text: `${turn} at ${nodeLabel(path[i])}` });
  }
  steps.push({ icon: 'flag', color: '#EF4444', text: `Arrive at destination` });
  return steps;
}

// ─── Animated dot position interpolated over segments ────────────────────────
function interpolateDot(segments, progress) {
  if (!segments.length) return { x: 0, y: 0 };
  const total = segments[segments.length - 1].cumLen + segments[segments.length - 1].len;
  const target = progress * total;
  for (const seg of segments) {
    const segEnd = seg.cumLen + seg.len;
    if (target <= segEnd) {
      const t = seg.len === 0 ? 0 : (target - seg.cumLen) / seg.len;
      return {
        x: seg.x1 + t * (seg.x2 - seg.x1),
        y: seg.y1 + t * (seg.y2 - seg.y1),
      };
    }
  }
  const last = segments[segments.length - 1];
  return { x: last.x2, y: last.y2 };
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ModernMapScreen({ route: navRoute }) {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);

  // Search state
  const [startQuery, setStartQuery]       = useState('My Location');
  const [destQuery, setDestQuery]         = useState('');
  const [startBuilding, setStartBuilding] = useState(null);
  const [destBuilding, setDestBuilding]   = useState(null);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions]   = useState([]);
  const [activeInput, setActiveInput]     = useState(null);
  const [panelOpen, setPanelOpen]         = useState(false);

  // Route state — declared BEFORE any useEffect that references them
  const [route, setRoute]       = useState(null);
  const [navMode, setNavMode]   = useState(false);
  const [navDone, setNavDone]   = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [dotPos, setDotPos]     = useState(null);
  const [turns, setTurns]       = useState([]);

  // Auto-navigate when destination param passed from Home screen
  useEffect(() => {
    const destParam = navRoute?.params?.destination;
    if (!destParam) return;
    const found = buildings.find(b => b.name.toLowerCase() === destParam.toLowerCase());
    if (!found) return;
    setDestBuilding(found);
    setDestQuery(found.name);
    const path = dijkstra(USER_NODE, found.node);
    if (!path.length) return;
    const svgD     = pathToSvgD(path);
    const dist     = pathDistance(path);
    const segments = buildRouteSegments(path);
    const turnList = getTurnInstructions(path);
    setRoute({ path, svgD, dist, segments });
    setTurns(turnList);
    setNavMode(false);
    setNavDone(false);
    setCurrentStep(0);
    setDotPos(segments.length ? { x: segments[0].x1, y: segments[0].y1 } : null);
  }, [navRoute?.params?.destination]);

  // Animation refs
  const navProgress   = useRef(new Animated.Value(0)).current;
  const navAnim       = useRef(null);
  const pulseAnim     = useRef(new Animated.Value(1)).current;
  const sheetAnim     = useRef(new Animated.Value(300)).current;
  const panelAnim     = useRef(new Animated.Value(-300)).current;

  // Pan/zoom refs
  const scaleRef  = useRef(1);
  const txRef     = useRef(0);
  const tyRef     = useRef(0);
  const lastScale = useRef(1);
  const lastTX    = useRef(0);
  const lastTY    = useRef(0);
  const lastPinch = useRef(null);
  const transformAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scaleAnimVal  = useRef(new Animated.Value(1)).current;

  const applyTransform = useCallback(() => {
    transformAnim.setValue({ x: txRef.current, y: tyRef.current });
    scaleAnimVal.setValue(scaleRef.current);
  }, []);

  // ── Pan responder ──────────────────────────────────────────────────────────
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  () => true,
    onPanResponderGrant: () => {
      lastTX.current    = txRef.current;
      lastTY.current    = tyRef.current;
      lastScale.current = scaleRef.current;
      lastPinch.current = null;
    },
    onPanResponderMove: (_, gs) => {
      if (gs.numberActiveTouches === 2) {
        const t = gs._nativeEvent?.touches;
        if (t && t.length === 2) {
          const d = Math.hypot(t[0].pageX - t[1].pageX, t[0].pageY - t[1].pageY);
          if (lastPinch.current !== null) {
            scaleRef.current = Math.min(4, Math.max(0.4, lastScale.current * (d / lastPinch.current)));
          }
          lastPinch.current  = d;
          lastScale.current  = scaleRef.current;
        }
      } else {
        txRef.current = lastTX.current + gs.dx;
        tyRef.current = lastTY.current + gs.dy;
      }
      applyTransform();
    },
    onPanResponderRelease: () => { lastPinch.current = null; },
  })).current;

  // ── Pulse animation ────────────────────────────────────────────────────────
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 2.2, duration: 1000, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1,   duration: 1000, useNativeDriver: true }),
    ])).start();
  }, []);

  // ── Sheet animation ────────────────────────────────────────────────────────
  useEffect(() => {
    Animated.spring(sheetAnim, {
      toValue: route ? 0 : -300,
      useNativeDriver: true,
      tension: 65, friction: 11,
    }).start();
  }, [route]);

  // ── Panel animation ────────────────────────────────────────────────────────
  useEffect(() => {
    Animated.spring(panelAnim, {
      toValue: panelOpen ? 0 : -300,
      useNativeDriver: true,
      tension: 65, friction: 11,
    }).start();
  }, [panelOpen]);

  // ── Nav dot interpolation listener ────────────────────────────────────────
  useEffect(() => {
    const id = navProgress.addListener(({ value }) => {
      if (!route?.segments) return;
      setDotPos(interpolateDot(route.segments, value));
      // Update current step
      const total = route.segments[route.segments.length - 1]?.cumLen +
                    route.segments[route.segments.length - 1]?.len || 1;
      const travelled = value * total;
      let stepIdx = 0;
      for (let i = 0; i < route.segments.length; i++) {
        if (travelled >= route.segments[i].cumLen) stepIdx = i;
      }
      setCurrentStep(Math.min(stepIdx, turns.length - 1));
    });
    return () => navProgress.removeListener(id);
  }, [route, turns]);

  // ── Search helpers ─────────────────────────────────────────────────────────
  const filterBuildings = (text) =>
    text.trim()
      ? buildings.filter(b => b.name.toLowerCase().includes(text.toLowerCase()))
      : buildings.slice(0, 6);

  const handleStartChange = (text) => {
    setStartQuery(text);
    setStartSuggestions(filterBuildings(text));
  };

  const handleDestChange = (text) => {
    setDestQuery(text);
    setDestSuggestions(filterBuildings(text));
  };

  const selectStart = (b) => {
    setStartBuilding(b);
    setStartQuery(b.name);
    setStartSuggestions([]);
    setActiveInput(null);
  };

  const selectDest = (b) => {
    setDestBuilding(b);
    setDestQuery(b.name);
    setDestSuggestions([]);
    setActiveInput(null);
  };

  // ── Routing ────────────────────────────────────────────────────────────────
  const computeRoute = useCallback(() => {
    const fromNode = startBuilding ? startBuilding.node : USER_NODE;
    const toNode   = destBuilding?.node;
    if (!toNode) return;
    const path = dijkstra(fromNode, toNode);
    if (!path.length) return;
    const svgD     = pathToSvgD(path);
    const dist     = pathDistance(path);
    const segments = buildRouteSegments(path);
    const turnList = getTurnInstructions(path);
    setRoute({ path, svgD, dist, segments });
    setTurns(turnList);
    setNavMode(false);
    setNavDone(false);
    setCurrentStep(0);
    navProgress.setValue(0);
    setDotPos(segments.length ? { x: segments[0].x1, y: segments[0].y1 } : null);
    setPanelOpen(false);
  }, [startBuilding, destBuilding]);

  const clearAll = () => {
    setRoute(null);
    setDestBuilding(null);
    setStartBuilding(null);
    setStartQuery('My Location');
    setDestQuery('');
    setNavMode(false);
    setNavDone(false);
    setDotPos(null);
    navProgress.setValue(0);
    if (navAnim.current) navAnim.current.stop();
  };

  // ── Navigation animation ───────────────────────────────────────────────────
  const startNavigation = () => {
    if (!route) return;
    setNavMode(true);
    setNavDone(false);
    navProgress.setValue(0);
    navAnim.current = Animated.timing(navProgress, {
      toValue: 1,
      duration: NAV_DURATION,
      useNativeDriver: false,
    });
    navAnim.current.start(({ finished }) => {
      if (finished) { setNavDone(true); setNavMode(false); }
    });
  };

  const stopNavigation = () => {
    if (navAnim.current) navAnim.current.stop();
    setNavMode(false);
    navProgress.setValue(0);
    setDotPos(route?.segments?.length
      ? { x: route.segments[0].x1, y: route.segments[0].y1 }
      : null);
    setCurrentStep(0);
  };

  // ── Tap building on map ────────────────────────────────────────────────────
  const tapBuilding = (b) => {
    setDestBuilding(b);
    setDestQuery(b.name);
    const fromNode = startBuilding ? startBuilding.node : USER_NODE;
    const path = dijkstra(fromNode, b.node);
    if (!path.length) return;
    const svgD     = pathToSvgD(path);
    const dist     = pathDistance(path);
    const segments = buildRouteSegments(path);
    const turnList = getTurnInstructions(path);
    setRoute({ path, svgD, dist, segments });
    setTurns(turnList);
    setNavMode(false);
    setNavDone(false);
    setCurrentStep(0);
    navProgress.setValue(0);
    setDotPos(segments.length ? { x: segments[0].x1, y: segments[0].y1 } : null);
  };

  const userPos = startBuilding ? nodes[startBuilding.node] : nodes[USER_NODE];
  const destPos = destBuilding  ? nodes[destBuilding.node]  : null;
  const activeDot = navMode && dotPos ? dotPos : userPos;

  // Web layout max width constraints
  const isWebWide = Platform.OS === 'web' && SW > 768;
  const panelMaxWidth = isWebWide ? 400 : '100%';
  const panelAlign = isWebWide ? 'flex-start' : 'stretch';

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={[s.root, { backgroundColor: theme.backgroundSecondary }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* ── Floating search bar (collapsed) ── */}
      {!panelOpen && (
        <View style={[s.searchBar, { maxWidth: panelMaxWidth, alignSelf: panelAlign }]}>
          <TouchableOpacity style={[s.searchBarInner, { backgroundColor: theme.surface }]} onPress={() => setPanelOpen(true)}>
            <Ionicons name="search" size={18} color={theme.textTertiary} />
            <Text style={[s.searchBarText, { color: theme.text }]} numberOfLines={1}>
              {destQuery || 'Where to?'}
            </Text>
            {destQuery ? (
              <TouchableOpacity onPress={clearAll}>
                <Ionicons name="close-circle" size={18} color={theme.textTertiary} />
              </TouchableOpacity>
            ) : (
              <Ionicons name="chevron-down" size={16} color={theme.textTertiary} />
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* ── Input panel (expanded) ── */}
      <Animated.View style={[s.inputPanel, { transform: [{ translateY: panelAnim }], backgroundColor: theme.surface, maxWidth: panelMaxWidth, alignSelf: panelAlign }]}>
        <View style={s.panelHeader}>
          <TouchableOpacity onPress={() => setPanelOpen(false)} style={s.panelBack}>
            <Ionicons name="arrow-back" size={20} color={theme.text} />
          </TouchableOpacity>
          <Text style={[s.panelTitle, { color: theme.text }]}>Get Directions</Text>
        </View>

        {/* Start input */}
        <View style={[s.inputRow, { backgroundColor: theme.hoverBackground }]}>
          <View style={[s.inputDot, { backgroundColor: theme.info }]} />
          <TextInput
            style={[s.inputField, { color: theme.text }]}
            placeholder="Starting point"
            placeholderTextColor={theme.textTertiary}
            value={startQuery}
            onChangeText={handleStartChange}
            onFocus={() => { setActiveInput('start'); setStartSuggestions(filterBuildings(startQuery)); }}
          />
          {startBuilding && (
            <TouchableOpacity onPress={() => { setStartBuilding(null); setStartQuery('My Location'); setStartSuggestions([]); }}>
              <Ionicons name="close-circle" size={16} color={theme.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Start suggestions */}
        {activeInput === 'start' && startSuggestions.length > 0 && (
          <View style={[s.dropdown, { backgroundColor: theme.surface }]}>
            <FlatList
              data={startSuggestions}
              keyExtractor={(_, i) => `s${i}`}
              keyboardShouldPersistTaps="handled"
              style={{ maxHeight: 160 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={[s.dropItem, { borderBottomColor: theme.border }]} onPress={() => selectStart(item)}>
                  <Ionicons name="business-outline" size={14} color={theme.info} style={{ marginRight: 8 }} />
                  <Text style={[s.dropText, { color: theme.text }]}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Divider */}
        <View style={[s.inputDivider, { backgroundColor: theme.border }]} />

        {/* Destination input */}
        <View style={[s.inputRow, { backgroundColor: theme.hoverBackground }]}>
          <View style={[s.inputDot, { backgroundColor: theme.error }]} />
          <TextInput
            style={[s.inputField, { color: theme.text }]}
            placeholder="Choose destination"
            placeholderTextColor={theme.textTertiary}
            value={destQuery}
            onChangeText={handleDestChange}
            onFocus={() => { setActiveInput('dest'); setDestSuggestions(filterBuildings(destQuery)); }}
          />
          {destBuilding && (
            <TouchableOpacity onPress={() => { setDestBuilding(null); setDestQuery(''); setDestSuggestions([]); }}>
              <Ionicons name="close-circle" size={16} color={theme.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Dest suggestions */}
        {activeInput === 'dest' && destSuggestions.length > 0 && (
          <View style={[s.dropdown, { backgroundColor: theme.surface }]}>
            <FlatList
              data={destSuggestions}
              keyExtractor={(_, i) => `d${i}`}
              keyboardShouldPersistTaps="handled"
              style={{ maxHeight: 160 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={[s.dropItem, { borderBottomColor: theme.border }]} onPress={() => selectDest(item)}>
                  <Ionicons name="location-outline" size={14} color={theme.error} style={{ marginRight: 8 }} />
                  <Text style={[s.dropText, { color: theme.text }]}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Get Directions button */}
        <TouchableOpacity
          style={[s.dirBtn, !destBuilding && s.dirBtnDisabled, { backgroundColor: destBuilding ? theme.primary : theme.primaryLight }]}
          onPress={computeRoute}
          disabled={!destBuilding}
        >
          <Ionicons name="navigate" size={16} color="#fff" style={{ marginRight: 6 }} />
          <Text style={s.dirBtnText}>Get Directions</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* ── Map ── */}
      <View style={[s.map, { backgroundColor: theme.backgroundSecondary }]} {...panResponder.panHandlers}>
        <Animated.View style={{
          flex: 1,
          transform: [
            { translateX: transformAnim.x },
            { translateY: transformAnim.y },
            { scale: scaleAnimVal },
          ],
        }}>
          <Svg
            width={SW}
            height={SH}
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Campus ground */}
            <Rect x="0" y="0" width={VB_W} height={VB_H} fill={isDarkMode ? '#0F172A' : '#EEF5EE'} />

            {/* Green grass patches */}
            <Rect x="495" y="240" width="290" height="340" rx="8" fill={isDarkMode ? '#14532D' : '#BBF7D0'} opacity="0.5" />
            <Rect x="385" y="10" width="300" height="105" rx="8" fill={isDarkMode ? '#14532D' : '#BBF7D0'} opacity="0.4" />

            {/* Campus boundary */}
            <Rect x="5" y="5" width={VB_W - 10} height={VB_H - 10} rx="12"
              fill="none" stroke={isDarkMode ? '#1E3A5F' : '#93C5FD'} strokeWidth="3" strokeDasharray="8 6" />

            {/* Roads — outer kerb */}
            {ROADS.map((d, i) => (
              <Path key={`ro${i}`} d={d}
                stroke={isDarkMode ? '#1E3A5F' : '#94A3B8'}
                strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            ))}
            {/* Roads — asphalt surface */}
            {ROADS.map((d, i) => (
              <Path key={`rs${i}`} d={d}
                stroke={isDarkMode ? '#1E293B' : '#F1F5F9'}
                strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            ))}
            {/* Roads — centre line */}
            {ROADS.map((d, i) => (
              <Path key={`rd${i}`} d={d}
                stroke={isDarkMode ? '#334155' : '#CBD5E1'}
                strokeWidth="1.5" strokeLinecap="round" strokeDasharray="10 8" fill="none" />
            ))}

            {/* Route glow */}
            {route?.svgD && (
              <Path d={route.svgD} stroke="#60A5FA" strokeWidth="18"
                strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.35" />
            )}
            {/* Route line */}
            {route?.svgD && (
              <Path d={route.svgD} stroke="#2563EB" strokeWidth="6"
                strokeLinecap="round" strokeLinejoin="round" fill="none" />
            )}
            {/* Route arrows */}
            {route?.svgD && (
              <Path d={route.svgD} stroke="#FFFFFF" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 14" fill="none" />
            )}

            {/* Entrance gate */}
            <Rect x="78" y="70" width="114" height="38" rx="8"
              fill={isDarkMode ? '#1E3A8A' : '#1E3A8A'} />
            <Rect x="78" y="70" width="114" height="38" rx="8"
              fill="none" stroke="#60A5FA" strokeWidth="1.5" />
            <SvgText x="135" y="84" fontSize="7" fill="#93C5FD" textAnchor="middle">🏫</SvgText>
            <SvgText x="135" y="100" fontSize="9" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">ENTRANCE</SvgText>

            {/* Buildings */}
            {buildings.map((b, i) => {
              const isDest  = destBuilding?.name === b.name;
              const isStart = startBuilding?.name === b.name;
              const fillColor = isDest ? '#2563EB' : isStart ? '#059669' : isDarkMode ? '#1E293B' : b.color;
              const strokeColor = isDest ? '#93C5FD' : isStart ? '#6EE7B7' : isDarkMode ? '#334155' : 'rgba(255,255,255,0.3)';
              return (
                <G key={i} onPress={() => tapBuilding(b)}>
                  {/* Drop shadow */}
                  <Rect x={b.x + 4} y={b.y + 4} width={b.w} height={b.h} rx="10"
                    fill="rgba(0,0,0,0.18)" />
                  {/* Building body */}
                  <Rect x={b.x} y={b.y} width={b.w} height={b.h} rx="10"
                    fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
                  {/* Highlight top edge */}
                  <Rect x={b.x + 2} y={b.y + 2} width={b.w - 4} height={6} rx="8"
                    fill="rgba(255,255,255,0.15)" />
                  {/* Emoji */}
                  <SvgText
                    x={b.x + b.w / 2} y={b.y + b.h / 2 - 4}
                    fontSize={b.h > 80 ? 14 : 10} textAnchor="middle"
                  >{b.emoji}</SvgText>
                  {/* Name */}
                  <SvgText
                    x={b.x + b.w / 2} y={b.y + b.h / 2 + (b.h > 80 ? 14 : 10)}
                    fontSize={b.w > 130 ? 10 : b.w > 90 ? 8.5 : 7.5}
                    fontWeight="bold" fill="#FFFFFF" textAnchor="middle"
                  >{b.name}</SvgText>
                </G>
              );
            })}

            {/* User location */}
            <Circle cx={userPos.x} cy={userPos.y} r="20" fill="#3B82F6" opacity="0.15" />
            <Circle cx={userPos.x} cy={userPos.y} r="13" fill="#FFFFFF" />
            <Circle cx={userPos.x} cy={userPos.y} r="9"  fill="#2563EB" />
            <Circle cx={userPos.x} cy={userPos.y} r="4"  fill="#FFFFFF" />

            {/* Destination pin */}
            {destPos && (
              <G>
                <Circle cx={destPos.x} cy={destPos.y} r="15" fill="#EF4444" opacity="0.2" />
                <Circle cx={destPos.x} cy={destPos.y} r="10" fill="#EF4444" />
                <Circle cx={destPos.x} cy={destPos.y} r="4"  fill="#FFFFFF" />
              </G>
            )}

            {/* Nav dot */}
            {navMode && dotPos && (
              <G>
                <Circle cx={dotPos.x} cy={dotPos.y} r="18" fill="#60A5FA" opacity="0.25" />
                <Circle cx={dotPos.x} cy={dotPos.y} r="12" fill="#FFFFFF" />
                <Circle cx={dotPos.x} cy={dotPos.y} r="8"  fill="#2563EB" />
                <Circle cx={dotPos.x} cy={dotPos.y} r="3"  fill="#FFFFFF" />
              </G>
            )}

            {/* Compass rose */}
            <SvgText x="760" y="30" fontSize="18" textAnchor="middle">🧭</SvgText>
          </Svg>
        </Animated.View>

        {/* Zoom controls */}
        <View style={[s.zoomBox, { backgroundColor: theme.surface }]}>
          <TouchableOpacity style={s.zoomBtn} onPress={() => { scaleRef.current = Math.min(4, scaleRef.current + 0.35); applyTransform(); }}>
            <Ionicons name="add" size={20} color={theme.text} />
          </TouchableOpacity>
          <View style={[s.zoomLine, { backgroundColor: theme.border }]} />
          <TouchableOpacity style={s.zoomBtn} onPress={() => { scaleRef.current = Math.max(0.4, scaleRef.current - 0.35); applyTransform(); }}>
            <Ionicons name="remove" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Re-center */}
        <TouchableOpacity style={[s.recenterBtn, { backgroundColor: theme.surface }]} onPress={() => {
          txRef.current = 0; tyRef.current = 0; scaleRef.current = 1; applyTransform();
        }}>
          <Ionicons name="locate" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* ── Bottom Sheet ── */}
      {!panelOpen && (
      <Animated.View style={[s.sheet, { transform: [{ translateY: sheetAnim }], backgroundColor: theme.surface, maxWidth: panelMaxWidth, alignSelf: panelAlign }]}>
        {route && destBuilding && (
          <>
            <View style={[s.sheetHandle, { backgroundColor: theme.border }]} />
            {/* Header row */}
            <View style={s.sheetHeader}>
              <View style={[s.sheetIcon, { backgroundColor: theme.primary }]}>
                <Ionicons name="navigate" size={20} color="#fff" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[s.sheetTitle, { color: theme.text }]}>{destBuilding.name}</Text>
                <Text style={[s.sheetMeta, { color: theme.textSecondary }]}>
                  {Math.round(route.dist * SVG_TO_M)} m ·{' '}
                  {Math.round(route.dist * SVG_TO_M * STEPS_PER_M)} steps ·{' '}
                  ~{Math.ceil(route.dist * SVG_TO_M / 80)} min walk
                </Text>
              </View>
              <TouchableOpacity onPress={clearAll} style={{ padding: 6 }}>
                <Ionicons name="close" size={20} color={theme.textTertiary} />
              </TouchableOpacity>
            </View>

            {/* Progress bar during navigation */}
            {navMode && (
              <View style={[s.progressTrack, { backgroundColor: theme.border }]}>
                <Animated.View style={[s.progressFill, {
                  width: navProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                  backgroundColor: theme.primary
                }]} />
              </View>
            )}

            {/* Turn-by-turn steps */}
            <ScrollView style={s.turnScroll} showsVerticalScrollIndicator={false}>
              {turns.map((t, i) => (
                <View key={i} style={[s.turnRow, navMode && i === currentStep && { backgroundColor: theme.activeBackground }]}>
                  <Ionicons name={t.icon} size={14} color={navMode && i === currentStep ? theme.primary : t.color} style={{ marginRight: 8 }} />
                  <Text style={[s.turnText, { color: theme.textSecondary }, navMode && i === currentStep && { color: theme.primary, fontWeight: '600' }]}>
                    {t.text}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* Action buttons */}
            <View style={s.btnRow}>
              {!navMode && !navDone && (
                <TouchableOpacity style={[s.startBtn, { backgroundColor: theme.primary }]} onPress={startNavigation}>
                  <Ionicons name="play" size={16} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={s.startBtnText}>Start Navigation</Text>
                </TouchableOpacity>
              )}
              {navMode && (
                <TouchableOpacity style={[s.stopBtn, { backgroundColor: theme.error }]} onPress={stopNavigation}>
                  <Ionicons name="stop" size={16} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={s.startBtnText}>Stop</Text>
                </TouchableOpacity>
              )}
              {navDone && (
                <View style={[s.arrivedBanner, { backgroundColor: theme.success + '20' }]}>
                  <Ionicons name="checkmark-circle" size={18} color={theme.success} style={{ marginRight: 6 }} />
                  <Text style={[s.arrivedText, { color: theme.success }]}>You have arrived!</Text>
                </View>
              )}
              <TouchableOpacity style={[s.clearBtn, { backgroundColor: theme.hoverBackground }]} onPress={clearAll}>
                <Text style={[s.clearBtnText, { color: theme.text }]}>Clear</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Animated.View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F1F5F9' },

  // Floating search bar
  searchBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 38,
    left: 16, right: 16,
    zIndex: 30,
  },
  searchBarInner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.13, shadowRadius: 8, elevation: 7,
    gap: 8,
  },
  searchBarText: { flex: 1, fontSize: 15, color: '#374151' },

  // Input panel
  inputPanel: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 40,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: Platform.OS === 'ios' ? 54 : 36,
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 10, elevation: 10,
  },
  panelHeader: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 14,
  },
  panelBack: { padding: 4, marginRight: 10 },
  panelTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },

  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F9FAFB', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10,
    marginBottom: 4,
  },
  inputDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  inputField: { flex: 1, fontSize: 14, color: '#111827' },
  inputDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 4 },

  dropdown: {
    backgroundColor: '#fff', borderRadius: 12, marginBottom: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 4,
    overflow: 'hidden',
  },
  dropItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 11,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  dropText: { fontSize: 13, color: '#111827', fontWeight: '500' },

  dirBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#2563EB', borderRadius: 12,
    paddingVertical: 13, marginTop: 8,
  },
  dirBtnDisabled: { backgroundColor: '#93C5FD' },
  dirBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Map
  map: { flex: 1, overflow: 'hidden', backgroundColor: '#E8F0E9' },

  // Zoom
  zoomBox: {
    position: 'absolute', right: 14, bottom: 180,
    backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 6, elevation: 5,
  },
  zoomBtn: { padding: 11, alignItems: 'center', justifyContent: 'center' },
  zoomLine: { height: 1, backgroundColor: '#E5E7EB' },
  recenterBtn: {
    position: 'absolute', right: 14, bottom: 130,
    backgroundColor: '#fff', borderRadius: 12, padding: 11,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 6, elevation: 5,
  },

  // Bottom sheet — positioned below the search bar
  sheet: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 110 : 96,
    left: 16, right: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20, paddingBottom: 16,
    paddingTop: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 12, elevation: 18,
    maxHeight: SH * 0.52,
    zIndex: 25,
  },
  sheetHandle: {
    width: 40, height: 4, backgroundColor: '#E5E7EB',
    borderRadius: 2, alignSelf: 'center', marginBottom: 14,
  },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sheetIcon: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center',
  },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  sheetMeta:  { fontSize: 12, color: '#6B7280', marginTop: 2 },

  // Progress bar
  progressTrack: {
    height: 5, backgroundColor: '#E5E7EB', borderRadius: 3, marginBottom: 10,
  },
  progressFill: {
    height: 5, backgroundColor: '#2563EB', borderRadius: 3,
  },

  // Turn list
  turnScroll: { maxHeight: 120, marginBottom: 10 },
  turnRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 5, paddingHorizontal: 4,
    borderRadius: 8,
  },
  turnRowActive: { backgroundColor: '#EFF6FF' },
  turnText: { fontSize: 12, color: '#374151', flex: 1 },
  turnTextActive: { color: '#1D4ED8', fontWeight: '600' },

  // Buttons
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  startBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#2563EB', borderRadius: 12, paddingVertical: 13,
  },
  stopBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#EF4444', borderRadius: 12, paddingVertical: 13,
  },
  startBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  clearBtn: {
    paddingHorizontal: 18, paddingVertical: 13,
    backgroundColor: '#F3F4F6', borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  clearBtnText: { color: '#374151', fontWeight: '600', fontSize: 14 },
  arrivedBanner: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#ECFDF5', borderRadius: 12, paddingVertical: 13,
  },
  arrivedText: { color: '#059669', fontWeight: '700', fontSize: 14 },
});
