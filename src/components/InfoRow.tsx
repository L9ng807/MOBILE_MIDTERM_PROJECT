import { Text, View } from 'react-native';

import { createScaledSheet } from '../utils/responsive';

interface InfoRowProps {
  label: string;
  value: string;
}

export default function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>

      <Text
        style={styles.value}
        numberOfLines={3}
        adjustsFontSizeToFit
        minimumFontScale={0.65}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = createScaledSheet({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  label: {
    color: '#64748b',
    fontSize: 15,
    flexShrink: 0,
    maxWidth: '40%',
  },
  value: {
    color: '#0f172a',
    fontWeight: '600',
    fontSize: 15,
    flex: 1,
    flexShrink: 1,
    textAlign: 'right',
  },
});
