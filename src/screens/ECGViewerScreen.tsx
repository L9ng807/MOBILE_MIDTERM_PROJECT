import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Polyline } from 'react-native-svg';
import { useRoute } from '@react-navigation/native';

import InfoRow from '../components/InfoRow';
import SectionCard from '../components/SectionCard';
import { getECGRecord } from '../data/ecgRecords';

export default function ECGViewerScreen() {
  const route = useRoute<any>();

  const recordId = route.params?.recordId ?? '100';
  const inputSource = route.params?.inputSource ?? 'sample';

  const record = getECGRecord(recordId);

  const chartWidth = 320;
  const chartHeight = 180;
  const centerY = chartHeight / 2;

  const maxAmplitude = Math.max(
    ...record.samples.map((value) => Math.abs(value)),
  );

  const points = record.samples
    .map((sample, index) => {
      const x =
        (index / (record.samples.length - 1)) *
        chartWidth;

      const normalized =
        maxAmplitude === 0
          ? 0
          : sample / maxAmplitude;

      const y =
        centerY - normalized * (chartHeight * 0.4);

      return `${x},${y}`;
    })
    .join(' ');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>ECG Viewer</Text>

      <Text style={styles.subtitle}>
        Record {record.recordId}
      </Text>

      <SectionCard title="Record Information">
        <InfoRow label="Dataset" value="MIT-BIH" />

        <InfoRow
          label="Record"
          value={record.recordId}
        />

        <InfoRow
          label="Sampling Rate"
          value={`${record.samplingRate} Hz`}
        />

        <InfoRow
          label="Input Source"
          value={
            inputSource === 'sample'
              ? 'MIT-BIH Sample'
              : 'Uploaded File'
          }
        />
      </SectionCard>

      <SectionCard title="ECG Waveform">
        <View style={styles.chart}>
          <Svg
            width="100%"
            height={chartHeight}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            <Line
              x1="0"
              y1={centerY}
              x2={chartWidth}
              y2={centerY}
              stroke="#cbd5e1"
              strokeWidth="1"
            />

            <Polyline
              points={points}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
            />
          </Svg>
        </View>

        <Text style={styles.sampleText}>
          {record.samples.length} samples
        </Text>
      </SectionCard>

      <SectionCard title="Beat Information">
        <InfoRow
          label="Heart Rate"
          value={`${record.heartRate} BPM`}
        />

        <InfoRow
          label="Reference Class"
          value={record.label}
        />

        <InfoRow
          label="Segment"
          value="Segment 01"
        />
      </SectionCard>

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          Current waveform uses simulated ECG data for
          application development.
        </Text>
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
  chart: {
    height: 180,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  sampleText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 12,
    marginTop: 8,
  },
  notice: {
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 14,
  },
  noticeText: {
    color: '#9a3412',
    fontSize: 13,
    lineHeight: 19,
  },
});