import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { useRoute } from '@react-navigation/native';

import InfoRow from '../components/InfoRow';
import SectionCard from '../components/SectionCard';

const samples = Array.from({ length: 180 }, (_, i) => {
  const base = Math.sin(i / 8) * 12;

  if (i % 45 === 20) {
    return 55;
  }

  if (i % 45 === 21) {
    return -30;
  }

  return base;
});

export default function ECGViewerScreen() {
  const route = useRoute<any>();

  const recordId = route.params?.recordId ?? '100';
  const inputSource = route.params?.inputSource ?? 'sample';

  const width = 320;
  const height = 160;

  const points = samples
    .map((sample, index) => {
      const x = (index / (samples.length - 1)) * width;
      const y = height / 2 - sample;

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
        ECG waveform preview
      </Text>

      <SectionCard title="Record Information">
        <InfoRow label="Dataset" value="MIT-BIH" />
        <InfoRow label="Record" value={recordId} />
        <InfoRow label="Sampling Rate" value="360 Hz" />
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
          <Svg width="100%" height={height}>
            <Polyline
              points={points}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
            />
          </Svg>
        </View>

        <Text style={styles.chartNote}>
          Mock ECG waveform for UI development
        </Text>
      </SectionCard>

      <SectionCard title="Current Beat">
        <InfoRow label="Beat" value="#001" />
        <InfoRow label="Reference Class" value="N" />
        <InfoRow label="Heart Rate" value="78 BPM" />
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
  chart: {
    height: 160,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  chartNote: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 10,
    textAlign: 'center',
  },
});