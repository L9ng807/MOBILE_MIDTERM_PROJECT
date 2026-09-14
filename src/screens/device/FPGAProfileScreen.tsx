import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { mockFPGAProfile } from '../../utils/deviceData';

export default function FPGAProfileScreen() {
  const rows: [string, string][] = [
    ['Tên accelerator', mockFPGAProfile.acceleratorName],
    ['Bitstream', mockFPGAProfile.bitstream],
    ['Xung nhịp (clock)', `${mockFPGAProfile.clockMHz} MHz`],
    ['DMA engine', mockFPGAProfile.dmaEngine],
    ['Precision', mockFPGAProfile.precision],
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>FPGA Profile</Text>
      <Text style={styles.note}>
        FPGA Fabric (PL) đảm nhận các phép toán có trọng số: Conv1D, Depthwise/Pointwise Conv1D, projection — được
        tăng tốc thông qua một accelerator dùng chung, có thể cấu hình lại theo kiến trúc do NAS chọn.
      </Text>
      <View style={styles.card}>
        {rows.map(([label, value]) => (
          <View style={styles.row} key={label}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.subtitle}>Các phép toán được tăng tốc</Text>
      <View style={styles.chipRow}>
        {mockFPGAProfile.supportedOps.map((op) => (
          <View style={styles.chip} key={op}>
            <Text style={styles.chipText}>{op}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, paddingHorizontal: 20 },
  content: { paddingBottom: 48 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  note: { color: '#64748b', marginBottom: 16 },
  card: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: '#475569', flex: 1 },
  value: { fontWeight: '600', flex: 1, textAlign: 'right' },
  subtitle: { fontSize: 15, fontWeight: '700', marginTop: 20, marginBottom: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: '#dbeafe', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  chipText: { color: '#1e40af', fontWeight: '600', fontSize: 12 },
});
