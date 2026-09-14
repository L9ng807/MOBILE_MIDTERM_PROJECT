import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDeviceStore } from '../../store/useDeviceStore';

const ITEMS: { key: string; title: string; subtitle: string }[] = [
  { key: 'SmartphoneProfile', title: 'Smartphone Profile', subtitle: 'Thông tin điện thoại đang chạy app' },
  { key: 'MCUProfile', title: 'MCU Profile (PYNQ ARM)', subtitle: 'Vai trò và trạng thái của PYNQ-Z2 ARM' },
  { key: 'FPGAProfile', title: 'FPGA Profile', subtitle: 'Accelerator, bitstream, DMA' },
  { key: 'ResourceMonitor', title: 'Resource Monitor', subtitle: 'LUT / FF / DSP / BRAM & latency' },
  { key: 'DeviceConnection', title: 'Device Connection', subtitle: 'Kết nối tới PYNQ server' },
];

export default function DeviceProfileScreen() {
  const navigation = useNavigation<any>();
  const connectionState = useDeviceStore((s) => s.state);

  const dotStyle =
    connectionState === 'connected'
      ? styles.dotOk
      : connectionState === 'connecting'
      ? styles.dotWarn
      : styles.dotOff;

  const statusText =
    connectionState === 'connected'
      ? 'PYNQ đang kết nối'
      : connectionState === 'connecting'
      ? 'Đang kết nối...'
      : connectionState === 'error'
      ? 'Kết nối lỗi'
      : 'Chưa kết nối PYNQ';

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Device Profile</Text>
      <Text style={styles.note}>
        Tổng quan các thiết bị tham gia hệ thống: điện thoại (mobile edge), PYNQ ARM (điều phối) và FPGA (tăng tốc phần
        cứng).
      </Text>

      <View style={styles.statusRow}>
        <View style={[styles.dot, dotStyle]} />
        <Text style={styles.statusText}>{statusText}</Text>
      </View>

      {ITEMS.map((item) => (
        <TouchableOpacity key={item.key} style={styles.card} onPress={() => navigation.navigate(item.key)}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  note: { color: '#64748b', marginBottom: 16 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotOk: { backgroundColor: '#22c55e' },
  dotWarn: { backgroundColor: '#f59e0b' },
  dotOff: { backgroundColor: '#94a3b8' },
  statusText: { color: '#334155', fontWeight: '600' },
  card: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardSubtitle: { color: '#64748b' },
});
