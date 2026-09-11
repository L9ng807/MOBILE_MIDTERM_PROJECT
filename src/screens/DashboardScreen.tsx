import { ScrollView, StyleSheet, Text, View } from 'react-native';

import InfoRow from '../components/InfoRow';
import MetricItem from '../components/MetricItem';
import SectionCard from '../components/SectionCard';
import StatusBadge from '../components/StatusBadge';

export default function DashboardScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Hardware-Aware ECG</Text>

      <Text style={styles.subtitle}>
        ECG Analysis & Hardware-Aware NAS
      </Text>

      <SectionCard title="System Status">
        <InfoRow label="Dataset" value="MIT-BIH" />

        <View style={styles.statusRow}>
          <Text style={styles.label}>Backend</Text>
          <StatusBadge text="Online" />
        </View>

        <InfoRow label="Target Device" value="Smartphone" />
      </SectionCard>

      <SectionCard title="Current Model">
        <Text style={styles.modelName}>NAS-ECG-v3</Text>

        <View style={styles.metricRow}>
          <MetricItem value="94.8%" label="Accuracy" />
          <MetricItem value="18.4 ms" label="Latency" />
          <MetricItem value="820 KB" label="Model Size" />
        </View>
      </SectionCard>

      <SectionCard title="ECG Overview">
        <InfoRow label="Record" value="100" />
        <InfoRow label="Sample Rate" value="360 Hz" />
        <InfoRow label="Current Class" value="N" />
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    color: '#64748b',
    fontSize: 15,
  },
  modelName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});