import { StyleSheet, Text, View } from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  text: {
    fontWeight: '600',
    fontSize: 15,
  },
});