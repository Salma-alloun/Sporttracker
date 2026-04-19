import { StyleSheet } from 'react-native';
import { COLORS} from './colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  keyboardView: { flex: 1 },
  bgDecor1: { position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: '#00E5FF20' },
  bgDecor2: { position: 'absolute', bottom: -100, left: -100, width: 250, height: 250, borderRadius: 125, backgroundColor: '#0080FF20' },
  logoSection: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  appName: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  tagline: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  formContainer: { backgroundColor: COLORS.cardBg, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 24 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FF3D6B20', padding: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: COLORS.error },
  errorText: { fontSize: 13, color: COLORS.error, flex: 1 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.border, borderRadius: 12, paddingHorizontal: 16, marginBottom: 16, height: 50 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: COLORS.text, fontSize: 16 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotText: { color: COLORS.primary, fontSize: 13 },
  loginBtn: { height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { color: COLORS.muted, paddingHorizontal: 16 },
  registerBtn: { height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.primary },
  registerBtnText: { color: COLORS.primary, fontSize: 16, fontWeight: '500' },
});