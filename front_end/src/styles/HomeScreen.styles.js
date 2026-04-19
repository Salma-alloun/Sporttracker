import { StyleSheet } from 'react-native';
import { COLORS} from './colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  greeting: { fontSize: 14, color: COLORS.muted },
  userName: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginTop: 2 },
  wsBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  wsDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  wsText: { fontSize: 12, fontWeight: '600' },
  goalCard: { marginHorizontal: 20, padding: 20, borderRadius: 20, marginBottom: 24 },
  goalTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  goalHint: { fontSize: 13, color: COLORS.muted },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginHorizontal: 20, marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12 },
  statCard: { width: '30%', backgroundColor: COLORS.cardBg, borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1 },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.muted, marginTop: 4 },
  startBtn: { marginHorizontal: 20, marginVertical: 24, borderRadius: 20, overflow: 'hidden' },
  startBtnContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  startBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  startBtnTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  startBtnSubtitle: { fontSize: 12, color: '#fff', opacity: 0.8 },
  historyLink: { alignItems: 'center', marginBottom: 30 },
  historyLinkText: { fontSize: 14, color: COLORS.primary, fontWeight: '500' },
});