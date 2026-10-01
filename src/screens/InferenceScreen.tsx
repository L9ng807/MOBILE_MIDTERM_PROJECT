import {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  useRoute,
} from '@react-navigation/native';

import type {
  RouteProp,
} from '@react-navigation/native';

import InfoRow from '../components/InfoRow';
import SectionCard from '../components/SectionCard';

import {
  getCandidates,
} from '../services/modelApi';

import {
  runSoftwareInference,
} from '../services/inferenceApi';

import type {
  ECGClass,
} from '../types/ecg';

import {
  ECG_CLASSES,
  ECG_CLASS_NAMES,
  MODEL_INPUT_SAMPLES,
} from '../types/ecg';

import type {
  InferenceDisplayResult,
} from '../types/inference';

import type {
  CandidateInfo,
} from '../types/model';

import type {
  RootTabParamList,
} from '../types/navigation';

import { createScaledSheet } from '../utils/responsive';

type InferenceRouteProp =
  RouteProp<
    RootTabParamList,
    'Inference'
  >;

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
    useRoute<InferenceRouteProp>();

  const params =
    route.params;

  const recordId =
    params?.recordId;

  const beatIndex =
    params?.beatIndex;

  const referenceLabel =
    params?.referenceLabel;

  const samplingRate =
    params?.samplingRate;

  const samples =
    params?.samples ??
    [];

  const [
    candidates,
    setCandidates,
  ] =
    useState<
      CandidateInfo[]
    >([]);

  const [
    selectedCandidateId,
    setSelectedCandidateId,
  ] =
    useState<number | null>(
      null,
    );

  const [
    result,
    setResult,
  ] =
    useState<
      InferenceDisplayResult | null
    >(null);

  const [
    loadingCandidates,
    setLoadingCandidates,
  ] =
    useState(true);

  const [
    runningInference,
    setRunningInference,
  ] =
    useState(false);

  const [
    candidateError,
    setCandidateError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    inferenceError,
    setInferenceError,
  ] =
    useState<string | null>(
      null,
    );

  const inputReady =
    samples.length ===
    MODEL_INPUT_SAMPLES;

  const selectedCandidate =
    candidates.find(
      (candidate) =>
        candidate.candidate_id ===
        selectedCandidateId,
    );

  const loadCandidates =
    async () => {
      setLoadingCandidates(
        true,
      );

      setCandidateError(
        null,
      );

      try {
        const response =
          await getCandidates();

        setCandidates(
          response,
        );

        const balanced =
          response.find(
            (candidate) =>
              candidate.role ===
                'balanced' ||
              candidate
                .candidate_id ===
                69,
          );

        const firstCandidate =
          balanced ??
          response[0];

        setSelectedCandidateId(
          firstCandidate
            ?.candidate_id ??
            null,
        );
      } catch (
        requestError
      ) {
        setCandidates([]);

        setSelectedCandidateId(
          null,
        );

        if (
          requestError instanceof
          Error
        ) {
          setCandidateError(
            requestError.message,
          );
        } else {
          setCandidateError(
            'Unable to load model candidates.',
          );
        }
      } finally {
        setLoadingCandidates(
          false,
        );
      }
    };

  useEffect(() => {
    loadCandidates();
  }, []);

  useEffect(() => {
    setResult(null);

    setInferenceError(
      null,
    );
  }, [
    recordId,
    beatIndex,
  ]);

  const handleRunInference =
    async () => {
      if (!inputReady) {
        setInferenceError(
          `Inference requires exactly ${MODEL_INPUT_SAMPLES} samples.`,
        );

        return;
      }

      if (
        selectedCandidateId ===
        null
      ) {
        setInferenceError(
          'Please select a model candidate.',
        );

        return;
      }

      setRunningInference(
        true,
      );

      setInferenceError(
        null,
      );

      setResult(null);

      try {
        const prediction =
          await runSoftwareInference(
            selectedCandidateId,
            {
              index:
                beatIndex ??
                0,

              label:
                referenceLabel,

              samples,
            },
          );

        setResult(
          prediction,
        );
      } catch (
        requestError
      ) {
        if (
          requestError instanceof
          Error
        ) {
          setInferenceError(
            requestError.message,
          );
        } else {
          setInferenceError(
            'Inference request failed.',
          );
        }
      } finally {
        setRunningInference(
          false,
        );
      }
    };

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
        style={styles.title}
      >
        Inference
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        Real TFLite INT8 ECG
        heartbeat classification
      </Text>

      <SectionCard title="Selected ECG">
        <InfoRow
          label="Record"
          value={
            recordId ??
            'Not selected'
          }
        />

        <InfoRow
          label="Selected Beat"
          value={
            beatIndex ===
            undefined
              ? 'Not selected'
              : `#${beatIndex + 1}`
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
          label="Ground Truth"
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
              : 'Invalid'
          }
        />
      </SectionCard>

      <SectionCard title="Model Candidate">
        {loadingCandidates ? (
          <View
            style={
              styles.loadingBox
            }
          >
            <ActivityIndicator />

            <Text
              style={
                styles.loadingText
              }
            >
              Loading candidates...
            </Text>
          </View>
        ) : candidateError ? (
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
              Unable to load
              candidates
            </Text>

            <Text
              style={
                styles.errorText
              }
            >
              {candidateError}
            </Text>

            <Pressable
              style={
                styles.retryButton
              }
              onPress={
                loadCandidates
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
        ) : (
          candidates.map(
            (
              candidate,
            ) => {
              const selected =
                candidate
                  .candidate_id ===
                selectedCandidateId;

              return (
                <Pressable
                  key={
                    candidate
                      .candidate_id
                  }
                  style={[
                    styles.candidateCard,

                    selected &&
                      styles.candidateCardSelected,
                  ]}
                  onPress={() => {
                    setSelectedCandidateId(
                      candidate
                        .candidate_id,
                    );

                    setResult(
                      null,
                    );

                    setInferenceError(
                      null,
                    );
                  }}
                >
                  <View
                    style={
                      styles.candidateHeader
                    }
                  >
                    <View>
                      <Text
                        style={[
                          styles.candidateName,

                          selected &&
                            styles.candidateNameSelected,
                        ]}
                      >
                        Candidate #
                        {
                          candidate
                            .candidate_id
                        }
                      </Text>

                      <Text
                        style={
                          styles.candidateLabel
                        }
                      >
                        {
                          candidate.label
                        }
                      </Text>
                    </View>

                    {selected && (
                      <View
                        style={
                          styles.selectedBadge
                        }
                      >
                        <Text
                          style={
                            styles.selectedBadgeText
                          }
                        >
                          Selected
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text
                    style={
                      styles.candidatePurpose
                    }
                  >
                    {
                      candidate.purpose
                    }
                  </Text>

                  <View
                    style={
                      styles.candidateMetrics
                    }
                  >
                    <Text
                      style={
                        styles.metricText
                      }
                    >
                      F1{' '}
                      {(
                        candidate
                          .int8_val_macro_f1 *
                        100
                      ).toFixed(
                        2,
                      )}
                      %
                    </Text>

                    <Text
                      style={
                        styles.metricText
                      }
                    >
                      Params{' '}
                      {
                        candidate.params
                      }
                    </Text>

                    <Text
                      style={
                        styles.metricText
                      }
                    >
                      MACs{' '}
                      {
                        candidate.macs
                      }
                    </Text>
                  </View>
                </Pressable>
              );
            },
          )
        )}
      </SectionCard>

      {selectedCandidate && (
        <SectionCard title="Selected Model">
          <InfoRow
            label="Candidate"
            value={`#${selectedCandidate.candidate_id}`}
          />

          <InfoRow
            label="Role"
            value={
              selectedCandidate.label
            }
          />

          <InfoRow
            label="INT8 Status"
            value={
              selectedCandidate.int8_status
            }
          />

          <InfoRow
            label="INT8 Accuracy"
            value={`${(
              selectedCandidate.int8_val_accuracy *
              100
            ).toFixed(2)}%`}
          />

          <InfoRow
            label="INT8 Macro F1"
            value={`${(
              selectedCandidate.int8_val_macro_f1 *
              100
            ).toFixed(2)}%`}
          />

          <InfoRow
            label="Parameters"
            value={`${selectedCandidate.params}`}
          />

          <InfoRow
            label="MACs"
            value={`${selectedCandidate.macs}`}
          />

          <InfoRow
            label="Model Size"
            value={`${selectedCandidate.int8_model_size_kb.toFixed(
              2,
            )} KB`}
          />
        </SectionCard>
      )}

      {inferenceError && (
        <View
          style={
            styles.errorBoxStandalone
          }
        >
          <Text
            style={
              styles.errorTitle
            }
          >
            Inference failed
          </Text>

          <Text
            style={
              styles.errorText
            }
          >
            {inferenceError}
          </Text>
        </View>
      )}

      <Pressable
        style={[
          styles.runButton,

          (!inputReady ||
            selectedCandidateId ===
              null ||
            runningInference) &&
            styles.runButtonDisabled,
        ]}
        onPress={
          handleRunInference
        }
        disabled={
          !inputReady ||
          selectedCandidateId ===
            null ||
          runningInference
        }
      >
        {runningInference ? (
          <View
            style={
              styles.runButtonContent
            }
          >
            <ActivityIndicator
              color="#ffffff"
            />

            <Text
              style={
                styles.runButtonText
              }
            >
              Running inference...
            </Text>
          </View>
        ) : (
          <Text
            style={
              styles.runButtonText
            }
          >
            Run Software Inference
          </Text>
        )}
      </Pressable>

      {result && (
        <>
          <SectionCard title="Classification Result">
            <Text
              style={[
                styles.predictedClass,

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
                result
                  .predictedClass
              }
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

            <InfoRow
              label="Backend"
              value={
                result.backend
              }
            />

            <InfoRow
              label="Candidate"
              value={`#${result.candidate.candidate_id} - ${result.candidate.label}`}
            />

            <InfoRow
              label="Confidence"
              value={`${result.confidencePercent.toFixed(
                2,
              )}%`}
            />

            <InfoRow
              label="Inference Latency"
              value={`${result.latencyMs.toFixed(
                3,
              )} ms`}
            />
          </SectionCard>

          {referenceLabel && (
            <SectionCard title="Ground Truth Comparison">
              <InfoRow
                label="Ground Truth"
                value={
                  referenceLabel
                }
              />

              <InfoRow
                label="Prediction"
                value={
                  result
                    .predictedClass
                }
              />

              <View
                style={
                  styles.statusRow
                }
              >
                <Text
                  style={
                    styles.statusLabel
                  }
                >
                  Status
                </Text>

                <Text
                  style={[
                    styles.statusValue,

                    {
                      color:
                        referenceLabel ===
                        result
                          .predictedClass
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
            </SectionCard>
          )}

          <SectionCard title="Class Probabilities">
            {ECG_CLASSES.map(
              (
                ecgClass,
              ) => {
                const probability =
                  result
                    .probabilitiesPercent[
                    ecgClass
                  ];

                const width =
                  Math.min(
                    100,
                    Math.max(
                      0,
                      probability,
                    ),
                  );

                return (
                  <View
                    key={
                      ecgClass
                    }
                    style={
                      styles.probabilityRow
                    }
                  >
                    <View
                      style={
                        styles.probabilityHeader
                      }
                    >
                      <Text
                        style={[
                          styles.probabilityClass,

                          {
                            color:
                              COLORS[
                                ecgClass
                              ],
                          },
                        ]}
                      >
                        {
                          ecgClass
                        }
                      </Text>

                      <Text
                        style={
                          styles.probabilityName
                        }
                      >
                        {
                          ECG_CLASS_NAMES[
                            ecgClass
                          ]
                        }
                      </Text>

                      <Text
                        style={
                          styles.probabilityValue
                        }
                      >
                        {probability.toFixed(
                          2,
                        )}
                        %
                      </Text>
                    </View>

                    <View
                      style={
                        styles.barBackground
                      }
                    >
                      <View
                        style={[
                          styles.barFill,

                          {
                            width: `${width}%`,

                            backgroundColor:
                              COLORS[
                                ecgClass
                              ],
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              },
            )}
          </SectionCard>

          <View
            style={
              styles.realInferenceNotice
            }
          >
            <Text
              style={
                styles.realInferenceTitle
              }
            >
              Real Inference
            </Text>

            <Text
              style={
                styles.realInferenceText
              }
            >
              This result was produced
              by the selected INT8
              TFLite model running on
              the ECG NAS backend.
            </Text>
          </View>
        </>
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

    loadingBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 8,
    },

    loadingText: {
      color: '#64748b',
    },

    candidateCard: {
      borderWidth: 1,
      borderColor: '#cbd5e1',
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      backgroundColor:
        '#ffffff',
    },

    candidateCardSelected: {
      borderColor: '#2563eb',
      backgroundColor:
        '#eff6ff',
    },

    candidateHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
    },

    candidateName: {
      fontSize: 16,
      fontWeight: '700',
      color: '#0f172a',
    },

    candidateNameSelected: {
      color: '#1d4ed8',
    },

    candidateLabel: {
      fontSize: 13,
      color: '#64748b',
      marginTop: 2,
    },

    selectedBadge: {
      backgroundColor:
        '#2563eb',
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },

    selectedBadgeText: {
      color: '#ffffff',
      fontWeight: '700',
      fontSize: 11,
    },

    candidatePurpose: {
      color: '#64748b',
      fontSize: 12,
      lineHeight: 17,
      marginTop: 8,
    },

    candidateMetrics: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 10,
    },

    metricText: {
      color: '#334155',
      fontSize: 12,
      fontWeight: '600',
    },

    runButton: {
      backgroundColor:
        '#2563eb',
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 16,
    },

    runButtonDisabled: {
      backgroundColor:
        '#94a3b8',
    },

    runButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },

    runButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '700',
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

    errorBoxStandalone: {
      backgroundColor:
        '#fef2f2',
      borderWidth: 1,
      borderColor:
        '#fecaca',
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
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
      backgroundColor:
        '#dc2626',
      borderRadius: 10,
      paddingVertical: 10,
      marginTop: 10,
      alignItems: 'center',
    },

    retryButtonText: {
      color: '#ffffff',
      fontWeight: '700',
    },

    predictedClass: {
      fontSize: 44,
      fontWeight: '800',
      textAlign:
        'center',
    },

    predictedName: {
      color: '#64748b',
      textAlign:
        'center',
      marginBottom: 16,
      fontSize: 14,
    },

    statusRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },

    statusLabel: {
      color: '#64748b',
      fontSize: 15,
    },

    statusValue: {
      fontSize: 15,
      fontWeight: '700',
    },

    probabilityRow: {
      marginBottom: 14,
    },

    probabilityHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },

    probabilityClass: {
      width: 24,
      fontWeight: '800',
      fontSize: 14,
    },

    probabilityName: {
      flex: 1,
      color: '#475569',
      fontSize: 12,
    },

    probabilityValue: {
      width: 62,
      textAlign:
        'right',
      color: '#0f172a',
      fontWeight: '700',
      fontSize: 12,
    },

    barBackground: {
      height: 10,
      backgroundColor:
        '#e2e8f0',
      borderRadius: 5,
      overflow: 'hidden',
    },

    barFill: {
      height: '100%',
      borderRadius: 5,
    },

    realInferenceNotice: {
      backgroundColor:
        '#f0fdf4',
      borderWidth: 1,
      borderColor:
        '#bbf7d0',
      borderRadius: 12,
      padding: 14,
    },

    realInferenceTitle: {
      color: '#166534',
      fontWeight: '700',
      marginBottom: 4,
    },

    realInferenceText: {
      color: '#15803d',
      fontSize: 13,
      lineHeight: 19,
    },
  });