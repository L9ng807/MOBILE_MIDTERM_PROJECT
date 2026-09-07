import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { mockFPGAStatus } from '../utils/mockData';
import { useAppStore } from '../store/useAppStore';

export default function SettingsScreen() {
  const mode = useAppStore((s) => s.executionMode);
  const setExecutionMode = useAppStore((s) => s.setExecutionMode);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FPGA / Settings</Text>

      <View style={styles.card}>
        <Text>Status: {mockFPGAStatus.connected ? 'Connected' : 'Disconnected'}</Text>
        <Text>IP: {mockFPGAStatus.ipAddress}</Text>
        <Text>Ping: {mockFPGAStatus.pingMs} ms</Text>
        <Text>Model: {mockFPGAStatus.modelLoaded}</Text>
      </View>

      <Text style={styles.subtitle}>Execution Mode</Text>
      <View style={styles.row}>
        {(['mobile', 'fpga', 'adaptive'] as const).map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.pill, mode === m && styles.pillActive]}
            onPress={() => setExecutionMode(m)}
          >
            <Text style={mode === m ? styles.pillTextActive : styles.pillText}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, gap: 16 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  card: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 10, gap: 4 },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  row: { flexDirection: 'row', gap: 8 },
  pill: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#e2e8f0' },
  pillActive: { backgroundColor: '#2563eb' },
  pillText: { color: '#334155' },
  pillTextActive: { color: 'white', fontWeight: 'bold' },
});