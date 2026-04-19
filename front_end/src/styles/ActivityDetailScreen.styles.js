import { StyleSheet } from 'react-native';
import { COLORS} from './colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  backBtn: { padding: 8, backgroundColor: COLORS.cardBg, borderRadius: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  deleteBtn: { padding: 8 },
  dateText: { fontSize: 14, color: COLORS.muted, textAlign: 'center', marginBottom: 16 },
  mapContainer: { marginHorizontal: 20, borderRadius: 20, overflow: 'hidden', height: 200, marginBottom: 20 },
  map: { width: '100%', height: '100%' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12, marginBottom: 30 },
});

export const blockStyles = StyleSheet.create({
  container: { width: '47%', backgroundColor: COLORS.cardBg, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1 },
  value: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginTop: 8 },
  unit: { fontSize: 12, color: COLORS.muted },
  label: { fontSize: 12, color: COLORS.muted, marginTop: 4 },
});

export { COLORS };