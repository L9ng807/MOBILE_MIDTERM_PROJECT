import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useDeviceStore } from '../../store/useDeviceStore';
import { checkPynqHealth } from '../../utils/deviceData';

export default function DeviceConnectionScreen() {
  const ipAddress = useDeviceStore((s) => s.ipAddress);
  const port = useDeviceStore((s) => s.port);
  const state = useDeviceStore((s) => s.state);
  const lastPingMs = useDeviceStore((s) => s.lastPingMs);
  const lastError = useDeviceStore((s) => s.lastError);
  const setIpAddress = useDeviceStore((s) => s.setIpAddress);
  const setPort = useDeviceStore((s) => s.setPort);
  const setState = useDeviceStore((s) => s.setState);
  const setPing = useDeviceStore((s) => s.setPing);
  const setError = useDeviceStore((s) => s.setError);

  const [ipInput, setIpInput] = useState(ipAddress);
  const [portInput, setPortInput] = useState(String(port));

  const handleConnect = async () => {
    const parsedPort = parseInt(portInput, 10) || 9000;
    setIpAddress(ipInput);
    setPort(parsedPort);
    setState('connecting');
    setError(null);

    const result = await checkPynqHealth(ipInput, parsedPort);
    if (result.ok) {
      setState('connected');
      setPing(result.latencyMs);
    } else {
      setState('error');
      setError(result.error ?? 'Không kết nối được');
      setPing(null);
    }
  };

  const handleDisconnect = () => {
    setState('disconnected');
    setPing(null);
    setError(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Device Connection</Text>
      <Text style={styles.note}>
        Kết nối tới PYNQ runtime server (server.py) đang chạy trên PYNQ-Z2 qua HTTP, dùng endpoint /health để kiểm
        tra. Điện thoại và PYNQ-Z2 phải cùng một mạng Wi-Fi.
      </Text>

      <Text style={styles.label}>Địa chỉ IP của PYNQ</Text>
      <TextInput
        style={styles.input}
        value={ipInput}
        onChangeText={setIpInput}
        placeholder="192.168.2.99"
        autoCapitalize="none"
        keyboardType="numbers-and-punctuation"
      />

      <Text style={styles.label}>Cổng (port)</Text>
      <TextInput
        style={styles.input}
        value={portInput}
        onChangeText={setPortInput}
        placeholder="9000"
        keyboardType="number-pad"
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleConnect}
          disabled={state === 'connecting'}
        >
          {state === 'connecting' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Connect / Ping</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={handleDisconnect}>
          <Text style={styles.buttonTextSecondary}>Disconnect</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Trạng thái</Text>
          <Text style={styles.rowValue}>{state}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Ping</Text>
          <Text style={styles.rowValue}>{lastPingMs != null ? `${lastPingMs} ms` : '—'}</Text>
        </View>
        {lastError ? <Text style={styles.error}>{lastError}</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  note: { color: '#64748b', marginBottom: 16 },
  label: { fontWeight: '600', marginBottom: 6, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10 },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  button: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonPrimary: { backgroundColor: '#2563eb' },
  buttonSecondary: { backgroundColor: '#e2e8f0' },
  buttonText: { color: 'white', fontWeight: '700' },
  buttonTextSecondary: { color: '#334155', fontWeight: '700' },
  card: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginTop: 20, gap: 8, marginBottom: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowLabel: { color: '#475569' },
  rowValue: { fontWeight: '600' },
  error: { color: '#dc2626', marginTop: 6 },
});
