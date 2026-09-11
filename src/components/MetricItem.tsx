import { StyleSheet, Text, View } from 'react-native';

interface MetricItemProps {
  value: string;
  label: string;
}

export default function MetricItem({
  value,
  label,
}: MetricItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  label: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
});