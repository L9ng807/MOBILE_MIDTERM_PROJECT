import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { mockResourceUsage, mockLatencyBreakdown } from '../../utils/deviceData';

function UsageBar({ label, used, available }: { label: string; used: number; available: number }) {
  const pct = Math.min(100, (used / available) * 100);
  return (
    <View style={styles.barBlock}>
      <View style={styles.barHeader}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barValue}>
          {used.toLocaleString()} / {available.toLocaleString()} ({pct.toFixed(2)}%)
        </Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}

export default function ResourceMonitorScreen() {
  const { totalMs, fpgaWeightedMs, nonFpgaMs } = mockLatencyBreakdown;
  const fpgaPct = Math.min(100, (fpgaWeightedMs / totalMs) * 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Resource Monitor</Text>

      <Text style={styles.section}>Tài nguyên FPGA (post-implementation)</Text>
      {mockResourceUsage.map((r) => (
        <UsageBar key={r.label} label={r.label} used={r.used} available={r.available} />
      ))}
      <Text style={styles.hint}>
        Các số liệu này gần như không đổi khi NAS chỉ thay đổi kernel/channel nhưng vẫn dùng chung một accelerator cấu
        hình được — LUT/BRAM/DSP không phải biến của quá trình tìm kiến trúc.
      </Text>

      <Text style={styles.section}>Phân tích Latency (hybrid inference)</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Total Latency</Text>
          <Text style={styles.value}>{totalMs.toFixed(1)} ms</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>FPGA Weighted</Text>
          <Text style={styles.value}>{fpgaWeightedMs.toFixed(1)} ms</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Non-FPGA{'\n'}(DMA + ARM + Python)</Text>
          <Text style={styles.value}>{nonFpgaMs.toFixed(1)} ms</Text>
        </View>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${fpgaPct}%`, backgroundColor: '#f59e0b' }]} />
        </View>
        <Text style={styles.hint}>
          Phần cam là tỉ lệ thời gian tính trên FPGA so với tổng thời gian. Phần lớn thời gian hiện nằm ở orchestration
          và DMA setup/copy, không phải phép MAC trên FPGA.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, paddingHorizontal: 20 },
  content: { paddingBottom: 48 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  section: { fontSize: 15, fontWeight: '700', marginTop: 8, marginBottom: 10, color: '#1e293b' },
  barBlock: { marginBottom: 14 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  barLabel: { fontWeight: '600' },
  barValue: { color: '#64748b', fontSize: 12 },
  barTrack: { height: 10, backgroundColor: '#e2e8f0', borderRadius: 6, overflow: 'hidden', marginTop: 6 },
  barFill: { height: 10, backgroundColor: '#2563eb', borderRadius: 6 },
  card: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, gap: 8, marginBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  label: { color: '#475569', flex: 1, marginRight: 12 },
  value: { fontWeight: '600', flexShrink: 0, textAlign: 'right' },
  hint: { color: '#94a3b8', fontSize: 12, marginTop: 4, marginBottom: 8 },
});
