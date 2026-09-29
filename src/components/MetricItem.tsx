import { Text, View } from 'react-native';

import { createScaledSheet } from '../utils/responsive';

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
      <Text
        style={styles.value}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {value}
      </Text>
      <Text
        style={styles.label}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = createScaledSheet({
  container: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
    paddingHorizontal: 4,
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
    textAlign: 'center',
  },
});
