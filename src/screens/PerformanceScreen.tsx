import { View, Text, StyleSheet } from 'react-native';
import { mockPerformance } from '../utils/mockData';

export default function PerformanceScreen() {
  const maxLatency = Math.max(...mockPerformance.map((m) => m.latencyMs));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Performance Dashboard</Text>
      {mockPerformance.map((m) => (
        <View key={m.device} style={styles.card}>
          <Text style={styles.device}>{m.device.toUpperCase()}</Text>
          <Text>Latency: {m.latencyMs} ms</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${(m.latencyMs / maxLatency) * 100}%` }]} />
          </View>
          <Text>Throughput: {m.throughputBeatsPerSec} beat/s</Text>
          {m.modelSizeKB && <Text>Model size: {m.modelSizeKB} KB</Text>}
          {m.lut !== undefined && (
            <Text>LUT: {m.lut}% | DSP: {m.dsp}% | BRAM: {m.bram}%</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, gap: 16 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  card: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 10, gap: 4 },
  device: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  barBg: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden', marginVertical: 4 },
  barFill: { height: '100%', backgroundColor: '#2563eb' },
});