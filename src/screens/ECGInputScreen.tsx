import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import * as DocumentPicker from 'expo-document-picker';

import {
  File,
} from 'expo-file-system';

import InfoRow from '../components/InfoRow';
import SectionCard from '../components/SectionCard';

import {
  getDatasetRecords,
} from '../services/ecgApi';

import type {
  DatasetSplit,
  ECGInputSource,
  ECGRecordSummary,
  UploadedECGFile,
} from '../types/ecg';

import {
  ECG_CLASSES,
  MIT_BIH_SAMPLING_RATE,
  MODEL_INPUT_SAMPLES,
} from '../types/ecg';

import type {
  ECGStackParamList,
} from '../types/navigation';

import {
  getCompleteHeartbeatCount,
  parseECGSamples,
} from '../utils/ecgCsv';

type ECGInputNavigationProp =
  NativeStackNavigationProp<
    ECGStackParamList,
    'ECGInput'
  >;

const SPLITS: DatasetSplit[] = [
  'train',
  'val',
  'test',
];

export default function ECGInputScreen() {
  const navigation =
    useNavigation<ECGInputNavigationProp>();

  const [
    inputSource,
    setInputSource,
  ] =
    useState<ECGInputSource>(
      'dataset',
    );

  const [
    split,
    setSplit,
  ] =
    useState<DatasetSplit>(
      'test',
    );

  const [
    records,
    setRecords,
  ] =
    useState<
      ECGRecordSummary[]
    >([]);

  const [
    recordIndex,
    setRecordIndex,
  ] =
    useState(0);

  const [
    selectedFile,
    setSelectedFile,
  ] =
    useState<UploadedECGFile | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const currentRecord =
    records[recordIndex];

  const loadRecords =
    useCallback(
      async (
        selectedSplit:
          DatasetSplit,
        isRefresh = false,
      ) => {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        try {
          const response =
            await getDatasetRecords(
              selectedSplit,
            );

          setRecords(
            response.records,
          );

          setRecordIndex(0);
        } catch (
          requestError
        ) {
          setRecords([]);
          setRecordIndex(0);

          if (
            requestError instanceof
            Error
          ) {
            setError(
              requestError.message,
            );
          } else {
            setError(
              'Unable to load dataset records.',
            );
          }
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [],
    );

  useEffect(() => {
    loadRecords(split);
  }, [
    loadRecords,
    split,
  ]);

  const selectSplit = (
    selectedSplit:
      DatasetSplit,
  ) => {
    setSplit(selectedSplit);

    setInputSource(
      'dataset',
    );
  };

  const previousRecord =
    () => {
      if (
        records.length === 0
      ) {
        return;
      }

      setRecordIndex(
        (current) =>
          current === 0
            ? records.length - 1
            : current - 1,
      );
    };

  const nextRecord =
    () => {
      if (
        records.length === 0
      ) {
        return;
      }

      setRecordIndex(
        (current) =>
          current ===
          records.length - 1
            ? 0
            : current + 1,
      );
    };

  const selectDatasetSource =
    () => {
      setInputSource(
        'dataset',
      );
    };

  const selectECGFile =
    async () => {
      setInputSource(
        'upload',
      );

      try {
        const result =
          await DocumentPicker
            .getDocumentAsync({
              type: '*/*',
              multiple: false,
              copyToCacheDirectory:
                true,
            });

        if (result.canceled) {
          return;
        }

        const asset =
          result.assets[0];

        if (
          !asset.name
            .toLowerCase()
            .endsWith('.csv')
        ) {
          setSelectedFile(
            null,
          );

          Alert.alert(
            'Invalid file type',
            'Please select an ECG file in CSV format.',
          );

          return;
        }

        const file =
          new File(
            asset.uri,
          );

        const content =
          await file.text();

        const samples =
          parseECGSamples(
            content,
          );

        if (
          samples.length <
          MODEL_INPUT_SAMPLES
        ) {
          setSelectedFile(
            null,
          );

          Alert.alert(
            'Invalid ECG data',
            `The CSV file must contain at least ${MODEL_INPUT_SAMPLES} numeric samples.`,
          );

          return;
        }

        setSelectedFile({
          name: asset.name,

          uri: asset.uri,

          samplingRate:
            MIT_BIH_SAMPLING_RATE,

          samples,
        });
      } catch {
        setSelectedFile(
          null,
        );

        Alert.alert(
          'File reading failed',
          'The selected ECG file could not be read.',
        );
      }
    };

  const loadECG =
    () => {
      if (
        inputSource ===
        'upload'
      ) {
        if (!selectedFile) {
          Alert.alert(
            'ECG file required',
            'Please select an ECG file before loading.',
          );

          return;
        }

        navigation.navigate(
          'ECGViewer',
          {
            inputSource:
              'upload',

            recordId:
              selectedFile.name.replace(
                /\.csv$/i,
                '',
              ),

            uploadedFileName:
              selectedFile.name,

            uploadedSamples:
              selectedFile.samples,

            samplingRate:
              selectedFile.samplingRate,
          },
        );

        return;
      }

      if (!currentRecord) {
        Alert.alert(
          'Record required',
          'No MIT-BIH record is currently available.',
        );

        return;
      }

      navigation.navigate(
        'ECGViewer',
        {
          inputSource:
            'dataset',

          split,

          recordId:
            currentRecord.record_id,
        },
      );
    };

  const uploadedBeatCount =
    selectedFile
      ? getCompleteHeartbeatCount(
          selectedFile.samples,
        )
      : 0;

  return (
    <ScrollView
      style={
        styles.container
      }
      contentContainerStyle={
        styles.content
      }
      refreshControl={
        <RefreshControl
          refreshing={
            refreshing
          }
          onRefresh={() =>
            loadRecords(
              split,
              true,
            )
          }
        />
      }
    >
      <Text
        style={styles.title}
      >
        ECG Data
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        Select a real MIT-BIH
        heartbeat or upload a CSV
        file
      </Text>

      <SectionCard title="Dataset">
        <View
          style={
            styles.selectedBox
          }
        >
          <Text
            style={
              styles.selectedTitle
            }
          >
            MIT-BIH
          </Text>

          <Text
            style={
              styles.selectedSubtitle
            }
          >
            Arrhythmia ECG Dataset
          </Text>
        </View>

        <InfoRow
          label="Sampling Rate"
          value={`${MIT_BIH_SAMPLING_RATE} Hz`}
        />

        <InfoRow
          label="Classes"
          value={
            ECG_CLASSES.join(
              ' / ',
            )
          }
        />

        <InfoRow
          label="Model Input"
          value={`${MODEL_INPUT_SAMPLES} samples / heartbeat`}
        />
      </SectionCard>

      <SectionCard title="Input Source">
        <Pressable
          style={[
            styles.sourceButton,

            inputSource ===
              'dataset' &&
              styles.sourceButtonActive,
          ]}
          onPress={
            selectDatasetSource
          }
        >
          <Text
            style={
              inputSource ===
              'dataset'
                ? styles.sourceButtonActiveText
                : styles.sourceButtonText
            }
          >
            MIT-BIH Dataset
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.sourceButton,

            inputSource ===
              'upload' &&
              styles.sourceButtonActive,
          ]}
          onPress={
            selectECGFile
          }
        >
          <Text
            style={
              inputSource ===
              'upload'
                ? styles.sourceButtonActiveText
                : styles.sourceButtonText
            }
          >
            Upload ECG File
          </Text>
        </Pressable>
      </SectionCard>

      {inputSource ===
        'dataset' && (
        <>
          <SectionCard title="Dataset Split">
            <View
              style={
                styles.splitRow
              }
            >
              {SPLITS.map(
                (
                  splitOption,
                ) => (
                  <Pressable
                    key={
                      splitOption
                    }
                    style={[
                      styles.splitButton,

                      split ===
                        splitOption &&
                        styles.splitButtonActive,
                    ]}
                    onPress={() =>
                      selectSplit(
                        splitOption,
                      )
                    }
                  >
                    <Text
                      style={
                        split ===
                        splitOption
                          ? styles.splitButtonActiveText
                          : styles.splitButtonText
                      }
                    >
                      {splitOption
                        .toUpperCase()}
                    </Text>
                  </Pressable>
                ),
              )}
            </View>

            <InfoRow
              label="Records"
              value={`${records.length}`}
            />
          </SectionCard>

          <SectionCard title="MIT-BIH Record">
            {loading ? (
              <Text
                style={
                  styles.infoText
                }
              >
                Loading records...
              </Text>
            ) : error ? (
              <View
                style={
                  styles.errorBox
                }
              >
                <Text
                  style={
                    styles.errorTitle
                  }
                >
                  Dataset request
                  failed
                </Text>

                <Text
                  style={
                    styles.errorText
                  }
                >
                  {error}
                </Text>

                <Pressable
                  style={
                    styles.retryButton
                  }
                  onPress={() =>
                    loadRecords(
                      split,
                    )
                  }
                >
                  <Text
                    style={
                      styles.retryButtonText
                    }
                  >
                    Retry
                  </Text>
                </Pressable>
              </View>
            ) : currentRecord ? (
              <>
                <View
                  style={
                    styles.recordSelector
                  }
                >
                  <Pressable
                    style={
                      styles.arrowButton
                    }
                    onPress={
                      previousRecord
                    }
                  >
                    <Text
                      style={
                        styles.arrowText
                      }
                    >
                      {'<'}
                    </Text>
                  </Pressable>

                  <View
                    style={
                      styles.recordBox
                    }
                  >
                    <Text
                      style={
                        styles.recordValue
                      }
                    >
                      {
                        currentRecord.record_id
                      }
                    </Text>

                    <Text
                      style={
                        styles.recordLabel
                      }
                    >
                      Record{' '}
                      {recordIndex +
                        1}{' '}
                      /{' '}
                      {
                        records.length
                      }
                    </Text>
                  </View>

                  <Pressable
                    style={
                      styles.arrowButton
                    }
                    onPress={
                      nextRecord
                    }
                  >
                    <Text
                      style={
                        styles.arrowText
                      }
                    >
                      {'>'}
                    </Text>
                  </Pressable>
                </View>

                <InfoRow
                  label="Split"
                  value={
                    currentRecord.split.toUpperCase()
                  }
                />

                <InfoRow
                  label="Heartbeat Count"
                  value={`${currentRecord.beat_count}`}
                />

                {ECG_CLASSES.map(
                  (
                    ecgClass,
                  ) => (
                    <InfoRow
                      key={
                        ecgClass
                      }
                      label={`Class ${ecgClass}`}
                      value={`${currentRecord.class_counts[ecgClass] ?? 0}`}
                    />
                  ),
                )}
              </>
            ) : (
              <Text
                style={
                  styles.infoText
                }
              >
                No records available.
              </Text>
            )}
          </SectionCard>
        </>
      )}

      {inputSource ===
        'upload' && (
        <SectionCard title="Uploaded CSV">
          {selectedFile ? (
            <View
              style={
                styles.fileBox
              }
            >
              <Text
                style={
                  styles.fileName
                }
              >
                {
                  selectedFile.name
                }
              </Text>

              <Text
                style={
                  styles.fileDetails
                }
              >
                {
                  selectedFile
                    .samples.length
                }{' '}
                numeric samples
              </Text>

              <Text
                style={
                  styles.fileDetails
                }
              >
                {
                  uploadedBeatCount
                }{' '}
                complete heartbeat
                {uploadedBeatCount ===
                1
                  ? ''
                  : 's'}
              </Text>
            </View>
          ) : (
            <Text
              style={
                styles.infoText
              }
            >
              No ECG file selected.
            </Text>
          )}
        </SectionCard>
      )}

      <Pressable
        style={[
          styles.primaryButton,

          inputSource ===
            'dataset' &&
            !currentRecord &&
            styles.primaryButtonDisabled,

          inputSource ===
            'upload' &&
            !selectedFile &&
            styles.primaryButtonDisabled,
        ]}
        onPress={loadECG}
        disabled={
          (inputSource ===
            'dataset' &&
            !currentRecord) ||
          (inputSource ===
            'upload' &&
            !selectedFile)
        }
      >
        <Text
          style={
            styles.primaryButtonText
          }
        >
          Load ECG
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        '#f8fafc',
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
      backgroundColor:
        '#eff6ff',

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

    sourceButton: {
      borderWidth: 1,

      borderColor:
        '#cbd5e1',

      borderRadius: 12,

      padding: 14,

      marginBottom: 10,

      alignItems:
        'center',
    },

    sourceButtonActive: {
      backgroundColor:
        '#eff6ff',

      borderColor:
        '#2563eb',
    },

    sourceButtonText: {
      color: '#334155',

      fontWeight: '600',
    },

    sourceButtonActiveText: {
      color: '#2563eb',

      fontWeight: '700',
    },

    splitRow: {
      flexDirection: 'row',

      gap: 8,

      marginBottom: 16,
    },

    splitButton: {
      flex: 1,

      borderWidth: 1,

      borderColor:
        '#cbd5e1',

      borderRadius: 10,

      paddingVertical: 10,

      alignItems:
        'center',
    },

    splitButtonActive: {
      backgroundColor:
        '#2563eb',

      borderColor:
        '#2563eb',
    },

    splitButtonText: {
      color: '#334155',

      fontWeight: '600',
    },

    splitButtonActiveText: {
      color: '#ffffff',

      fontWeight: '700',
    },

    recordSelector: {
      flexDirection: 'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      marginBottom: 20,
    },

    arrowButton: {
      width: 48,

      height: 48,

      borderRadius: 12,

      backgroundColor:
        '#eff6ff',

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    arrowText: {
      color: '#2563eb',

      fontSize: 24,

      fontWeight: '700',

      lineHeight: 28,
    },

    recordBox: {
      flex: 1,

      alignItems:
        'center',
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

    infoText: {
      color: '#64748b',

      fontSize: 13,

      lineHeight: 18,
    },

    errorBox: {
      backgroundColor:
        '#fef2f2',

      borderWidth: 1,

      borderColor:
        '#fecaca',

      borderRadius: 12,

      padding: 12,
    },

    errorTitle: {
      color: '#991b1b',

      fontWeight: '700',

      marginBottom: 4,
    },

    errorText: {
      color: '#b91c1c',

      fontSize: 13,

      lineHeight: 18,
    },

    retryButton: {
      marginTop: 12,

      backgroundColor:
        '#dc2626',

      borderRadius: 10,

      paddingVertical: 10,

      alignItems:
        'center',
    },

    retryButtonText: {
      color: '#ffffff',

      fontWeight: '700',
    },

    fileBox: {
      backgroundColor:
        '#f0fdf4',

      borderWidth: 1,

      borderColor:
        '#86efac',

      borderRadius: 10,

      padding: 12,
    },

    fileName: {
      color: '#166534',

      fontWeight: '700',

      textAlign:
        'center',
    },

    fileDetails: {
      color: '#15803d',

      fontSize: 12,

      textAlign:
        'center',

      marginTop: 4,
    },

    primaryButton: {
      backgroundColor:
        '#2563eb',

      borderRadius: 14,

      paddingVertical: 16,

      alignItems:
        'center',

      marginTop: 4,
    },

    primaryButtonDisabled: {
      backgroundColor:
        '#94a3b8',
    },

    primaryButtonText: {
      color: '#ffffff',

      fontSize: 16,

      fontWeight: '700',
    },
  });