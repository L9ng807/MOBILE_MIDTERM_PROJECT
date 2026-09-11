import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import InfoRow from '../components/InfoRow';
import SectionCard from '../components/SectionCard';

export default function ECGInputScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>ECG Data</Text>
      <Text style={styles.subtitle}>
        Select ECG data for analysis
      </Text>

      <SectionCard title="Dataset">
        <View style={styles.selectedBox}>
          <Text style={styles.selectedTitle}>MIT-BIH</Text>
          <Text style={styles.selectedSubtitle}>
            Arrhythmia ECG Dataset
          </Text>
        </View>

        <InfoRow label="Sampling Rate" value="360 Hz" />
        <InfoRow label="Classes" value="N / S / V / F" />
      </SectionCard>

      <SectionCard title="ECG Record">
        <Text style={styles.fieldLabel}>Selected Record</Text>

        <View style={styles.recordSelector}>
          <Pressable style={styles.arrowButton}>
            <Text style={styles.arrowText}>‹</Text>
          </Pressable>

          <View style={styles.recordBox}>
            <Text style={styles.recordValue}>100</Text>
            <Text style={styles.recordLabel}>Record ID</Text>
          </View>

          <Pressable style={styles.arrowButton}>
            <Text style={styles.arrowText}>›</Text>
          </Pressable>
        </View>

        <InfoRow label="Current Segment" value="Segment 01" />
        <InfoRow label="Current Beat" value="#001" />
        <InfoRow label="Reference Label" value="N" />
      </SectionCard>

      <SectionCard title="Input Source">
        <Pressable style={[styles.sourceButton, styles.sourceButtonActive]}>
          <Text style={styles.sourceButtonActiveText}>
            MIT-BIH Sample
          </Text>
        </Pressable>

        <Pressable style={styles.sourceButton}>
          <Text style={styles.sourceButtonText}>
            Upload ECG File
          </Text>
        </Pressable>
      </SectionCard>

      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>
          Load ECG
        </Text>
      </Pressable>
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
  selectedBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb',
  },
  selectedSubtitle: {
    color: '#64748b',
    marginTop: 4,
  },
  fieldLabel: {
    color: '#64748b',
    marginBottom: 10,
  },
  recordSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  arrowButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 30,
    color: '#2563eb',
    lineHeight: 32,
  },
  recordBox: {
    flex: 1,
    alignItems: 'center',
  },
  recordValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  recordLabel: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  sourceButton: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
  },
  sourceButtonActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  sourceButtonText: {
    color: '#334155',
    fontWeight: '600',
  },
  sourceButtonActiveText: {
    color: '#2563eb',
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});