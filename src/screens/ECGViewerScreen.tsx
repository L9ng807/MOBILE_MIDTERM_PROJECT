import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Line, Polyline, Rect } from 'react-native-svg';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import InfoRow from '../components/InfoRow';
import SectionCard from '../components/SectionCard';
import { getECGRecord } from '../data/ecgRecords';

const SEGMENT_SIZE = 80;
const MAX_CHART_POINTS = 800;

const reduceChartSamples = (samples: number[]) => {
  if (samples.length <= MAX_CHART_POINTS) {
    return samples;
  }

  return Array.from(
    { length: MAX_CHART_POINTS },
    (_, index) => {
      const sourceIndex = Math.round(
        (index * (samples.length - 1)) /
          (MAX_CHART_POINTS - 1),
      );

      return samples[sourceIndex];
    },
  );
};

export default function ECGViewerScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const recordId = route.params?.recordId ?? '100';
  const inputSource = route.params?.inputSource ?? 'sample';
  const uploadedFileName = route.params
    ?.uploadedFileName as string | undefined;
  const uploadedSamplingRate = route.params
    ?.samplingRate as number | undefined;

  const uploadedSamples = Array.isArray(
    route.params?.uploadedSamples,
  )
    ? route.params.uploadedSamples.filter(
        (value: unknown): value is number =>
          typeof value === 'number' &&
          Number.isFinite(value),
      )
    : [];

  const sampleRecord = getECGRecord(
    inputSource === 'sample' ? recordId : '100',
  );

  const isUploaded =
    inputSource === 'upload' &&
    uploadedSamples.length >= SEGMENT_SIZE;

  const samples = isUploaded
    ? uploadedSamples
    : sampleRecord.samples;

  const displayRecordId = isUploaded
    ? uploadedFileName ?? recordId
    : sampleRecord.recordId;

  const samplingRate = isUploaded
    ? uploadedSamplingRate ?? 360
    : sampleRecord.samplingRate;

  const heartRate = isUploaded
    ? undefined
    : sampleRecord.heartRate;

  const referenceLabel = isUploaded
    ? undefined
    : sampleRecord.label;

  const [beatIndex, setBeatIndex] = useState(0);

  const totalBeats = Math.max(
    1,
    Math.floor(samples.length / SEGMENT_SIZE),
  );

  const selectedBeat = beatIndex + 1;
  const segmentStart = beatIndex * SEGMENT_SIZE;
  const segmentEnd = Math.min(
    segmentStart + SEGMENT_SIZE,
    samples.length,
  );

  const selectedSamples = samples.slice(
    segmentStart,
    segmentEnd,
  );

  const previousBeat = () => {
    setBeatIndex((current) =>
      current === 0 ? totalBeats - 1 : current - 1,
    );
  };

  const nextBeat = () => {
    setBeatIndex((current) =>
      current === totalBeats - 1 ? 0 : current + 1,
    );
  };

  const analyzeBeat = () => {
    navigation.getParent()?.navigate('Inference', {
      recordId: displayRecordId,
      beatIndex: selectedBeat,
      referenceLabel,
      samplingRate,
      samples: selectedSamples,
    });
  };

  const chartWidth = 320;
  const chartHeight = 180;
  const centerY = chartHeight / 2;

  const chartSamples = reduceChartSamples(samples);

  const maxAmplitude = chartSamples.reduce(
    (maximum, value) =>
      Math.max(maximum, Math.abs(value)),
    0,
  );

  const points = chartSamples
    .map((sample, index) => {
      const denominator = Math.max(
        chartSamples.length - 1,
        1,
      );

      const x = (index / denominator) * chartWidth;

      const normalized =
        maxAmplitude === 0
          ? 0
          : sample / maxAmplitude;

      const y =
        centerY - normalized * (chartHeight * 0.4);

      return `${x},${y}`;
    })
    .join(' ');

  const selectionX =
    (segmentStart / samples.length) * chartWidth;

  const selectionWidth =
    ((segmentEnd - segmentStart) / samples.length) *
    chartWidth;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>ECG Viewer</Text>

      <Text style={styles.subtitle}>
        Record {displayRecordId}
      </Text>

      <SectionCard title="Record Information">
        <InfoRow
          label="Dataset"
          value={
            isUploaded ? 'Uploaded CSV' : 'MIT-BIH'
          }
        />

        <InfoRow
          label={isUploaded ? 'File' : 'Record'}
          value={displayRecordId}
        />

        <InfoRow
          label="Sampling Rate"
          value={`${samplingRate} Hz`}
        />

        <InfoRow
          label="Input Source"
          value={
            isUploaded
              ? 'Uploaded File'
              : 'MIT-BIH Sample'
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
            <Rect
              x={selectionX}
              y={0}
              width={selectionWidth}
              height={chartHeight}
              fill="#dbeafe"
            />

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
          {samples.length} samples
        </Text>
      </SectionCard>

      <SectionCard title="Heartbeat Selection">
        <View style={styles.beatSelector}>
          <Pressable
            style={styles.arrowButton}
            onPress={previousBeat}
          >
            <Text style={styles.arrowText}>{'<'}</Text>
          </Pressable>

          <View style={styles.beatBox}>
            <Text style={styles.beatValue}>
              Beat #{selectedBeat}
            </Text>

            <Text style={styles.beatLabel}>
              Samples {segmentStart} - {segmentEnd - 1}
            </Text>
          </View>

          <Pressable
            style={styles.arrowButton}
            onPress={nextBeat}
          >
            <Text style={styles.arrowText}>{'>'}</Text>
          </Pressable>
        </View>

        <InfoRow
          label="Heart Rate"
          value={
            heartRate === undefined
              ? 'Not provided'
              : `${heartRate} BPM`
          }
        />

        <InfoRow
          label="Reference Class"
          value={referenceLabel ?? 'Not provided'}
        />

        <InfoRow
          label="Selected Beat"
          value={`#${selectedBeat}`}
        />
      </SectionCard>

      <Pressable
        style={styles.primaryButton}
        onPress={analyzeBeat}
      >
        <Text style={styles.primaryButtonText}>
          Analyze Beat
        </Text>
      </Pressable>

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          {isUploaded
            ? 'Uploaded CSV data is divided into fixed 80-sample segments for UI testing.'
            : 'Current waveform uses simulated ECG data for application development.'}
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
  beatSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  arrowButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#2563eb',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  beatBox: {
    flex: 1,
    alignItems: 'center',
  },
  beatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  beatLabel: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
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