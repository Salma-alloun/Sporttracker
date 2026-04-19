// src/styles/ProfileScreen.styles.js
import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  avatarSection: { alignItems: 'center', marginVertical: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  email: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  sportBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.border, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 12 },
  sportBadgeText: { fontSize: 12, color: COLORS.primary },
  
  // ✅ Nouveaux styles pour les infos
  infoSection: {
    backgroundColor: COLORS.cardBg,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.muted,
    width: 60,
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  
  menu: { marginTop: 30, paddingHorizontal: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  menuLabel: { flex: 1, fontSize: 16, color: COLORS.text },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginHorizontal: 20, marginTop: 40, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: COLORS.error },
  logoutText: { fontSize: 16, color: COLORS.error, fontWeight: '500' },
  version: { textAlign: 'center', color: COLORS.muted, fontSize: 12, marginTop: 30, marginBottom: 20 },
});