import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { generateMockECGSegment } from '../utils/mockData';
import { useAppStore } from '../store/useAppStore';

export default function ECGMonitorScreen() {
  const [samples, setSamples] = useState<number[]>(generateMockECGSegment().samples);
  const isRunning = useAppStore((s) => s.isRunning);
  const setRunning = useAppStore((s) => s.setRunning);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSamples(generateMockECGSegment().samples);
    }, 800);
    return () => clearInterval(interval);
  }, [isRunning]);

  const points = samples
    .map((y, i) => `${(i / samples.length) * 300},${60 - y / 2}`)
    .join(' ');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ECG Monitor</Text>
      <Svg height="120" width="300" style={styles.chart}>
        <Polyline points={points} fill="none" stroke="#2563eb" strokeWidth="2" />
      </Svg>
      <Text style={styles.hr}>Heart Rate: {isRunning ? '78 bpm' : '--'}</Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isRunning ? '#dc2626' : '#16a34a' }]}
        onPress={() => setRunning(!isRunning)}
      >
        <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  title: { fontSize: 22, fontWeight: 'bold' },
  chart: { backgroundColor: '#f1f5f9', borderRadius: 8 },
  hr: { fontSize: 16, color: '#334155' },
  button: { paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});