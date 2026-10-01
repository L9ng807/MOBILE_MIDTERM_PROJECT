import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import * as Device from 'expo-device';
import { useBatteryLevel } from 'expo-battery';
import { colors } from '../../theme';

export default function SmartphoneProfileScreen() {
  const batteryLevel = useBatteryLevel();
  const [memoryGB, setMemoryGB] = useState('—');

  useEffect(() => {
    if (Device.totalMemory) {
      setMemoryGB((Device.totalMemory / (1024 * 1024 * 1024)).toFixed(2));
    }
  }, []);

  const rows: [string, string][] = [
    ['Hãng (brand)', Device.brand ?? '—'],
    ['Nhà sản xuất', Device.manufacturer ?? '—'],
    ['Tên máy (model)', Device.modelName ?? '—'],
    ['Hệ điều hành', `${Device.osName ?? '—'} ${Device.osVersion ?? ''}`.trim()],
    ['Loại thiết bị', Device.isDevice ? 'Thiết bị thật' : 'Máy giả lập (simulator)'],
    ['RAM ước tính', `${memoryGB} GB`],
    ['Mức pin', batteryLevel != null && batteryLevel >= 0 ? `${Math.round(batteryLevel * 100)}%` : '—'],
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Smartphone Profile</Text>
      <Text style={styles.note}>
        Thông tin thật của điện thoại đang chạy app (đọc qua expo-device và expo-battery) — thể hiện vai trò "thiết
        bị biên di động" (Local Mobile inference) trong hệ thống.
      </Text>
      <View style={styles.card}>
        {rows.map(([label, value]) => (
          <View style={styles.row} key={label}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 20, paddingHorizontal: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: colors.text },
  note: { color: colors.textMuted, marginBottom: 16 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: colors.textMuted, flex: 1 },
  value: { fontWeight: '600', flex: 1, textAlign: 'right', color: colors.text },
});
