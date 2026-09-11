import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Hardware-Aware ECG</Text>
      <Text style={styles.subtitle}>
        ECG Analysis & Hardware-Aware NAS
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>System Status</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Dataset</Text>
          <Text style={styles.value}>MIT-BIH</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Backend</Text>
          <Text style={styles.online}>● Online</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Target Device</Text>
          <Text style={styles.value}>Smartphone</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Model</Text>

        <Text style={styles.modelName}>NAS-ECG-v3</Text>

        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>94.8%</Text>
            <Text style={styles.metricLabel}>Accuracy</Text>
          </View>

          <View style={styles.metric}>
            <Text style={styles.metricValue}>18.4 ms</Text>
            <Text style={styles.metricLabel}>Latency</Text>
          </View>

          <View style={styles.metric}>
            <Text style={styles.metricValue}>820 KB</Text>
            <Text style={styles.metricLabel}>Model Size</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>ECG Overview</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Record</Text>
          <Text style={styles.value}>100</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Sample Rate</Text>
          <Text style={styles.value}>360 Hz</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Current Class</Text>
          <Text style={styles.value}>N</Text>
        </View>
      </View>
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: '#64748b',
  },
  value: {
    color: '#0f172a',
    fontWeight: '600',
  },
  online: {
    color: '#16a34a',
    fontWeight: '600',
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
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
});