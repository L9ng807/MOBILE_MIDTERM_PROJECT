import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { generateMockECGSegment } from '../utils/mockData';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme';
import AppIcon from '../components/AppIcon';

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
      <View style={styles.heading}><View><Text style={styles.eyebrow}>LIVE TELEMETRY</Text><Text style={styles.title}>ECG Monitor</Text></View><View style={[styles.status, isRunning && styles.statusLive]}><Text style={styles.statusText}>{isRunning ? 'LIVE' : 'IDLE'}</Text></View></View>
      <View style={styles.chartCard}><Svg height="140" width="300" style={styles.chart}>
        <Polyline points={points} fill="none" stroke={colors.cyan} strokeWidth="2" />
      </Svg>
      </View>
      <View style={styles.metric}><AppIcon name="activity" color={colors.danger} /><Text style={styles.hr}>Heart Rate: {isRunning ? '78 bpm' : '--'}</Text></View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isRunning ? colors.danger : colors.success }]}
        onPress={() => setRunning(!isRunning)}
      >
        <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24, gap: 18 },
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { color: colors.cyan, fontSize: 11, letterSpacing: 1.2, fontWeight: '800' },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  status: { backgroundColor: colors.surfaceElevated, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 16 }, statusLive: { backgroundColor: '#143D35' }, statusText: { color: colors.textMuted, fontSize: 10, fontWeight: '800' },
  chartCard: { backgroundColor: colors.surface, borderRadius: 18, padding: 10, borderWidth: 1, borderColor: colors.border }, chart: { borderRadius: 8 },
  metric: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 16 }, hr: { fontSize: 18, color: colors.text, fontWeight: '700' },
  button: { marginTop: 'auto', paddingVertical: 15, borderRadius: 14 }, buttonText: { color: colors.text, fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
});
