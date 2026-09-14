import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { mockMCUProfile } from '../../utils/deviceData';
import { useDeviceStore } from '../../store/useDeviceStore';

export default function MCUProfileScreen() {
  const connectionState = useDeviceStore((s) => s.state);

  const rows: [string, string][] = [
    ['Tên thiết bị', mockMCUProfile.name],
    ['Địa chỉ IP', mockMCUProfile.ipAddress],
    ['Cổng', String(mockMCUProfile.port)],
    ['Hệ điều hành', mockMCUProfile.osVersion],
    ['Deployment đang chạy', mockMCUProfile.deploymentLoaded],
    ['Trạng thái kết nối', connectionState],
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>MCU Profile — PYNQ ARM (PS)</Text>
      <Text style={styles.note}>{mockMCUProfile.role}</Text>
      <View style={styles.card}>
        {rows.map(([label, value]) => (
          <View style={styles.row} key={label}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.hint}>
        Dữ liệu này hiện là placeholder — khi nhóm bạn hoàn thiện API layer, hãy thay bằng dữ liệu đọc được từ endpoint
        /health hoặc /status của server.py chạy trên PYNQ.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, paddingHorizontal: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  note: { color: '#64748b', marginBottom: 16 },
  card: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: '#475569', flex: 1 },
  value: { fontWeight: '600', flex: 1, textAlign: 'right' },
  hint: { color: '#94a3b8', fontSize: 12, marginTop: 16 },
});
