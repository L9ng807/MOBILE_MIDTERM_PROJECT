import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRoute } from '@react-navigation/native';

import { generateMockInference } from '../utils/mockData';

import { useAppStore } from '../store/useAppStore';

import type {
  ECGClass,
} from '../types/ecg';

import {
  ECG_CLASSES,
  ECG_CLASS_NAMES,
  MODEL_INPUT_SAMPLES,
} from '../types/ecg';

import InfoRow from '../components/InfoRow';
import SectionCard from '../components/SectionCard';

const COLORS: Record<
  ECGClass,
  string
> = {
  N: '#16a34a',
  L: '#2563eb',
  R: '#7c3aed',
  V: '#dc2626',
  A: '#f59e0b',
};

export default function InferenceScreen() {
  const route =
    useRoute<any>();

  const recordId =
    route.params?.recordId as
      | string
      | undefined;

  const beatIndex =
    route.params?.beatIndex as
      | number
      | undefined;

  const referenceLabel =
    route.params
      ?.referenceLabel as
      | ECGClass
      | undefined;

  const samplingRate =
    route.params
      ?.samplingRate as
      | number
      | undefined;

  const samples =
    Array.isArray(
      route.params?.samples,
    )
      ? route.params.samples
      : [];

  const result =
    useAppStore(
      (state) =>
        state.latestResult,
    );

  const setLatestResult =
    useAppStore(
      (state) =>
        state.setLatestResult,
    );

  const inputReady =
    samples.length ===
    MODEL_INPUT_SAMPLES;

  const displayBeat =
    beatIndex === undefined
      ? undefined
      : beatIndex + 1;

  const runMockInference =
    () => {
      if (!inputReady) {
        return;
      }

      setLatestResult(
        generateMockInference(),
      );
    };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
    >
      <Text style={styles.title}>
        Inference
      </Text>

      <Text style={styles.subtitle}>
        ECG heartbeat classification
      </Text>

      {recordId && (
        <SectionCard title="Selected ECG">
          <InfoRow
            label="Record"
            value={recordId}
          />

          <InfoRow
            label="Selected Beat"
            value={
              displayBeat ===
              undefined
                ? 'Unknown'
                : `#${displayBeat}`
            }
          />

          <InfoRow
            label="Beat Index"
            value={
              beatIndex ===
              undefined
                ? 'Unknown'
                : `${beatIndex}`
            }
          />

          <InfoRow
            label="Sampling Rate"
            value={
              samplingRate ===
              undefined
                ? 'Unknown'
                : `${samplingRate} Hz`
            }
          />

          <InfoRow
            label="Reference Class"
            value={
              referenceLabel ??
              'Not provided'
            }
          />

          <InfoRow
            label="Input Samples"
            value={`${samples.length} / ${MODEL_INPUT_SAMPLES}`}
          />

          <InfoRow
            label="Input Status"
            value={
              inputReady
                ? 'Ready'
                : 'Invalid input length'
            }
          />
        </SectionCard>
      )}

      <SectionCard title="Model Classes">
        {ECG_CLASSES.map(
          (ecgClass) => (
            <InfoRow
              key={ecgClass}
              label={ecgClass}
              value={
                ECG_CLASS_NAMES[
                  ecgClass
                ]
              }
            />
          ),
        )}
      </SectionCard>

      <TouchableOpacity
        style={[
          styles.button,

          !inputReady &&
            styles.buttonDisabled,
        ]}
        disabled={!inputReady}
        onPress={
          runMockInference
        }
      >
        <Text
          style={
            styles.buttonText
          }
        >
          Run Inference (mock)
        </Text>
      </TouchableOpacity>

      {result && (
        <View
          style={
            styles.resultBox
          }
        >
          <Text
            style={
              styles.resultTitle
            }
          >
            Classification Result
          </Text>

          <Text
            style={[
              styles.predicted,

              {
                color:
                  COLORS[
                    result
                      .predictedClass
                  ],
              },
            ]}
          >
            Predicted:{' '}
            {
              result.predictedClass
            }{' '}
            (
            {result.confidence.toFixed(
              1,
            )}
            %)
          </Text>

          <Text
            style={
              styles.predictedName
            }
          >
            {
              ECG_CLASS_NAMES[
                result
                  .predictedClass
              ]
            }
          </Text>

          {referenceLabel && (
            <View
              style={
                styles.comparisonBox
              }
            >
              <View
                style={
                  styles.comparisonRow
                }
              >
                <Text
                  style={
                    styles.comparisonLabel
                  }
                >
                  Ground Truth
                </Text>

                <Text
                  style={[
                    styles.comparisonValue,

                    {
                      color:
                        COLORS[
                          referenceLabel
                        ],
                    },
                  ]}
                >
                  {referenceLabel}
                </Text>
              </View>

              <View
                style={
                  styles.comparisonRow
                }
              >
                <Text
                  style={
                    styles.comparisonLabel
                  }
                >
                  Prediction
                </Text>

                <Text
                  style={[
                    styles.comparisonValue,

                    {
                      color:
                        COLORS[
                          result
                            .predictedClass
                        ],
                    },
                  ]}
                >
                  {
                    result.predictedClass
                  }
                </Text>
              </View>

              <View
                style={
                  styles.comparisonRow
                }
              >
                <Text
                  style={
                    styles.comparisonLabel
                  }
                >
                  Status
                </Text>

                <Text
                  style={[
                    styles.comparisonValue,

                    {
                      color:
                        referenceLabel ===
                        result.predictedClass
                          ? '#16a34a'
                          : '#dc2626',
                    },
                  ]}
                >
                  {referenceLabel ===
                  result.predictedClass
                    ? 'Correct'
                    : 'Incorrect'}
                </Text>
              </View>

              <View
                style={
                  styles.comparisonRow
                }
              >
                <Text
                  style={
                    styles.comparisonLabel
                  }
                >
                  Confidence
                </Text>

                <Text
                  style={
                    styles.comparisonValue
                  }
                >
                  {result.confidence.toFixed(
                    1,
                  )}
                  %
                </Text>
              </View>
            </View>
          )}

          {ECG_CLASSES.map(
            (ecgClass) => (
              <View
                key={ecgClass}
                style={styles.row}
              >
                <Text
                  style={[
                    styles.label,

                    {
                      color:
                        COLORS[
                          ecgClass
                        ],
                    },
                  ]}
                >
                  {ecgClass}
                </Text>

                <View
                  style={
                    styles.barBg
                  }
                >
                  <View
                    style={[
                      styles.barFill,

                      {
                        width: `${result.probabilities[ecgClass]}%`,

                        backgroundColor:
                          COLORS[
                            ecgClass
                          ],
                      },
                    ]}
                  />
                </View>

                <Text
                  style={
                    styles.value
                  }
                >
                  {result.probabilities[
                    ecgClass
                  ].toFixed(1)}
                  %
                </Text>
              </View>
            ),
          )}

          <InfoRow
            label="Latency"
            value={`${result.latencyMs.toFixed(2)} ms`}
          />

          <Text style={styles.note}>
            * Mock inference result for
            UI testing only. Software
            inference will be connected
            to the ECG NAS backend in
            the next checkpoints.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
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

    button: {
      backgroundColor: '#2563eb',
      paddingVertical: 15,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 16,
    },

    buttonDisabled: {
      backgroundColor: '#94a3b8',
    },

    buttonText: {
      color: '#ffffff',
      fontWeight: '700',
      fontSize: 16,
    },

    resultBox: {
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 16,
      gap: 10,
    },

    resultTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: '#0f172a',
      marginBottom: 4,
    },

    predicted: {
      fontSize: 18,
      fontWeight: '700',
      textAlign: 'center',
    },

    predictedName: {
      textAlign: 'center',
      fontSize: 13,
      color: '#64748b',
      marginBottom: 8,
    },

    comparisonBox: {
      backgroundColor: '#f8fafc',
      borderWidth: 1,
      borderColor: '#e2e8f0',
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      gap: 10,
    },

    comparisonRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
    },

    comparisonLabel: {
      fontSize: 14,
      color: '#64748b',
    },

    comparisonValue: {
      fontSize: 14,
      fontWeight: '700',
      color: '#0f172a',
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    label: {
      width: 20,
      fontWeight: '700',
    },

    barBg: {
      flex: 1,
      height: 10,
      backgroundColor: '#e2e8f0',
      borderRadius: 5,
      overflow: 'hidden',
    },

    barFill: {
      height: '100%',
    },

    value: {
      width: 50,
      textAlign: 'right',
    },

    note: {
      fontSize: 12,
      color: '#64748b',
      marginTop: 12,
      fontStyle: 'italic',
      lineHeight: 18,
    },
  });