import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { generateMockInference } from '../utils/mockData';
import { useAppStore } from '../store/useAppStore';
import { ECGClass } from '../types/ecg';

const COLORS: Record<ECGClass, string> = { N: '#16a34a', S: '#f59e0b', V: '#dc2626', F: '#dc2626' };

export default function InferenceScreen() {
  const result = useAppStore((s) => s.latestResult);
  const setLatestResult = useAppStore((s) => s.setLatestResult);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inference</Text>
      <TouchableOpacity style={styles.button} onPress={() => setLatestResult(generateMockInference())}>
        <Text style={styles.buttonText}>Run Inference (mock)</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultBox}>
          <Text style={[styles.predicted, { color: COLORS[result.predictedClass] }]}>
            Predicted: {result.predictedClass} ({result.confidence.toFixed(1)}%)
          </Text>
          {(Object.keys(result.probabilities) as ECGClass[]).map((cls) => (
            <View key={cls} style={styles.row}>
              <Text style={styles.label}>{cls}</Text>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${result.probabilities[cls]}%`, backgroundColor: COLORS[cls] }]} />
              </View>
              <Text style={styles.value}>{result.probabilities[cls].toFixed(1)}%</Text>
            </View>
          ))}
          <Text style={styles.note}>* Kết quả phân loại của mô hình, không phải chẩn đoán y khoa.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 60, gap: 16, paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  button: { backgroundColor: '#2563eb', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  resultBox: { width: '100%', gap: 8 },
  predicted: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { width: 20, fontWeight: 'bold' },
  barBg: { flex: 1, height: 10, backgroundColor: '#e2e8f0', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%' },
  value: { width: 50, textAlign: 'right' },
  note: { fontSize: 12, color: '#64748b', marginTop: 12, fontStyle: 'italic' },
});