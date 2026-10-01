import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import Svg, {
  Line,
  Polyline,
} from 'react-native-svg';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import type {
  RouteProp,
} from '@react-navigation/native';

import type {
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';

import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import InfoRow from '../components/InfoRow';
import SectionCard from '../components/SectionCard';

import {
  getDatasetRecord,
} from '../services/ecgApi';

import {
  useAppStore,
} from '../store/useAppStore';

import type {
  ECGBeat,
  ECGClass,
  ECGInferenceInput,
  ECGRecordResponse,
} from '../types/ecg';

import {
  MIT_BIH_SAMPLING_RATE,
  MODEL_INPUT_SAMPLES,
} from '../types/ecg';

import type {
  ECGStackParamList,
  RootTabParamList,
} from '../types/navigation';

import { createScaledSheet } from '../utils/responsive';

type ECGViewerRouteProp =
  RouteProp<
    ECGStackParamList,
    'ECGViewer'
  >;

type ECGViewerNavigationProp =
  NativeStackNavigationProp<
    ECGStackParamList,
    'ECGViewer'
  >;

type RootTabNavigationProp =
  BottomTabNavigationProp<
    RootTabParamList
  >;

const CHART_WIDTH = 320;
const CHART_HEIGHT = 180;

function createChartPoints(
  samples: number[],
): string {
  if (
    samples.length === 0
  ) {
    return '';
  }

  const maximumAmplitude =
    samples.reduce(
      (
        maximum,
        value,
      ) =>
        Math.max(
          maximum,
          Math.abs(
            value,
          ),
        ),
      0,
    );

  const centerY =
    CHART_HEIGHT / 2;

  return samples
    .map(
      (
        sample,
        index,
      ) => {
        const denominator =
          Math.max(
            samples.length -
              1,
            1,
          );

        const x =
          (index /
            denominator) *
          CHART_WIDTH;

        const normalized =
          maximumAmplitude ===
          0
            ? 0
            : sample /
              maximumAmplitude;

        const y =
          centerY -
          normalized *
            (CHART_HEIGHT *
              0.4);

        return `${x},${y}`;
      },
    )
    .join(' ');
}

export default function ECGViewerScreen() {
  const route =
    useRoute<ECGViewerRouteProp>();

  const navigation =
    useNavigation<ECGViewerNavigationProp>();

  const setSelectedECG =
    useAppStore(
      (state) =>
        state.setSelectedECG,
    );

  const params =
    route.params;

  const inputSource =
    params.inputSource;

  const recordId =
    params.recordId;

  const isDataset =
    inputSource ===
    'dataset';

  const split =
    isDataset
      ? params.split
      : undefined;

  const uploadedFileName =
    !isDataset
      ? params.uploadedFileName
      : undefined;

  const uploadedSamplingRate =
    !isDataset
      ? params.samplingRate
      : undefined;

  const uploadedSamples =
    !isDataset
      ? params.uploadedSamples.filter(
          (value) =>
            Number.isFinite(
              value,
            ),
        )
      : [];

  const [
    record,
    setRecord,
  ] =
    useState<ECGRecordResponse | null>(
      null,
    );

  const [
    beatIndex,
    setBeatIndex,
  ] =
    useState(0);

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const loadRecord =
    useCallback(
      async () => {
        if (
          !isDataset ||
          !split
        ) {
          return;
        }

        setLoading(true);

        setError(null);

        try {
          const response =
            await getDatasetRecord(
              split,
              recordId,
            );

          setRecord(
            response,
          );

          setBeatIndex(0);
        } catch (
          requestError
        ) {
          setRecord(null);

          if (
            requestError instanceof
            Error
          ) {
            setError(
              requestError.message,
            );
          } else {
            setError(
              'Unable to load ECG record.',
            );
          }
        } finally {
          setLoading(false);
        }
      },
      [
        isDataset,
        recordId,
        split,
      ],
    );

  useEffect(() => {
    loadRecord();
  }, [loadRecord]);

  const uploadedBeats =
    useMemo<
      ECGBeat[]
    >(
      () => {
        if (isDataset) {
          return [];
        }

        const beatCount =
          Math.floor(
            uploadedSamples
              .length /
              MODEL_INPUT_SAMPLES,
          );

        return Array.from(
          {
            length:
              beatCount,
          },

          (
            _,
            index,
          ) => {
            const start =
              index *
              MODEL_INPUT_SAMPLES;

            const end =
              start +
              MODEL_INPUT_SAMPLES;

            return {
              index,

              start,

              end:
                end - 1,

              samples:
                uploadedSamples.slice(
                  start,
                  end,
                ),
            };
          },
        );
      },
      [
        isDataset,
        uploadedSamples,
      ],
    );

  const beats =
    isDataset
      ? record?.beats ??
        []
      : uploadedBeats;

  const currentBeat =
    beats[beatIndex];

  const totalBeats =
    beats.length;

  const referenceLabel =
    currentBeat
      ?.label as
      | ECGClass
      | undefined;

  const selectedSamples =
    currentBeat
      ?.samples ??
    [];

  const samplingRate =
    isDataset
      ? MIT_BIH_SAMPLING_RATE
      : uploadedSamplingRate ??
        MIT_BIH_SAMPLING_RATE;

  const displayRecord =
    isDataset
      ? recordId
      : uploadedFileName ??
        recordId;

  const chartPoints =
    createChartPoints(
      selectedSamples,
    );

  const previousBeat =
    () => {
      if (
        totalBeats <= 1
      ) {
        return;
      }

      setBeatIndex(
        (current) =>
          current === 0
            ? totalBeats - 1
            : current - 1,
      );
    };

  const nextBeat =
    () => {
      if (
        totalBeats <= 1
      ) {
        return;
      }

      setBeatIndex(
        (current) =>
          current ===
          totalBeats - 1
            ? 0
            : current + 1,
      );
    };

  const analyzeBeat =
    () => {
      if (
        selectedSamples.length !==
        MODEL_INPUT_SAMPLES
      ) {
        return;
      }

      const inferenceInput:
        ECGInferenceInput =
        {
          recordId:
            displayRecord,

          beatIndex:
            currentBeat
              ?.index ??
            beatIndex,

          samplingRate,

          samples:
            selectedSamples,

          inputSource,

          referenceLabel,

          split:
            isDataset
              ? split
              : undefined,
        };

      setSelectedECG(
        inferenceInput,
      );

      const parentNavigation =
        navigation.getParent<RootTabNavigationProp>();

      parentNavigation?.navigate(
        'Inference',
        inferenceInput,
      );
    };

  if (
    isDataset &&
    loading
  ) {
    return (
      <View
        style={
          styles.centered
        }
      >
        <Text
          style={
            styles.centeredTitle
          }
        >
          Loading ECG
          record...
        </Text>

        <Text
          style={
            styles.centeredText
          }
        >
          {split?.toUpperCase()}{' '}
          / {recordId}
        </Text>
      </View>
    );
  }

  if (
    isDataset &&
    error
  ) {
    return (
      <View
        style={
          styles.centered
        }
      >
        <Text
          style={
            styles.errorTitle
          }
        >
          Unable to load
          record
        </Text>

        <Text
          style={
            styles.centeredText
          }
        >
          {error}
        </Text>

        <Pressable
          style={
            styles.retryButton
          }
          onPress={
            loadRecord
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
    );
  }

  return (
    <ScrollView
      style={
        styles.container
      }
      contentContainerStyle={
        styles.content
      }
    >
      <Text
        style={
          styles.title
        }
      >
        ECG Viewer
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        {displayRecord}
      </Text>

      <SectionCard title="Record Information">
        <InfoRow
          label="Source"
          value={
            isDataset
              ? 'MIT-BIH Backend'
              : 'Uploaded CSV'
          }
        />

        <InfoRow
          label="Record"
          value={
            displayRecord
          }
        />

        {isDataset &&
          split && (
          <InfoRow
            label="Split"
            value={
              split.toUpperCase()
            }
          />
        )}

        <InfoRow
          label="Sampling Rate"
          value={`${samplingRate} Hz`}
        />

        <InfoRow
          label="Heartbeats"
          value={`${totalBeats}`}
        />

        {record && (
          <InfoRow
            label="Source Dataset"
            value={
              record.source
            }
          />
        )}
      </SectionCard>

      {currentBeat ? (
        <>
          <SectionCard title="Selected Heartbeat">
            <View
              style={
                styles.beatSelector
              }
            >
              <Pressable
                style={
                  styles.arrowButton
                }
                onPress={
                  previousBeat
                }
                disabled={
                  totalBeats <=
                  1
                }
              >
                <Text
                  style={[
                    styles.arrowText,

                    totalBeats <=
                      1 &&
                      styles.arrowTextDisabled,
                  ]}
                >
                  {'<'}
                </Text>
              </Pressable>

              <View
                style={
                  styles.beatBox
                }
              >
                <Text
                  style={
                    styles.beatValue
                  }
                >
                  Beat #
                  {beatIndex +
                    1}
                </Text>

                <Text
                  style={
                    styles.beatLabel
                  }
                >
                  Index{' '}
                  {
                    currentBeat.index
                  }
                </Text>

                <Text
                  style={
                    styles.beatLabel
                  }
                >
                  {beatIndex +
                    1}{' '}
                  /{' '}
                  {
                    totalBeats
                  }
                </Text>
              </View>

              <Pressable
                style={
                  styles.arrowButton
                }
                onPress={
                  nextBeat
                }
                disabled={
                  totalBeats <=
                  1
                }
              >
                <Text
                  style={[
                    styles.arrowText,

                    totalBeats <=
                      1 &&
                      styles.arrowTextDisabled,
                  ]}
                >
                  {'>'}
                </Text>
              </Pressable>
            </View>

            <InfoRow
              label="Reference Class"
              value={
                referenceLabel ??
                'Not provided'
              }
            />

            <InfoRow
              label="Input Samples"
              value={`${selectedSamples.length} / ${MODEL_INPUT_SAMPLES}`}
            />

            {currentBeat.start !==
              undefined && (
              <InfoRow
                label="Start Sample"
                value={`${currentBeat.start}`}
              />
            )}

            {currentBeat.end !==
              undefined && (
              <InfoRow
                label="End Sample"
                value={`${currentBeat.end}`}
              />
            )}
          </SectionCard>

          <SectionCard title="Heartbeat Waveform">
            <View
              style={
                styles.chart
              }
            >
              <Svg
                width="100%"
                height={
                  CHART_HEIGHT
                }
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              >
                <Line
                  x1="0"
                  y1={
                    CHART_HEIGHT /
                    2
                  }
                  x2={
                    CHART_WIDTH
                  }
                  y2={
                    CHART_HEIGHT /
                    2
                  }
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />

                <Polyline
                  points={
                    chartPoints
                  }
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                />
              </Svg>
            </View>

            <Text
              style={
                styles.chartNote
              }
            >
              {
                selectedSamples.length
              }{' '}
              normalized samples
            </Text>
          </SectionCard>

          <Pressable
            style={[
              styles.primaryButton,

              selectedSamples.length !==
                MODEL_INPUT_SAMPLES &&
                styles.primaryButtonDisabled,
            ]}
            onPress={
              analyzeBeat
            }
            disabled={
              selectedSamples.length !==
              MODEL_INPUT_SAMPLES
            }
          >
            <Text
              style={
                styles.primaryButtonText
              }
            >
              Analyze Beat
            </Text>
          </Pressable>

          <View
            style={
              styles.notice
            }
          >
            <Text
              style={
                styles.noticeText
              }
            >
              {isDataset
                ? 'This heartbeat is loaded from the MIT-BIH backend. Analyze Beat also stores the selected heartbeat for Inference and Performance comparison.'
                : 'Uploaded CSV data is divided locally into complete 320-sample heartbeat segments. Analyze Beat stores the selected segment for inference and model comparison.'}
            </Text>
          </View>
        </>
      ) : (
        <View
          style={
            styles.emptyBox
          }
        >
          <Text
            style={
              styles.centeredText
            }
          >
            No heartbeat data
            available.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles =
  createScaledSheet({
    container: {
      flex: 1,
      backgroundColor:
        '#f8fafc',
    },

    content: {
      padding: 20,
      paddingBottom: 40,
    },

    centered: {
      flex: 1,
      backgroundColor:
        '#f8fafc',
      alignItems:
        'center',
      justifyContent:
        'center',
      padding: 24,
    },

    centeredTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#0f172a',
      marginBottom: 6,
    },

    centeredText: {
      color: '#64748b',
      textAlign:
        'center',
      lineHeight: 20,
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

    beatSelector: {
      flexDirection: 'row',
      alignItems:
        'center',
      marginBottom: 18,
    },

    arrowButton: {
      width: 46,
      height: 46,
      borderRadius: 12,
      backgroundColor:
        '#eff6ff',
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    arrowText: {
      color: '#2563eb',
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 28,
    },

    arrowTextDisabled: {
      color: '#94a3b8',
    },

    beatBox: {
      flex: 1,
      alignItems:
        'center',
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

    chart: {
      height:
        CHART_HEIGHT,
      backgroundColor:
        '#f8fafc',
      borderRadius: 12,
      overflow: 'hidden',
      justifyContent:
        'center',
    },

    chartNote: {
      textAlign:
        'center',
      color: '#64748b',
      fontSize: 12,
      marginTop: 8,
    },

    primaryButton: {
      backgroundColor:
        '#2563eb',
      borderRadius: 14,
      paddingVertical: 16,
      alignItems:
        'center',
      marginBottom: 16,
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

    notice: {
      backgroundColor:
        '#eff6ff',
      borderRadius: 12,
      padding: 14,
    },

    noticeText: {
      color: '#1e40af',
      fontSize: 13,
      lineHeight: 19,
    },

    emptyBox: {
      backgroundColor:
        '#ffffff',
      padding: 20,
      borderRadius: 14,
    },

    errorTitle: {
      color: '#b91c1c',
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 8,
    },

    retryButton: {
      marginTop: 16,
      backgroundColor:
        '#2563eb',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 10,
    },

    retryButtonText: {
      color: '#ffffff',
      fontWeight: '700',
    },
  });