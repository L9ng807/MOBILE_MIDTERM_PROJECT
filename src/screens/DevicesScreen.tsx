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

import { createScaledSheet } from '../utils/responsive';

type PynqConnectionState =
  | 'checking'
  | 'connected'
  | 'not_connected'
  | 'error';

/** Typical PYNQ-Z2 resource totals (XC7Z020). */
const FPGA_RESOURCE_TOTALS = {
  lut: 53200,
  ff: 106400,
  bram: 140,
  dsp: 220,
} as const;

/**
 * Demo utilization for deployment final_w4a4_p99_9 @ 40 MHz.
 * Replace with live FPGA telemetry when backend exposes it.
 */
const FPGA_RESOURCE_USED = {
  lut: 18420,
  ff: 22150,
  bram: 48,
  dsp: 86,
} as const;

const CLOCK_MHZ = 40;

const DEPLOYMENT_ID = 'final_w4a4_p99_9';

function ResourceBar({
  label,
  used,
  total,
  unit,
}: {
  label: string;
  used: number;
  total: number;
  unit?: string;
}) {
  const ratio =
    total > 0
      ? Math.min(used / total, 1)
      : 0;

  const percent =
    Math.round(ratio * 1000) / 10;

  const barColor =
    ratio > 0.85
      ? '#dc2626'
      : ratio > 0.65
        ? '#f59e0b'
        : '#2563eb';

  return (
    <View style={styles.resourceRow}>
      <View style={styles.resourceHeader}>
        <Text style={styles.resourceLabel}>
          {label}
        </Text>
        <Text
          style={styles.resourceValue}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.65}
        >
          {used.toLocaleString()}
          {' / '}
          {total.toLocaleString()}
          {unit ? ` ${unit}` : ''}
          {'  '}
          <Text style={styles.resourcePercent}>
            {percent}%
          </Text>
        </Text>
      </View>

      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            {
              width: `${ratio * 100}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

function connectionLabel(
  state: PynqConnectionState,
): string {
  switch (state) {
    case 'checking':
      return 'Checking';
    case 'connected':
      return 'Connected';
    case 'error':
      return 'Error';
    case 'not_connected':
    default:
      return 'Not connected';
  }
}

function connectionOnline(
  state: PynqConnectionState,
): boolean {
  return state === 'connected';
}

export default function DevicesScreen() {
  const backendUrl =
    useConnectionStore(
      (state) => state.backendUrl,
    );

  const hasHydrated =
    useConnectionStore(
      (state) => state.hasHydrated,
    );

  const [
    status,
    setStatus,
  ] =
    useState<SystemStatusResponse | null>(
      null,
    );

  const [
    connectionState,
    setConnectionState,
  ] =
    useState<PynqConnectionState>(
      'checking',
    );

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState<string | null>(null);

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);

  const [
    lastCheckedAt,
    setLastCheckedAt,
  ] =
    useState<string | null>(null);

  const checkConnection =
    useCallback(
      async (isRefresh = false) => {
        if (!hasHydrated) {
          return;
        }

        if (isRefresh) {
          setRefreshing(true);
        }

        setConnectionState('checking');
        setErrorMessage(null);

        try {
          const response =
            await getSystemStatus(
              backendUrl,
            );

          setStatus(response);

          if (response.pynq_configured) {
            setConnectionState(
              'connected',
            );
          } else {
            setConnectionState(
              'not_connected',
            );
          }

          setLastCheckedAt(
            new Date().toLocaleTimeString(),
          );
        } catch (requestError) {
          setStatus(null);

          setConnectionState('error');

          if (
            requestError instanceof
            Error
          ) {
            setErrorMessage(
              requestError.message,
            );
          } else {
            setErrorMessage(
              'Unable to reach backend.',
            );
          }

          setLastCheckedAt(
            new Date().toLocaleTimeString(),
          );
        } finally {
          setRefreshing(false);
        }
      },
      [backendUrl, hasHydrated],
    );

  useEffect(() => {
    if (hasHydrated) {
      checkConnection();
    }
  }, [hasHydrated, checkConnection]);

  const deploymentReady =
    connectionState === 'connected' &&
    (status?.runtime.models_found ?? 0) >
      0;

  const precisionLabel =
    DEPLOYMENT_ID.includes('w4')
      ? 'INT4 (W4A4)'
      : 'INT8';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() =>
            checkConnection(true)
          }
        />
      }
    >
      <Text
        style={styles.title}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        FPGA Monitor
      </Text>

      <Text style={styles.subtitle}>
        PYNQ-Z2 connection, deployment
        and on-chip resources
      </Text>

      {/* PYNQ-Z2 Status */}
      <SectionCard title="PYNQ-Z2 Status">
        <View style={styles.statusRow}>
          <Text
            style={styles.statusLabel}
            numberOfLines={1}
          >
            Board
          </Text>
          <StatusBadge
            text={connectionLabel(
              connectionState,
            )}
            online={connectionOnline(
              connectionState,
            )}
          />
        </View>

        <InfoRow
          label="Backend"
          value={
            hasHydrated
              ? backendUrl
              : 'Loading...'
          }
        />

        <InfoRow
          label="PYNQ configured"
          value={
            status == null
              ? '—'
              : status.pynq_configured
                ? 'Yes'
                : 'No'
          }
        />

        {lastCheckedAt && (
          <InfoRow
            label="Last checked"
            value={lastCheckedAt}
          />
        )}

        {connectionState ===
          'checking' && (
          <View style={styles.checkingRow}>
            <ActivityIndicator
              color="#2563eb"
              size="small"
            />
            <Text style={styles.checkingText}>
              Checking connection…
            </Text>
          </View>
        )}

        {connectionState === 'error' &&
          errorMessage && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>
              Connection error
            </Text>
            <Text style={styles.errorText}>
              {errorMessage}
            </Text>
          </View>
        )}

        {connectionState ===
          'not_connected' && (
          <View style={styles.warnBox}>
            <Text style={styles.warnText}>
              Backend is reachable but
              PYNQ is not configured.
              Enable the FPGA inference
              service on the laptop
              backend.
            </Text>
          </View>
        )}
      </SectionCard>

      {/* Deployment Status */}
      <SectionCard title="Deployment Status">
        <InfoRow
          label="Runtime"
          value={
            status?.runtime
              .tensorflow_available
              ? 'TensorFlow + FPGA'
              : connectionState ===
                  'connected'
                ? 'FPGA only'
                : '—'
          }
        />

        <InfoRow
          label="Endpoint"
          value={
            connectionState ===
            'connected'
              ? `${backendUrl.replace(/\/$/, '')}/api/infer`
              : '—'
          }
        />

        <InfoRow
          label="Deployment"
          value={DEPLOYMENT_ID}
        />

        <InfoRow
          label="Precision"
          value={precisionLabel}
        />

        <View style={styles.statusRow}>
          <Text
            style={styles.statusLabel}
            numberOfLines={1}
          >
            Status
          </Text>
          <StatusBadge
            text={
              deploymentReady
                ? 'Ready'
                : 'Not ready'
            }
            online={deploymentReady}
          />
        </View>

        {status && (
          <InfoRow
            label="INT models"
            value={`${status.runtime.models_found} / ${status.runtime.models_total}`}
          />
        )}
      </SectionCard>

      {/* Resource Monitor */}
      <SectionCard title="Resource Monitor">
        <View style={styles.clockRow}>
          <Text style={styles.clockLabel}>
            Clock
          </Text>
          <View style={styles.clockBadge}>
            <Text style={styles.clockValue}>
              {CLOCK_MHZ} MHz
            </Text>
          </View>
        </View>

        <Text style={styles.resourceHint}>
          Utilization for{' '}
          {DEPLOYMENT_ID} on XC7Z020
          (PYNQ-Z2). Values are design
          estimates until live telemetry
          is available.
        </Text>

        <ResourceBar
          label="LUT"
          used={FPGA_RESOURCE_USED.lut}
          total={FPGA_RESOURCE_TOTALS.lut}
        />

        <ResourceBar
          label="FF"
          used={FPGA_RESOURCE_USED.ff}
          total={FPGA_RESOURCE_TOTALS.ff}
        />

        <ResourceBar
          label="BRAM"
          used={FPGA_RESOURCE_USED.bram}
          total={FPGA_RESOURCE_TOTALS.bram}
          unit="blocks"
        />

        <ResourceBar
          label="DSP"
          used={FPGA_RESOURCE_USED.dsp}
          total={FPGA_RESOURCE_TOTALS.dsp}
        />
      </SectionCard>

      <Pressable
        style={[
          styles.refreshButton,
          connectionState ===
            'checking' &&
            styles.refreshButtonDisabled,
        ]}
        onPress={() =>
          checkConnection(true)
        }
        disabled={
          connectionState === 'checking'
        }
      >
        {connectionState ===
        'checking' ? (
          <View
            style={styles.buttonContent}
          >
            <ActivityIndicator
              color="#ffffff"
            />
            <Text style={styles.buttonText}>
              Checking…
            </Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>
            Refresh — Check Connection
          </Text>
        )}
      </Pressable>

      <Text style={styles.footerHint}>
        Pull down or tap Refresh to
        re-test the backend and PYNQ
        configuration.
      </Text>
    </ScrollView>
  );
}

const styles = createScaledSheet({
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
    flexShrink: 1,
  },

  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 20,
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },

  statusLabel: {
    color: '#64748b',
    fontSize: 15,
    flexShrink: 1,
  },

  checkingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },

  checkingText: {
    color: '#64748b',
    fontSize: 13,
  },

  errorBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
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

  warnBox: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },

  warnText: {
    color: '#92400e',
    fontSize: 13,
    lineHeight: 18,
  },

  clockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  clockLabel: {
    color: '#64748b',
    fontSize: 15,
  },

  clockBadge: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  clockValue: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },

  resourceHint: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
  },

  resourceRow: {
    marginBottom: 14,
  },

  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },

  resourceLabel: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
  },

  resourceValue: {
    color: '#64748b',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    flexShrink: 1,
    minWidth: 0,
    textAlign: 'right',
  },

  resourcePercent: {
    color: '#0f172a',
    fontWeight: '700',
  },

  barTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },

  barFill: {
    height: 10,
    borderRadius: 5,
  },

  refreshButton: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },

  refreshButtonDisabled: {
    opacity: 0.7,
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

  footerHint: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 17,
  },
});
