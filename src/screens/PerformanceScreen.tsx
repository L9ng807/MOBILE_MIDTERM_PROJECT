import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';

import InfoRow from '../components/InfoRow';
import SectionCard from '../components/SectionCard';

import {
  compareSoftwareModels,
} from '../services/inferenceApi';

import {
  getCandidates,
} from '../services/modelApi';

import {
  useAppStore,
} from '../store/useAppStore';

import type {
  SoftwareComparisonResponse,
} from '../types/inference';

import type {
  CandidateInfo,
} from '../types/model';

import {
  ECG_CLASSES,
  ECG_CLASS_NAMES,
  MODEL_INPUT_SAMPLES,
} from '../types/ecg';

import { createScaledSheet } from '../utils/responsive';

export default function PerformanceScreen() {
  const selectedECG =
    useAppStore(
      (state) =>
        state.selectedECG,
    );

  const [
    candidates,
    setCandidates,
  ] =
    useState<
      CandidateInfo[]
    >([]);

  const [
    comparison,
    setComparison,
  ] =
    useState<
      SoftwareComparisonResponse | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);

  const [
    comparing,
    setComparing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    comparisonError,
    setComparisonError,
  ] =
    useState<string | null>(
      null,
    );

  const loadCandidates =
    useCallback(
      async (
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
            await getCandidates();

          const sorted =
            [
              ...response,
            ].sort(
              (
                first,
                second,
              ) =>
                first.candidate_id -
                second.candidate_id,
            );

          setCandidates(
            sorted,
          );
        } catch (
          requestError
        ) {
          setCandidates([]);

          if (
            requestError instanceof
            Error
          ) {
            setError(
              requestError.message,
            );
          } else {
            setError(
              'Unable to load model candidates.',
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
    loadCandidates();
  }, [loadCandidates]);

  useEffect(() => {
    setComparison(null);

    setComparisonError(
      null,
    );
  }, [selectedECG]);

  const runComparison =
    async () => {
      if (!selectedECG) {
        setComparisonError(
          'Select a heartbeat from the ECG Viewer first.',
        );

        return;
      }

      if (
        selectedECG
          .samples.length !==
        MODEL_INPUT_SAMPLES
      ) {
        setComparisonError(
          `Comparison requires exactly ${MODEL_INPUT_SAMPLES} samples.`,
        );

        return;
      }

      setComparing(true);

      setComparison(null);

      setComparisonError(
        null,
      );

      try {
        const response =
          await compareSoftwareModels(
            {
              index:
                selectedECG
                  .beatIndex,

              label:
                selectedECG
                  .referenceLabel,

              samples:
                selectedECG
                  .samples,
            },
          );

        setComparison({
          ...response,

          rows:
            [
              ...response.rows,
            ].sort(
              (
                first,
                second,
              ) =>
                first
                  .candidate
                  .candidate_id -
                second
                  .candidate
                  .candidate_id,
            ),
        });
      } catch (
        requestError
      ) {
        if (
          requestError instanceof
          Error
        ) {
          setComparisonError(
            requestError.message,
          );
        } else {
          setComparisonError(
            'Unable to compare models.',
          );
        }
      } finally {
        setComparing(false);
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
      refreshControl={
        <RefreshControl
          refreshing={
            refreshing
          }
          onRefresh={() =>
            loadCandidates(
              true,
            )
          }
        />
      }
    >
      <Text
        style={styles.title}
      >
        Model Performance
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        Explore and compare
        Hardware-Aware NAS
        candidates
      </Text>

      <SectionCard title="Available Models">
        {loading ? (
          <View
            style={
              styles.loadingRow
            }
          >
            <ActivityIndicator />

            <Text
              style={
                styles.loadingText
              }
            >
              Loading model
              candidates...
            </Text>
          </View>
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
              Candidate request
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
                loadCandidates()
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
            ) => (
              <View
                key={
                  candidate
                    .candidate_id
                }
                style={
                  styles.modelCard
                }
              >
                <View
                  style={
                    styles.modelHeader
                  }
                >
                  <View
                    style={
                      styles.modelTitleContainer
                    }
                  >
                    <Text
                      style={
                        styles.modelTitle
                      }
                    >
                      Candidate #
                      {
                        candidate
                          .candidate_id
                      }
                    </Text>

                    <Text
                      style={
                        styles.modelRole
                      }
                    >
                      {
                        candidate.label
                      }
                    </Text>
                  </View>

                  <View
                    style={
                      styles.int8Badge
                    }
                  >
                    <Text
                      style={
                        styles.int8BadgeText
                      }
                    >
                      INT8
                    </Text>
                  </View>
                </View>

                <Text
                  style={
                    styles.purpose
                  }
                >
                  {
                    candidate.purpose
                  }
                </Text>

                <InfoRow
                  label="Validation Accuracy"
                  value={`${(
                    candidate.int8_val_accuracy *
                    100
                  ).toFixed(
                    2,
                  )}%`}
                />

                <InfoRow
                  label="Macro F1"
                  value={`${(
                    candidate.int8_val_macro_f1 *
                    100
                  ).toFixed(
                    2,
                  )}%`}
                />

                <InfoRow
                  label="Parameters"
                  value={
                    candidate.params.toLocaleString()
                  }
                />

                <InfoRow
                  label="MACs"
                  value={
                    candidate.macs.toLocaleString()
                  }
                />

                <InfoRow
                  label="INT8 Model Size"
                  value={`${candidate.int8_model_size_kb.toFixed(
                    2,
                  )} KB`}
                />

                <InfoRow
                  label="INT8 Status"
                  value={
                    candidate.int8_status
                  }
                />
              </View>
            ),
          )
        )}
      </SectionCard>

      <SectionCard title="Selected Heartbeat">
        {selectedECG ? (
          <>
            <InfoRow
              label="Record"
              value={
                selectedECG
                  .recordId
              }
            />

            <InfoRow
              label="Beat"
              value={`#${selectedECG.beatIndex + 1}`}
            />

            <InfoRow
              label="Beat Index"
              value={`${selectedECG.beatIndex}`}
            />

            <InfoRow
              label="Source"
              value={
                selectedECG
                  .inputSource ===
                'dataset'
                  ? 'MIT-BIH'
                  : 'Uploaded CSV'
              }
            />

            <InfoRow
              label="Ground Truth"
              value={
                selectedECG
                  .referenceLabel ??
                'Not provided'
              }
            />

            <InfoRow
              label="Samples"
              value={`${selectedECG.samples.length} / ${MODEL_INPUT_SAMPLES}`}
            />
          </>
        ) : (
          <View
            style={
              styles.emptySelection
            }
          >
            <Text
              style={
                styles.emptySelectionTitle
              }
            >
              No heartbeat selected
            </Text>

            <Text
              style={
                styles.emptySelectionText
              }
            >
              Go to ECG, select a
              record and heartbeat,
              then press Analyze
              Beat.
            </Text>
          </View>
        )}
      </SectionCard>

      {comparisonError && (
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
            Comparison failed
          </Text>

          <Text
            style={
              styles.errorText
            }
          >
            {comparisonError}
          </Text>
        </View>
      )}

      <Pressable
        style={[
          styles.compareButton,

          (!selectedECG ||
            comparing) &&
            styles.compareButtonDisabled,
        ]}
        onPress={
          runComparison
        }
        disabled={
          !selectedECG ||
          comparing
        }
      >
        {comparing ? (
          <View
            style={
              styles.compareButtonContent
            }
          >
            <ActivityIndicator
              color="#ffffff"
            />

            <Text
              style={
                styles.compareButtonText
              }
            >
              Comparing all
              models...
            </Text>
          </View>
        ) : (
          <Text
            style={
              styles.compareButtonText
            }
          >
            Compare All INT8
            Models
          </Text>
        )}
      </Pressable>

      {comparison && (
        <SectionCard title="Software Comparison">
          <InfoRow
            label="Mode"
            value={
              comparison.mode.toUpperCase()
            }
          />

          <InfoRow
            label="Models"
            value={`${comparison.rows.length}`}
          />

          {comparison.rows.map(
            (row) => {
              const candidate =
                row.candidate;

              return (
                <View
                  key={
                    candidate
                      .candidate_id
                  }
                  style={
                    styles.comparisonCard
                  }
                >
                  <View
                    style={
                      styles.comparisonHeader
                    }
                  >
                    <Text
                      style={
                        styles.comparisonTitle
                      }
                    >
                      Candidate #
                      {
                        candidate
                          .candidate_id
                      }
                    </Text>

                    <Text
                      style={
                        styles.comparisonRole
                      }
                    >
                      {
                        candidate.label
                      }
                    </Text>
                  </View>

                  {!row.ok ? (
                    <View
                      style={
                        styles.rowErrorBox
                      }
                    >
                      <Text
                        style={
                          styles.errorText
                        }
                      >
                        {row.error}
                      </Text>
                    </View>
                  ) : (
                    <>
                      <InfoRow
                        label="Prediction"
                        value={`${row.result.predicted_class} - ${
                          ECG_CLASS_NAMES[
                            row
                              .result
                              .predicted_class
                          ]
                        }`}
                      />

                      <InfoRow
                        label="Confidence"
                        value={`${(
                          row.result
                            .confidence *
                          100
                        ).toFixed(
                          2,
                        )}%`}
                      />

                      <InfoRow
                        label="Latency"
                        value={`${row.result.latency_ms.toFixed(
                          3,
                        )} ms`}
                      />

                      {selectedECG?.referenceLabel && (
                        <InfoRow
                          label="Status"
                          value={
                            selectedECG.referenceLabel ===
                            row
                              .result
                              .predicted_class
                              ? 'Correct'
                              : 'Incorrect'
                          }
                        />
                      )}

                      <View
                        style={
                          styles.probabilityBlock
                        }
                      >
                        <Text
                          style={
                            styles.probabilityTitle
                          }
                        >
                          Probabilities
                        </Text>

                        {ECG_CLASSES.map(
                          (
                            ecgClass,
                          ) => (
                            <View
                              key={
                                ecgClass
                              }
                              style={
                                styles.probabilityRow
                              }
                            >
                              <Text
                                style={
                                  styles.probabilityLabel
                                }
                              >
                                {
                                  ecgClass
                                }
                              </Text>

                              <Text
                                style={
                                  styles.probabilityValue
                                }
                              >
                                {(
                                  (
                                    row
                                      .result
                                      .probabilities[
                                      ecgClass
                                    ] ??
                                    0
                                  ) *
                                  100
                                ).toFixed(
                                  2,
                                )}
                                %
                              </Text>
                            </View>
                          ),
                        )}
                      </View>
                    </>
                  )}
                </View>
              );
            },
          )}

          <Text
            style={
              styles.latencyNote
            }
          >
            Latency shown here is
            TFLite inference time
            measured by the backend.
            It does not include the
            complete phone-to-server
            Wi-Fi round trip.
          </Text>
        </SectionCard>
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

    loadingRow: {
      flexDirection: 'row',

      alignItems:
        'center',

      gap: 10,
    },

    loadingText: {
      color: '#64748b',
    },

    modelCard: {
      borderWidth: 1,

      borderColor:
        '#e2e8f0',

      borderRadius: 12,

      padding: 14,

      marginBottom: 14,

      backgroundColor:
        '#f8fafc',
    },

    modelHeader: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',

      marginBottom: 8,
    },

    modelTitleContainer: {
      flex: 1,
    },

    modelTitle: {
      color: '#0f172a',

      fontSize: 16,

      fontWeight: '700',
    },

    modelRole: {
      color: '#2563eb',

      fontSize: 13,

      fontWeight: '600',

      marginTop: 2,
    },

    int8Badge: {
      backgroundColor:
        '#eef2ff',

      paddingHorizontal: 10,

      paddingVertical: 5,

      borderRadius: 10,
    },

    int8BadgeText: {
      color: '#4338ca',

      fontSize: 11,

      fontWeight: '700',
    },

    purpose: {
      color: '#64748b',

      fontSize: 12,

      lineHeight: 18,

      marginBottom: 10,
    },

    emptySelection: {
      alignItems:
        'center',

      paddingVertical: 10,
    },

    emptySelectionTitle: {
      color: '#334155',

      fontWeight: '700',

      marginBottom: 4,
    },

    emptySelectionText: {
      color: '#64748b',

      fontSize: 13,

      lineHeight: 19,

      textAlign:
        'center',
    },

    compareButton: {
      backgroundColor:
        '#2563eb',

      borderRadius: 14,

      paddingVertical: 16,

      alignItems:
        'center',

      marginBottom: 16,
    },

    compareButtonDisabled: {
      backgroundColor:
        '#94a3b8',
    },

    compareButtonContent: {
      flexDirection: 'row',

      alignItems:
        'center',

      gap: 10,
    },

    compareButtonText: {
      color: '#ffffff',

      fontSize: 16,

      fontWeight: '700',
    },

    comparisonCard: {
      borderTopWidth: 1,

      borderTopColor:
        '#e2e8f0',

      paddingTop: 14,

      marginTop: 14,
    },

    comparisonHeader: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',

      marginBottom: 10,
    },

    comparisonTitle: {
      color: '#0f172a',

      fontSize: 15,

      fontWeight: '700',
    },

    comparisonRole: {
      color: '#2563eb',

      fontSize: 12,

      fontWeight: '600',
    },

    probabilityBlock: {
      backgroundColor:
        '#f8fafc',

      borderRadius: 10,

      padding: 10,

      marginTop: 8,
    },

    probabilityTitle: {
      color: '#475569',

      fontWeight: '700',

      fontSize: 12,

      marginBottom: 6,
    },

    probabilityRow: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      marginVertical: 2,
    },

    probabilityLabel: {
      color: '#64748b',

      fontSize: 12,

      fontWeight: '600',
    },

    probabilityValue: {
      color: '#0f172a',

      fontSize: 12,

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

    rowErrorBox: {
      backgroundColor:
        '#fef2f2',

      borderRadius: 10,

      padding: 10,
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

      alignItems:
        'center',

      marginTop: 10,
    },

    retryButtonText: {
      color: '#ffffff',

      fontWeight: '700',
    },

    latencyNote: {
      color: '#64748b',

      fontSize: 12,

      lineHeight: 18,

      fontStyle: 'italic',

      marginTop: 16,
    },
  });