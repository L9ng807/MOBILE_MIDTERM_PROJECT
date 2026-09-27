import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import InfoRow from '../components/InfoRow';
import MetricItem from '../components/MetricItem';
import SectionCard from '../components/SectionCard';
import StatusBadge from '../components/StatusBadge';

import {
  getSystemStatus,
} from '../services/systemApi';

import {
  useConnectionStore,
} from '../store/useConnectionStore';

import type {
  SystemStatusResponse,
} from '../types/api';

import {
  ECG_CLASSES,
  MIT_BIH_SAMPLING_RATE,
  MODEL_INPUT_SAMPLES,
} from '../types/ecg';

export default function DashboardScreen() {
  const backendUrl =
    useConnectionStore(
      (state) =>
        state.backendUrl,
    );

  const hasHydrated =
    useConnectionStore(
      (state) =>
        state.hasHydrated,
    );

  const [
    status,
    setStatus,
  ] =
    useState<SystemStatusResponse | null>(
      null,
    );

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
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const loadStatus =
    useCallback(
      async (
        isRefresh = false,
      ) => {
        if (!hasHydrated) {
          return;
        }

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        try {
          const response =
            await getSystemStatus(
              backendUrl,
            );

          setStatus(
            response,
          );
        } catch (
          requestError
        ) {
          setStatus(null);

          if (
            requestError instanceof
            Error
          ) {
            setError(
              requestError.message,
            );
          } else {
            setError(
              'Unable to connect to backend.',
            );
          }
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [
        backendUrl,
        hasHydrated,
      ],
    );

  useEffect(() => {
    if (hasHydrated) {
      loadStatus();
    }
  }, [
    hasHydrated,
    loadStatus,
  ]);

  const backendOnline =
    status !== null;

  const datasetConnected =
    status?.dataset
      .connected ??
    false;

  const tensorflowAvailable =
    status?.runtime
      .tensorflow_available ??
    false;

  const nasReady =
    status?.nas
      .search_space_backend_ready ??
    false;

  const pynqConfigured =
    status
      ?.pynq_configured ??
    false;

  const modelsFound =
    status?.runtime
      .models_found ??
    0;

  const modelsTotal =
    status?.runtime
      .models_total ??
    0;

  const modelIds =
    status
      ? Object.keys(
          status.runtime
            .model_paths,
        ).sort(
          (
            first,
            second,
          ) =>
            Number(first) -
            Number(second),
        )
      : [];

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
            loadStatus(true)
          }
        />
      }
    >
      <Text
        style={styles.title}
      >
        Hardware-Aware ECG
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        ECG Analysis &
        Hardware-Aware NAS
      </Text>

      <SectionCard title="Backend Connection">
        <View
          style={
            styles.statusRow
          }
        >
          <Text
            style={
              styles.label
            }
          >
            Backend
          </Text>

          <StatusBadge
            text={
              backendOnline
                ? 'Online'
                : 'Offline'
            }
            online={
              backendOnline
            }
          />
        </View>

        <InfoRow
          label="Server"
          value={
            hasHydrated
              ? backendUrl
              : 'Loading...'
          }
        />

        {loading &&
          hasHydrated && (
          <Text
            style={
              styles.infoText
            }
          >
            Checking backend...
          </Text>
        )}

        {error && (
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
              Connection failed
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
                loadStatus()
              }
            >
              <Text
                style={
                  styles.retryButtonText
                }
              >
                Retry Connection
              </Text>
            </Pressable>
          </View>
        )}
      </SectionCard>

      <SectionCard title="System Status">
        <InfoRow
          label="Dataset"
          value={
            status?.dataset
              .mode ??
            'Unknown'
          }
        />

        <View
          style={
            styles.statusRow
          }
        >
          <Text
            style={
              styles.label
            }
          >
            Dataset Connection
          </Text>

          <StatusBadge
            text={
              datasetConnected
                ? 'Connected'
                : 'Disconnected'
            }
            online={
              datasetConnected
            }
          />
        </View>

        <View
          style={
            styles.statusRow
          }
        >
          <Text
            style={
              styles.label
            }
          >
            TensorFlow
          </Text>

          <StatusBadge
            text={
              tensorflowAvailable
                ? 'Available'
                : 'Unavailable'
            }
            online={
              tensorflowAvailable
            }
          />
        </View>

        <View
          style={
            styles.statusRow
          }
        >
          <Text
            style={
              styles.label
            }
          >
            NAS Backend
          </Text>

          <StatusBadge
            text={
              nasReady
                ? 'Ready'
                : 'Not Ready'
            }
            online={
              nasReady
            }
          />
        </View>

        <View
          style={
            styles.statusRow
          }
        >
          <Text
            style={
              styles.label
            }
          >
            PYNQ
          </Text>

          <StatusBadge
            text={
              pynqConfigured
                ? 'Configured'
                : 'Not Configured'
            }
            online={
              pynqConfigured
            }
          />
        </View>
      </SectionCard>

      <SectionCard title="Inference Runtime">
        <View
          style={
            styles.metricRow
          }
        >
          <MetricItem
            value={`${modelsFound}`}
            label="Models Found"
          />

          <MetricItem
            value={`${modelsTotal}`}
            label="Models Total"
          />

          <MetricItem
            value={
              tensorflowAvailable
                ? 'Ready'
                : 'Unavailable'
            }
            label="TensorFlow"
          />
        </View>

        {modelIds.length >
          0 && (
          <View
            style={
              styles.modelList
            }
          >
            <Text
              style={
                styles.modelListTitle
              }
            >
              Available INT8
              Candidates
            </Text>

            {modelIds.map(
              (modelId) => (
                <View
                  key={
                    modelId
                  }
                  style={
                    styles.modelItem
                  }
                >
                  <Text
                    style={
                      styles.modelItemText
                    }
                  >
                    Candidate #
                    {modelId}
                  </Text>

                  <StatusBadge
                    text="Loaded"
                  />
                </View>
              ),
            )}
          </View>
        )}
      </SectionCard>

      <SectionCard title="ECG Configuration">
        <InfoRow
          label="Dataset"
          value={
            status?.dataset
              .mode ??
            'MIT-BIH'
          }
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
          label="Sampling Rate"
          value={`${MIT_BIH_SAMPLING_RATE} Hz`}
        />

        <InfoRow
          label="Model Input"
          value={`${MODEL_INPUT_SAMPLES} samples`}
        />
      </SectionCard>

      <View
        style={
          styles.notice
        }
      >
        <Text
          style={
            styles.noticeTitle
          }
        >
          Live Backend Data
        </Text>

        <Text
          style={
            styles.noticeText
          }
        >
          The backend URL can now
          be changed and saved from
          Settings. Pull down to
          refresh this status.
        </Text>
      </View>
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

    statusRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },

    label: {
      color: '#64748b',
      fontSize: 15,
    },

    metricRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
    },

    infoText: {
      color: '#64748b',
      fontSize: 13,
      marginTop: 4,
    },

    errorBox: {
      marginTop: 12,
      padding: 12,
      borderRadius: 12,
      backgroundColor:
        '#fef2f2',
      borderWidth: 1,
      borderColor:
        '#fecaca',
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
      alignItems: 'center',
    },

    retryButtonText: {
      color: '#ffffff',
      fontWeight: '700',
    },

    modelList: {
      marginTop: 18,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor:
        '#e2e8f0',
    },

    modelListTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: '#334155',
      marginBottom: 10,
    },

    modelItem: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },

    modelItemText: {
      fontSize: 14,
      color: '#334155',
      fontWeight: '600',
    },

    notice: {
      backgroundColor:
        '#eff6ff',
      borderRadius: 12,
      padding: 14,
    },

    noticeTitle: {
      color: '#1d4ed8',
      fontWeight: '700',
      marginBottom: 4,
    },

    noticeText: {
      color: '#1e40af',
      fontSize: 13,
      lineHeight: 19,
    },
  });