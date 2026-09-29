import { Text, View } from 'react-native';

import { createScaledSheet } from '../utils/responsive';

interface StatusBadgeProps {
  text: string;
  online?: boolean;
}

export default function StatusBadge({
  text,
  online = true,
}: StatusBadgeProps) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.dot,
          {
            backgroundColor: online ? '#16a34a' : '#dc2626',
          },
        ]}
      />

      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        style={[
          styles.text,
          {
            color: online ? '#16a34a' : '#dc2626',
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = createScaledSheet({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
    maxWidth: '58%',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  text: {
    fontWeight: '600',
    fontSize: 15,
    flexShrink: 1,
  },
});
