import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppIcon from '../../components/AppIcon';
import { useDeviceStore } from '../../store/useDeviceStore';
import { mockFPGAProfile, mockResourceUsage } from '../../utils/deviceData';
import { colors } from '../../theme';

function ResourceBar({ label, used, available }: { label: string; used: number; available: number }) {
  const percent = (used / available) * 100;
  return (
    <View style={styles.resource}>
      <View style={styles.resourceHeader}>
        <Text style={styles.resourceLabel}>{label}</Text>
        <Text style={styles.resourceValue}>{used.toLocaleString()} / {available.toLocaleString()} ({percent.toFixed(2)}%)</Text>
      </View>
      <View style={styles.track}><View style={[styles.fill, { width: `${percent}%` }]} /></View>
    </View>
  );
}

export default function FPGAMonitorScreen() {
  const navigation = useNavigation<any>();
  const state = useDeviceStore((s) => s.state);
  const ipAddress = useDeviceStore((s) => s.ipAddress);
  const port = useDeviceStore((s) => s.port);
  const ready = state === 'connected';
  const status = ready ? 'Connected · Ready for inference' : state === 'connecting' ? 'Checking connection…' : state === 'error' ? 'Connection error' : 'Not connected';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heading}>
        <View style={styles.iconWrap}><AppIcon name="cpu" size={26} color={colors.cyan} /></View>
        <View><Text style={styles.eyebrow}>HARDWARE STATUS</Text><Text style={styles.title}>FPGA Monitor</Text></View>
      </View>
      <Text style={styles.description}>Theo dõi kết nối PYNQ-Z2, deployment đang chạy và tài nguyên FPGA. Không bao gồm NAS, benchmark hoặc kết quả ECG.</Text>

      <View style={styles.statusCard}>
        <View style={[styles.dot, { backgroundColor: ready ? colors.success : state === 'connecting' ? colors.warning : colors.textMuted }]} />
        <View style={styles.statusCopy}><Text style={styles.cardTitle}>PYNQ-Z2 FPGA</Text><Text style={styles.muted}>{status}</Text></View>
        <TouchableOpacity style={styles.refresh} onPress={() => navigation.navigate('DeviceConnection')}><Text style={styles.refreshText}>Refresh</Text></TouchableOpacity>
      </View>

      <Text style={styles.section}>DEPLOYMENT STATUS</Text>
      <View style={styles.card}>
        <View style={styles.row}><Text style={styles.muted}>Runtime</Text><Text style={styles.value}>PYNQ FPGA Hybrid</Text></View>
        <View style={styles.row}><Text style={styles.muted}>Endpoint</Text><Text style={styles.value}>{ipAddress}:{port}</Text></View>
        <View style={styles.row}><Text style={styles.muted}>Deployment</Text><Text style={styles.value}>final_w4a4_p99_9</Text></View>
        <View style={styles.row}><Text style={styles.muted}>Precision</Text><Text style={styles.value}>INT8 / INT4</Text></View>
        <View style={styles.row}><Text style={styles.muted}>Inference</Text><Text style={[styles.value, { color: ready ? colors.success : colors.warning }]}>{ready ? 'Ready' : 'Not ready'}</Text></View>
      </View>

      <Text style={styles.section}>FPGA RESOURCE USAGE</Text>
      <View style={styles.card}>
        <View style={styles.clockRow}><Text style={styles.muted}>Clock</Text><Text style={styles.clock}>{mockFPGAProfile.clockMHz} MHz</Text></View>
        {mockResourceUsage.map((resource) => <ResourceBar key={resource.label} {...resource} />)}
      </View>
      <Text style={styles.footnote}>Các số liệu tài nguyên là kết quả post-implementation của accelerator trên PYNQ-Z2.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background }, content: { padding: 20, paddingBottom: 40 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }, iconWrap: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  eyebrow: { color: colors.cyan, fontSize: 11, letterSpacing: 1.2, fontWeight: '800' }, title: { fontSize: 28, fontWeight: '800', color: colors.text }, description: { color: colors.textMuted, lineHeight: 20, marginBottom: 18 },
  statusCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 20 }, dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 }, statusCopy: { flex: 1 },
  cardTitle: { color: colors.text, fontWeight: '800', fontSize: 16 }, muted: { color: colors.textMuted, fontSize: 13 }, refresh: { backgroundColor: colors.primarySoft, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 }, refreshText: { color: colors.cyan, fontWeight: '700', fontSize: 12 },
  section: { color: colors.cyan, fontWeight: '800', fontSize: 11, letterSpacing: 1, marginBottom: 8 }, card: { backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 20, gap: 13 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 }, value: { color: colors.text, fontWeight: '700', textAlign: 'right' }, clockRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }, clock: { color: colors.cyan, fontSize: 22, fontWeight: '800' },
  resource: { gap: 6 }, resourceHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 }, resourceLabel: { color: colors.text, fontWeight: '700' }, resourceValue: { color: colors.textMuted, fontSize: 12 }, track: { height: 9, backgroundColor: colors.surfaceElevated, borderRadius: 9, overflow: 'hidden' }, fill: { height: '100%', backgroundColor: colors.primary, borderRadius: 9 }, footnote: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
});
