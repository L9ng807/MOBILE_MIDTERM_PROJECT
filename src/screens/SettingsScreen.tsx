import {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import InfoRow from '../components/InfoRow';
import SectionCard from '../components/SectionCard';
import StatusBadge from '../components/StatusBadge';

import {
  DEFAULT_API_BASE_URL,
} from '../config/api';

import {
  getSystemStatus,
} from '../services/systemApi';

import {
  useAppStore,
} from '../store/useAppStore';

import {
  useConnectionStore,
} from '../store/useConnectionStore';

import type {
  SystemStatusResponse,
} from '../types/api';

import {
  isValidBackendUrl,
  normalizeBaseUrl,
} from '../services/apiClient';

import { createScaledSheet } from '../utils/responsive';

type TestState =
  | 'idle'
  | 'testing'
  | 'success'
  | 'error';

export default function SettingsScreen() {
  const executionMode =
    useAppStore(
      (state) =>
        state.executionMode,
    );

  const setExecutionMode =
    useAppStore(
      (state) =>
        state.setExecutionMode,
    );

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

  const setBackendUrl =
    useConnectionStore(
      (state) =>
        state.setBackendUrl,
    );

  const resetBackendUrl =
    useConnectionStore(
      (state) =>
        state.resetBackendUrl,
    );

  const [
    inputUrl,
    setInputUrl,
  ] =
    useState(
      backendUrl,
    );

  const [
    testState,
    setTestState,
  ] =
    useState<TestState>(
      'idle',
    );

  const [
    testError,
    setTestError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    status,
    setStatus,
  ] =
    useState<SystemStatusResponse | null>(
      null,
    );

  const [
    saveMessage,
    setSaveMessage,
  ] =
    useState<string | null>(
      null,
    );

  useEffect(() => {
    if (hasHydrated) {
      setInputUrl(
        backendUrl,
      );
    }
  }, [
    backendUrl,
    hasHydrated,
  ]);

  const validateInput =
    (): string | null => {
      const normalized =
        normalizeBaseUrl(
          inputUrl,
        );

      if (!normalized) {
        return 'Backend URL is required.';
      }

      if (
        !isValidBackendUrl(
          normalized,
        )
      ) {
        return 'Enter a valid URL such as http://192.168.10.214:5000';
      }

      return null;
    };

  const testConnection =
    async () => {
      const validationError =
        validateInput();

      if (
        validationError
      ) {
        setTestState(
          'error',
        );

        setTestError(
          validationError,
        );

        setStatus(null);

        return;
      }

      const normalized =
        normalizeBaseUrl(
          inputUrl,
        );

      setTestState(
        'testing',
      );

      setTestError(
        null,
      );

      setSaveMessage(
        null,
      );

      setStatus(null);

      try {
        const response =
          await getSystemStatus(
            normalized,
          );

        setStatus(
          response,
        );

        setTestState(
          'success',
        );
      } catch (
        requestError
      ) {
        setStatus(null);

        setTestState(
          'error',
        );

        if (
          requestError instanceof
          Error
        ) {
          setTestError(
            requestError.message,
          );
        } else {
          setTestError(
            'Unable to connect to backend.',
          );
        }
      }
    };

  const saveBackendUrl =
    () => {
      const validationError =
        validateInput();

      if (
        validationError
      ) {
        setTestState(
          'error',
        );

        setTestError(
          validationError,
        );

        return;
      }

      const normalized =
        normalizeBaseUrl(
          inputUrl,
        );

      setBackendUrl(
        normalized,
      );

      setInputUrl(
        normalized,
      );

      setSaveMessage(
        'Backend URL saved successfully.',
      );
    };

  const resetUrl =
    () => {
      resetBackendUrl();

      setInputUrl(
        DEFAULT_API_BASE_URL,
      );

      setStatus(null);

      setTestState(
        'idle',
      );

      setTestError(
        null,
      );

      setSaveMessage(
        'Backend URL reset to the default value.',
      );
    };

  return (
    <ScrollView
      style={
        styles.container
      }
      contentContainerStyle={
        styles.content
      }
      keyboardShouldPersistTaps="handled"
    >
      <Text
        style={styles.title}
      >
        Settings
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        Backend connection and
        execution configuration
      </Text>

      <SectionCard title="Backend Connection">
        <InfoRow
          label="Current Backend"
          value={
            hasHydrated
              ? backendUrl
              : 'Loading...'
          }
        />

        <Text
          style={
            styles.fieldLabel
          }
        >
          Backend URL
        </Text>

        <TextInput
          style={
            styles.input
          }
          value={inputUrl}
          onChangeText={
            setInputUrl
          }
          placeholder="http://192.168.1.10:5000"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />

        <Text
          style={
            styles.helpText
          }
        >
          Laptop and iPhone must
          normally be connected to
          the same Wi-Fi network.
          The Flask backend uses port
          5000.
        </Text>

        <Pressable
          style={[
            styles.button,
            styles.testButton,
          ]}
          onPress={
            testConnection
          }
          disabled={
            testState ===
            'testing'
          }
        >
          {testState ===
          'testing' ? (
            <View
              style={
                styles.buttonContent
              }
            >
              <ActivityIndicator
                color="#ffffff"
              />

              <Text
                style={
                  styles.buttonText
                }
              >
                Testing...
              </Text>
            </View>
          ) : (
            <Text
              style={
                styles.buttonText
              }
            >
              Test Connection
            </Text>
          )}
        </Pressable>

        <Pressable
          style={[
            styles.button,
            styles.saveButton,
          ]}
          onPress={
            saveBackendUrl
          }
        >
          <Text
            style={
              styles.buttonText
            }
          >
            Save Backend URL
          </Text>
        </Pressable>

        <Pressable
          style={
            styles.resetButton
          }
          onPress={
            resetUrl
          }
        >
          <Text
            style={
              styles.resetButtonText
            }
          >
            Reset to Default
          </Text>
        </Pressable>

        {saveMessage && (
          <View
            style={
              styles.successBox
            }
          >
            <Text
              style={
                styles.successText
              }
            >
              {saveMessage}
            </Text>
          </View>
        )}

        {testState ===
          'success' && (
          <View
            style={
              styles.connectionResult
            }
          >
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
                Connection
              </Text>

              <StatusBadge
                text="Online"
              />
            </View>

            <Text
              style={
                styles.successText
              }
            >
              Backend connection
              successful.
            </Text>
          </View>
        )}

        {testState ===
          'error' &&
          testError && (
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
              {testError}
            </Text>
          </View>
        )}
      </SectionCard>

      {status && (
        <SectionCard title="Backend Status">
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
              Dataset
            </Text>

            <StatusBadge
              text={
                status.dataset
                  .connected
                  ? 'Connected'
                  : 'Disconnected'
              }
              online={
                status.dataset
                  .connected
              }
            />
          </View>

          <InfoRow
            label="Dataset Mode"
            value={
              status.dataset
                .mode
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
              TensorFlow
            </Text>

            <StatusBadge
              text={
                status.runtime
                  .tensorflow_available
                  ? 'Available'
                  : 'Unavailable'
              }
              online={
                status.runtime
                  .tensorflow_available
              }
            />
          </View>

          <InfoRow
            label="INT8 Models"
            value={`${status.runtime.models_found} / ${status.runtime.models_total}`}
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
              NAS Backend
            </Text>

            <StatusBadge
              text={
                status.nas
                  .search_space_backend_ready
                  ? 'Ready'
                  : 'Not Ready'
              }
              online={
                status.nas
                  .search_space_backend_ready
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
                styles.statusLabel
              }
            >
              PYNQ
            </Text>

            <StatusBadge
              text={
                status.pynq_configured
                  ? 'Configured'
                  : 'Not Configured'
              }
              online={
                status.pynq_configured
              }
            />
          </View>
        </SectionCard>
      )}

      <SectionCard title="Execution Mode">
        <Text
          style={
            styles.sectionDescription
          }
        >
          Select the preferred
          inference execution target.
        </Text>

        <View
          style={
            styles.modeRow
          }
        >
          {(
            [
              'mobile',
              'fpga',
              'adaptive',
            ] as const
          ).map(
            (mode) => {
              const selected =
                executionMode ===
                mode;

              return (
                <Pressable
                  key={mode}
                  style={[
                    styles.modeButton,

                    selected &&
                      styles.modeButtonSelected,
                  ]}
                  onPress={() =>
                    setExecutionMode(
                      mode,
                    )
                  }
                >
                  <Text
                    style={
                      selected
                        ? styles.modeButtonTextSelected
                        : styles.modeButtonText
                    }
                  >
                    {mode ===
                    'mobile'
                      ? 'Software'
                      : mode ===
                          'fpga'
                        ? 'FPGA'
                        : 'Adaptive'}
                  </Text>
                </Pressable>
              );
            },
          )}
        </View>

        <InfoRow
          label="Current Mode"
          value={
            executionMode ===
            'mobile'
              ? 'Software'
              : executionMode ===
                  'fpga'
                ? 'FPGA'
                : 'Adaptive'
          }
        />

        <Text
          style={
            styles.helpText
          }
        >
          FPGA mode will become
          available when the PYNQ
          inference service is
          configured.
        </Text>
      </SectionCard>

      <SectionCard title="Finding Laptop IP">
        <Text
          style={
            styles.command
          }
        >
          ipconfig
        </Text>

        <Text
          style={
            styles.helpText
          }
        >
          On Windows, find
          "Wireless LAN adapter
          Wi-Fi" and use its IPv4
          Address. For example, if
          IPv4 is 192.168.1.25,
          enter
          http://192.168.1.25:5000.
        </Text>
      </SectionCard>
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

    fieldLabel: {
      color: '#334155',
      fontSize: 14,
      fontWeight: '600',
      marginTop: 10,
      marginBottom: 7,
    },

    input: {
      borderWidth: 1,
      borderColor:
        '#cbd5e1',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 14,
      color: '#0f172a',
      backgroundColor:
        '#ffffff',
    },

    helpText: {
      color: '#64748b',
      fontSize: 12,
      lineHeight: 18,
      marginTop: 8,
    },

    button: {
      borderRadius: 12,
      paddingVertical: 13,
      alignItems: 'center',
      marginTop: 12,
    },

    testButton: {
      backgroundColor:
        '#0f172a',
    },

    saveButton: {
      backgroundColor:
        '#2563eb',
    },

    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    buttonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '700',
    },

    resetButton: {
      borderWidth: 1,
      borderColor:
        '#cbd5e1',
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 10,
    },

    resetButtonText: {
      color: '#475569',
      fontWeight: '600',
    },

    successBox: {
      backgroundColor:
        '#f0fdf4',
      borderWidth: 1,
      borderColor:
        '#bbf7d0',
      borderRadius: 10,
      padding: 10,
      marginTop: 12,
    },

    successText: {
      color: '#15803d',
      fontSize: 13,
      lineHeight: 18,
    },

    connectionResult: {
      backgroundColor:
        '#f0fdf4',
      borderRadius: 10,
      padding: 12,
      marginTop: 12,
    },

    errorBox: {
      backgroundColor:
        '#fef2f2',
      borderWidth: 1,
      borderColor:
        '#fecaca',
      borderRadius: 10,
      padding: 10,
      marginTop: 12,
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

    statusRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },

    statusLabel: {
      color: '#64748b',
      fontSize: 15,
    },

    sectionDescription: {
      color: '#64748b',
      fontSize: 13,
      marginBottom: 12,
    },

    modeRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
    },

    modeButton: {
      flex: 1,
      borderWidth: 1,
      borderColor:
        '#cbd5e1',
      borderRadius: 10,
      paddingVertical: 11,
      alignItems: 'center',
    },

    modeButtonSelected: {
      backgroundColor:
        '#2563eb',
      borderColor:
        '#2563eb',
    },

    modeButtonText: {
      color: '#475569',
      fontSize: 12,
      fontWeight: '600',
    },

    modeButtonTextSelected: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '700',
    },

    command: {
      fontFamily:
        'monospace',
      backgroundColor:
        '#0f172a',
      color: '#ffffff',
      padding: 12,
      borderRadius: 8,
      fontSize: 14,
    },
  });