import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';

import InfoRow from '../components/InfoRow';
import SectionCard from '../components/SectionCard';

const records = [
  { recordId: '100', referenceLabel: 'N' },
  { recordId: '101', referenceLabel: 'N' },
  { recordId: '102', referenceLabel: 'S' },
  { recordId: '103', referenceLabel: 'V' },
  { recordId: '104', referenceLabel: 'N' },
  { recordId: '105', referenceLabel: 'F' },
];

type InputSource = 'sample' | 'upload';

type SelectedECGFile = {
  name: string;
  uri: string;
  samples: number[];
};

const parseECGSamples = (content: string): number[] => {
  const numericRows = content
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) =>
      line
        .split(/[,\t;]/)
        .map((cell) => cell.trim())
        .filter((cell) => cell.length > 0)
        .map((cell) => Number(cell))
        .filter((value) => Number.isFinite(value)),
    )
    .filter((row) => row.length > 0);

  if (
    numericRows.length === 1 &&
    numericRows[0].length > 2
  ) {
    return numericRows[0];
  }

  return numericRows.map((row) => row[row.length - 1]);
};

export default function ECGInputScreen() {
  const navigation = useNavigation<any>();

  const [recordIndex, setRecordIndex] = useState(0);
  const [inputSource, setInputSource] =
    useState<InputSource>('sample');
  const [selectedFile, setSelectedFile] =
    useState<SelectedECGFile | null>(null);

  const currentRecord = records[recordIndex];

  const previousRecord = () => {
    setRecordIndex((current) =>
      current === 0 ? records.length - 1 : current - 1,
    );
  };

  const nextRecord = () => {
    setRecordIndex((current) =>
      current === records.length - 1 ? 0 : current + 1,
    );
  };

  const selectSampleSource = () => {
    setInputSource('sample');
  };

  const selectECGFile = async () => {
    setInputSource('upload');

    try {
      const result =
        await DocumentPicker.getDocumentAsync({
          type: '*/*',
          multiple: false,
          copyToCacheDirectory: true,
        });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];

      if (!asset.name.toLowerCase().endsWith('.csv')) {
        setSelectedFile(null);

        Alert.alert(
          'Invalid file type',
          'Please select an ECG file in CSV format.',
        );
        return;
      }

      const file = new File(asset.uri);
      const content = await file.text();
      const samples = parseECGSamples(content);

      if (samples.length < 80) {
        setSelectedFile(null);

        Alert.alert(
          'Invalid ECG data',
          'The CSV file must contain at least 80 numeric samples.',
        );
        return;
      }

      setSelectedFile({
        name: asset.name,
        uri: asset.uri,
        samples,
      });
    } catch {
      setSelectedFile(null);

      Alert.alert(
        'File reading failed',
        'The selected ECG file could not be read.',
      );
    }
  };

  const loadECG = () => {
    if (inputSource === 'upload') {
      if (!selectedFile) {
        Alert.alert(
          'ECG file required',
          'Please select an ECG file before loading.',
        );
        return;
      }

      navigation.navigate('ECGViewer', {
        recordId: selectedFile.name.replace(
          /\.csv$/i,
          '',
        ),
        inputSource: 'upload',
        uploadedFileName: selectedFile.name,
        uploadedSamples: selectedFile.samples,
        samplingRate: 360,
      });

      return;
    }

    navigation.navigate('ECGViewer', {
      recordId: currentRecord.recordId,
      inputSource: 'sample',
    });
  };

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
        <Text style={styles.fieldLabel}>
          Selected Record
        </Text>

        <View style={styles.recordSelector}>
          <Pressable
            style={styles.arrowButton}
            onPress={previousRecord}
          >
            <Text style={styles.arrowText}>{'<'}</Text>
          </Pressable>

          <View style={styles.recordBox}>
            <Text style={styles.recordValue}>
              {currentRecord.recordId}
            </Text>

            <Text style={styles.recordLabel}>
              Record ID
            </Text>
          </View>

          <Pressable
            style={styles.arrowButton}
            onPress={nextRecord}
          >
            <Text style={styles.arrowText}>{'>'}</Text>
          </Pressable>
        </View>

        <InfoRow
          label="Current Segment"
          value="Segment 01"
        />

        <InfoRow label="Current Beat" value="#001" />

        <InfoRow
          label="Reference Label"
          value={currentRecord.referenceLabel}
        />
      </SectionCard>

      <SectionCard title="Input Source">
        <Pressable
          style={[
            styles.sourceButton,
            inputSource === 'sample' &&
              styles.sourceButtonActive,
          ]}
          onPress={selectSampleSource}
        >
          <Text
            style={
              inputSource === 'sample'
                ? styles.sourceButtonActiveText
                : styles.sourceButtonText
            }
          >
            MIT-BIH Sample
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.sourceButton,
            inputSource === 'upload' &&
              styles.sourceButtonActive,
          ]}
          onPress={selectECGFile}
        >
          <Text
            style={
              inputSource === 'upload'
                ? styles.sourceButtonActiveText
                : styles.sourceButtonText
            }
          >
            Upload ECG File
          </Text>
        </Pressable>

        {inputSource === 'upload' &&
          (selectedFile ? (
            <View style={styles.fileBox}>
              <Text style={styles.fileName}>
                {selectedFile.name}
              </Text>

              <Text style={styles.fileDetails}>
                {selectedFile.samples.length} samples
              </Text>
            </View>
          ) : (
            <Text style={styles.uploadMessage}>
              No ECG file selected
            </Text>
          ))}
      </SectionCard>

      <Pressable
        style={styles.primaryButton}
        onPress={loadECG}
      >
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
    fontSize: 24,
    fontWeight: '700',
    color: '#2563eb',
    lineHeight: 28,
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
  uploadMessage: {
    color: '#dc2626',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
  },
  fileBox: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 10,
    padding: 12,
  },
  fileName: {
    color: '#166534',
    fontWeight: '700',
    textAlign: 'center',
  },
  fileDetails: {
    color: '#15803d',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
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