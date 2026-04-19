import { StyleSheet } from 'react-native';
import { COLORS} from './colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  mapContainer: { flex: 1, position: 'relative' },
  map: { width: '100%', height: '100%' },
  wsIndicator: { position: 'absolute', top: 20, right: 20, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  wsDot: { width: 8, height: 8, borderRadius: 4 },
  wsLabel: { fontSize: 10, fontWeight: 'bold' },
  startMarker: { 
    backgroundColor: COLORS.green, 
    padding: 8, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  currentMarker: {
    backgroundColor: COLORS.accent,
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  panel: { backgroundColor: COLORS.cardBg, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, paddingBottom: 30 },
  panelTitle: { fontSize: 16, color: COLORS.muted, marginBottom: 12 },
  sportList: { flexDirection: 'row', marginBottom: 20 },
  sportBtn: { alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: COLORS.border, marginRight: 10 },
  sportBtnActive: { backgroundColor: `${COLORS.primary}20`, borderWidth: 1, borderColor: COLORS.primary },
  sportBtnLabel: { fontSize: 12, color: COLORS.muted, marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24, flexWrap: 'wrap', gap: 16 },
  controls: { alignItems: 'center' },
  mainBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 40 },
  mainBtnText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  activeControls: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  secondaryBtn: { alignItems: 'center', gap: 4, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, backgroundColor: COLORS.border },
  secondaryBtnText: { fontSize: 12, color: COLORS.primary },
  statusBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, color: COLORS.muted },
});

export const liveStyles = StyleSheet.create({
  container: { alignItems: 'center', minWidth: 70 },
  value: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  unit: { fontSize: 10, color: COLORS.muted },
  label: { fontSize: 10, color: COLORS.muted, marginTop: 2 },
});

export const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
];

export { COLORS };